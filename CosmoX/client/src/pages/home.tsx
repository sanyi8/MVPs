import { useState, useEffect } from "react";
import { Star, User, Plus } from "lucide-react";
import { ProfileModal } from "@/components/profile-modal";
import { ProfileSelector } from "@/components/profile-selector";
import { ZodiacCarousel } from "@/components/zodiac-carousel";
import { ZodiacMetrics } from "@/components/zodiac-metrics";
import { SocialShare } from "@/components/social-share";
import { BottomNavigation } from "@/components/bottom-navigation";
import { CosmoxLogo } from "@/components/cosmox-logo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Profile, ZodiacProfile } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [zodiacProfile, setZodiacProfile] = useState<ZodiacProfile | null>(null);
  const [selectedSystems, setSelectedSystems] = useState<Set<string>>(
    new Set(['western', 'chinese', 'vedic', 'mayan', 'celtic', 'arabic'])
  );
  const [crossSystemInsights, setCrossSystemInsights] = useState({
    unifiedThemes: zodiacProfile?.unifiedThemes || [],
    integrationOpportunities: zodiacProfile?.integrationOpportunities || []
  });
  const [isRefreshingInsights, setIsRefreshingInsights] = useState(false);
  const { toast } = useToast();

  const toggleSystem = (system: string) => {
    const newSystems = new Set(selectedSystems);
    if (newSystems.has(system)) {
      newSystems.delete(system);
    } else {
      newSystems.add(system);
    }
    setSelectedSystems(newSystems);
  };

  const refreshCrossSystemInsights = async () => {
    if (!zodiacProfile) return;

    setIsRefreshingInsights(true);
    try {
      const response = await fetch('/api/cross-system-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zodiacProfile,
          selectedSystems: Array.from(selectedSystems)
        })
      });

      if (response.ok) {
        const insights = await response.json();
        setCrossSystemInsights(insights);
      }
    } catch (error) {
      console.error('Error refreshing insights:', error);
    } finally {
      setIsRefreshingInsights(false);
    }
  };

  // Debug logging
  useEffect(() => {
    console.log("Home page component mounted and rendering");
    // console.log("Current route:", location); // Assuming 'location' is available in this scope
  }, []);

  useEffect(() => {
    if (zodiacProfile) {
      setCrossSystemInsights({
        unifiedThemes: zodiacProfile.unifiedThemes,
        integrationOpportunities: zodiacProfile.integrationOpportunities
      });
    }
  }, [zodiacProfile]);

  // Check if user has a profile
  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (!savedProfile) {
      // Auto-load Sac's profile as default
      const defaultProfile: Profile = {
        id: 0,
        name: "Sac",
        birthDate: "31/03/1981",
        birthTime: null,
        createdAt: new Date(),
      };
      setCurrentProfile(defaultProfile);
      localStorage.setItem("userProfile", JSON.stringify(defaultProfile));
      generateZodiacProfile(defaultProfile.birthDate, defaultProfile.birthTime || undefined);
    } else {
      const profile = JSON.parse(savedProfile);
      setCurrentProfile(profile);
      generateZodiacProfile(profile.birthDate, profile.birthTime);
    }
  }, []);

  const generateZodiacMutation = useMutation({
    mutationFn: async (data: { birthDate: string; birthTime?: string }) => {
      const response = await apiRequest("POST", "/api/zodiac-profile", data);
      return response.json();
    },
    onSuccess: (data: ZodiacProfile) => {
      setZodiacProfile(data);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to generate zodiac profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const generateZodiacProfile = (birthDate: string, birthTime?: string) => {
    generateZodiacMutation.mutate({ birthDate, birthTime });
  };

  const handleProfileCreated = (profile: Profile) => {
    // Save the new profile to the saved profiles list
    const existingSavedProfiles = localStorage.getItem("savedProfiles");
    let savedProfiles: Profile[] = [];

    if (existingSavedProfiles) {
      try {
        savedProfiles = JSON.parse(existingSavedProfiles);
      } catch (error) {
        console.error("Error parsing saved profiles:", error);
      }
    }

    // Add the new profile if it doesn't already exist
    const existingProfile = savedProfiles.find(p => p.name === profile.name);
    if (!existingProfile) {
      savedProfiles.push(profile);
      localStorage.setItem("savedProfiles", JSON.stringify(savedProfiles));
    }

    // Set as current profile
    setCurrentProfile(profile);
    setShowProfileModal(false);
    localStorage.setItem("userProfile", JSON.stringify(profile));
    generateZodiacProfile(profile.birthDate, profile.birthTime || undefined);

    // Trigger a storage event to update profile selector
    window.dispatchEvent(new Event('storage'));
  };

  const handleProfileSelect = (profileData: { name: string; birthDate: string; birthTime?: string }) => {
    // Create a mock profile object for the zodiac calculation
    const profile: Profile = {
      id: 0, // Temporary ID for predefined profiles
      name: profileData.name,
      birthDate: profileData.birthDate,
      birthTime: profileData.birthTime || null,
      createdAt: new Date(),
    };

    setCurrentProfile(profile);
    localStorage.setItem("userProfile", JSON.stringify(profile));
    generateZodiacProfile(profile.birthDate, profile.birthTime || undefined);
  };

  const handleShareProfile = () => {
    if (navigator.share && currentProfile) {
      navigator.share({
        title: "My Cosmic Profile",
        text: `Check out my multi-zodiac astrology profile! I'm a ${zodiacProfile?.western.sign} in Western astrology.`,
        url: window.location.href,
      });
    } else {
      // Fallback to clipboard
      const shareText = `Check out my cosmic profile! I'm a ${zodiacProfile?.western.sign} in Western astrology.`;
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to clipboard",
        description: "Share text has been copied to your clipboard.",
      });
    }
  };

  const handleSaveProfile = () => {
    const profileData = {
      profile: currentProfile,
      zodiac: zodiacProfile,
    };
    const dataStr = JSON.stringify(profileData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cosmic-profile-${currentProfile?.name || 'user'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Profile saved",
      description: "Your cosmic profile has been downloaded.",
    });
  };

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CosmoxLogo size={32} />
              <h1 className="text-xl font-bold text-white">
                CosmoX
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <ProfileSelector
                onProfileSelect={handleProfileSelect}
                currentProfile={currentProfile?.name}
              />
              <Button
                variant="ghost"
                size="sm"
                className="bg-transparent hover:bg-purple-500/10 text-white"
                onClick={() => setShowProfileModal(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                New
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-24">
        {/* Profile Overview */}
        {currentProfile && (
          <section className="mb-8">
            <Card className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cosmic-purple to-cosmic-gold flex items-center justify-center text-2xl">
                    ✨
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{currentProfile.name || "Your Profile"}</h2>
                    <p className="text-gray-300 text-sm">{currentProfile.birthDate}</p>
                    {zodiacProfile && (
                      <div className="flex items-center gap-2 flex-wrap mt-2">
                        <Badge variant="secondary" className="bg-white/10 text-white text-xs">
                          {zodiacProfile.western.sign}
                        </Badge>
                        <Badge variant="secondary" className="bg-red-500/20 text-red-300 text-xs">
                          {zodiacProfile.chinese.animal}
                        </Badge>
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 text-xs">
                          {zodiacProfile.vedic.nakshatra}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end mb-4">
                  <SocialShare
                    text={`Check out my cosmic profile! I'm a ${zodiacProfile?.western.sign} ☉, ${zodiacProfile?.chinese.animal} 🐉, and ${zodiacProfile?.arabic.mansion} ☪ in Medieval Arabic Astrology!`}
                  />
                </div>

                {zodiacProfile && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-300">Your Zodiac Systems (tap to toggle)</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => toggleSystem('western')}
                        className={`flex items-center p-3 rounded-lg transition-all ${
                          selectedSystems.has('western')
                            ? 'bg-slate-800/50 border-l-4 border-[#00f0ff]'
                            : 'bg-slate-800/30 border-l-4 border-transparent opacity-50'
                        }`}
                      >
                        <div className="text-[#00f0ff] text-2xl mr-3">☉</div>
                        <div className="text-left">
                          <p className="text-base font-semibold text-white">{zodiacProfile.western.sign}</p>
                          <p className="text-sm text-gray-400">Western</p>
                        </div>
                      </button>

                      <button
                        onClick={() => toggleSystem('chinese')}
                        className={`flex items-center p-3 rounded-lg transition-all ${
                          selectedSystems.has('chinese')
                            ? 'bg-slate-800/50 border-l-4 border-[#ff0032]'
                            : 'bg-slate-800/30 border-l-4 border-transparent opacity-50'
                        }`}
                      >
                        <div className="text-[#ff0032] text-2xl mr-3">🐉</div>
                        <div className="text-left">
                          <p className="text-base font-semibold text-white">{zodiacProfile.chinese.animal}</p>
                          <p className="text-sm text-gray-400">Chinese</p>
                        </div>
                      </button>

                      <button
                        onClick={() => toggleSystem('vedic')}
                        className={`flex items-center p-3 rounded-lg transition-all ${
                          selectedSystems.has('vedic')
                            ? 'bg-slate-800/50 border-l-4 border-[#8f00ff]'
                            : 'bg-slate-800/30 border-l-4 border-transparent opacity-50'
                        }`}
                      >
                        <div className="text-[#8f00ff] text-2xl mr-3">☽</div>
                        <div className="text-left">
                          <p className="text-base font-semibold text-white">{zodiacProfile.vedic.nakshatra}</p>
                          <p className="text-sm text-gray-400">Vedic</p>
                        </div>
                      </button>

                      <button
                        onClick={() => toggleSystem('arabic')}
                        className={`flex items-center p-3 rounded-lg transition-all ${
                          selectedSystems.has('arabic')
                            ? 'bg-slate-800/50 border-l-4 border-[#ffa700]'
                            : 'bg-slate-800/30 border-l-4 border-transparent opacity-50'
                        }`}
                      >
                        <div className="text-[#ffa700] text-2xl mr-3">☪</div>
                        <div className="text-left">
                          <p className="text-base font-semibold text-white">{zodiacProfile.arabic.mansion}</p>
                          <p className="text-sm text-gray-400">Medieval Arabic</p>
                        </div>
                      </button>

                      <button
                        onClick={() => toggleSystem('mayan')}
                        className={`flex items-center p-3 rounded-lg transition-all ${
                          selectedSystems.has('mayan')
                            ? 'bg-slate-800/50 border-l-4 border-[#c6866d]'
                            : 'bg-slate-800/30 border-l-4 border-transparent opacity-50'
                        }`}
                      >
                        <div className="text-[#c6866d] text-2xl mr-3">🌱</div>
                        <div className="text-left">
                          <p className="text-base font-semibold text-white">{zodiacProfile.mayan.daySign}</p>
                          <p className="text-sm text-gray-400">Mayan</p>
                        </div>
                      </button>

                      <button
                        onClick={() => toggleSystem('celtic')}
                        className={`flex items-center p-3 rounded-lg transition-all ${
                          selectedSystems.has('celtic')
                            ? 'bg-slate-800/50 border-l-4 border-[#00ff59]'
                            : 'bg-slate-800/30 border-l-4 border-transparent opacity-50'
                        }`}
                      >
                        <div className="text-[#00ff59] text-2xl mr-3">🌳</div>
                        <div className="text-left">
                          <p className="text-base font-semibold text-white">{zodiacProfile.celtic.tree}</p>
                          <p className="text-sm text-gray-400">Celtic</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {/* Zodiac Systems Carousel */}
        {zodiacProfile && (
          <ZodiacCarousel zodiacProfile={zodiacProfile} selectedSystems={selectedSystems} />
        )}

        {/* Zodiac Metrics Visualization */}
        {zodiacProfile && (
          <ZodiacMetrics zodiacProfile={zodiacProfile} selectedSystems={selectedSystems} />
        )}

        {/* Cross-System Insights */}
        {zodiacProfile && (
          <section className="mb-8">
            <Card className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 border border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Cross-System Insights</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={refreshCrossSystemInsights}
                    disabled={isRefreshingInsights}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    <svg
                      className={`w-4 h-4 ${isRefreshingInsights ? 'animate-spin' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-800/30 rounded-xl p-4">
                    <h4 className="font-medium text-yellow-300 mb-2">Unified Themes</h4>
                    <ul className="space-y-2 text-sm text-gray-200">
                      {crossSystemInsights.unifiedThemes.map((theme, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-pink-400 mt-1">•</span>
                          <span>{theme}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-800/30 rounded-xl p-4">
                    <h4 className="font-medium text-purple-300 mb-2">Integration Opportunities</h4>
                    <ul className="space-y-2 text-sm text-gray-200">
                      {crossSystemInsights.integrationOpportunities.map((opportunity, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-purple-400 mt-1">•</span>
                          <span>{opportunity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Action Buttons */}
        {currentProfile && zodiacProfile && (
          <section className="mb-8">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 h-auto p-4 flex flex-col items-center space-y-2"
                onClick={handleShareProfile}
              >
                <div className="text-cosmic-purple text-xl">📤</div>
                <span className="font-medium">Share Profile</span>
                <span className="text-xs text-cosmic-gray">Send to friends</span>
              </Button>
              <Button
                variant="outline"
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 h-auto p-4 flex flex-col items-center space-y-2"
                onClick={handleSaveProfile}
              >
                <div className="text-cosmic-gold text-xl">💾</div>
                <span className="font-medium">Save Report</span>
                <span className="text-xs text-cosmic-gray">Export as JSON</span>
              </Button>
            </div>
          </section>
        )}
      </main>

      {/* Profile Creation Modal */}
      <ProfileModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onProfileCreated={handleProfileCreated}
      />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </>
  );
}