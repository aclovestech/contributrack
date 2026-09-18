import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { getTotalDonationCountYtd } from '@/actions/donations.action';
import { calculateTrend } from '@/lib/utils';

export default async function TotalDonationCount() {
  const data = await getTotalDonationCountYtd();

  const trend = calculateTrend(data.currentYear, data.previousYear);

  const formattedTotalDonationCount = data.currentYear.toLocaleString();

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Donations recorded</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {formattedTotalDonationCount}
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
          Number of donations this year, compared with the same period last year
        </div>
      </CardFooter>
    </Card>
  );
}
