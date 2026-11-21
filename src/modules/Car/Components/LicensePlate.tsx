interface LicensePlateProps {
  number: string;
  province: string;
  /** Red plate (ป้ายแดง) for a car that isn't registered yet */
  red?: boolean;
  size?: "default" | "large";
}

export default function LicensePlate({ number, province, red = false, size = "default" }: LicensePlateProps) {
  const className = ["plate", size === "large" && "plate-large", red && "plate-red"].filter(Boolean).join(" ");
  const label = `${number} ${province}${red ? ", red plate" : ""}`;

  return (
    <span className={className} aria-label={label} title={red ? "Red plate (ป้ายแดง)" : undefined}>
      <span className="plate-number">{number}</span>
      <span className="plate-province">{province}</span>
    </span>
  );
}
