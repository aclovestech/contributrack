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

export default function AverageDonation() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Average Donation</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          $45,678
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
          In comparison to overall average
        </div>
      </CardFooter>
    </Card>
  );
}
