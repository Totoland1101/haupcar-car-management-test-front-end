"use client";

import { useEffect, useRef, useState } from "react";
import { App, Button, Image, Popconfirm, Spin, Typography, Upload } from "antd";
import { CameraOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import CarPhotoService, {
  CAR_SIDES,
  PHOTO_MAX_BYTES,
  PHOTO_TYPES,
  type CarSide,
} from "@/core/services/carPhoto";

export type PendingPhotos = Partial<Record<CarSide, File>>;

interface CarPhotosProps {
  /** Photos of a saved car. Leave out on the add page, where files wait in `pending`. */
  carId?: number;
  editable?: boolean;
  pending?: PendingPhotos;
  onPendingChange?: (files: PendingPhotos) => void;
}

// One slot per side of the car: front, left, right and back.
export default function CarPhotos({ carId, editable = false, pending, onPendingChange }: CarPhotosProps) {
  const { message } = App.useApp();
  const [urls, setUrls] = useState<Partial<Record<CarSide, string>>>({});
  const [loading, setLoading] = useState(Boolean(carId));
  const [busySide, setBusySide] = useState<CarSide | null>(null);
  const urlsRef = useRef(urls);
  urlsRef.current = urls;

  // Object URLs keep the image in memory until they are revoked.
  useEffect(() => () => Object.values(urlsRef.current).forEach((url) => url && URL.revokeObjectURL(url)), []);

  function setUrl(side: CarSide, url: string | null) {
    setUrls((prev) => {
      if (prev[side]) URL.revokeObjectURL(prev[side]!);
      const next = { ...prev };
      if (url) next[side] = url;
      else delete next[side];
      return next;
    });
  }

  // A saved car: load the photos it has.
  useEffect(() => {
    if (!carId) return;
    let ignore = false;
    (async () => {
      const list = await CarPhotoService.findAll(carId);
      if (list.success) {
        for (const photo of list.data.data) {
          const image = await CarPhotoService.fetchImage(carId, photo.side);
          if (!ignore && image.success) setUrl(photo.side, URL.createObjectURL(image.data));
        }
      }
      if (!ignore) setLoading(false);
    })();
    return () => {
      ignore = true;
    };
  }, [carId]);

  // The add page: preview the files that will be uploaded after saving.
  useEffect(() => {
    if (carId) return;
    for (const { side } of CAR_SIDES) {
      const file = pending?.[side];
      setUrl(side, file ? URL.createObjectURL(file) : null);
    }
  }, [carId, pending]);

  function checkFile(file: File) {
    if (!PHOTO_TYPES.includes(file.type)) {
      message.error("Pick a JPEG, PNG or WebP image");
      return false;
    }
    if (file.size > PHOTO_MAX_BYTES) {
      message.error("Photos can be at most 5 MB");
      return false;
    }
    return true;
  }

  async function handlePick(side: CarSide, file: File) {
    if (!checkFile(file)) return;
    if (!carId) {
      onPendingChange?.({ ...pending, [side]: file });
      return;
    }
    setBusySide(side);
    const { success, error } = await CarPhotoService.upload(carId, side, file);
    setBusySide(null);
    if (!success) {
      message.error(error.message);
      return;
    }
    setUrl(side, URL.createObjectURL(file));
    message.success("Photo saved");
  }

  async function handleRemove(side: CarSide) {
    if (!carId) {
      const next = { ...pending };
      delete next[side];
      onPendingChange?.(next);
      return;
    }
    setBusySide(side);
    const { success, error } = await CarPhotoService.delete(carId, side);
    setBusySide(null);
    if (!success) {
      message.error(error.message);
      return;
    }
    setUrl(side, null);
    message.success("Photo removed");
  }

  if (loading) {
    return (
      <div className="photo-grid-loading">
        <Spin />
      </div>
    );
  }

  return (
    <div className="photo-grid">
      {CAR_SIDES.map(({ side, label }) => (
        <div key={side} className="photo-slot">
          <Typography.Text strong>{label}</Typography.Text>
          <div className="photo-frame">
            {urls[side] ? (
              <Image src={urls[side]} alt={`${label} of the car`} />
            ) : (
              <div className="photo-empty">
                <CameraOutlined />
                <span>No photo</span>
              </div>
            )}
          </div>
          {editable && (
            <div className="photo-actions">
              <Upload
                accept={PHOTO_TYPES.join(",")}
                showUploadList={false}
                beforeUpload={(file) => {
                  handlePick(side, file);
                  return false;
                }}
              >
                <Button size="small" icon={<UploadOutlined />} loading={busySide === side}>
                  {urls[side] ? "Replace" : "Upload"}
                </Button>
              </Upload>
              {urls[side] && (
                <Popconfirm title="Remove this photo?" okText="Remove" okButtonProps={{ danger: true }} onConfirm={() => handleRemove(side)}>
                  <Button size="small" danger icon={<DeleteOutlined />} aria-label={`Remove the ${label.toLowerCase()} photo`} />
                </Popconfirm>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
