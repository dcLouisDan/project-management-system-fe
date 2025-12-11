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
import { cn } from '@/lib/utils'

export default function PaginationBar({
  pagination,
  className,
  onPerPageChange,
  getPageSearchParams,
}: {
  pagination: PaginatedResponseMetaData
  className?: string
  onPerPageChange?: (perPage: number) => void
  getPageSearchParams?: (page: number) => (prev: any) => any
}) {
  const handlePerPageValueChange = (value: string) => {
    if (onPerPageChange) {
      onPerPageChange(Number(value))
    }
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
              search={getPageSearchParams ? getPageSearchParams(1) : undefined}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious
              disabled={isFirstPage}
              to="."
              search={
                getPageSearchParams
                  ? getPageSearchParams(Math.max(1, current_page - 1))
                  : undefined
              }
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
                  to="."
                  search={
                    getPageSearchParams ? getPageSearchParams(page) : undefined
                  }
                  aria-current={page === current_page ? 'page' : undefined}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationNext
              to="."
              disabled={isLastPage}
              search={
                getPageSearchParams
                  ? getPageSearchParams(Math.min(last_page, current_page + 1))
                  : undefined
              }
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLast
              to="."
              disabled={isLastPage}
              search={
                getPageSearchParams ? getPageSearchParams(last_page) : undefined
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
