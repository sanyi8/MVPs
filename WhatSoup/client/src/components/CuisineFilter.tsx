
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Soup } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CuisineFilterProps {
  onFilterChange: (filters: string[]) => void;
}

export const CuisineFilter = ({ onFilterChange }: CuisineFilterProps) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  const soupOptions = [
    { id: "hearty", label: "Hearty", icon: "🍖" },
    { id: "eastern-european", label: "Eastern European", icon: "🥘" },
    { id: "vegetable", label: "Vegetable", icon: "🥕" },
    { id: "mediterranean", label: "Mediterranean", icon: "🫒" },
    { id: "asian", label: "Asian", icon: "🥢" },
    { id: "cream", label: "Cream", icon: "🥛" }
  ];

  const visibleOptions = showAll ? soupOptions : soupOptions.slice(0, 3);

  const handleFilterToggle = (filterId: string) => {
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter(f => f !== filterId)
      : [...selectedFilters, filterId];
    
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setSelectedFilters([]);
    onFilterChange([]);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Soup className="h-4 w-4 text-[#cd8444ff]" />
          <span className="text-sm font-medium text-[#788931ff]">Soup Type</span>
        </div>
        
        {selectedFilters.length > 0 && (
          <button 
            onClick={clearFilters}
            className="h-7 px-2 text-xs bg-[#F95432] text-white hover:bg-[#F95432]/90 border-none rounded-md"
          >
            Clear
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {visibleOptions.map((option) => (
          <Badge
            key={option.id}
            variant="outline"
            className={cn(
              "cursor-pointer text-sm px-3 py-1 border-[#cd8444ff]/30",
              selectedFilters.includes(option.id) 
                ? "bg-[#F95432]/10 border-[#F95432] text-[#F95432] font-medium" 
                : "text-[#cd8444ff] bg-[#F6D7AE]/50 hover:bg-[#F6D7AE]/80"
            )}
            onClick={() => handleFilterToggle(option.id)}
          >
            <span className="mr-1.5">{option.icon}</span>
            {option.label}
          </Badge>
        ))}
        
        {!showAll && soupOptions.length > 3 && (
          <button
            onClick={() => setShowAll(true)}
            className="text-sm text-[#F95432] hover:text-[#F95432]/80 font-medium"
          >
            + Show More
          </button>
        )}
      </div>
    </div>
  );
};
