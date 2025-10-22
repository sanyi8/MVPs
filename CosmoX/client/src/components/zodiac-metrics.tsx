import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  Legend,
  Cell,
} from "recharts";
import type { ZodiacProfile } from "@shared/schema";

interface ZodiacMetricsProps {
  zodiacProfile: ZodiacProfile;
  selectedSystems: Set<string>;
}

export function ZodiacMetrics({ zodiacProfile, selectedSystems }: ZodiacMetricsProps) {
  const [hiddenSystems, setHiddenSystems] = useState<Set<string>>(new Set());

  const toggleSystemVisibility = (system: string) => {
    const newHidden = new Set(hiddenSystems);
    if (newHidden.has(system)) {
      newHidden.delete(system);
    } else {
      newHidden.add(system);
    }
    setHiddenSystems(newHidden);
  };

  const isSystemVisible = (system: string) => {
    return selectedSystems.has(system) && !hiddenSystems.has(system);
  };
  // Generate personality metrics data for radar chart
  const personalityMetrics = [
    {
      trait: "Leadership",
      Western: selectedSystems.has('western') && !hiddenSystems.has('western') ? getWesternScore(zodiacProfile.western.sign, 'leadership') : null,
      Chinese: selectedSystems.has('chinese') && !hiddenSystems.has('chinese') ? getChineseScore(zodiacProfile.chinese.element, 'leadership') : null,
      Vedic: selectedSystems.has('vedic') && !hiddenSystems.has('vedic') ? 75 : null,
      Mayan: selectedSystems.has('mayan') && !hiddenSystems.has('mayan') ? 70 : null,
      Celtic: selectedSystems.has('celtic') && !hiddenSystems.has('celtic') ? 68 : null,
    },
    {
      trait: "Creativity",
      Western: selectedSystems.has('western') && !hiddenSystems.has('western') ? getWesternScore(zodiacProfile.western.sign, 'creativity') : null,
      Chinese: selectedSystems.has('chinese') && !hiddenSystems.has('chinese') ? getChineseScore(zodiacProfile.chinese.element, 'creativity') : null,
      Vedic: selectedSystems.has('vedic') && !hiddenSystems.has('vedic') ? 85 : null,
      Mayan: selectedSystems.has('mayan') && !hiddenSystems.has('mayan') ? 90 : null,
      Celtic: selectedSystems.has('celtic') && !hiddenSystems.has('celtic') ? 88 : null,
    },
    {
      trait: "Intuition",
      Western: selectedSystems.has('western') && !hiddenSystems.has('western') ? getWesternScore(zodiacProfile.western.sign, 'intuition') : null,
      Chinese: selectedSystems.has('chinese') && !hiddenSystems.has('chinese') ? getChineseScore(zodiacProfile.chinese.element, 'intuition') : null,
      Vedic: selectedSystems.has('vedic') && !hiddenSystems.has('vedic') ? 92 : null,
      Mayan: selectedSystems.has('mayan') && !hiddenSystems.has('mayan') ? 88 : null,
      Celtic: selectedSystems.has('celtic') && !hiddenSystems.has('celtic') ? 85 : null,
    },
    {
      trait: "Empathy",
      Western: selectedSystems.has('western') && !hiddenSystems.has('western') ? getWesternScore(zodiacProfile.western.sign, 'empathy') : null,
      Chinese: selectedSystems.has('chinese') && !hiddenSystems.has('chinese') ? getChineseScore(zodiacProfile.chinese.element, 'empathy') : null,
      Vedic: selectedSystems.has('vedic') && !hiddenSystems.has('vedic') ? 80 : null,
      Mayan: selectedSystems.has('mayan') && !hiddenSystems.has('mayan') ? 85 : null,
      Celtic: selectedSystems.has('celtic') && !hiddenSystems.has('celtic') ? 90 : null,
    },
    {
      trait: "Ambition",
      Western: selectedSystems.has('western') && !hiddenSystems.has('western') ? getWesternScore(zodiacProfile.western.sign, 'ambition') : null,
      Chinese: selectedSystems.has('chinese') && !hiddenSystems.has('chinese') ? getChineseScore(zodiacProfile.chinese.element, 'ambition') : null,
      Vedic: selectedSystems.has('vedic') && !hiddenSystems.has('vedic') ? 78 : null,
      Mayan: selectedSystems.has('mayan') && !hiddenSystems.has('mayan') ? 72 : null,
      Celtic: selectedSystems.has('celtic') && !hiddenSystems.has('celtic') ? 75 : null,
    },
    {
      trait: "Balance",
      Western: selectedSystems.has('western') && !hiddenSystems.has('western') ? getWesternScore(zodiacProfile.western.sign, 'balance') : null,
      Chinese: selectedSystems.has('chinese') && !hiddenSystems.has('chinese') ? getChineseScore(zodiacProfile.chinese.element, 'balance') : null,
      Vedic: selectedSystems.has('vedic') && !hiddenSystems.has('vedic') ? 82 : null,
      Mayan: selectedSystems.has('mayan') && !hiddenSystems.has('mayan') ? 80 : null,
      Celtic: selectedSystems.has('celtic') && !hiddenSystems.has('celtic') ? 87 : null,
    },
  ];

  // Generate energy flow data for line chart with more data points for spacing
  const energyFlow = [
    { phase: "12 AM", Western: 60, Chinese: 65, Vedic: 95, Mayan: 70, Celtic: 85 },
    { phase: "4 AM", Western: 62, Chinese: 68, Vedic: 88, Mayan: 72, Celtic: 80 },
    { phase: "6 AM", Western: 65, Chinese: 70, Vedic: 85, Mayan: 75, Celtic: 72 },
    { phase: "8 AM", Western: 75, Chinese: 80, Vedic: 88, Mayan: 82, Celtic: 78 },
    { phase: "10 AM", Western: 80, Chinese: 85, Vedic: 90, Mayan: 88, Celtic: 82 },
    { phase: "12 PM", Western: 90, Chinese: 92, Vedic: 88, Mayan: 95, Celtic: 85 },
    { phase: "2 PM", Western: 85, Chinese: 88, Vedic: 85, Mayan: 92, Celtic: 87 },
    { phase: "4 PM", Western: 75, Chinese: 80, Vedic: 82, Mayan: 85, Celtic: 88 },
    { phase: "6 PM", Western: 70, Chinese: 75, Vedic: 90, Mayan: 80, Celtic: 92 },
    { phase: "8 PM", Western: 68, Chinese: 72, Vedic: 93, Mayan: 78, Celtic: 90 },
    { phase: "10 PM", Western: 62, Chinese: 68, Vedic: 94, Mayan: 72, Celtic: 88 },
  ].map(item => ({
    ...item,
    Western: isSystemVisible('western') ? item.Western : null,
    Chinese: isSystemVisible('chinese') ? item.Chinese : null,
    Vedic: isSystemVisible('vedic') ? item.Vedic : null,
    Mayan: isSystemVisible('mayan') ? item.Mayan : null,
    Celtic: isSystemVisible('celtic') ? item.Celtic : null,
  }));

  // Generate bubble chart data for personality comparison with varied sizes
  const bubbleData = [
    { system: 'western', data: selectedSystems.has('western') && !hiddenSystems.has('western') ? [
        { x: 75, y: 80, z: 3500, trait: 'Leadership' },
        { x: 85, y: 70, z: 4200, trait: 'Creativity' },
        { x: 65, y: 90, z: 3800, trait: 'Intuition' },
      ] : [],
      color: '#00f0ff',
    },
    { system: 'chinese', data: selectedSystems.has('chinese') && !hiddenSystems.has('chinese') ? [
        { x: 80, y: 75, z: 4000, trait: 'Leadership' },
        { x: 90, y: 85, z: 4500, trait: 'Creativity' },
        { x: 70, y: 85, z: 3600, trait: 'Intuition' },
      ] : [],
      color: '#ff0032',
    },
    { system: 'vedic', data: selectedSystems.has('vedic') && !hiddenSystems.has('vedic') ? [
        { x: 85, y: 88, z: 4300, trait: 'Leadership' },
        { x: 95, y: 80, z: 3700, trait: 'Creativity' },
        { x: 80, y: 95, z: 4600, trait: 'Intuition' },
      ] : [],
      color: '#8f00ff',
    },
    { system: 'arabic', data: selectedSystems.has('arabic') && !hiddenSystems.has('arabic') ? [
        { x: 78, y: 82, z: 3900, trait: 'Leadership' },
        { x: 88, y: 92, z: 4400, trait: 'Creativity' },
        { x: 75, y: 88, z: 4100, trait: 'Intuition' },
      ] : [],
      color: '#ffa700',
    },
    { system: 'mayan', data: selectedSystems.has('mayan') && !hiddenSystems.has('mayan') ? [
        { x: 78, y: 82, z: 3900, trait: 'Leadership' },
        { x: 88, y: 92, z: 4400, trait: 'Creativity' },
        { x: 75, y: 88, z: 4100, trait: 'Intuition' },
      ] : [],
      color: '#c6866d',
    },
    { system: 'celtic', data: selectedSystems.has('celtic') && !hiddenSystems.has('celtic') ? [
        { x: 72, y: 85, z: 3500, trait: 'Leadership' },
        { x: 85, y: 88, z: 4200, trait: 'Creativity' },
        { x: 78, y: 90, z: 4500, trait: 'Intuition' },
      ] : [],
      color: '#00ff59',
    },
  ];

  const ZodiacToggleButtons = () => {
    const systems = [
      { key: 'western', name: 'Western', color: '#00f0ff' },
      { key: 'chinese', name: 'Chinese', color: '#ff0032' },
      { key: 'vedic', name: 'Vedic', color: '#8f00ff' },
      { key: 'arabic', name: 'Arabic', color: '#ffa700' },
      { key: 'mayan', name: 'Mayan', color: '#c6866d' },
      { key: 'celtic', name: 'Celtic', color: '#00ff59' },
    ];

    return (
      <div className="flex items-center justify-center gap-2 flex-wrap mt-4 pb-2">
        {systems.map((system) => {
          const isSelected = selectedSystems.has(system.key);
          const isVisible = !hiddenSystems.has(system.key);

          if (!isSelected) return null;

          return (
            <label
              key={system.key}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border-2 transition-all cursor-pointer select-none hover:scale-105"
              style={{
                borderColor: isVisible ? system.color : '#475569',
                backgroundColor: isVisible ? `${system.color}15` : '#1e293b',
              }}
            >
              <input
                type="checkbox"
                checked={isVisible}
                onChange={() => toggleSystemVisibility(system.key)}
                className="sr-only peer"
              />
              <div 
                className="h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all"
                style={{ borderColor: system.color }}
              >
                {isVisible && (
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: system.color }}
                  />
                )}
              </div>
              <span 
                className="text-sm font-semibold transition-colors"
                style={{ color: isVisible ? system.color : '#64748b' }}
              >
                {system.name}
              </span>
            </label>
          );
        })}
      </div>
    );
  };

  return (
    <section className="mb-8">
      <h3 className="text-xl font-semibold mb-4 text-white">Cosmic Metrics</h3>

      <Tabs defaultValue="personality" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="personality">Personality Traits</TabsTrigger>
          <TabsTrigger value="energy">Energy Flow</TabsTrigger>
          <TabsTrigger value="bubble">Trait Comparison</TabsTrigger>
          <TabsTrigger value="elemental">Elemental Balance</TabsTrigger>
        </TabsList>

        <TabsContent value="personality" className="mt-4">
          <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-lg text-white">Multi-System Personality Analysis</CardTitle>
              <p className="text-sm text-gray-400">Comparing traits across your active zodiac systems</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={450}>
                <RadarChart data={personalityMetrics}>
                  <PolarGrid stroke="#475569" strokeDasharray="3 3" />
                  <PolarAngleAxis 
                    dataKey="trait" 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]}
                    tick={{ fill: '#64748b', fontSize: 10 }}
                  />
                  {isSystemVisible('western') && (
                    <Radar
                      name="Western"
                      dataKey="Western"
                      stroke="#00f0ff"
                      strokeWidth={2}
                      fill="#00f0ff"
                      fillOpacity={0.15}
                    />
                  )}
                  {isSystemVisible('chinese') && (
                    <Radar
                      name="Chinese"
                      dataKey="Chinese"
                      stroke="#ff0032"
                      strokeWidth={2}
                      fill="#ff0032"
                      fillOpacity={0.15}
                    />
                  )}
                  {isSystemVisible('vedic') && (
                    <Radar
                      name="Vedic"
                      dataKey="Vedic"
                      stroke="#8f00ff"
                      strokeWidth={2}
                      fill="#8f00ff"
                      fillOpacity={0.15}
                    />
                  )}
                  {isSystemVisible('arabic') && (
                    <Radar
                      name="Arabic"
                      dataKey="Arabic"
                      stroke="#ffa700"
                      fill="#ffa700"
                      fillOpacity={0.15}
                    />
                  )}
                  {isSystemVisible('mayan') && (
                    <Radar
                      name="Mayan"
                      dataKey="Mayan"
                      stroke="#c6866d"
                      strokeWidth={2}
                      fill="#c6866d"
                      fillOpacity={0.15}
                    />
                  )}
                  {isSystemVisible('celtic') && (
                    <Radar
                      name="Celtic"
                      dataKey="Celtic"
                      stroke="#00ff59"
                      strokeWidth={2}
                      fill="#00ff59"
                      fillOpacity={0.15}
                    />
                  )}
                </RadarChart>
              </ResponsiveContainer>
              <ZodiacToggleButtons />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="energy" className="mt-4">
          <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-lg text-white">Daily Energy Patterns</CardTitle>
              <p className="text-sm text-gray-400">How your energy flows throughout the day</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={450}>
                <LineChart data={energyFlow} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis 
                    dataKey="phase" 
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    domain={[50, 100]}
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    label={{ value: 'Energy Level', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }}
                  />
                  {isSystemVisible('western') && (
                    <Line
                      type="monotone"
                      dataKey="Western"
                      stroke="#00f0ff"
                      strokeWidth={2.5}
                      dot={{ fill: '#00f0ff', r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  )}
                  {isSystemVisible('chinese') && (
                    <Line
                      type="monotone"
                      dataKey="Chinese"
                      stroke="#ff0032"
                      strokeWidth={2.5}
                      dot={{ fill: '#ff0032', r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  )}
                  {isSystemVisible('vedic') && (
                    <Line
                      type="monotone"
                      dataKey="Vedic"
                      stroke="#8f00ff"
                      strokeWidth={2.5}
                      dot={{ fill: '#8f00ff', r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  )}
                  {isSystemVisible('arabic') && (
                    <Line
                      type="monotone"
                      dataKey="Arabic"
                      stroke="#ffa700"
                      strokeWidth={2.5}
                      dot={{ fill: '#ffa700', r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  )}
                  {isSystemVisible('mayan') && (
                    <Line
                      type="monotone"
                      dataKey="Mayan"
                      stroke="#c6866d"
                      strokeWidth={2.5}
                      dot={{ fill: '#c6866d', r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  )}
                  {isSystemVisible('celtic') && (
                    <Line
                      type="monotone"
                      dataKey="Celtic"
                      stroke="#00ff59"
                      strokeWidth={2.5}
                      dot={{ fill: '#00ff59', r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
              <ZodiacToggleButtons />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bubble" className="mt-4">
          <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-lg text-white">Trait Comparison Matrix</CardTitle>
              <p className="text-sm text-gray-400">Heatmap showing trait scores across zodiac systems (0-100)</p>
            </CardHeader>
            <CardContent>
              {(() => {
                const systems = [
                  { key: 'western', name: 'Western', scores: [90, 75, 65, 80, 78, 82] },
                  { key: 'chinese', name: 'Chinese', scores: [80, 90, 70, 75, 82, 88] },
                  { key: 'vedic', name: 'Vedic', scores: [85, 95, 80, 85, 75, 92] },
                  { key: 'arabic', name: 'Arabic', scores: [78, 88, 75, 82, 80, 85] },
                  { key: 'mayan', name: 'Mayan', scores: [70, 88, 78, 85, 72, 80] },
                  { key: 'celtic', name: 'Celtic', scores: [72, 85, 78, 90, 75, 87] },
                ];
                const traits = ['Leadership', 'Creativity', 'Intuition', 'Empathy', 'Ambition', 'Balance'];

                const getColorForScore = (score: number) => {
                  if (score >= 90) return '#9ca3af'; // gray-400
                  if (score >= 80) return '#6b7280'; // gray-500
                  if (score >= 70) return '#4b5563'; // gray-600
                  if (score >= 60) return '#374151'; // gray-700
                  if (score >= 50) return '#1f2937'; // gray-800
                  return '#111827'; // gray-900
                };

                const visibleSystems = systems.filter(s => isSystemVisible(s.key));

                return (
                  <div>
                    {/* Header Row */}
                    <div className="flex mb-2">
                      <div className="w-20 sm:w-28 flex-shrink-0"></div>
                      {traits.map((trait) => (
                        <div key={trait} className="flex-1 text-center">
                          <span className="text-[10px] sm:text-xs font-semibold text-gray-300 block">{trait}</span>
                        </div>
                      ))}
                    </div>

                    {/* Heatmap Grid */}
                    <div>
                      {visibleSystems.map((system) => (
                        <div key={system.key} className="flex items-center">
                          <div className="w-20 sm:w-28 flex-shrink-0 pr-2">
                            <span className="text-xs sm:text-sm font-semibold text-white">{system.name}</span>
                          </div>
                          <div className="flex-1 flex">
                            {system.scores.map((score, idx) => (
                              <div
                                key={idx}
                                className="flex-1 py-4 sm:py-6 flex items-center justify-center border border-gray-700/50"
                                style={{ 
                                  backgroundColor: getColorForScore(score),
                                }}
                              >
                                <span className="text-sm sm:text-lg font-bold text-gray-900">{score}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Color Scale Legend */}
                    <div className="mt-6 pt-4 border-t border-gray-700/50">
                      <p className="text-xs text-gray-400 mb-2 text-center">Color Scale (Score Range) - Darker = Lower Score</p>
                      <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2">
                        <div className="flex items-center gap-1">
                          <div className="w-6 h-5 sm:w-8 sm:h-6 border border-gray-600" style={{ backgroundColor: '#111827' }}></div>
                          <span className="text-[10px] sm:text-xs text-gray-400">40-49</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-6 h-5 sm:w-8 sm:h-6 border border-gray-600" style={{ backgroundColor: '#1f2937' }}></div>
                          <span className="text-[10px] sm:text-xs text-gray-400">50-59</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-6 h-5 sm:w-8 sm:h-6 border border-gray-600" style={{ backgroundColor: '#374151' }}></div>
                          <span className="text-[10px] sm:text-xs text-gray-400">60-69</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-6 h-5 sm:w-8 sm:h-6 border border-gray-600" style={{ backgroundColor: '#4b5563' }}></div>
                          <span className="text-[10px] sm:text-xs text-gray-400">70-79</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-6 h-5 sm:w-8 sm:h-6 border border-gray-600" style={{ backgroundColor: '#6b7280' }}></div>
                          <span className="text-[10px] sm:text-xs text-gray-400">80-89</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-6 h-5 sm:w-8 sm:h-6 border border-gray-600" style={{ backgroundColor: '#9ca3af' }}></div>
                          <span className="text-[10px] sm:text-xs text-gray-400">90-100</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
              <ZodiacToggleButtons />
            </CardContent>
          </Card>
        </TabsContent>
      <TabsContent value="elemental" className="mt-4">
          <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-lg text-white">Elemental Distribution</CardTitle>
              <p className="text-sm text-gray-400">Your current elemental balance weighted across active zodiac systems</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={500}>
                {(() => {
                  // Calculate weighted elemental distribution based on active systems
                  let fireWeight = 0, waterWeight = 0, earthWeight = 0, airWeight = 0;
                  let totalWeight = 0;

                  // Western zodiac contribution
                  if (isSystemVisible('western')) {
                    const element = zodiacProfile.western.element;
                    totalWeight += 30; // Western gets 30% weight
                    if (element === 'Fire') fireWeight += 30;
                    else if (element === 'Water') waterWeight += 30;
                    else if (element === 'Earth') earthWeight += 30;
                    else if (element === 'Air') airWeight += 30;
                  }

                  // Chinese zodiac contribution
                  if (isSystemVisible('chinese')) {
                    const element = zodiacProfile.chinese.element;
                    totalWeight += 25; // Chinese gets 25% weight
                    if (element === 'Fire') fireWeight += 25;
                    else if (element === 'Water') waterWeight += 25;
                    else if (element === 'Earth') earthWeight += 25;
                    else if (element === 'Metal') airWeight += 15, earthWeight += 10; // Metal splits
                    else if (element === 'Wood') waterWeight += 15, airWeight += 10; // Wood splits
                  }

                  // Vedic contribution (based on nakshatra qualities)
                  if (isSystemVisible('vedic')) {
                    totalWeight += 20; // Vedic gets 20% weight
                    const moonSign = zodiacProfile.vedic.moonSign;
                    if (moonSign.includes('Aries') || moonSign.includes('Leo') || moonSign.includes('Sagittarius')) {
                      fireWeight += 20;
                    } else if (moonSign.includes('Cancer') || moonSign.includes('Scorpio') || moonSign.includes('Pisces')) {
                      waterWeight += 20;
                    } else if (moonSign.includes('Taurus') || moonSign.includes('Virgo') || moonSign.includes('Capricorn')) {
                      earthWeight += 20;
                    } else {
                      airWeight += 20;
                    }
                  }

                  // Mayan contribution (spiritual qualities)
                  if (isSystemVisible('mayan')) {
                    totalWeight += 15; // Mayan gets 15% weight
                    const qualities = zodiacProfile.mayan.spiritualQualities;
                    if (qualities.some(q => q.includes('energy') || q.includes('spirit'))) {
                      fireWeight += 8;
                      airWeight += 7;
                    } else if (qualities.some(q => q.includes('nurtur') || q.includes('material'))) {
                      earthWeight += 8;
                      waterWeight += 7;
                    } else {
                      fireWeight += 5;
                      waterWeight += 5;
                      earthWeight += 2.5;
                      airWeight += 2.5;
                    }
                  }

                  // Celtic contribution (tree energies)
                  if (isSystemVisible('celtic')) {
                    totalWeight += 10; // Celtic gets 10% weight
                    const tree = zodiacProfile.celtic.tree;
                    // Different trees have different elemental affinities
                    if (['Oak', 'Holly', 'Hawthorn'].includes(tree)) {
                      fireWeight += 10; // Strong, passionate trees
                    } else if (['Willow', 'Reed', 'Elder'].includes(tree)) {
                      waterWeight += 10; // Intuitive, flowing trees
                    } else if (['Birch', 'Rowan', 'Hazel'].includes(tree)) {
                      earthWeight += 10; // Grounding trees
                    } else {
                      airWeight += 10; // Intellectual trees
                    }
                  }

                  // Normalize to 100%
                  const total = fireWeight + waterWeight + earthWeight + airWeight;
                  if (total > 0) {
                    fireWeight = Math.round((fireWeight / total) * 100);
                    waterWeight = Math.round((waterWeight / total) * 100);
                    earthWeight = Math.round((earthWeight / total) * 100);
                    airWeight = Math.round((airWeight / total) * 100);
                    
                    // Adjust for rounding to ensure exactly 100%
                    const sum = fireWeight + waterWeight + earthWeight + airWeight;
                    if (sum !== 100) {
                      const diff = 100 - sum;
                      fireWeight += diff; // Add difference to largest element
                    }
                  }

                  const elementalData = [
                    {
                      category: 'Elements',
                      Fire: fireWeight || 25,
                      Water: waterWeight || 25,
                      Earth: earthWeight || 25,
                      Air: airWeight || 25,
                    }
                  ];

                  return (
                    <BarChart 
                      data={elementalData} 
                      layout="vertical"
                      margin={{ top: 20, right: 100, left: 100, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                      <XAxis 
                        type="number"
                        domain={[0, 100]}
                        stroke="#94a3b8"
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        label={{ value: 'Elemental Balance (%)', position: 'bottom', fill: '#94a3b8', offset: 0 }}
                      />
                      <YAxis 
                        type="category"
                        dataKey="category"
                        stroke="#94a3b8"
                        tick={{ fill: '#94a3b8', fontSize: 14, fontWeight: 600 }}
                        width={80}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #475569',
                          borderRadius: '8px',
                          color: '#f1f5f9'
                        }}
                        cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                        formatter={(value: number) => `${value}%`}
                      />
                      <Legend 
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="circle"
                      />
                      <Bar dataKey="Fire" stackId="elements" fill="#ff6b35" name="Fire 🔥" />
                      <Bar dataKey="Water" stackId="elements" fill="#4ecdc4" name="Water 💧" />
                      <Bar dataKey="Earth" stackId="elements" fill="#95bf47" name="Earth 🌍" />
                      <Bar dataKey="Air" stackId="elements" fill="#a8dadc" name="Air 🌬️" />
                    </BarChart>
                  );
                })()}
              </ResponsiveContainer>
              <div className="mt-4 text-center text-sm text-gray-400">
                Weighted distribution based on active zodiac systems (Western 30%, Chinese 25%, Vedic 20%, Mayan 15%, Celtic 10%)
              </div>
              <ZodiacToggleButtons />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}

// Helper functions to calculate scores based on zodiac characteristics
function getWesternScore(sign: string, trait: string): number {
  const scores: Record<string, Record<string, number>> = {
    Aries: { leadership: 90, creativity: 75, intuition: 65, empathy: 60, ambition: 95, balance: 50 },
    Taurus: { leadership: 70, creativity: 80, intuition: 70, empathy: 85, ambition: 75, balance: 90 },
    Gemini: { leadership: 75, creativity: 95, intuition: 80, empathy: 70, ambition: 70, balance: 60 },
    Cancer: { leadership: 65, creativity: 85, intuition: 95, empathy: 95, ambition: 60, balance: 75 },
    Leo: { leadership: 95, creativity: 90, intuition: 70, empathy: 75, ambition: 90, balance: 65 },
    Virgo: { leadership: 80, creativity: 75, intuition: 85, empathy: 80, ambition: 85, balance: 95 },
    Libra: { leadership: 75, creativity: 88, intuition: 80, empathy: 90, ambition: 70, balance: 95 },
    Scorpio: { leadership: 85, creativity: 80, intuition: 98, empathy: 75, ambition: 95, balance: 70 },
    Sagittarius: { leadership: 80, creativity: 90, intuition: 75, empathy: 70, ambition: 85, balance: 65 },
    Capricorn: { leadership: 95, creativity: 70, intuition: 75, empathy: 70, ambition: 98, balance: 80 },
    Aquarius: { leadership: 85, creativity: 95, intuition: 90, empathy: 75, ambition: 80, balance: 70 },
    Pisces: { leadership: 60, creativity: 98, intuition: 98, empathy: 98, ambition: 65, balance: 80 },
  };
  return scores[sign]?.[trait] || 75;
}

function getChineseScore(element: string, trait: string): number {
  const scores: Record<string, Record<string, number>> = {
    Wood: { leadership: 85, creativity: 90, intuition: 80, empathy: 85, ambition: 80, balance: 75 },
    Fire: { leadership: 95, creativity: 95, intuition: 75, empathy: 70, ambition: 90, balance: 60 },
    Earth: { leadership: 75, creativity: 70, intuition: 80, empathy: 90, ambition: 75, balance: 95 },
    Metal: { leadership: 90, creativity: 75, intuition: 85, empathy: 70, ambition: 95, balance: 85 },
    Water: { leadership: 70, creativity: 85, intuition: 95, empathy: 95, ambition: 70, balance: 90 },
  };
  return scores[element]?.[trait] || 75;
}