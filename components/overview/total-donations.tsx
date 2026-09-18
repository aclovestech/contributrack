import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';
import { getTotalDonationsYtd } from '@/actions/donations.action';
import { calculateTrend, formatCurrency } from '@/lib/utils';

export default async function TotalDonations() {
  const data = await getTotalDonationsYtd();

  const trend = calculateTrend(data.currentYear, data.previousYear);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Total Donations</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {formatCurrency(data.currentYear)}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            {trend.isPositive ? (
              <>
                <IconTrendingUp className="text-green-500" />+{trend.output}
              </>
            ) : (
              <>
                <IconTrendingDown className="text-red-500" />
                {trend.output}
              </>
            )}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {trend.isPositive ? (
            <>
              <IconTrendingUp className="size-4 text-green-500" />
              Trending up this year
            </>
          ) : (
            <>
              <IconTrendingDown className="size-4 text-red-500" />
              Trending down this year
            </>
          )}
        </div>
        <div className="text-muted-foreground">
          From the beginning of the year to date compared to the previous year
        </div>
      </CardFooter>
    </Card>
  );
}
