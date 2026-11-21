import { Card, Statistic, theme } from "antd";
import { CAR_STATUS } from "@/core/constants/car";
import type { CarStatus, CarSummary } from "@/core/services/car";

interface SummaryCardsProps {
  summary: CarSummary | null;
  activeStatus?: CarStatus;
  /** Called with undefined for the "All cars" card */
  onSelect: (status: CarStatus | undefined) => void;
}

// One card per status. Clicking a card filters the table by that status.
export default function SummaryCards({ summary, activeStatus, onSelect }: SummaryCardsProps) {
  const { token } = theme.useToken();

  const statCards = [
    { key: undefined, title: "All cars", value: summary?.total },
    ...(Object.keys(CAR_STATUS) as CarStatus[]).map((key) => ({
      key,
      title: CAR_STATUS[key].label,
      value: summary?.byStatus[key],
    })),
  ];

  return (
    <div className="stat-grid">
      {statCards.map((stat) => (
        <Card
          key={stat.key ?? "all"}
          size="small"
          className="stat-card"
          style={activeStatus === stat.key ? { borderColor: token.colorPrimary } : undefined}
          onClick={() => onSelect(stat.key)}
        >
          <Statistic title={stat.title} value={stat.value ?? "-"} loading={!summary} />
        </Card>
      ))}
    </div>
  );
}
