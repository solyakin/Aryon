import { Box } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useInView } from 'react-intersection-observer'
import { useInfiniteQuery } from '@tanstack/react-query'
import httpRequest from '../../lib/httpsRequest'
import { useDebouncedValue } from '@/lib/debounceSearch'
import React, { useCallback, useEffect, useState } from 'react'
import { useUserAuthContext } from "@/context/user/user-hooks"

const SearchWrapper = React.lazy(() => import('@/components/dashboard/SearchWrapper'));
const DashboardTitle = React.lazy(() => import('@/components/dashboard/DashboardTitle'));
const RecommendationCard = React.lazy(() => import('@/components/dashboard/RecommendationCard'));

const pageLimit = 10;
function ArchivedRecommendations() {

  const { token } = useUserAuthContext();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "0px 0px 400px 0px"
  });

  const fetchingArchivedRecommendation = useCallback(async ({ pageParam = null }: { pageParam?: string | null }) => {
    const response = await httpRequest({ token: token }).get(
      `/recommendations/archive?${pageParam ? `cursor=${pageParam}&` : ''}limit=${pageLimit}&search=${debouncedSearchQuery}&tags=`
    );
    console.log(response);
    return response.data;
  }, [debouncedSearchQuery, token]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({
    queryKey: ['archived-recommendations', debouncedSearchQuery],
    queryFn: fetchingArchivedRecommendation,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination?.cursor?.next || undefined;
    },
    initialPageParam: null as string | null
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  console.log("Data:", data);

  return (
    <div className="h-screen">
      <SidebarProvider className="flex flex-col">
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex-1 py-4 px-8 bg-gray-100">
              <div className="sticky top-0 z-50 bg-gray-100 pb-5">
                <div className="">
                  <DashboardTitle 
                  title="Archived Recommendations"
                  subtitle="View all archived recommendations"
                  link="/recommendations"
                  actionLabel="Active"
                  />
                  <SearchWrapper 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    count={data?.pages?.reduce((total, page) => total + page.data.length, 0) || 0}
                    totalCount={data?.pages[0]?.pagination?.totalItems || 0}
                    selectedTags={selectedTags}
                    setSelectedTags={setSelectedTags}
                  />
                </div>
              </div>
              <div className="min-h-[100vh] overflow-scroll">
                <div className="space-y-3">
                  {status === 'pending' ? (
                    <div className="h-[calc(100vh-200px)] flex items-center justify-center">
                      <div className="bg-teal-300 p-5 rounded-md flex items-center justify-center">
                        <Box className="animate-spin size-6"/>
                      </div>
                    </div>
                  ) : status === 'error' ? (
                    <div>Error fetching recommendations</div>
                  ) : (
                    <div className='space-y-4'>
                      {data?.pages.map((page, i) => (
                        <React.Fragment key={i}>
                          {page.data.map((item: any, index: number) => (
                            <RecommendationCard 
                              item={item} 
                              status="archived"
                              key={`${page.pagination.cursor?.next || 'initial'}-${index}`}
                            />
                          ))}
                        </React.Fragment>
                      ))}
                      <div
                        ref={ref}
                        className="h-10 flex items-center justify-center"
                      >
                        {isFetchingNextPage
                          ? 'Loading more...'
                          : hasNextPage
                          ? 'Load more'
                          : 'Nothing more to load'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}

export default ArchivedRecommendations;
