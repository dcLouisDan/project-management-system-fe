import type { ProjectRelationsGraph } from "../types/project-relations";
import type { Task } from "../types/task";
import type { User } from "../types/user";

export const mockProjectGraphData: ProjectRelationsGraph = {
    "\App\Models\Task_1": [
        {
            "target": "\App\Models\Task_2",
            "target_status": "in_progress",
            "type": "blocks"
        },
        {
            "target": "\App\Models\Task_4",
            "target_status": "not_started",
            "type": "blocks"
        }
    ],
    "\App\Models\Task_2": [
        {
            "target": "\App\Models\Task_3",
            "target_status": "completed",
            "type": "blocks"
        }
    ],
    "\App\Models\Task_3": [
    ]
}

export const mockUser: User = {
    id: 1,
    name: "John Doe",
    email: "[EMAIL_ADDRESS]",
    roles: ["admin"],
    created_at: "2025-01-20",
}

export const mockTasks: Task[] = [
    {
        id: 1,
        title: "Task 1",
        description: "This is the first task description",
        status: "in_progress",
        priority: "high",
        project_id: 1,
        assigned_to: mockUser,
        assigned_by: mockUser,
        due_date: "2025-01-20",
        is_overdue: false,
        created_at: "2025-01-01",
        updated_at: "2025-01-10",
        reviews: [],
    },
    {
        id: 2,
        title: "Task 2",
        description: "This is the second task description",
        status: "completed",
        priority: "medium",
        project_id: 1,
        assigned_to: mockUser,
        assigned_by: mockUser,
        due_date: "2025-01-25",
        is_overdue: false,
        created_at: "2025-01-02",
        updated_at: "2025-01-15",
        reviews: []
    },
    {
        id: 3,
        title: "Task 3",
        description: "This is the third task description",
        status: "not_started",
        priority: "low",
        project_id: 1,
        assigned_to: mockUser,
        assigned_by: mockUser,
        due_date: "2025-01-28",
        is_overdue: false,
        created_at: "2025-01-03",
        updated_at: "2025-01-03",
        reviews: []
    },
    {
        id: 4,
        title: "Task 4",
        description: "This is the fourth task description",
        status: "in_progress",
        priority: "urgent",
        project_id: 1,
        assigned_to: mockUser,
        assigned_by: mockUser,
        due_date: "2025-01-22",
        is_overdue: true,
        created_at: "2025-01-04",
        updated_at: "2025-01-18",
        reviews: []
    },
]