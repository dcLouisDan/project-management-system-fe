import { Pie, PieChart, Cell, Label } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { projectsChartConfig } from '@/lib/mock/dashboard-data'
import { useMemo } from 'react'
import type { ProgressStatus } from '@/lib/types/status'

interface ProjectsStatusChartProps {
  data: Record<ProgressStatus, number>
}

export function ProjectsStatusChart({ data }: ProjectsStatusChartProps) {
  const chartData = useMemo(() => {
    const statusesToShow: ProgressStatus[] = [
      'not_started',
      'in_progress',
      'completed',
      'cancelled',
    ]

    return statusesToShow
      .map((status) => ({
        status,
        count: data[status] || 0,
        fill: `var(--color-${status})`,
      }))
      .filter((item) => item.count > 0)
  }, [data])

  const totalProjects = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0)
  }, [chartData])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Projects by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={projectsChartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={5}
            >
              {chartData.map((entry) => (
                <Cell key={entry.status} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalProjects}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          Projects
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
