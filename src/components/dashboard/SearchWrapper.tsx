import { Filter, Search } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react";
import { 
  useRecommendationsContext 
} from "@/context/recommendations/recommendations-hooks";
import type { Dispatch, SetStateAction } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SelectedFilters } from "@/context/recommendations/types";
import { useQueryClient } from "@tanstack/react-query";
import FilterItem from "./FilterItem";

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

const SearchWrapper = ({ count, totalCount, searchQuery, setSearchQuery, selectedTags, setSelectedTags }: SearchWrapperProps) => {
    
  const queryClient = useQueryClient();
  const [filterSearch, setFilterSearch] = useState("");
  const { availableTags, selectedFilters, dispatch } = useRecommendationsContext();

  const handleFilterChange = (category: FilterCategory, value: string) => {
    if (selectedTags.includes(value)) {
      setSelectedTags(selectedTags.filter(tag => tag !== value));
    } else {
      setSelectedTags([...selectedTags, value]);
    }
    dispatch({
      type: "UPDATE_SELECTED_FILTERS",
      payload: { [category]: selectedTags.includes(value) ? selectedTags.filter(tag => tag !== value) : [...selectedTags, value] }
    });
  };

  const getSelectedFiltersCount = (filters: SelectedFilters): number => {
    return Object.values(filters).reduce((acc, curr) => acc + (curr?.length || 0), 0);
  };

  const clearFilters = async() => {
    setSelectedTags([]);
    dispatch({ type: "CLEAR_FILTERS", payload: null });
    // Refresh the data
    await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['recommendations'] }),
        queryClient.invalidateQueries({ queryKey: ['archived-recommendations'] })
    ]);
  };

  return (
    <section 
      aria-label="Search and filter recommendations" 
      className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-2 mt-5 mb-5"
    >
      <div role="search" className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto">
        <div className="flex items-center gap-2 border border-gray-300 bg-white rounded-sm p-2 w-full sm:w-auto">
          <Search className="size-4 flex-shrink-0" aria-hidden="true" />
          <label htmlFor="search-input" className="sr-only">Search recommendations</label>
          <input
            id="search-input"
            type="search"
            role="searchbox"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recommendations..."
            className="border-none outline-none focus:ring-0 bg-transparent w-full sm:w-[300px] text-gray-700"
            aria-label="Search recommendations"
          />
        </div>
        <Popover>
          <PopoverTrigger className="w-full sm:w-auto">
            <div 
              role="button"
              aria-haspopup="dialog"
              aria-expanded="false"
              aria-label="Filter"
              tabIndex={0}
              className="border border-gray-300 p-2.5 rounded-sm flex items-center justify-center sm:justify-start gap-2 hover:bg-gray-200 transition-colors cursor-pointer w-full sm:w-auto"
            >
              <Filter className="size-3 text-gray-600" aria-hidden="true" />
              <span className="text-sm">Filter</span>
              {getSelectedFiltersCount(selectedFilters) > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5" role="status" aria-live="polite">
                  {getSelectedFiltersCount(selectedFilters)} filters active
                </span>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[calc(100vw-2rem)] sm:w-80 p-0">
            <div className="p-2 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Search className="size-4" aria-hidden="true" />
                <label htmlFor="filter-search" className="sr-only">Search filters</label>
                <input
                  id="filter-search"
                  type="search"
                  placeholder="Search filters..."
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  className="border-none outline-none text-sm focus:ring-0 bg-transparent w-full text-gray-700"
                  aria-label="Search filters"
                />
              </div>
            </div>
            <ScrollArea className="h-[300px]">
              <nav aria-label="Filter categories">
                <FilterItem 
                  title="Cloud Providers"
                  category="providers"
                  availableTags={availableTags?.providers || []}
                  selectedFilters={selectedFilters}
                  handleFilterChange={handleFilterChange}
                />
                <FilterItem 
                  title="Frameworks"
                  category="frameworks"
                  availableTags={availableTags?.frameworks || []}
                  selectedFilters={selectedFilters}
                  handleFilterChange={handleFilterChange}
                />
                <FilterItem 
                  title="Reasons"
                  category="reasons"
                  availableTags={availableTags?.reasons || []}
                  selectedFilters={selectedFilters}
                  handleFilterChange={handleFilterChange}
                />
                <FilterItem 
                  title="Classes"
                  category="classes"
                  availableTags={availableTags?.classes || []}
                  selectedFilters={selectedFilters}
                  handleFilterChange={handleFilterChange}
                />
              </nav>
            </ScrollArea>
            <div className="border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="w-full text-center text-sm font-medium px-2 py-2 text-gray-500 hover:bg-gray-100"
                aria-label="Clear all filters"
              >
                Clear Filters
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex items-center gap-4 w-full md:w-auto md:justify-end md:text-right">
        <p className="text-gray-600 text-sm" role="status" aria-live="polite">
          Showing {count} of {totalCount} results
        </p>
      </div>
    </section>
  )
}

export default SearchWrapper