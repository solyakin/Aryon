import { Box, Inbox } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import httpRequest from '../../lib/httpsRequest';
import { useInView } from 'react-intersection-observer';
import { useDebouncedValue } from '@/lib/debounceSearch';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useUserAuthContext } from "@/context/user/user-hooks";
import React, { useCallback, useEffect, useState } from 'react';
import { RecommendationsProvider } from "@/context/recommendations/recommendations-context";
import { useRecommendationsContext } from "@/context/recommendations/recommendations-hooks";
import { RecommendationsAction } from "@/context/recommendations/types";

const SearchWrapper = React.lazy(() => import('@/components/dashboard/SearchWrapper'));
const DashboardTitle = React.lazy(() => import('@/components/dashboard/DashboardTitle'));
const RecommendationCard = React.lazy(() => import('@/components/dashboard/RecommendationCard'));

const PAGE_SIZE = 10;

function RecommendationsContent() {
  const { token } = useUserAuthContext();
  const { dispatch } = useRecommendationsContext();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "0px 0px 400px 0px"
  });

  const fetchRecommendations = useCallback(async ({ pageParam = null }: { pageParam?: string | null }) => {
    if(!token) {
      throw new Error("No authentication token found");
    }
    const response = await httpRequest({ token: token }).get(
      `/recommendations?${pageParam ? `cursor=${pageParam}&` : ''}limit=${PAGE_SIZE}&search=${debouncedSearchQuery}&tags=${selectedTags.join(',')}`
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
    queryKey: ['recommendations', debouncedSearchQuery, selectedTags, token],
    queryFn: fetchRecommendations,
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

  useEffect(() => {
    if (data?.pages?.[0]?.availableTags) {
      dispatch({
        type: RecommendationsAction.SET_AVAILABLE_TAGS,
        payload: data.pages[0].availableTags
      });
    }
  }, [data?.pages, dispatch]);

  return (
    <div className="flex-1 py-4 px-8 bg-gray-100">
      <div className="sticky top-0 z-50 bg-gray-100 pb-5">
        <div className="">
          <DashboardTitle 
          title="Recommendations"
          subtitle="View all recommendations"
          link="/recommendations/archive"
          actionLabel="Archived"
          />
          <SearchWrapper 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            count={data?.pages?.reduce((total, page) => total + page.data.length, 0) || 0}
            totalCount={data?.pages[0]?.pagination?.totalItems || 0}
            setSelectedTags={setSelectedTags}
            selectedTags={selectedTags}
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
          ) :  data?.pages[0]?.data?.length === 0 ? (
            <div className="h-[calc(100vh-200px)] flex items-center justify-center">
              <div className="bg-gray-200 p-20 rounded-md flex flex-col gap-5 items-center justify-center">
                <Inbox className="size-14 text-gray-600" />
                <p className="text-lg font-semibold">No Recommendations Found</p>
              </div>
            </div>
          ) : (
            <div className='space-y-4'>
              {data?.pages.map((page, i) => (
                <React.Fragment key={i}>
                  {page.data.map((item: any, index: number) => (
                    <RecommendationCard 
                      item={item} 
                      status="active"
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
  );
}

function Recommendations() {
  return (
    <div className="h-screen">
      <SidebarProvider className="flex flex-col">
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <RecommendationsProvider>
              <RecommendationsContent />
            </RecommendationsProvider>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default Recommendations;
