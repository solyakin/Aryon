import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import React, { useState } from "react"
import { Filter, Search } from "lucide-react"
import { ScrollArea } from "../ui/scroll-area"
import type { FilterCategory } from "./SearchWrapper"
import { useQueryClient } from "@tanstack/react-query"
import type { SelectedFilters } from "@/context/recommendations/types"
import { useRecommendationsContext } from "@/context/recommendations/recommendations-hooks"

const FilterItem = React.lazy(() => import("./FilterItem"));

interface FilterMenuListProps {
    selectedTags: string[];
    setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const FilterMenuList = ({ selectedTags, setSelectedTags }: FilterMenuListProps) => {

    const queryClient = useQueryClient();
    const [filterSearch, setFilterSearch] = useState<string>("");
    const { availableTags, selectedFilters, dispatch } = useRecommendationsContext();

    const handleFilterChange = (category: FilterCategory, value: string) => {
        if (selectedTags.includes(value)) {
            setSelectedTags(selectedTags.filter(tag => tag !== value));
            } else {
            setSelectedTags([...selectedTags, value]);
        }
        // Update the selected filters in the context
        dispatch({
        type: "UPDATE_SELECTED_FILTERS",
        payload: { [category]: selectedTags.includes(value) ? selectedTags.filter(tag => tag !== value) : [...selectedTags, value] }
        });
    };
    // Function to count the number of selected filters
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
                {getSelectedFiltersCount(selectedFilters)}
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
            {Object.entries({
                providers: "Cloud Providers",
                frameworks: "Frameworks",
                reasons: "Reasons",
                classes: "Classes"
            }).map(([category, title]) => {
                const tags = availableTags?.[category as keyof typeof availableTags] || [];
                const filteredTags = filterSearch
                    ? tags.filter(tag => 
                        tag.toLowerCase().includes(filterSearch.toLowerCase())
                      )
                    : tags;

                // Only render if there are matching tags or no search term
                if (filteredTags.length > 0 || !filterSearch) {
                    return (
                        <FilterItem 
                            key={category}
                            title={title}
                            category={category as FilterCategory}
                            availableTags={filteredTags}
                            selectedFilters={selectedFilters}
                            handleFilterChange={handleFilterChange}
                        />
                    );
                }
                return null;
            })}
            </nav>
        </ScrollArea>
        <div className="border-t border-gray-200">
            <button
            onClick={clearFilters}
            className="w-full text-center text-sm font-medium px-2 py-2 text-gray-500 hover:bg-gray-100 cursor-pointer transition-colors"
            aria-label="Clear all filters"
            >
            Clear Filters
            </button>
        </div>
        </PopoverContent>
    </Popover>
  )
}

export default FilterMenuList