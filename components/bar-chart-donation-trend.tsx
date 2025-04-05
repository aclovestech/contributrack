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
import { useUser } from '@stackframe/stack';

// const chartData = [
//   { month: 'January', donorCount: 100 },
//   { month: 'February', donorCount: 200 },
//   { month: 'March', donorCount: 150 },
//   { month: 'April', donorCount: 300 },
//   { month: 'May', donorCount: 250 },
//   { month: 'June', donorCount: 400 },
//   { month: 'July', donorCount: 350 },
//   { month: 'August', donorCount: 500 },
//   { month: 'September', donorCount: 450 },
//   { month: 'October', donorCount: 600 },
//   { month: 'November', donorCount: 550 },
//   { month: 'December', donorCount: 700 },
// ];

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
  const user = useUser({ or: 'redirect' });

  const [chartData, setChartData] = useState<BarChartData[]>([]);

  useEffect(() => {
    async function fetchChartData() {
      const data = await getTotalDonationsPerMonthYTD(user.id);
      setChartData(data);
      console.log(data);
    }

    fetchChartData();
  }, []);

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
      </CardContent>
    </Card>
  );
}
