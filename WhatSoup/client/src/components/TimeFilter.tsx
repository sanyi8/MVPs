
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface TimeFilterProps {
  onFilterChange: (filters: string[]) => void;
}

export const TimeFilter = ({ onFilterChange }: TimeFilterProps) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  
  const timeFilters = [
    { label: "<30m", value: "quick" },
    { label: "<45m", value: "medium" },
    { label: "1hr", value: "long" },
    { label: "1hr+", value: "extended" }
  ];

  const toggleFilter = (filter: string) => {
    const newFilters = selectedFilters.includes(filter)
      ? selectedFilters.filter(f => f !== filter)
      : [...selectedFilters, filter];
    
    setSelectedFilters(newFilters);
  };

  useEffect(() => {
    onFilterChange(selectedFilters);
  }, [selectedFilters, onFilterChange]);

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#cd8444ff]" />
          <span className="text-sm font-medium text-[#788931ff]">Cooking Time</span>
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
      
      <div className="flex flex-wrap gap-2">
        {timeFilters.map((filter) => (
          <Badge
            key={filter.value}
            variant="outline"
            className={cn(
              "cursor-pointer text-sm px-3 py-1 border-[#cd8444ff]/30",
              selectedFilters.includes(filter.value) 
                ? "bg-[#F95432]/10 border-[#F95432] text-[#F95432] font-medium" 
                : "text-[#cd8444ff] bg-[#F6D7AE]/50 hover:bg-[#F6D7AE]/80"
            )}
            onClick={() => toggleFilter(filter.value)}
          >
            {filter.label}
          </Badge>
        ))}
      </div>
    </div>
  );
};
