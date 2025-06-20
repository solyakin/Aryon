import { Search } from "lucide-react"
import FilterMenuList from "./FilterMenu";
import type { Dispatch, SetStateAction } from "react";

interface SearchWrapperProps {
  count: number;
  totalCount: number;
  searchQuery: string;
  selectedTags: string[];
  setSelectedTags: Dispatch<SetStateAction<string[]>>;
  setSearchQuery: Dispatch<SetStateAction<string>>;
}

const FILTER_CATEGORIES = {
  frameworks: "Frameworks",
  reasons: "Reasons",
  providers: "Cloud Providers",
  classes: "Classes"
} as const;

export type FilterCategory = keyof typeof FILTER_CATEGORIES;

const SearchWrapper = ({ 
  count, 
  totalCount, 
  searchQuery, 
  setSearchQuery, 
  selectedTags, 
  setSelectedTags 
}: SearchWrapperProps) => {
  return (
    <section 
      aria-label="Search and filter recommendations" 
      className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-2 mt-5 mb-5"
    >
      <div role="search" className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto">
        <div className="flex items-center gap-2 border border-accent bg-card rounded-sm p-2 w-full sm:w-auto">
          <Search className="size-4 flex-shrink-0" aria-hidden="true" />
          <label htmlFor="search-input" className="sr-only">Search recommendations</label>
          <input
            id="search-input"
            type="search"
            role="searchbox"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recommendations..."
            className="border-none outline-none focus:ring-0 bg-transparent w-full sm:w-[300px] text-card-foreground"
            aria-label="Search recommendations"
          />
        </div>
        <FilterMenuList 
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        />
      </div>
      <div className="flex items-center gap-4 w-full md:w-auto md:justify-end md:text-right">
        <p className="text-card-foreground text-sm" role="status" aria-live="polite">
          Showing {count} of {totalCount} results
        </p>
      </div>
    </section>
  )
}

export default SearchWrapper