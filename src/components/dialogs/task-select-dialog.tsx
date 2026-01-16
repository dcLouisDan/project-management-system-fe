import type { Task } from "@/lib/types/task"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { useQuery } from "@tanstack/react-query"
import { tasksQueryOptions } from "@/lib/query-options/tasks-query-options"
import DebouncedInput from "../debounced-input"
import { useState } from "react"
import { DialogDescription } from "@radix-ui/react-dialog"
import { truncateText } from "@/lib/string-utils"

interface TaskSelectDialogProps {
    task: Task
}

export default function TaskSelectDialog({ task }: TaskSelectDialogProps) {
    const [searchTitle, setSearchTitle] = useState("")
    const { data: taskList } = useQuery(tasksQueryOptions({
        page: 1,
        per_page: 10,
        sort: 'created_at',
        direction: 'desc',
        project_id: task.project_id,
        title: searchTitle
    }))


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Select Task</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Task Select Dialog</DialogTitle>
                    <DialogDescription>Select a task to create a relation</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <DebouncedInput
                            value={searchTitle}
                            onChange={(value) => setSearchTitle(value.toString())}
                            placeholder="Search tasks"
                            className="w-full"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        {
                            taskList && taskList?.data.map((task) => {
                                return (
                                    <TaskSelectItem task={task} key={task.id} />
                                )
                            })
                        }
                    </div>
                    <div className="text-end text-sm text-muted-foreground">
                        Showing 10 out of {taskList?.meta.total} results
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function TaskSelectItem({ task }: { task: Task }) {
    return <div className="border p-2 rounded-md">
        <div className="text-sm">{truncateText(task.title, 40)}</div>
    </div>
}