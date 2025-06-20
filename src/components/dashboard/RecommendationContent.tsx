import httpRequest from '../../lib/httpsRequest';
import { useDebouncedValue } from "@/lib/debounceSearch";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { GlobalResponseState } from "@/types/global";
import { useUserAuthContext } from "@/context/user/user-hooks";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RecommendationsAction } from "@/context/recommendations/types";
import { useRecommendationsContext } from "@/context/recommendations/recommendations-hooks";

const SearchWrapper = React.lazy(() => import('@/components/dashboard/SearchWrapper'));
const DashboardTitle = React.lazy(() => import('@/components/dashboard/DashboardTitle'));
const RecommendationList = React.lazy(() => import('@/components/dashboard/RecommendationList'));

const PAGE_SIZE = 10;

const RecommendationsContent = () => {

    const { token } = useUserAuthContext();
    const { dispatch } = useRecommendationsContext();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);
    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: "0px 0px 400px 0px"
    });

    const fetchRecommendations = useCallback(
        async ({ pageParam = null }: { pageParam?: string | null }) => {
            if (!token) {
                throw new Error("No authentication token found");
            }
            const response = await httpRequest({ token: token }).get(
                `/recommendations?${pageParam ? `cursor=${pageParam}&` : ''}limit=${PAGE_SIZE}&search=${debouncedSearchQuery}&tags=${selectedTags.join(',')}`
            );
            return response.data;
        },
        [token, debouncedSearchQuery, selectedTags]
    );

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


    // Memoize the recommendations data to avoid unnecessary re-renders
    const memoizedRecommendations: GlobalResponseState | undefined = useMemo(() => {
      if (!data) return;
      return data as GlobalResponseState;
    }, [data]);

    // Effect to fetch next page when in view
    // and there are more pages to fetch
    // This will trigger when the user scrolls to the bottom of the list
    // and there are more recommendations to load
    useEffect(() => {
        if (inView && hasNextPage) {
        fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);


    // Effect to set available tags in the context when the data is fetched
    // This will ensure that the available tags are set only once when the data is fetched
    // and not on every render
    useEffect(() => {
        if (data?.pages?.[0]?.availableTags) {
        dispatch({
            type: RecommendationsAction.SET_AVAILABLE_TAGS,
            payload: data.pages[0].availableTags
        });
        }
    }, [data?.pages, dispatch]);

    return (
    <div className="flex-1 py-4 px-4 md:px-8 bg-gray-100">
        <div className="sticky top-0 z-30 bg-gray-100 pb-5">
            <DashboardTitle 
            title="Recommendations"
            subtitle="View all recommendations"
            link="/recommendations/archive"
            actionLabel="Archived"
            />
        </div>
        <SearchWrapper 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            count={Math.min(
                data?.pages?.length ? data.pages.length * PAGE_SIZE : 0,
                data?.pages[0]?.pagination?.totalItems || 0
            )}
            totalCount={data?.pages[0]?.pagination?.totalItems || 0}
            setSelectedTags={setSelectedTags}
            selectedTags={selectedTags}
        />
        <RecommendationList 
            data={memoizedRecommendations}
            inViewRef={ref}
            type='active'
            isFetchingNextPage={isFetchingNextPage}
            status={status}
            hasNextPage={hasNextPage}
        />
    </div>
  );
}

export default RecommendationsContent;