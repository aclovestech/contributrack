import {
  IconMinus,
  IconTrendingDown,
  IconTrendingUp,
} from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import { calculateTrend } from '@/lib/utils';

interface TrendSummaryProps {
  current: number;
  previous: number;
}

function getTrendState({ current, previous }: TrendSummaryProps) {
  const trend = calculateTrend(current, previous);
  return {
    ...trend,
    isNeutral: current === previous,
  };
}

export function TrendBadge(props: TrendSummaryProps) {
  const trend = getTrendState(props);

  return (
    <Badge variant="outline">
      {trend.isNeutral ? (
        <>
          <IconMinus className="text-muted-foreground" aria-hidden="true" />
          {trend.output}
        </>
      ) : trend.isPositive ? (
        <>
          <IconTrendingUp className="text-green-500" aria-hidden="true" />+
          {trend.output}
        </>
      ) : (
        <>
          <IconTrendingDown className="text-red-500" aria-hidden="true" />
          {trend.output}
        </>
      )}
    </Badge>
  );
}

export function TrendDescription(props: TrendSummaryProps) {
  const trend = getTrendState(props);

  return (
    <div className="line-clamp-1 flex gap-2 font-medium">
      {trend.isNeutral ? (
        <>
          <IconMinus
            className="text-muted-foreground size-4"
            aria-hidden="true"
          />
          No change from the same period last year
        </>
      ) : trend.isPositive ? (
        <>
          <IconTrendingUp
            className="size-4 text-green-500"
            aria-hidden="true"
          />
          Trending up this year
        </>
      ) : (
        <>
          <IconTrendingDown
            className="size-4 text-red-500"
            aria-hidden="true"
          />
          Trending down this year
        </>
      )}
    </div>
  );
}
