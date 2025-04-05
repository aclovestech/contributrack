import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconTrendingUp } from '@tabler/icons-react';

export default function TotalDonationCount() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Total Donation Count</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          1,000
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            <IconTrendingUp />
            +12.5%
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Trending up compared to last year{' '}
          <IconTrendingUp className="size-4" />
        </div>
        <div className="text-muted-foreground">
          From the beginning of the year to date
        </div>
      </CardFooter>
    </Card>
  );
}
