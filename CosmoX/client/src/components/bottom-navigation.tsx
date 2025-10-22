import { Home, Users, Calendar, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export function BottomNavigation() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { icon: Home, label: "Profile", path: "/" },
    { icon: Users, label: "Match", path: "/match" },
    { icon: Calendar, label: "Daily", path: "/daily" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-around py-3">
          {navItems.map(({ icon: Icon, label, path }) => {
            const isActive = location === path;
            return (
              <Button
                key={path}
                variant="ghost"
                onClick={() => setLocation(path)}
                className={`flex flex-col items-center space-y-1 transition-colors ${
                  isActive 
                    ? "text-purple-400" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
