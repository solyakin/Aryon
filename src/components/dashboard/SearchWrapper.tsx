import { Filter, Search } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox"
import { useRecommendationsContext } from "@/context/recommendations/recommendations-hooks";
import type { Dispatch, SetStateAction } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SelectedFilters } from "@/context/recommendations/types";
import { useQueryClient } from "@tanstack/react-query";

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

type FilterCategory = keyof typeof FILTER_CATEGORIES;

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
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-2 mt-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto">
        <div className="flex items-center gap-2 border border-gray-300 bg-white rounded-sm p-2 w-full sm:w-auto">
          <Search className="size-4 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search... "
            className="border-none outline-none focus:ring-0 bg-transparent w-full sm:w-[300px] text-gray-700"
          />
        </div>
        <Popover>
          <PopoverTrigger className="w-full sm:w-auto">
            <div className="border border-gray-300 p-2.5 rounded-sm flex items-center justify-center sm:justify-start gap-2 hover:bg-gray-200 transition-colors cursor-pointer w-full sm:w-auto">
              <Filter className="size-3 text-gray-600" />
              <span className="text-sm">Filter</span>
              {getSelectedFiltersCount(selectedFilters) > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                  {getSelectedFiltersCount(selectedFilters)}
                </span>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[calc(100vw-2rem)] sm:w-80 p-0">
            <div className="p-2 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Search className="size-4" />
                <input
                  type="text"
                  placeholder="Search filters..."
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  className="border-none outline-none text-sm focus:ring-0 bg-transparent w-full text-gray-700"
                />
              </div>
            </div>
            <ScrollArea className="h-[300px]">
                <div className="p-3">
                    <div className="flex items-center justify-between mb-1">
                        <p className="">Cloud Providers</p>
                        <p className="">{availableTags?.providers?.length}</p>
                    </div>
                    {
                        availableTags?.providers?.map((tag: string, index: number) => (
                            <div key={index} className="flex items-center justify-between py-1">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                    id={`provider-${index}`}
                                    checked={selectedFilters["providers"]?.includes(tag)}
                                    onCheckedChange={() => handleFilterChange("providers", tag)}
                                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                                    />
                                    <label htmlFor={`provider-${index}`} className="text-sm text-gray-700">
                                    {tag}
                                    </label>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="p-3">
                    <div className="flex items-center justify-between mb-1">
                        <p className="">Frameworks</p>
                        <p className="">{availableTags?.frameworks?.length}</p>
                    </div>
                    {
                        availableTags?.frameworks?.map((tag: string, index: number) => (
                            <div key={index} className="flex items-center justify-between py-1">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                    id={`framework-${index}`}
                                    checked={selectedFilters["frameworks"]?.includes(tag)}
                                    onCheckedChange={() => handleFilterChange("frameworks", tag)}
                                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                                    />
                                    <label htmlFor={`framework-${index}`} className="text-sm text-gray-700">
                                    {tag}
                                    </label>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="p-3">
                    <div className="flex items-center justify-between mb-1">
                        <p className="">Reasons</p>
                        <p className="">{availableTags?.reasons?.length}</p>
                    </div>
                    {
                        availableTags?.reasons?.map((tag: string, index: number) => (
                            <div key={index} className="flex items-center justify-between py-1">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                    id={`reason-${index}`}
                                    checked={selectedFilters["reasons"]?.includes(tag)}
                                    onCheckedChange={() => handleFilterChange("reasons", tag)}
                                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                                    />
                                    <label htmlFor={`reason-${index}`} className="text-sm text-gray-700">
                                    {tag}
                                    </label>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="p-3">
                    <div className="flex items-center justify-between mb-1">
                        <p className="">Classes</p>
                        <p className="">{availableTags?.classes?.length}</p>
                    </div>
                    {
                        availableTags?.classes?.map((tag: string, index: number) => (
                            <div key={index} className="flex items-center justify-between py-1">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                    id={`class-${index}`}
                                    checked={selectedFilters["classes"]?.includes(tag)}
                                    onCheckedChange={() => handleFilterChange("classes", tag)}
                                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                                    />
                                    <label htmlFor={`class-${index}`} className="text-sm text-gray-700">
                                    {tag}
                                    </label>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </ScrollArea>
            <div className="border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="w-full text-center text-sm font-medium px-2 py-2 text-gray-500 hover:bg-gray-100"
              >
                Clear Filters
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex items-center gap-4 w-full md:w-auto md:justify-end md:text-right">
        <p className="text-gray-600 text-sm">
          Showing {count} of {totalCount} results
        </p>
      </div>
    </div>
  )
}

export default SearchWrapper