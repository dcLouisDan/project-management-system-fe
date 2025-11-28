import { Bar, BarChart, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { tasksStatusChartConfig } from '@/lib/mock/dashboard-data'
import { useMemo } from 'react'
import type { ProgressStatus } from '@/lib/types/status'

interface TasksStatusChartProps {
  data: Record<ProgressStatus, number>
}

export function TasksStatusChart({ data }: TasksStatusChartProps) {
  const chartData = useMemo(() => {
    const statusesToShow: ProgressStatus[] = [
      'not_started',
      'in_progress',
      'awaiting_review',
      'completed',
    ]

    return statusesToShow.map((status) => ({
      status,
      count: data[status] || 0,
      fill: `var(--color-${status})`,
    }))
  }, [data])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Tasks by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={tasksStatusChartConfig}
          className="max-h-[250px] w-full"
        >
          <BarChart data={chartData}>
            <XAxis
              dataKey="status"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                tasksStatusChartConfig[
                  value as keyof typeof tasksStatusChartConfig
                ]?.label
                  ?.toString()
                  .split('_')[0] || value
              }
            />
            <YAxis hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
