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
import { stackServerApp } from '@/stack';
import { getAverageDonationYtd } from '@/actions/donations.action';
import { calculateTrend } from '@/lib/utils';

export default async function AverageDonation() {
  const user = await stackServerApp.getUser({ or: 'redirect' });

  const data = await getAverageDonationYtd(user.id);

  const trend = calculateTrend(data.currentYear, data.previousYear);

  const formattedAverageDonation = data.currentYear.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Average Donation</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          ${formattedAverageDonation}
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
          From the beginning of the year to date
        </div>
      </CardFooter>
    </Card>
  );
}
