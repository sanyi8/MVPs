import { useState, useEffect } from "react";
import { Calendar, ArrowLeft, Sun, Moon, Star, TrendingUp, Activity, BarChart3, Sparkles } from "lucide-react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, PieChart, Pie, Cell } from 'recharts';
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Profile, ZodiacProfile } from "@shared/schema";
import { useLocation } from "wouter";

interface DailyInsight {
  morningFocus: string;
  afternoonEnergy: string;
  eveningReflection: string;
  luckyColor: string;
  cosmicAdvice: string;
  energyLevel: number;
}

export default function Daily() {
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [zodiacProfile, setZodiacProfile] = useState<ZodiacProfile | null>(null);
  const [dailyInsights, setDailyInsights] = useState<DailyInsight | null>(null);
  const [, setLocation] = useLocation();

  // Debug logging
  useEffect(() => {
    console.log("Daily page component mounted and rendering");
  }, []);

  const generateInsightsMutation = useMutation({
    mutationFn: async (zodiacData: ZodiacProfile) => {
      const response = await apiRequest("POST", "/api/daily-insights", { zodiacProfile: zodiacData });
      return response.json();
    },
    onSuccess: (insights: DailyInsight) => {
      setDailyInsights(insights);
    },
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    const savedZodiac = localStorage.getItem("zodiacProfile");

    if (!savedProfile || !savedZodiac) {
      setLocation("/");
      return;
    }

    try {
      const profile = JSON.parse(savedProfile);
      const zodiac = JSON.parse(savedZodiac);
      setCurrentProfile(profile);
      setZodiacProfile(zodiac);

      // Generate daily insights using Gemini
      generateInsightsMutation.mutate(zodiac);
    } catch (error) {
      console.error("Error parsing profile data:", error);
      setLocation("/");
    }
  }, [setLocation]);

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Generate sample cosmic energy data for the current week
  const weeklyEnergyData = [
    { day: 'Mon', energy: 75, love: 60, career: 80, health: 70, creativity: 85 },
    { day: 'Tue', energy: 82, love: 75, career: 85, health: 78, creativity: 78 },
    { day: 'Wed', energy: 78, love: 70, career: 75, health: 82, creativity: 90 },
    { day: 'Thu', energy: 85, love: 80, career: 90, health: 85, creativity: 75 },
    { day: 'Fri', energy: 90, love: 85, career: 88, health: 80, creativity: 95 },
    { day: 'Sat', energy: 88, love: 90, career: 70, health: 85, creativity: 88 },
    { day: 'Sun', energy: 80, love: 85, career: 65, health: 90, creativity: 82 },
  ];

  // Today's cosmic alignment (sample data based on current profile)
  const todaysAlignment = [
    { name: 'Love', value: 78, color: '#ef4444' },
    { name: 'Career', value: 85, color: '#3b82f6' },
    { name: 'Health', value: 72, color: '#10b981' },
    { name: 'Creativity', value: 90, color: '#f59e0b' },
  ];

  // Moon phase data
  const moonPhases = [
    { phase: 'New Moon', intensity: 20, date: 'Dec 1' },
    { phase: 'Waxing Crescent', intensity: 35, date: 'Dec 8' },
    { phase: 'First Quarter', intensity: 50, date: 'Dec 15' },
    { phase: 'Waxing Gibbous', intensity: 75, date: 'Dec 22' },
    { phase: 'Full Moon', intensity: 100, date: 'Dec 29' },
  ];

  // Get today's primary energy based on profile
  const getTodaysEnergy = () => {
    const today = new Date().getDay();
    const energyTypes = ['Transformative', 'Creative', 'Harmonious', 'Focused', 'Adventurous', 'Intuitive', 'Reflective'];
    return energyTypes[today] || 'Balanced';
  };

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Loading daily insights...</p>
        </div>
      </div>
    );
  }

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
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <Calendar className="text-white w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold text-white">
                CosmoX
              </h1>
            </div>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-24">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Hello, {currentProfile.name}!</h2>
          <p className="text-gray-400">{todayDate}</p>
        </div>

        {/* Quick Daily Summary */}
        {zodiacProfile && (
          <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 mb-6">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Your Daily Cosmic Summary</h3>
                  <p className="text-indigo-100 mb-3">
                    As a <span className="font-semibold text-white">{zodiacProfile.western.sign}</span> with{' '}
                    <span className="font-semibold text-white">{zodiacProfile.chinese.animal}</span> energy and{' '}
                    <span className="font-semibold text-white">{zodiacProfile.arabic.mansion}</span> influence, 
                    today brings a unique blend of cosmic forces aligned for your growth.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                      <p className="text-xs text-indigo-300 mb-1">Focus Area</p>
                      <p className="text-sm font-medium text-white">
                        {zodiacProfile.western.element === 'Fire' ? 'Leadership & Initiative' : 
                         zodiacProfile.western.element === 'Earth' ? 'Stability & Planning' :
                         zodiacProfile.western.element === 'Air' ? 'Communication & Ideas' :
                         'Emotional Intelligence'}
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                      <p className="text-xs text-indigo-300 mb-1">Best Time</p>
                      <p className="text-sm font-medium text-white">
                        {zodiacProfile.chinese.element === 'Wood' || zodiacProfile.chinese.element === 'Fire' ? 'Morning' :
                         zodiacProfile.chinese.element === 'Earth' ? 'Midday' :
                         'Evening'}
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                      <p className="text-xs text-indigo-300 mb-1">Key Strength</p>
                      <p className="text-sm font-medium text-white">
                        {zodiacProfile.vedic.spiritualTraits[0] || 'Intuition'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Today's Energy Overview */}
        <Card className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 border border-slate-700/50 mb-6">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Today's Cosmic Energy</h3>
              <Badge className="bg-purple-500/20 text-purple-300 text-lg px-4 py-1">
                {getTodaysEnergy()}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {todaysAlignment.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="rgb(30 41 59)"
                        strokeWidth="4"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="4"
                        strokeDasharray={`${item.value * 1.76} 176`}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{item.value}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">{item.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Energy Trends */}
        <Card className="bg-slate-800/60 border-slate-700/50 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Weekly Energy Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyEnergyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#f3f4f6' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="love" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Love"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="career" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Career"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="health" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Health"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="creativity" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="Creativity"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Moon Phase Tracker */}
        <Card className="bg-slate-800/60 border-slate-700/50 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Moon className="w-5 h-5" />
              <span>Lunar Influence Tracker</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moonPhases.map((phase, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                      <Moon className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{phase.phase}</p>
                      <p className="text-sm text-gray-400">{phase.date}</p>
                    </div>
                  </div>
                  <div className="w-24">
                    <Progress 
                      value={phase.intensity} 
                      className="h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI-Generated Daily Insights */}
        {dailyInsights ? (
          <>
            {/* Cosmic Advice Banner */}
            <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 mb-6">
              <CardContent className="p-6 text-center">
                <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Today's Cosmic Guidance</h3>
                <p className="text-purple-200 text-lg italic">"{dailyInsights.cosmicAdvice}"</p>
                <div className="flex items-center justify-center space-x-4 mt-4">
                  <Badge className="bg-purple-500/20 text-purple-300">
                    Lucky Color: {dailyInsights.luckyColor}
                  </Badge>
                  <Badge className="bg-amber-500/20 text-amber-300">
                    Energy: {dailyInsights.energyLevel}%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Daily Timeline */}
            <div className="grid gap-4">
              <Card className="bg-slate-800/40 border-slate-700/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Sun className="w-6 h-6 text-yellow-400" />
                    <div className="flex-1">
                      <h4 className="font-medium text-white">Morning Focus</h4>
                      <p className="text-sm text-gray-400">{dailyInsights.morningFocus}</p>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-300">
                      Active
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/40 border-slate-700/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-6 h-6 text-green-400" />
                    <div className="flex-1">
                      <h4 className="font-medium text-white">Afternoon Energy</h4>
                      <p className="text-sm text-gray-400">{dailyInsights.afternoonEnergy}</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-300">
                      High
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/40 border-slate-700/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Star className="w-6 h-6 text-purple-400" />
                    <div className="flex-1">
                      <h4 className="font-medium text-white">Evening Reflection</h4>
                      <p className="text-sm text-gray-400">{dailyInsights.eveningReflection}</p>
                    </div>
                    <Badge className="bg-purple-500/20 text-purple-300">
                      Optimal
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <Card className="bg-slate-800/40 border-slate-700/50">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-white mb-2">Generating Your Daily Insights</h3>
              <p className="text-gray-400">
                {generateInsightsMutation.isPending 
                  ? "Our AI is analyzing your cosmic profile..."
                  : "Loading personalized guidance for today..."
                }
              </p>
              {generateInsightsMutation.isError && (
                <Button 
                  onClick={() => zodiacProfile && generateInsightsMutation.mutate(zodiacProfile)}
                  className="mt-4 bg-purple-600 hover:bg-purple-700"
                >
                  Retry Generation
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </>
  );
}