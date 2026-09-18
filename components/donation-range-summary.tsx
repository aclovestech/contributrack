import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface DonationRangeSummaryProps {
  total: number;
  donationCount: number;
  isArchived: boolean;
}

export function DonationRangeSummary({
  total,
  donationCount,
  isArchived,
}: DonationRangeSummaryProps) {
  const recordLabel = isArchived ? 'archived donations' : 'donations';

  return (
    <Card className="gap-3 py-4 sm:max-w-sm">
      <CardHeader className="px-4 pb-0">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          Total {recordLabel} in this range
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <p className="text-2xl font-semibold tabular-nums">
          {formatCurrency(total)}
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          {donationCount} {donationCount === 1 ? 'donation' : 'donations'}
        </p>
      </CardContent>
    </Card>
  );
}
