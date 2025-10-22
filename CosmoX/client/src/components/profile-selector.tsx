import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { User, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { Profile } from "@shared/schema";

interface ProfileOption {
  name: string;
  birthDate: string;
  birthTime?: string;
}

interface ProfileSelectorProps {
  onProfileSelect: (profile: ProfileOption) => void;
  currentProfile?: string | null;
  asNameButtons?: boolean;
}

// Generate a random default profile
const generateRandomProfile = (): ProfileOption => {
  const randomYear = Math.floor(Math.random() * (2010 - 1970 + 1)) + 1970;
  const randomMonth = Math.floor(Math.random() * 12) + 1;
  const randomDay = Math.floor(Math.random() * 28) + 1;
  
  const birthDate = `${String(randomDay).padStart(2, '0')}/${String(randomMonth).padStart(2, '0')}/${randomYear}`;
  
  return {
    name: "Random",
    birthDate
  };
};

export function ProfileSelector({ onProfileSelect, currentProfile, asNameButtons }: ProfileSelectorProps) {
  const [savedProfiles, setSavedProfiles] = useState<ProfileOption[]>([]);
  const [defaultProfile] = useState<ProfileOption>(generateRandomProfile());

  useEffect(() => {
    // Load saved profiles from localStorage
    const loadSavedProfiles = () => {
      const saved = localStorage.getItem("savedProfiles");
      if (saved) {
        try {
          const profiles = JSON.parse(saved) as Profile[];
          const profileOptions = profiles
            .filter(p => p.name) // Filter out profiles without names
            .map(p => ({
              name: p.name!,
              birthDate: p.birthDate,
              birthTime: p.birthTime || undefined
            }));
          setSavedProfiles(profileOptions);
        } catch (error) {
          console.error("Error loading saved profiles:", error);
        }
      }
    };

    loadSavedProfiles();
    
    // Listen for storage changes and custom events
    const handleStorageChange = () => loadSavedProfiles();
    window.addEventListener('storage', handleStorageChange);
    
    // Add custom event listener for immediate updates
    const handleCustomUpdate = () => loadSavedProfiles();
    window.addEventListener('profilesUpdated', handleCustomUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profilesUpdated', handleCustomUpdate);
    };
  }, []);

  const allProfiles = savedProfiles.length > 0 ? savedProfiles : [defaultProfile];

  const currentIndex = allProfiles.findIndex(p => p.name === currentProfile);
  
  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % allProfiles.length;
    onProfileSelect(allProfiles[nextIndex]);
  };
  
  const goToPrevious = () => {
    const prevIndex = currentIndex === 0 ? allProfiles.length - 1 : currentIndex - 1;
    onProfileSelect(allProfiles[prevIndex]);
  };

  if (asNameButtons) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {allProfiles.map((profile) => (
          <Button
            key={profile.name}
            onClick={() => onProfileSelect(profile)}
            variant={currentProfile === profile.name ? "default" : "outline"}
            size="sm"
            className={`transition-all ${
              currentProfile === profile.name
                ? 'bg-purple-500 text-white hover:bg-purple-600'
                : 'bg-transparent border-purple-500/30 text-white hover:bg-purple-500/10'
            }`}
          >
            {profile.name}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {allProfiles.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPrevious}
            className="bg-transparent hover:bg-purple-500/10 text-white px-2"
            title="Previous profile"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-transparent border-purple-500/30 text-white hover:bg-purple-500/10 hover:text-white"
          >
            <User className="h-4 w-4 mr-2" />
            {currentProfile || "Select Profile"}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-slate-800 border-purple-500/30">
          {allProfiles.map((profile) => (
            <DropdownMenuItem
              key={profile.name}
              onClick={() => onProfileSelect(profile)}
              className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20 cursor-pointer"
            >
              <div className="flex flex-col">
                <span className="font-medium">{profile.name}</span>
                <span className="text-sm text-gray-400">{profile.birthDate}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {allProfiles.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={goToNext}
          className="bg-transparent hover:bg-purple-500/10 text-white px-2"
          title="Next profile"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}