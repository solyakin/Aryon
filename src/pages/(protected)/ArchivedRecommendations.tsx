import { Archive, ChevronRight, Inbox, Loader } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
    if(!token) {
      throw new Error("No authentication token found");
    }
    const response = await httpRequest({ token: token }).get(
      `/recommendations/archive?${pageParam ? `cursor=${pageParam}&` : ''}limit=${pageLimit}&search=${debouncedSearchQuery}&tags=${selectedTags.join(',')}`
    );
    return response.data;
  }, [token, debouncedSearchQuery, selectedTags]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({
    queryKey: ['archived-recommendations', debouncedSearchQuery, selectedTags, token],
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

  return (
    <div className="h-screen">
      <SidebarProvider className="flex flex-col">
        <div className="flex flex-col lg:flex-row flex-1">
          <div className="sticky top-0 z-50 bg-gray-100 lg:hidden p-4">
            <AppSidebar />
          </div>
          <div className="hidden lg:block">
            <AppSidebar />
          </div>
          <SidebarInset>
            <div className="flex-1 py-4 px-8 bg-gray-100">
              <div className="sticky top-0 z-30 bg-gray-100 pb-5">
                <div className="space-y-4">
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/recommendations">Recommendations</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator>
                        <ChevronRight />
                      </BreadcrumbSeparator>
                      <BreadcrumbItem>
                        <BreadcrumbLink className="text-gray-600 font-medium" href="/recommendations/archive">Archived</BreadcrumbLink>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                  <div className="flex items-center gap-2">
                    <p className="text-lg sm:text-2xl font-semibold">Archived Recommendations</p>
                    <Archive className="text-4 sm:size-6 text-gray-600" />
                  </div>
                  
                  <div className="w-full overflow-x-auto">
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
              </div>
              <div className="min-h-[100vh] overflow-y-auto">
                <div className="space-y-3">
                  {status === 'pending' ? (
                    <div className="h-[calc(100vh-200px)] flex items-center justify-center">
                      <div className="flex items-center justify-center">
                        <Loader className="animate-spin text-teal-500 size-12"/>
                      </div>
                    </div>
                  ) : status === 'error' ? (
                    <div>Error fetching recommendations</div>
                  ) : data?.pages[0]?.data?.length === 0 ? (
                    <div className="h-[calc(100vh-200px)] flex items-center justify-center">
                      <div className="bg-gray-200 p-20 rounded-md flex flex-col gap-5 items-center justify-center">
                        <Inbox className="size-14 text-gray-600" />
                        <p className="text-lg font-semibold">No Archived Recommendations</p>
                      </div>
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      {data?.pages.map((page, i) => (
                        <React.Suspense fallback={<div>loading</div>} key={i}>
                          <React.Fragment>
                            {page.data.map((item: any, index: number) => (
                              <RecommendationCard
                                item={item}
                                status="archived"
                                key={`${page.pagination.cursor?.next || 'initial'}-${index}`}
                              />
                            ))}
                          </React.Fragment>
                        </React.Suspense>
                      ))}
                      <div
                        ref={ref}
                        className="h-10 flex items-center justify-center"
                      >
                        {isFetchingNextPage
                          ? <div className="flex items-center justify-center">
                              <Loader className="animate-spin text-teal-500 size-12"/>
                            </div>
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
