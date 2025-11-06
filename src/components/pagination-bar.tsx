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

export default function PaginationBar({
  pagination,
  className,
}: {
  pagination: PaginatedResponseMetaData
  className?: string
}) {
  const navigate = useNavigate()
  const handlePerPageValueChange = (value: string) => {
    navigate({
      to: '.',
      search: (prev: UsersIndexSearchParams) => ({
        ...prev,
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
        <span className="text-muted-foreground text-sm">Showing</span>
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
              search={(prev: UsersIndexSearchParams) => ({
                ...prev,
                page: 1,
              })}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious
              disabled={isFirstPage}
              to="."
              search={(prev: UsersIndexSearchParams) => ({
                ...prev,
                page: prev.page ? prev.page - 1 : undefined,
              })}
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
                  search={(prev: UsersIndexSearchParams) => ({
                    ...prev,
                    page: page,
                  })}
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
              search={(prev: UsersIndexSearchParams) => ({
                ...prev,
                page: prev.page ? prev.page + 1 : undefined,
              })}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLast
              to="."
              disabled={isLastPage}
              search={(prev: UsersIndexSearchParams) => ({
                ...prev,
                page: last_page,
              })}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
