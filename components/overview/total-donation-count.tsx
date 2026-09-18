import {
  Card,
  CardDescription,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getTotalDonationCountYtd } from '@/actions/donations.action';
import { TrendBadge, TrendDescription } from './trend-summary';

export default async function TotalDonationCount() {
  const data = await getTotalDonationCountYtd();

  const formattedTotalDonationCount = data.currentYear.toLocaleString();

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Donations recorded</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {formattedTotalDonationCount}
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
          Number of donations this year, compared with the same period last year
        </div>
      </CardFooter>
    </Card>
  );
}
