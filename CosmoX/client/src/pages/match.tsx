import { useState, useEffect } from "react";
import { Heart, ArrowLeft, Plus, User, CalendarDays, Share2, Copy } from "lucide-react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { calculateCompatibility, type CompatibilityMatch } from "@/lib/compatibility-calculator";
import { calculateZodiacProfile } from "@/lib/zodiac-calculator";
import type { ZodiacProfile, Profile, InsertProfile } from "@shared/schema";
import { insertProfileSchema } from "@shared/schema";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface MatchPerson {
  id: string;
  name: string;
  birthDate: string;
  birthTime?: string;
  zodiacProfile?: ZodiacProfile;
  compatibilityScore?: number;
  relationship?: string;
}

export default function Match() {
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [userZodiacProfile, setUserZodiacProfile] = useState<ZodiacProfile | null>(null);
  const [matchPeople, setMatchPeople] = useState<MatchPerson[]>([]);
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchPerson | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Debug logging
  useEffect(() => {
    console.log("Match page component mounted and rendering");
  }, []);

  const form = useForm<InsertProfile>({
    resolver: zodResolver(insertProfileSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      birthTime: "",
    },
  });

  const generateZodiacMutation = useMutation({
    mutationFn: async (data: { birthDate: string; birthTime?: string }) => {
      const response = await apiRequest("POST", "/api/zodiac-profile", data);
      return response.json();
    },
  });

  useEffect(() => {
    // Get user profile and zodiac from localStorage
    const savedProfile = localStorage.getItem("userProfile");
    const savedZodiac = localStorage.getItem("zodiacProfile");

    if (!savedProfile || !savedZodiac) {
      setLocation("/");
      return;
    }

    try {
      const profile = JSON.parse(savedProfile);
      const zodiac = JSON.parse(savedZodiac);
      setUserProfile(profile);
      setUserZodiacProfile(zodiac);
    } catch (error) {
      console.error("Error parsing profile data:", error);
      setLocation("/");
    }

    // Load saved match people
    const savedMatches = localStorage.getItem("matchPeople");
    if (savedMatches) {
      try {
        setMatchPeople(JSON.parse(savedMatches));
      } catch (error) {
        console.error("Error parsing match people:", error);
      }
    }
  }, [setLocation]);

  const calculatePersonCompatibility = (personZodiac: ZodiacProfile): { score: number; relationship: string } => {
    if (!userZodiacProfile) return { score: 50, relationship: "neutral" };

    const compatibility = calculateCompatibility(userZodiacProfile);

    // Find best match for this person's western sign
    const personWesternSign = personZodiac.western.sign;
    const bestMatch = compatibility.bestMatches.find(m => m.sign === personWesternSign);
    const challengingMatch = compatibility.challengingMatches.find(m => m.sign === personWesternSign);

    if (bestMatch) {
      return { score: bestMatch.score, relationship: bestMatch.relationship };
    } else if (challengingMatch) {
      return { score: challengingMatch.score, relationship: challengingMatch.relationship };
    }

    // Default compatibility calculation
    return { score: Math.floor(Math.random() * 40) + 60, relationship: "good" };
  };

  const handleAddPerson = async (data: InsertProfile) => {
    try {
      // Generate zodiac profile for the new person
      const zodiacResponse = await generateZodiacMutation.mutateAsync({
        birthDate: data.birthDate,
        birthTime: data.birthTime || undefined
      });

      const personZodiac = zodiacResponse as ZodiacProfile;
      const compatibility = calculatePersonCompatibility(personZodiac);

      const newPerson: MatchPerson = {
        id: Date.now().toString(),
        name: data.name || "Unknown",
        birthDate: data.birthDate,
        birthTime: data.birthTime || undefined,
        zodiacProfile: personZodiac,
        compatibilityScore: compatibility.score,
        relationship: compatibility.relationship
      };

      const updatedMatches = [...matchPeople, newPerson];
      setMatchPeople(updatedMatches);
      localStorage.setItem("matchPeople", JSON.stringify(updatedMatches));

      setShowAddPersonModal(false);
      form.reset();

      toast({
        title: "Person added",
        description: `${newPerson.name} has been added to your compatibility matches.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add person. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!userProfile || !userZodiacProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Loading compatibility insights...</p>
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
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <Heart className="text-white w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold text-white">
                CosmoX
              </h1>
            </div>
            <div className="w-16"></div> {/* Spacer for center alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-24">
        {/* User Profile Section */}
        <Card className="bg-slate-800/60 border-slate-700/50 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{userProfile.name}</h3>
                <p className="text-gray-400">{userZodiacProfile.western.sign} • {userZodiacProfile.chinese.animal}</p>
                <Badge className="bg-purple-500/20 text-purple-300 mt-1">
                  Your Profile
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Person Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Compatibility Matches</h2>
          <Dialog open={showAddPersonModal} onOpenChange={setShowAddPersonModal}>
            <DialogTrigger asChild>
              <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Person
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Add Someone to Match</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddPerson)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter their name"
                            className="bg-slate-800 border-slate-600 text-white"
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Birth Date</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="DD/MM/YYYY"
                            className="bg-slate-800 border-slate-600 text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="birthTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Birth Time (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="HH:MM"
                            className="bg-slate-800 border-slate-600 text-white"
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-pink-600 hover:bg-pink-700"
                    disabled={generateZodiacMutation.isPending}
                  >
                    {generateZodiacMutation.isPending ? "Calculating..." : "Add & Calculate Compatibility"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Match People List */}
        {matchPeople.length === 0 ? (
          <Card className="bg-slate-800/40 border-slate-700/50">
            <CardContent className="p-8 text-center">
              <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No matches yet</h3>
              <p className="text-gray-400 mb-4">
                Add people to see your cosmic compatibility scores
              </p>
              <Button 
                onClick={() => setShowAddPersonModal(true)}
                className="bg-pink-600 hover:bg-pink-700"
              >
                Add Your First Match
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {matchPeople.map((person) => (
              <Card key={person.id} className="bg-slate-800/60 border-slate-700/50 hover:bg-slate-800/80 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{person.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <CalendarDays className="w-3 h-3" />
                          <span>{person.birthDate}</span>
                        </div>
                        {person.zodiacProfile && (
                          <p className="text-sm text-gray-300">
                            {person.zodiacProfile.western.sign} • {person.zodiacProfile.chinese.animal}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        (person.compatibilityScore || 0) >= 80 ? 'text-green-400' :
                        (person.compatibilityScore || 0) >= 60 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {person.compatibilityScore || 0}%
                      </div>
                      <Badge 
                        className={`${
                          person.relationship === 'excellent' ? 'bg-green-500/20 text-green-300' :
                          person.relationship === 'good' ? 'bg-yellow-500/20 text-yellow-300' :
                          person.relationship === 'challenging' ? 'bg-red-500/20 text-red-300' :
                          'bg-gray-500/20 text-gray-300'
                        }`}
                      >
                        {person.relationship || 'neutral'}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full border-pink-500/30 text-pink-400 hover:bg-pink-500/10"
                    onClick={() => setSelectedMatch(person)}
                  >
                    View Detailed Compatibility
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Detailed Match Modal */}
        {selectedMatch && (
          <Dialog open={!!selectedMatch} onOpenChange={() => setSelectedMatch(null)}>
            <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {userProfile.name} & {selectedMatch.name} Compatibility
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 ${
                    (selectedMatch.compatibilityScore || 0) >= 80 ? 'text-green-400' :
                    (selectedMatch.compatibilityScore || 0) >= 60 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {selectedMatch.compatibilityScore || 0}%
                  </div>
                  <Badge 
                    className={`text-lg px-4 py-1 ${
                      selectedMatch.relationship === 'excellent' ? 'bg-green-500/20 text-green-300' :
                      selectedMatch.relationship === 'good' ? 'bg-yellow-500/20 text-yellow-300' :
                      selectedMatch.relationship === 'challenging' ? 'bg-red-500/20 text-red-300' :
                      'bg-gray-500/20 text-gray-300'
                    }`}
                  >
                    {selectedMatch.relationship || 'neutral'} match
                  </Badge>
                </div>

                {selectedMatch.zodiacProfile && userZodiacProfile && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/40 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">{userProfile.name}</h4>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-300">Western: {userZodiacProfile.western.sign}</p>
                        <p className="text-gray-300">Chinese: {userZodiacProfile.chinese.animal}</p>
                        <p className="text-gray-300">Vedic: {userZodiacProfile.vedic.nakshatra}</p>
                      </div>
                    </div>
                    <div className="bg-slate-800/40 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">{selectedMatch.name}</h4>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-300">Western: {selectedMatch.zodiacProfile.western.sign}</p>
                        <p className="text-gray-300">Chinese: {selectedMatch.zodiacProfile.chinese.animal}</p>
                        <p className="text-gray-300">Vedic: {selectedMatch.zodiacProfile.vedic.nakshatra}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-slate-800/40 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3">Compatibility Insights</h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>• Western zodiac compatibility shows {selectedMatch.relationship || 'moderate'} potential</p>
                    <p>• Chinese zodiac elements create {(selectedMatch.compatibilityScore || 0) >= 70 ? 'harmonious' : 'complex'} energy</p>
                    <p>• Communication styles are {(selectedMatch.compatibilityScore || 0) >= 60 ? 'well-aligned' : 'different but workable'}</p>
                    <p>• Emotional needs {(selectedMatch.compatibilityScore || 0) >= 80 ? 'complement each other perfectly' : 'require understanding'}</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Invite Friends Section */}
        {userProfile && (
          <Card className="bg-gradient-to-r from-pink-900/30 to-purple-900/30 border border-pink-700/50 mt-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Share2 className="w-6 h-6 text-pink-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Invite Friends</h3>
                  <p className="text-sm text-gray-300">Share your cosmic profile and check compatibility!</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-400">
                  Invite your friends to check their compatibility with you. They'll be able to see your zodiac profile and discover how well your cosmic energies align!
                </p>

                <Button
                  onClick={() => {
                    const inviteUrl = `${window.location.origin}/invite/${userProfile.id || 'default'}`;
                    navigator.clipboard.writeText(inviteUrl);
                    toast({
                      title: "Invite link copied!",
                      description: "Share this link with your friends to check compatibility.",
                    });
                  }}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white"
                  data-testid="copy-invite-link"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Invite Link
                </Button>

                <div className="flex items-center gap-2 pt-2">
                  <div className="flex-1 h-px bg-gray-700"></div>
                  <span className="text-xs text-gray-500">or share directly</span>
                  <div className="flex-1 h-px bg-gray-700"></div>
                </div>

                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const inviteUrl = `${window.location.origin}/invite/${userProfile.id || 'default'}`;
                      const text = `Check out my cosmic profile on CosmoX and see how compatible we are!`;
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteUrl)}`, '_blank');
                    }}
                    className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                    data-testid="share-facebook-invite"
                  >
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const inviteUrl = `${window.location.origin}/invite/${userProfile.id || 'default'}`;
                      const text = `Check out my cosmic profile on CosmoX and see how compatible we are!`;
                      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(inviteUrl)}`, '_blank');
                    }}
                    className="border-gray-500/30 text-gray-400 hover:bg-gray-500/10"
                    data-testid="share-x-invite"
                  >
                    X (Twitter)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const inviteUrl = `${window.location.origin}/invite/${userProfile.id || 'default'}`;
                      const text = `Check out my cosmic profile on CosmoX and see how compatible we are! ${inviteUrl}`;
                      navigator.clipboard.writeText(text);
                      toast({
                        title: "Copied for TikTok!",
                        description: "Paste this in your TikTok bio or message.",
                      });
                    }}
                    className="border-pink-500/30 text-pink-400 hover:bg-pink-500/10"
                    data-testid="share-tiktok-invite"
                  >
                    TikTok
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </>
  );
}