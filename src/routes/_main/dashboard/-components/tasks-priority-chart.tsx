import { Bar, BarChart, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { tasksPriorityChartConfig } from '@/lib/mock/dashboard-data'
import { useMemo } from 'react'
import type { PriorityLevel } from '@/lib/types/priority'

interface TasksPriorityChartProps {
  data: Record<PriorityLevel, number>
}

export function TasksPriorityChart({ data }: TasksPriorityChartProps) {
  const chartData = useMemo(() => {
    const priorities: PriorityLevel[] = ['low', 'medium', 'high', 'urgent']

    return priorities.map((priority) => ({
      priority,
      count: data[priority] || 0,
      fill: `var(--color-${priority})`,
    }))
  }, [data])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Tasks by Priority</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={tasksPriorityChartConfig}
          className="max-h-[250px] w-full"
        >
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 0 }}
          >
            <YAxis
              dataKey="priority"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                tasksPriorityChartConfig[value as keyof typeof tasksPriorityChartConfig]?.label?.toString() || value
              }
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
