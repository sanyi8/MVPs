import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Heart, Sprout, Eye, Shield, Scale, Moon, Sparkles, Gift } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ZodiacSign, ChineseZodiac, VedicSign, MayanSign, CelticSign, ArabicSign } from "@shared/schema";

interface ZodiacCardProps {
  type: "western" | "chinese" | "vedic" | "mayan" | "celtic" | "arabic";
  data: ZodiacSign | ChineseZodiac | VedicSign | MayanSign | CelticSign | ArabicSign;
}

export function ZodiacCard({ type, data }: ZodiacCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getCardConfig = () => {
    switch (type) {
      case "western":
        const western = data as ZodiacSign;
        return {
          title: "Western Zodiac",
          subtitle: "Sun Sign",
          icon: "☉",
          iconColor: "text-[#00f0ff]",
          bgColor: "bg-[#00f0ff]/20",
          mainTitle: `${western.sign} ${western.symbol}`,
          badge: western.element,
          badgeColor: getElementColor(western.element),
          description: western.description,
        };
      case "chinese":
        const chinese = data as ChineseZodiac;
        return {
          title: "Chinese Zodiac",
          subtitle: "Animal + Element",
          icon: "🐉",
          iconColor: "text-red-400",
          bgColor: "bg-red-500/20",
          mainTitle: `${chinese.element} ${chinese.animal}`,
          badge: chinese.year.toString(),
          badgeColor: "bg-red-500/20 text-red-300",
          description: chinese.description,
        };
      case "vedic":
        const vedic = data as VedicSign;
        return {
          title: "Vedic Astrology",
          subtitle: "Nakshatra & Moon",
          icon: "☽",
          iconColor: "text-purple-400",
          bgColor: "bg-purple-500/20",
          mainTitle: `${vedic.nakshatra} ✨`,
          badge: vedic.moonSign,
          badgeColor: "bg-purple-500/20 text-purple-300",
          description: vedic.description,
        };
      case "mayan":
        const mayan = data as MayanSign;
        return {
          title: "Mayan Zodiac",
          subtitle: "Day Sign",
          icon: "🌱",
          iconColor: "text-[#c6866d]",
          bgColor: "bg-[#c6866d]/20",
          mainTitle: `${mayan.daySign} 🌱`,
          badge: mayan.meaning,
          badgeColor: "bg-[#c6866d]/20 text-[#c6866d]",
          description: mayan.description,
        };
      case "celtic":
        const celtic = data as CelticSign;
        return {
          title: "Celtic Zodiac",
          subtitle: "Tree Sign",
          icon: "🌳",
          iconColor: "text-green-400",
          bgColor: "bg-green-500/20",
          mainTitle: `${celtic.tree} 🌳`,
          badge: celtic.meaning,
          badgeColor: "bg-green-500/20 text-green-300",
          description: celtic.description,
        };
      case "arabic":
        const arabic = data as ArabicSign;
        return {
          title: "Medieval Arabic",
          subtitle: "Lunar Mansion",
          icon: "☪",
          iconColor: "text-[#ffa700]",
          bgColor: "bg-[#ffa700]/20",
          mainTitle: `${arabic.mansion} ☽`,
          badge: `${arabic.arabicName} (#${arabic.number})`,
          badgeColor: "bg-[#ffa700]/20 text-[#ffa700]",
          description: arabic.description,
        };
      default:
        return {
          title: "",
          subtitle: "",
          icon: "",
          iconColor: "",
          bgColor: "",
          mainTitle: "",
          badge: "",
          badgeColor: "",
          description: "",
        };
    }
  };

  const getElementColor = (element: string) => {
    switch (element.toLowerCase()) {
      case "fire":
        return "bg-red-500/20 text-red-300";
      case "earth":
        return "bg-yellow-500/20 text-yellow-300";
      case "air":
        return "bg-blue-500/20 text-blue-300";
      case "water":
        return "bg-blue-500/20 text-blue-300";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  const config = getCardConfig();

  const renderExpandedContent = () => {
    switch (type) {
      case "western":
        const western = data as ZodiacSign;
        return (
          <div className="pt-3 border-t border-slate-700 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <h6 className="font-medium text-green-400 mb-1 flex items-center gap-1">
                  <Heart className="w-3 h-3" /> Strengths
                </h6>
                <ul className="text-xs text-cosmic-gray space-y-1">
                  {western.strengths.map((strength, index) => (
                    <li key={index}>• {strength}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h6 className="font-medium text-yellow-400 mb-1 flex items-center gap-1">
                  <Sprout className="w-3 h-3" /> Growth Areas
                </h6>
                <ul className="text-xs text-cosmic-gray space-y-1">
                  {western.growthAreas.map((area, index) => (
                    <li key={index}>• {area}</li>
                  ))}
                </ul>
              </div>
            </div>
            {western.detailedDescription && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <p className="text-sm text-blue-300">{western.detailedDescription}</p>
              </div>
            )}
          </div>
        );
      case "chinese":
        const chinese = data as ChineseZodiac;
        return (
          <div className="pt-3 border-t border-slate-700 space-y-4">
            <div>
              <h6 className="font-medium text-green-400 mb-2">Element Empowerment</h6>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <p className="text-sm text-green-300">{chinese.elementDescription}</p>
              </div>
            </div>
            <div>
              <h6 className="font-medium mb-2">Characteristics</h6>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {chinese.characteristics.positive.map((trait, index) => (
                  <div key={index} className="bg-slate-800/50 rounded p-2">
                    <span className="text-green-400">+</span> {trait}
                  </div>
                ))}
                {chinese.characteristics.challenges.map((trait, index) => (
                  <div key={index} className="bg-slate-800/50 rounded p-2">
                    <span className="text-yellow-400">△</span> {trait}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "vedic":
        const vedic = data as VedicSign;
        return (
          <div className="pt-3 border-t border-slate-700 space-y-4">
            <div>
              <h6 className="font-medium text-purple-400 mb-2">Planetary Influences</h6>
              <div className="space-y-2">
                {vedic.planetaryInfluences.map((influence, index) => (
                  <div key={index} className="flex justify-between items-center bg-slate-800/30 rounded p-2">
                    <span className="text-sm">{influence.planet}</span>
                    <span className="text-xs text-cosmic-gray">{influence.influence}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
              <p className="text-sm text-purple-300">
                You possess natural healing abilities and can help others find closure and peace.
              </p>
            </div>
          </div>
        );
      case "mayan":
        const mayan = data as MayanSign;
        return (
          <div className="pt-3 border-t border-slate-700 space-y-4">
            <div>
              <h6 className="font-medium text-[#c6866d] mb-2">Spiritual Qualities</h6>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {mayan.spiritualQualities.map((quality, index) => (
                  <div key={index} className="bg-slate-800/50 rounded p-2 text-center">
                    <Sparkles className="text-[#c6866d] mb-1 mx-auto w-3 h-3" />
                    <span>{quality}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h6 className="font-medium text-[#c6866d] mb-2">Sacred Gifts</h6>
              <div className="space-y-2">
                {mayan.sacredGifts.map((item, index) => (
                  <div key={index} className="bg-[#c6866d]/10 border border-[#c6866d]/20 rounded-lg p-2">
                    <div className="flex items-start space-x-2">
                      <Gift className="w-3 h-3 text-[#c6866d] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium" style={{ color: '#c6866d' }}>{item.gift}</p>
                        <p className="text-xs text-gray-400">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "celtic":
        const celtic = data as CelticSign;
        return (
          <div className="pt-3 border-t border-slate-700 space-y-4">
            <div>
              <h6 className="font-medium text-green-400 mb-2 flex items-center gap-1">
                <Moon className="w-4 h-4" /> Lunar Connection
              </h6>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <p className="text-sm text-blue-300">{celtic.lunarConnection}</p>
              </div>
            </div>
            <div>
              <h6 className="font-medium mb-2">Celtic Gifts</h6>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {celtic.gifts.map((gift, index) => (
                  <div key={index} className="bg-slate-800/50 rounded p-2 text-center">
                    <Eye className="text-cosmic-purple mb-1 mx-auto w-3 h-3" />
                    <span>{gift}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "arabic":
        const arabic = data as ArabicSign;
        return (
          <div className="pt-3 border-t border-slate-700 space-y-4">
            <div>
              <h6 className="font-medium text-[#ffa700] mb-2">Spiritual Qualities</h6>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {arabic.spiritualQualities.map((quality, index) => (
                  <div key={index} className="bg-slate-800/50 rounded p-2 text-center">
                    <Moon className="text-[#ffa700] mb-1 mx-auto w-3 h-3" />
                    <span>{quality}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h6 className="font-medium text-[#ffa700] mb-2">Magical Uses</h6>
              <div className="space-y-2">
                {arabic.magicalUses.map((item, index) => (
                  <div key={index} className="bg-[#ffa700]/10 border border-[#ffa700]/20 rounded-lg p-2">
                    <div className="flex items-start space-x-2">
                      <Heart className="w-3 h-3 text-[#ffa700] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium" style={{ color: '#ffa700' }}>{item.use}</p>
                        <p className="text-xs text-gray-400">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case "western":
        return "border-l-[#00f0ff]";
      case "chinese":
        return "border-l-red-500";
      case "vedic":
        return "border-l-purple-500";
      case "mayan":
        return "border-l-[#c6866d]";
      case "celtic":
        return "border-l-green-500";
      case "arabic":
        return "border-l-[#ffa700]";
      default:
        return "border-l-slate-700";
    }
  };

  return (
    <Card className={`w-64 sm:w-72 md:w-80 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 border-l-4 ${getBorderColor()} flex-shrink-0 snap-center`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${config.bgColor} rounded-full flex items-center justify-center`}>
              <span className={`${config.iconColor} text-lg`}>{config.icon}</span>
            </div>
            <div>
              <h4 className="font-semibold">{config.title}</h4>
              <p className="text-sm text-cosmic-gray">{config.subtitle}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-cosmic-gray hover:text-white transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </Button>
        </div>

        <div className="text-center mb-4">
          <h5 className={`text-xl font-bold ${config.iconColor} mb-1`}>
            {config.mainTitle}
          </h5>
          <Badge className={config.badgeColor}>{config.badge}</Badge>
        </div>

        <div className="space-y-3">
          <div>
            <h6 className="font-medium mb-1 text-white">Core Nature</h6>
            <p className="text-sm text-gray-300 leading-relaxed">{config.description}</p>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {renderExpandedContent()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}