import type { ChartConfig } from '@/components/ui/chart'

// Summary statistics for stat cards
export const mockDashboardStats = {
  users: { total: 24, active: 22, deleted: 2, trend: 8.2 },
  teams: { total: 6, withLead: 5, withoutLead: 1, trend: 0 },
  projects: {
    total: 12,
    active: 8,
    completed: 3,
    cancelled: 1,
    overdue: 2,
    trend: 12.5,
  },
  tasks: {
    total: 87,
    pending: 23,
    inProgress: 31,
    completed: 28,
    overdue: 5,
    trend: -3.1,
  },
}

// Chart data - Projects by Status (for PieChart/DonutChart)
export const mockProjectsByStatus = [
  { status: 'not_started', count: 2, fill: 'var(--color-not_started)' },
  { status: 'in_progress', count: 6, fill: 'var(--color-in_progress)' },
  { status: 'completed', count: 3, fill: 'var(--color-completed)' },
  { status: 'cancelled', count: 1, fill: 'var(--color-cancelled)' },
]

export const projectsChartConfig: ChartConfig = {
  count: { label: 'Projects' },
  not_started: { label: 'Not Started', color: 'var(--chart-3)' }, // dark blue
  in_progress: { label: 'In Progress', color: 'var(--info)' }, // bright blue
  completed: { label: 'Completed', color: 'var(--success)' }, // green
  cancelled: { label: 'Cancelled', color: 'var(--chart-5)' }, // coral/red
}

// Chart data - Tasks by Priority (for BarChart)
export const mockTasksByPriority = [
  { priority: 'low', count: 18, fill: 'var(--color-low)' },
  { priority: 'medium', count: 34, fill: 'var(--color-medium)' },
  { priority: 'high', count: 25, fill: 'var(--color-high)' },
  { priority: 'urgent', count: 10, fill: 'var(--color-urgent)' },
]

export const tasksPriorityChartConfig: ChartConfig = {
  count: { label: 'Tasks' },
  low: { label: 'Low', color: 'var(--chart-2)' }, // teal
  medium: { label: 'Medium', color: 'var(--chart-4)' }, // yellow/gold
  high: { label: 'High', color: 'var(--chart-1)' }, // orange
  urgent: { label: 'Urgent', color: 'var(--chart-5)' }, // red/coral
}

// Chart data - Tasks by Status (for horizontal BarChart)
export const mockTasksByStatus = [
  { status: 'not_started', count: 23, fill: 'var(--color-not_started)' },
  { status: 'in_progress', count: 31, fill: 'var(--color-in_progress)' },
  { status: 'awaiting_review', count: 8, fill: 'var(--color-awaiting_review)' },
  { status: 'completed', count: 25, fill: 'var(--color-completed)' },
]

export const tasksStatusChartConfig: ChartConfig = {
  count: { label: 'Tasks' },
  not_started: { label: 'Not Started', color: 'var(--chart-3)' }, // dark blue
  in_progress: { label: 'In Progress', color: 'var(--info)' }, // bright blue
  awaiting_review: { label: 'Awaiting Review', color: 'var(--warning)' }, // amber/yellow
  completed: { label: 'Completed', color: 'var(--success)' }, // green
}

// Recent items lists
export const mockRecentProjects = [
  {
    id: 1,
    name: 'Project Alpha',
    status: 'in_progress' as const,
    manager: 'John Doe',
    tasksCount: 12,
    completedTasks: 5,
    dueDate: '2025-02-15',
    isOverdue: false,
  },
  {
    id: 2,
    name: 'Website Redesign',
    status: 'in_progress' as const,
    manager: 'Jane Smith',
    tasksCount: 8,
    completedTasks: 3,
    dueDate: '2025-01-30',
    isOverdue: true,
  },
  {
    id: 3,
    name: 'Mobile App v2',
    status: 'not_started' as const,
    manager: null,
    tasksCount: 0,
    completedTasks: 0,
    dueDate: '2025-03-01',
    isOverdue: false,
  },
  {
    id: 4,
    name: 'API Integration',
    status: 'completed' as const,
    manager: 'Bob Wilson',
    tasksCount: 15,
    completedTasks: 15,
    dueDate: '2025-01-15',
    isOverdue: false,
  },
  {
    id: 5,
    name: 'Data Migration',
    status: 'in_progress' as const,
    manager: 'Alice Brown',
    tasksCount: 6,
    completedTasks: 2,
    dueDate: '2025-02-28',
    isOverdue: false,
  },
]

export const mockRecentTasks = [
  {
    id: 1,
    title: 'Implement user authentication',
    priority: 'high' as const,
    status: 'completed' as const,
    projectName: 'Project Alpha',
    projectId: 1,
    assignedTo: 'John Doe',
    dueDate: '2025-01-20',
    isOverdue: false,
  },
  {
    id: 2,
    title: 'Design landing page',
    priority: 'medium' as const,
    status: 'in_progress' as const,
    projectName: 'Website Redesign',
    projectId: 2,
    assignedTo: 'Jane Smith',
    dueDate: '2025-01-25',
    isOverdue: true,
  },
  {
    id: 3,
    title: 'Setup CI/CD pipeline',
    priority: 'high' as const,
    status: 'awaiting_review' as const,
    projectName: 'Project Alpha',
    projectId: 1,
    assignedTo: 'Bob Wilson',
    dueDate: '2025-01-28',
    isOverdue: false,
  },
  {
    id: 4,
    title: 'Write API documentation',
    priority: 'low' as const,
    status: 'not_started' as const,
    projectName: 'API Integration',
    projectId: 4,
    assignedTo: null,
    dueDate: '2025-02-10',
    isOverdue: false,
  },
  {
    id: 5,
    title: 'Database optimization',
    priority: 'urgent' as const,
    status: 'in_progress' as const,
    projectName: 'Data Migration',
    projectId: 5,
    assignedTo: 'Alice Brown',
    dueDate: '2025-01-22',
    isOverdue: true,
  },
]

export type DashboardStats = typeof mockDashboardStats
export type RecentProject = (typeof mockRecentProjects)[number]
export type RecentTask = (typeof mockRecentTasks)[number]

