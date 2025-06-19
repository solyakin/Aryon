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
    <header className="sticky top-0 z-30 bg-gray-100 pb-5" role="banner">
      <div className="space-y-4">
        <nav aria-label="Breadcrumb navigation">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/recommendations" aria-label="Go to recommendations">
                  Recommendations
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight aria-hidden="true" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  className="text-gray-600 font-medium" 
                  href="/recommendations/archive"
                  aria-current="page"
                  aria-label="Current page: Archived recommendations"
                >
                  Archived
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </nav>
        <div className="flex items-center gap-2" role="heading" aria-level={1}>
          <h1 className="text-lg sm:text-2xl font-semibold">Archived Recommendations</h1>
          <Archive className="text-4 sm:size-6 text-gray-600" aria-hidden="true" />
        </div> 
        <div 
          className="w-full overflow-x-auto"
          role="search"
          aria-label="Search and filter archived recommendations"
        >
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
    </header>
  )
}

export default RecommendationTop;