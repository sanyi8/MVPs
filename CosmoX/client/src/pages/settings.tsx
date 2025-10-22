import { useState, useEffect } from "react";
import { Settings as SettingsIcon, ArrowLeft, User, Trash2, Download, Moon, Sun, Key, Save, Edit2 } from "lucide-react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Profile } from "@shared/schema";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [apiKeys, setApiKeys] = useState({
    gemini: localStorage.getItem('gemini-api-key') || '',
    claude: localStorage.getItem('claude-api-key') || '',
    openai: localStorage.getItem('openai-api-key') || ''
  });
  const [savedProfiles, setSavedProfiles] = useState<Profile[]>([]);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setCurrentProfile(profile);
      } catch (error) {
        console.error("Error parsing profile:", error);
      }
    }

    // Load API keys from localStorage
    const savedKeys = localStorage.getItem("apiKeys");
    if (savedKeys) {
      try {
        setApiKeys(JSON.parse(savedKeys));
      } catch (error) {
        console.error("Error parsing API keys:", error);
      }
    }

    loadProfiles();
  }, []);

  const loadProfiles = () => {
    const saved = localStorage.getItem("savedProfiles");
    if (saved) {
      try {
        setSavedProfiles(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading profiles:", error);
      }
    }
  };

  const handleEditProfile = (profile: Profile) => {
    setEditingProfile({ ...profile });
  };

  const handleSaveProfile = () => {
    if (!editingProfile) return;

    // Generate a new ID if it's a new profile being added (though this UI is for editing existing)
    const profileToSave = { ...editingProfile, id: editingProfile.id || Date.now() };

    let updatedProfiles;
    if (editingProfile.id && savedProfiles.some(p => p.id === editingProfile.id)) {
      // Update existing profile
      updatedProfiles = savedProfiles.map(p => 
        p.id === profileToSave.id ? profileToSave : p
      );
    } else {
      // Add new profile
      updatedProfiles = [...savedProfiles, profileToSave];
    }
    
    localStorage.setItem("savedProfiles", JSON.stringify(updatedProfiles));
    setSavedProfiles(updatedProfiles);
    setEditingProfile(null);

    // Update current profile if editing it
    const current = localStorage.getItem("userProfile");
    if (current) {
      const currentProfile = JSON.parse(current);
      if (currentProfile.id === profileToSave.id) {
        localStorage.setItem("userProfile", JSON.stringify(profileToSave));
        setCurrentProfile(profileToSave); // Update state as well
      }
    }

    window.dispatchEvent(new Event('storage'));
    toast({
      title: "Profile updated",
      description: "Profile changes have been saved.",
    });
  };

  const handleDeleteProfile = (profileId: number) => {
    const updated = savedProfiles.filter(p => p.id !== profileId);
    localStorage.setItem("savedProfiles", JSON.stringify(updated));
    setSavedProfiles(updated);

    // If the deleted profile was the current one, clear current profile
    const current = localStorage.getItem("userProfile");
    if (current) {
      const currentProfile = JSON.parse(current);
      if (currentProfile.id === profileId) {
        localStorage.removeItem("userProfile");
        setCurrentProfile(null);
      }
    }

    window.dispatchEvent(new Event('storage'));
    toast({
      title: "Profile deleted",
      description: "Profile has been removed.",
    });
  };

  const handleSaveApiKey = (provider: string, key: string) => {
    setApiKeys({ ...apiKeys, [provider]: key });
    localStorage.setItem(`${provider}-api-key`, key);
    toast({
      title: "API Key Saved",
      description: `${provider.charAt(0).toUpperCase() + provider.slice(1)} API key has been saved.`,
    });
  };

  const handleClearData = () => {
    localStorage.removeItem("userProfile");
    localStorage.removeItem("zodiacProfile");
    localStorage.removeItem("savedProfiles"); // Clear saved profiles as well
    setCurrentProfile(null);
    setSavedProfiles([]); // Reset state
    setEditingProfile(null); // Reset editing state
    toast({
      title: "Data cleared",
      description: "All profile and settings data has been removed from this device.",
    });
    setLocation("/");
  };

  const handleExportData = () => {
    const userData = {
      profile: currentProfile,
      zodiac: localStorage.getItem("zodiacProfile") ? JSON.parse(localStorage.getItem("zodiacProfile")!) : null,
      savedProfiles: savedProfiles, // Include saved profiles in export
      apiKeys: apiKeys, // Include API keys in export
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cosme-data-${currentProfile?.name?.toLowerCase() || 'user'}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Data exported",
      description: "Your Cosme data has been downloaded.",
    });
  };

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="text-white hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-slate-600 rounded-full flex items-center justify-center">
                <SettingsIcon className="text-white w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold text-white">
                Settings
              </h1>
            </div>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-24">
        {/* Profile Section */}
        {currentProfile && (
          <Card className="bg-slate-800/60 border-slate-700/50 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{currentProfile.name}</h3>
                  <p className="text-gray-400">{currentProfile.birthDate}</p>
                  <Badge className="bg-green-500/20 text-green-300 mt-1">
                    Active Profile
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Management */}
        <Card className="bg-slate-900/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Manage Profiles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {savedProfiles.map((profile) => (
              <div key={profile.id} className="bg-slate-800/50 rounded-lg p-4">
                {editingProfile?.id === profile.id ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="edit-name" className="text-gray-300">Name</Label>
                      <Input
                        id="edit-name"
                        value={editingProfile.name || ''}
                        onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-date" className="text-gray-300">Birth Date (DD/MM/YYYY)</Label>
                      <Input
                        id="edit-date"
                        value={editingProfile.birthDate}
                        onChange={(e) => setEditingProfile({ ...editingProfile, birthDate: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="31/03/1981"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-time" className="text-gray-300">Birth Time (optional)</Label>
                      <Input
                        id="edit-time"
                        value={editingProfile.birthTime || ''}
                        onChange={(e) => setEditingProfile({ ...editingProfile, birthTime: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="14:30"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile} className="bg-purple-500 hover:bg-purple-600">
                        Save Changes
                      </Button>
                      <Button onClick={() => setEditingProfile(null)} variant="outline" className="border-slate-600">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{profile.name}</p>
                      <p className="text-gray-400 text-sm">{profile.birthDate}</p>
                      {profile.birthTime && <p className="text-gray-500 text-xs">{profile.birthTime}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditProfile(profile)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteProfile(profile.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {savedProfiles.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-4">No saved profiles yet</p>
            )}
          </CardContent>
        </Card>

        {/* Data Management */}
        <div className="space-y-4">
          <h4 className="font-medium text-white mb-3">Data Management</h4>

          <Card className="bg-slate-800/40 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Download className="w-5 h-5 text-blue-400" />
                  <div>
                    <h5 className="font-medium text-white">Export Data</h5>
                    <p className="text-sm text-gray-400">Download your profile and zodiac data</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportData}
                  className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                >
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Trash2 className="w-5 h-5 text-red-400" />
                  <div>
                    <h5 className="font-medium text-white">Clear All Data</h5>
                    <p className="text-sm text-gray-400">Remove all stored profile information</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearData}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI API Keys */}
        <div className="space-y-4 mt-8">
          <h4 className="font-medium text-white mb-3">AI Provider API Keys</h4>
          <p className="text-sm text-gray-400 mb-4">
            Configure your AI provider API keys to enable enhanced cosmic insights and daily horoscopes.
          </p>

          <Card className="bg-slate-800/40 border-slate-700/50">
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-white block mb-2">
                  <Key className="w-4 h-4 inline mr-2" />
                  Gemini AI (Flash 2.5)
                </label>
                <Input
                  type="password"
                  value={apiKeys.gemini}
                  onChange={(e) => setApiKeys({ ...apiKeys, gemini: e.target.value })}
                  onBlur={() => handleSaveApiKey("gemini", apiKeys.gemini)}
                  placeholder="Enter your Gemini API key"
                  className="bg-slate-900/50 border-slate-600 text-white"
                />
                <p className="text-xs text-gray-500 mt-1">Get your API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google AI Studio</a></p>
              </div>

              <div>
                <label className="text-sm font-medium text-white block mb-2">
                  <Key className="w-4 h-4 inline mr-2" />
                  Claude AI (Anthropic)
                </label>
                <Input
                  type="password"
                  value={apiKeys.claude}
                  onChange={(e) => setApiKeys({ ...apiKeys, claude: e.target.value })}
                  onBlur={() => handleSaveApiKey("claude", apiKeys.claude)}
                  placeholder="Enter your Claude API key"
                  className="bg-slate-900/50 border-slate-600 text-white"
                />
                <p className="text-xs text-gray-500 mt-1">Get your API key from <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Anthropic Console</a></p>
              </div>

              <div>
                <label className="text-sm font-medium text-white block mb-2">
                  <Key className="w-4 h-4 inline mr-2" />
                  ChatGPT (GPT-5 Nano)
                </label>
                <Input
                  type="password"
                  value={apiKeys.openai}
                  onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value })}
                  onBlur={() => handleSaveApiKey("openai", apiKeys.openai)}
                  placeholder="Enter your OpenAI API key"
                  className="bg-slate-900/50 border-slate-600 text-white"
                />
                <p className="text-xs text-gray-500 mt-1">Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">OpenAI Platform</a></p>
              </div>

              <Button
                onClick={() => {
                  handleSaveApiKey("gemini", apiKeys.gemini);
                  handleSaveApiKey("claude", apiKeys.claude);
                  handleSaveApiKey("openai", apiKeys.openai);
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save All API Keys
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* App Info */}
        <Card className="bg-slate-800/40 border-slate-700/50 mt-8">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl">✨</span>
            </div>
            <h3 className="font-semibold text-white mb-2">CosmoX</h3>
            <p className="text-sm text-gray-400 mb-3">
              Discover your strengths through multi-zodiac analysis - comparing Western, Vedic, Chinese, Arabic, Mayan & Celtic astrology in one app
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Developed by <a href="https://sandorkardos.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">sandorkardos.com</a>
            </p>
            <Badge className="bg-purple-500/20 text-purple-300">
              Version 1.0.0
            </Badge>
          </CardContent>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </>
  );
}