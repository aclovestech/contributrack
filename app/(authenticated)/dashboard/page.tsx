import { BarChartDonationTrend } from '@/components/bar-chart-donation-trend';
import TotalDonations from '@/components/overview/total-donations';
import TotalDonationCount from '@/components/overview/total-donation-count';
import AverageDonation from '@/components/overview/average-donation';
import TopDonor from '@/components/overview/top-donor';

export default function DashboardOverview() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <TotalDonations />
        <TotalDonationCount />
        <AverageDonation />
        <TopDonor />
      </div>
      <div className="px-4 lg:px-6">
        <BarChartDonationTrend />
      </div>
    </div>
  );
}
