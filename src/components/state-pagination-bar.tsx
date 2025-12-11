import type { PaginatedResponseMetaData } from '@/lib/types/response'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useMemo } from 'react'
import { BasicSelect, type BasicSelectItem } from './basic-select'
import { useNavigate } from '@tanstack/react-router'
import { type UsersIndexSearchParams } from '@/routes/_main/users'
import { cn } from '@/lib/utils'

export default function StatePaginationBar({
  pagination,
  className,
  onPageChange = () => {},
}: {
  pagination: PaginatedResponseMetaData
  className?: string
  onPageChange?: (page: number) => void
}) {
  const navigate = useNavigate()
  const handlePerPageValueChange = (value: string) => {
    navigate({
      to: '.',
      search: (prev) => ({
        ...(prev as UsersIndexSearchParams),
        per_page: Number(value),
        page: 1, // Reset to first page when per_page changes
      }),
    })
  }
  const { current_page, last_page } = pagination
  const isFirstPage = current_page === 1
  const isLastPage = current_page === last_page
  const pagesToShow = useMemo(() => {
    const pages: number[] = []
    const delta = isFirstPage || isLastPage ? 2 : 1
    const startPage = Math.max(1, current_page - delta)
    const endPage = Math.min(last_page, current_page + delta)

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }, [current_page, last_page])
  const perPageOptions: BasicSelectItem[] = [5, 10, 20, 50].map((num) => ({
    value: num.toString(),
    label: num.toString(),
  }))
  return (
    <div
      className={cn(
        'flex gap-2 items-center w-full sm:justify-between',
        className,
      )}
    >
      <div className="hidden sm:flex items-center gap-2">
        <BasicSelect
          onValueChange={handlePerPageValueChange}
          label="Rows per page"
          items={perPageOptions}
          value={pagination.per_page.toString()}
        />
        <span className="text-muted-foreground text-sm">
          out of {pagination.total} results
        </span>
      </div>
      <div className="hidden sm:block text-sm text-muted-foreground">
        Page {current_page} of {last_page}
      </div>
      <Pagination className="sm:w-fit mx-0">
        <PaginationContent>
          <PaginationItem>
            <PaginationFirst
              disabled={isFirstPage}
              to="."
              onClick={() => onPageChange(1)}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious
              disabled={isFirstPage}
              onClick={() => onPageChange(Math.max(1, current_page - 1))}
            />
          </PaginationItem>
          {pagesToShow.map((page, index) =>
            page === -1 ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === current_page}
                  onClick={() => onPageChange(page)}
                  aria-current={page === current_page ? 'page' : undefined}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationNext
              disabled={isLastPage}
              onClick={() =>
                onPageChange(Math.min(last_page, current_page + 1))
              }
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLast
              disabled={isLastPage}
              onClick={() => onPageChange(last_page)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
