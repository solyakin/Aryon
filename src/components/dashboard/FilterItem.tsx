import type { SelectedFilters } from "@/context/recommendations/types";
import { Checkbox } from "../ui/checkbox";
import type { FilterCategory } from "./SearchWrapper";

export interface FilterItemProps {
    title: string;
    category: FilterCategory;
    availableTags: string[];
    selectedFilters: SelectedFilters;
    handleFilterChange: (filterType: FilterCategory, tag: string) => void;
}
const FilterItem = ({ title, category, availableTags, selectedFilters, handleFilterChange }: FilterItemProps) => {
  return (
    <fieldset className="p-3" role="group" aria-labelledby={`filter-${category}-title`}>
      <div className="flex items-center justify-between mb-1">
        <legend id={`filter-${category}-title`} className="text-sm font-medium">
          {title}
          <span className="sr-only">{availableTags?.length} options available</span>
        </legend>
        <p className="text-xs text-gray-600 font-semibold py-1 px-2 bg-gray-100 rounded-full" aria-label={`${availableTags?.length} options`}>
          {availableTags?.length}
        </p>
      </div>
      <div role="list" className="space-y-2">
        {availableTags?.map((tag: string, index: number) => (
          <div 
            key={index} 
            role="listitem" 
            className="flex items-center justify-between py-1"
          >
            <div className="flex items-center gap-2">
              <Checkbox
                id={`${category}-${index}`}
                checked={selectedFilters[category]?.includes(tag)}
                onCheckedChange={() => handleFilterChange(category, tag)}
                aria-label={`Filter by ${tag}`}
                className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
              />
              <label 
                htmlFor={`${category}-${index}`} 
                className="text-sm text-gray-700 cursor-pointer"
              >
                {tag}
              </label>
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  );
}

export default FilterItem