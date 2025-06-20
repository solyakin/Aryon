import React, { 
    useCallback, 
    useEffect, 
    useMemo, 
    useState 
} from 'react'
import httpRequest from '@/lib/httpsRequest';
import { useDebouncedValue } from '@/lib/debounceSearch';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { GlobalResponseState } from '@/types/global';
import { useUserAuthContext } from '@/context/user/user-hooks';
import ErrorBoundary from '../ErrorBoundary';

const RecommendationTop = React.lazy(() => import('@/components/dashboard/RecommendationTop'));
const RecommendationList = React.lazy(() => import('@/components/dashboard/RecommendationList'));

const pageLimit = 10;
const ArchivedRecommendationContent = () => {

    const { token } = useUserAuthContext();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);
    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: "0px 0px 400px 0px"
    });

  const fetchingArchivedRecommendation = useCallback(
    async ({ pageParam = null }: { pageParam?: string | null }) => {
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

  // Transform InfiniteData to GlobalResponseState
  const memoizedRecommendations: GlobalResponseState | undefined = useMemo(() => {
    if (!data) return;
    return data as GlobalResponseState;
  }, [data]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <ErrorBoundary>
      <div className="flex-1 py-4 px-8 bg-background text-foreground">
          <React.Suspense>
            <RecommendationTop 
              data={memoizedRecommendations?.pages}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
          </React.Suspense>
          <React.Suspense>
            <RecommendationList 
              data={memoizedRecommendations}
              inViewRef={ref}
              type="archived"
              isFetchingNextPage={isFetchingNextPage}
              status={status}
              hasNextPage={hasNextPage}
            />
          </React.Suspense>
      </div>
    </ErrorBoundary>
  )
}

export default ArchivedRecommendationContent