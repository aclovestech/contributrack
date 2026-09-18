import {
  Card,
  CardDescription,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getTotalDonationsYtd } from '@/actions/donations.action';
import { formatCurrency } from '@/lib/utils';
import { TrendBadge, TrendDescription } from './trend-summary';

export default async function TotalDonations() {
  const data = await getTotalDonationsYtd();

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Donations this year</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {formatCurrency(data.currentYear)}
        </CardTitle>
        <CardAction>
          <TrendBadge current={data.currentYear} previous={data.previousYear} />
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <TrendDescription
          current={data.currentYear}
          previous={data.previousYear}
        />
        <div className="text-muted-foreground">
          January 1 to today, compared with the same period last year
        </div>
      </CardFooter>
    </Card>
  );
}
