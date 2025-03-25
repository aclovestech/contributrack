import { DataTable } from '@/components/data-table';
import { OverviewSectionCards } from '@/components/overview-section-cards';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';

import data from './data.json';

export default function DashboardOverview() {
  return (
    <>
      <OverviewSectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </>
  );
}
