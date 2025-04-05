import { getTopDonorYtd } from '@/actions/donations.action';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { stackServerApp } from '@/stack';

export default async function TopDonor() {
  const user = await stackServerApp.getUser({ or: 'redirect' });

  const data = await getTopDonorYtd(user.id);

  if (!data) return;

  const formattedAverageDonation = data?.amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Top Donor</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {data?.name}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Donated{' '}
          <span className="font-semibold text-green-500">
            ${formattedAverageDonation}
          </span>{' '}
          in total
        </div>
        <div className="text-muted-foreground">
          From the beginning of the year to date
        </div>
      </CardFooter>
    </Card>
  );
}
