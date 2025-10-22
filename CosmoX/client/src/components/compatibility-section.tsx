import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Shield, Users, MessageCircle, TrendingUp, AlertTriangle, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ZodiacProfile } from "@shared/schema";
import { calculateCompatibility, type CompatibilityMatch } from "@/lib/compatibility-calculator";

interface CompatibilitySectionProps {
  zodiacProfile: ZodiacProfile;
}

export function CompatibilitySection({ zodiacProfile }: CompatibilitySectionProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const compatibility = calculateCompatibility(zodiacProfile);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-green-500/20";
    if (score >= 60) return "bg-yellow-500/20";
    if (score >= 40) return "bg-orange-500/20";
    return "bg-red-500/20";
  };

  const MatchCard = ({ match, type }: { match: CompatibilityMatch; type: "best" | "challenging" }) => {
    const cardId = `${match.system}-${match.sign}`;
    const isExpanded = expandedCard === cardId;

    return (
      <Card className="bg-slate-800/60 border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full ${getScoreBackground(match.score)} flex items-center justify-center`}>
                {type === "best" ? (
                  <Heart className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-white">{match.sign}</h4>
                <p className="text-xs text-gray-400 capitalize">{match.system} System</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={`${getScoreBackground(match.score)} ${getScoreColor(match.score)} text-xs`}>
                {Math.round(match.score)}%
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedCard(isExpanded ? null : cardId)}
                className="text-gray-400 hover:text-white"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>

          <p className="text-sm text-gray-300 mb-3">{match.description}</p>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-slate-700 pt-3"
              >
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <h5 className="font-medium text-white mb-2 flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2 text-blue-400" />
                    Relationship Advice
                  </h5>
                  <p className="text-sm text-gray-300">{match.advice}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    );
  };

  return (
    <section className="mb-8">
      <Card className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 border border-slate-700/50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Relationship Compatibility</h3>
              <p className="text-sm text-gray-400">Discover your connections across zodiac systems</p>
            </div>
          </div>

          <Tabs defaultValue="matches" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
              <TabsTrigger value="matches" className="text-white data-[state=active]:bg-slate-700">
                Best Matches
              </TabsTrigger>
              <TabsTrigger value="challenges" className="text-white data-[state=active]:bg-slate-700">
                Growth Areas
              </TabsTrigger>
              <TabsTrigger value="insights" className="text-white data-[state=active]:bg-slate-700">
                Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="matches" className="space-y-4 mt-4">
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="w-5 h-5 text-green-400" />
                <h4 className="font-medium text-white">Your Most Compatible Signs</h4>
              </div>
              <div className="grid gap-3">
                {compatibility.bestMatches.map((match, index) => (
                  <MatchCard key={`best-${index}`} match={match} type="best" />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="challenges" className="space-y-4 mt-4">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-orange-400" />
                <h4 className="font-medium text-white">Challenging but Growth-Oriented Connections</h4>
              </div>
              <div className="grid gap-3">
                {compatibility.challengingMatches.map((match, index) => (
                  <MatchCard key={`challenging-${index}`} match={match} type="challenging" />
                ))}
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mt-4">
                <p className="text-sm text-orange-300">
                  <strong>Remember:</strong> Challenging connections often provide the greatest opportunities for personal growth and learning. 
                  Approach these relationships with patience, understanding, and an open mind.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <div className="bg-slate-800/30 rounded-lg p-4">
                  <h4 className="font-medium text-green-400 mb-3 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Empowering Connections
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    {compatibility.empoweringConnections.map((connection, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>{connection}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-800/30 rounded-lg p-4">
                  <h4 className="font-medium text-blue-400 mb-3 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Growth Opportunities
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    {compatibility.growthOpportunities.map((opportunity, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>{opportunity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-800/30 rounded-lg p-4">
                  <h4 className="font-medium text-purple-400 mb-3 flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Communication Tips
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    {compatibility.communicationTips.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
}