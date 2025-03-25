import { DataTable } from '@/components/data-table';
import { OverviewSectionCards } from '@/components/overview-section-cards';
import { BarChartDonationTrend } from '@/components/bar-chart-donation-trend';

export default function DashboardOverview() {
  return (
    <>
      <OverviewSectionCards />
      <div className="px-4 lg:px-6">
        <BarChartDonationTrend />
      </div>
    </>
  );
}
