import { BarChartDonationTrend } from '@/components/bar-chart-donation-trend';
import TotalDonations from '@/components/overview/total-donations';
import TotalDonationCount from '@/components/overview/total-donation-count';
import AverageDonation from '@/components/overview/average-donation';
import TopDonor from '@/components/overview/top-donor';
import { PageHeader } from '@/components/page-header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardOverview() {
  return (
    <div className="flex flex-col gap-6 py-5 md:gap-8 md:py-6">
      <PageHeader
        title="Overview"
        description="A quick view of this year's donations and the tasks you use most."
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/dashboard/donors">Find a donor</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/donations">Record donation</Link>
            </Button>
          </>
        }
      />
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
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
