'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useState, useEffect } from 'react';
import { getTotalDonationsPerMonthYTD } from '@/actions/donations.action';
import { Skeleton } from '@/components/ui/skeleton';

const chartConfig = {
  totalAmount: {
    label: 'Total Amount',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

type BarChartData = {
  month: string;
  totalAmount: number;
};

export function BarChartDonationTrend() {
  const [chartData, setChartData] = useState<BarChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function fetchChartData() {
      try {
        const data = await getTotalDonationsPerMonthYTD();
        setChartData(data);
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchChartData();
  }, [user.id]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Monthly Donation Trend</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            From the beginning of the year to date
          </span>
          <span className="@[540px]/card:hidden">
            From the beginning of the year to date
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <Skeleton className="h-[250px] w-full" />
        ) : hasError ? (
          <div className="text-muted-foreground flex h-[250px] items-center justify-center px-6 text-center text-sm">
            The trend is temporarily unavailable.
          </div>
        ) : chartData.every((item) => item.totalAmount === 0) ? (
          <div className="text-muted-foreground flex h-[250px] items-center justify-center px-6 text-center text-sm">
            Monthly totals will appear here after the first donation.
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
              <Bar
                dataKey="totalAmount"
                fill="var(--color-totalAmount)"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
