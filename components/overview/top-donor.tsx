import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function TopDonor() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Top Donor</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          John Doe
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Donated $1,000 in total
        </div>
      </CardFooter>
    </Card>
  );
}
