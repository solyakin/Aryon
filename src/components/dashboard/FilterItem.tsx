import type { SelectedFilters } from "@/context/recommendations/types";
import { Checkbox } from "../ui/checkbox";
import type { FilterCategory } from "./SearchWrapper";

interface FilterItemProps {
    title: string;
    category: FilterCategory;
    availableTags: string[];
    selectedFilters: SelectedFilters;
    handleFilterChange: (filterType: FilterCategory, tag: string) => void;
}
const FilterItem = ({ title, category, availableTags, selectedFilters, handleFilterChange }: FilterItemProps) => {
  return (
    <div className="p-3">
        <div className="flex items-center justify-between mb-1">
            <p className="">{title}</p>
            <p className="">{availableTags?.length}</p>
        </div>
        {
            availableTags?.map((tag: string, index: number) => (
                <div key={index} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                        <Checkbox
                        id={`provider-${index}`}
                        checked={selectedFilters[category]?.includes(tag)}
                        onCheckedChange={() => handleFilterChange(category, tag)}
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
  )
}

export default FilterItem