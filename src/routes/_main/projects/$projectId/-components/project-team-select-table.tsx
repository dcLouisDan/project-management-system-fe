import type { Team } from '@/lib/types/team'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table'
import PaginationBar from '@/components/pagination-bar'
import { Button } from '@/components/ui/button'
import { Check, Plus } from 'lucide-react'
import { useMemo } from 'react'
import ProjectTeamTableFilters from './project-team-table-filters'
import { teamsQueryOptions } from '@/lib/query-options/teams-query-options'
import type { ProjectTeamsSelectSearchParams } from '../teams'

interface ProjectTeamsSelectTableProps {
  selectedIds?: number[]
  onTeamSelect?: (team: Team) => void
}

export default function ProjectTeamsSelectTable({
  selectedIds = [],
  onTeamSelect = () => {},
}: ProjectTeamsSelectTableProps) {
  const { page, per_page, name, sort, direction } = useSearch({
    from: '/_main/projects/$projectId/teams',
  })
  const navigate = useNavigate({ from: '/_main/projects/$projectId/teams' })
  const { data, isFetching } = useQuery(
    teamsQueryOptions({
      page: page ?? 1,
      per_page: per_page ?? 10,
      name: name ?? '',
      sort: sort,
      direction: direction,
    }),
  )

  const handlePerPageChange = (perPage: number) => {
    navigate({
      to: '.',
      search: (prev: ProjectTeamsSelectSearchParams) => ({
        ...prev,
        per_page: perPage,
        page: 1,
      }),
    })
  }

  const getPageSearchParams = (page: number) => (prev: ProjectTeamsSelectSearchParams) => ({
    ...prev,
    page,
  })

  const columns: ColumnDef<Team>[] = useMemo(() => {
    return [
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const team = row.original

          const selected = selectedIds.includes(team.id)

          return (
            <Button
              disabled={selected}
              size="icon-sm"
              onClick={() => {
                onTeamSelect(team)
              }}
            >
              {selected ? <Check /> : <Plus />}
            </Button>
          )
        },
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
          const team = row.original
          return (
            <Link
              className="border-b border-foreground/30 border-dotted hover:border-dashed hover:border-foreground/50"
              to="/teams/$teamId"
              params={{ teamId: team.id.toString() }}
            >
              {team.name}
            </Link>
          )
        },
      },
    ]
  }, [selectedIds, onTeamSelect])
  return (
    <div>
      {' '}
      <ProjectTeamTableFilters />
      <DataTable
        columns={columns}
        data={data?.data || []}
        isFetching={isFetching}
      />
      {data?.meta && (
        <PaginationBar
          className="mt-2"
          pagination={data?.meta!}
          onPerPageChange={handlePerPageChange}
          getPageSearchParams={getPageSearchParams}
        />
      )}
    </div>
  )
}
