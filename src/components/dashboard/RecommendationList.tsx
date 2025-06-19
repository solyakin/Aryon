import React from "react"
import { Inbox, Loader } from "lucide-react"
import type { GlobalResponseState } from "@/types/global";

const RecommendationCard = React.lazy(() => import('@/components/dashboard/RecommendationCard'));

interface RecommendationListProps {
  data: GlobalResponseState | undefined;
  ref: React.RefObject<HTMLDivElement> | any;
  isFetchingNextPage: boolean;
  status: string;
  type: 'archived' | 'active';
  hasNextPage: boolean;
}

const RecommendationList = ({data, ref, isFetchingNextPage, status, hasNextPage, type}: RecommendationListProps) => {
  return (
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
                    <p className="text-lg font-semibold">{`No ${type === "archived" ? "Archived" : ""} Recommendations`}</p>
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
                                status={type}
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
                        : ''
                    }
                </div>
            </div>
            )}
        </div>
    </div>
  )
}

export default RecommendationList;