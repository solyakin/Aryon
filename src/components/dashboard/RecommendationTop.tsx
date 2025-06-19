import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Archive, ChevronRight } from "lucide-react";
import SearchWrapper from "./SearchWrapper";
import type { Dispatch, SetStateAction } from "react";
import type { RecommendationResponseData } from "@/types/global";

interface RecommendationTopProps {
  data: RecommendationResponseData[] | undefined;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  selectedTags: string[];
  setSelectedTags: Dispatch<SetStateAction<string[]>>;
}

const RecommendationTop = ({ data, searchQuery, setSearchQuery, selectedTags, setSelectedTags }: RecommendationTopProps) => {
  return (
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
            count={Math.min(
              data?.length ? data.length * 10 : 0,
              data?.[0]?.pagination?.totalItems || 0
            )}
            totalCount={data?.[0]?.pagination?.totalItems || 0}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
        </div>
      </div>
    </div>
  )
}

export default RecommendationTop;