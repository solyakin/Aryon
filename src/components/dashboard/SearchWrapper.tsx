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
  const { availableTags, selectedFilters, dispatch } = useRecommendationsContext();
  const [filterSearch, setFilterSearch] = useState("");

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

  const clearFilters = () => {
    dispatch({ type: "CLEAR_FILTERS", payload: null });
  };

  return (
    <div className="flex justify-between items-center mt-8">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 border border-gray-300 bg-white rounded-sm p-2">
          <Search className="size-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search... "
            className="border-none outline-none focus:ring-0 bg-transparent w-[300px] text-gray-700"
          />
        </div>
        <Popover>
          <PopoverTrigger className="ml-2">
            <div className="border border-gray-300 p-2.5 rounded-sm flex items-center gap-2 hover:bg-gray-200 transition-colors cursor-pointer">
              <Filter className="size-3 text-gray-600" />
              <span className="text-sm">Filter</span>
              {getSelectedFiltersCount(selectedFilters) > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                  {getSelectedFiltersCount(selectedFilters)}
                </span>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
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
      <div className="flex items-center gap-4">
        <p className="text-gray-600 text-sm">
          Showing {count} of {totalCount} results
        </p>
        {/* {(Object.entries(selectedFilters) as [FilterCategory, string[]][]).map(([category, values]) => 
          values.map((value: string, index: number) => (
            <span
              key={`${category}-${index}`}
              className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full flex items-center gap-1"
            >
              {value}
              <button
                onClick={() => handleFilterChange(category, value)}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                ×
              </button>
            </span>
          ))
        )} */}
      </div>
    </div>
  )
}

export default SearchWrapper