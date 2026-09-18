import { getTopDonorYtd } from '@/actions/donations.action';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

export default async function TopDonor() {
  const data = await getTopDonorYtd();

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Top Donor</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {data?.name ?? 'No named donor yet'}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {data ? (
            <>
              Donated{' '}
              <span className="font-semibold text-green-500">
                {formatCurrency(data.amount)}
              </span>{' '}
              in total
            </>
          ) : (
            'Record a donation with a donor to see your top donor.'
          )}
        </div>
        <div className="text-muted-foreground">
          From the beginning of the year to date
        </div>
      </CardFooter>
    </Card>
  );
}
