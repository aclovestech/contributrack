import { OverviewSectionCards } from '@/components/overview-section-cards';
import { BarChartDonationTrend } from '@/components/bar-chart-donation-trend';

export default function DashboardOverview() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <OverviewSectionCards />
      <div className="px-4 lg:px-6">
        <BarChartDonationTrend />
      </div>
    </div>
  );
}
