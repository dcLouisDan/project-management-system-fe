import { Check, Hourglass, ThumbsDown, ThumbsUp } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { Task, TaskReview } from '@/lib/types/task'
import { snakeCaseToTitleCase } from '@/lib/string-utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@radix-ui/react-select'
import { getStatusColorClassString } from '@/lib/types/status'
import { cn } from '@/lib/utils'
import dayjs from '@/lib/dayjs'
import { useEffect, useMemo, useState } from 'react'
import { BasicSelect, type BasicSelectItem } from '@/components/basic-select'
import { Label } from '@/components/ui/label'

interface TaskReviewDialogProps {
  task: Task
  prefix?: string
}

export default function TaskReviewDialog({
  task,
  prefix,
}: TaskReviewDialogProps) {
  const [currentReview, setCurrentReview] = useState<TaskReview | undefined>(
    task.reviews[0] ?? undefined,
  )
  const reviewOptions: BasicSelectItem[] = useMemo(() => {
    return task.reviews.map((review) => {
      const status = snakeCaseToTitleCase(review.status)
      const date = review.reviewed_at
        ? dayjs(review.reviewed_at).format('YYYY-MM-DD HH:MM:ss')
        : 'N/A'
      return {
        value: review.id.toString(),
        label: `Review ID No. ${review.id} - ${status} (${date})`,
      }
    })
  }, [task])
  const onReviewSelectChange = (value: string) => {
    task.reviews.forEach((review) => {
      if (review.id.toString() == value) {
        setCurrentReview(review)
      }
    })
  }

  useEffect(() => {
    setCurrentReview(task.reviews[0])
  }, [task.reviews])

  if (!currentReview) {
    return null
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={task.status == 'completed' ? 'success' : 'default'}>
          {task.status == 'completed' ? (
            <Check />
          ) : currentReview && currentReview.status == 'approved' ? (
            <ThumbsUp />
          ) : currentReview && currentReview.status == 'rejected' ? (
            <ThumbsDown />
          ) : (
            <Hourglass />
          )}{' '}
          {prefix && prefix + ' '}
          {snakeCaseToTitleCase(currentReview.status)}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Task currentReview</DialogTitle>
          <DialogDescription>
            View current task submission and currentReview status
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="flex justify-end items-center gap-2">
          <Label className="text-nowrap">Select Review:</Label>
          <BasicSelect
            items={reviewOptions}
            value={currentReview.id.toString()}
            onValueChange={onReviewSelectChange}
            className="w-full"
          />
        </div>
        <div className="grid sm:grid-cols-2 sm:divide-x-2">
          <div className="flex flex-col sm:pe-2">
            <p className="font-bold">{task.title}</p>

            <div className="text-xs text-muted-foreground flex gap-2">
              <p className="">{dayjs(currentReview.created_at).fromNow()}</p>|
              <p className="">{task.assigned_to?.name}</p>
            </div>
            <div className="p-2 mt-2 border rounded-lg h-96 overflow-y-auto text-sm">
              <p>{currentReview.submission_notes}</p>
            </div>
          </div>
          <div className="ps-2">
            {currentReview.reviewed_at ? (
              <div className="flex flex-col sm:pe-2">
                <div className="flex gap-2">
                  <div
                    className={cn(
                      'size-10 bg-accent text-accent-foreground rounded-lg border my-auto flex items-center justify-center',
                      getStatusColorClassString(currentReview.status),
                    )}
                  >
                    {currentReview.status == 'approved' ? (
                      <ThumbsUp />
                    ) : currentReview.status == 'rejected' ? (
                      <ThumbsDown />
                    ) : (
                      <Hourglass />
                    )}
                  </div>
                  <div>
                    <p className="font-bold">Feedback</p>
                    <div className="text-xs text-muted-foreground flex gap-2">
                      <p className="">
                        {snakeCaseToTitleCase(currentReview.status)}
                      </p>
                      |{' '}
                      <p className="">
                        {dayjs(currentReview.reviewed_at).fromNow()}
                      </p>
                      |<p className="">{currentReview?.reviewed_by?.name}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2 mt-2 border rounded-lg h-96 overflow-y-auto text-sm">
                  <p>{currentReview.feedback}</p>
                </div>
              </div>
            ) : (
              <div className="h-full border rounded-lg flex flex-col justify-center items-center text-muted-2-foreground">
                <Hourglass className="size-12" />
                <p className="text-center text-wrap w-54 text-sm mt-4">
                  This task submission is currently{' '}
                  {snakeCaseToTitleCase(currentReview.status)}. Check again on a
                  later time for the currentReviewers feedback.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
