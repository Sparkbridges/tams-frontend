import { useQuery } from '@tanstack/react-query'
import { ENDPOINTS, recruitmentClient } from '../client'
import { atsClient } from '../client/ats'
import { useTamsStore } from '#/lib/store'
import { useRecruitmentAccess } from './recruitment'

export function useRecruitmentDashboard() {
  const access = useRecruitmentAccess()
  const user = useTamsStore((state) => state.user)
  const branch = useTamsStore((state) => state.activeBranch)
  const context = [
    user?.id,
    user?.employee?.company_id,
    branch,
    user?.managingBranches?.map((item) => item.id),
  ]
  const pendingRequests = useQuery({
    queryKey: [
      ENDPOINTS.recruitmentTalentRequests,
      'dashboard',
      context,
      'pending',
    ],
    queryFn: () =>
      recruitmentClient.getRecruitmentJobRequests({
        page: 1,
        per_page: 5,
        status: 'pending',
      }),
    enabled: access.canViewTalentRequests,
  })
  const activeJobs = useQuery({
    queryKey: [
      ENDPOINTS.recruitmentJobPostings,
      'dashboard',
      context,
      'active',
    ],
    queryFn: () =>
      recruitmentClient.fetchRecruitmentJobPostings({
        page: 1,
        per_page: 1,
        status: 'active',
      }),
    enabled: access.canViewJobPostings,
  })
  const applications = useQuery({
    queryKey: [ENDPOINTS.recruitmentApplicants, 'dashboard', context],
    queryFn: () => atsClient.statistics({}),
    enabled: access.canViewApplicants,
  })
  return { access, pendingRequests, activeJobs, applications }
}
