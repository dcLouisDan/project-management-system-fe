import { Bar, BarChart, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  mockTasksByStatus,
  tasksStatusChartConfig,
} from '@/lib/mock/dashboard-data'

export function TasksStatusChart() {
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
          <BarChart data={mockTasksByStatus}>
            <XAxis
              dataKey="status"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                tasksStatusChartConfig[value as keyof typeof tasksStatusChartConfig]?.label?.toString().split(' ')[0] || value
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

