interface LicensePlateProps {
  number: string;
  province: string;
  size?: "default" | "large";
}

export default function LicensePlate({ number, province, size = "default" }: LicensePlateProps) {
  return (
    <span className={size === "large" ? "plate plate-large" : "plate"} aria-label={`${number} ${province}`}>
      <span className="plate-number">{number}</span>
      <span className="plate-province">{province}</span>
    </span>
  );
}
