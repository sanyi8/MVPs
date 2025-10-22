import type { ZodiacSign, ChineseZodiac, VedicSign, MayanSign, CelticSign, ArabicSign } from "@shared/schema";

export const zodiacData = {
  western: [
    {
      sign: "Aries",
      symbol: "♈",
      element: "Fire",
      traits: ["Bold", "Energetic", "Independent", "Competitive"],
      strengths: ["Natural leadership", "Courage", "Initiative"],
      growthAreas: ["Patience", "Diplomacy", "Follow-through"],
      description: "Dynamic and pioneering, you charge forward with enthusiasm and courage.",
      detailedDescription: "Fire element gives you passion and drive to initiate new projects and lead others."
    },
    {
      sign: "Taurus",
      symbol: "♉",
      element: "Earth",
      traits: ["Reliable", "Patient", "Practical", "Devoted"],
      strengths: ["Stability", "Determination", "Sensuality"],
      growthAreas: ["Flexibility", "Change adaptation", "Risk-taking"],
      description: "Grounded and reliable, you build lasting foundations with patience and determination.",
      detailedDescription: "Earth element provides you with practical wisdom and the ability to manifest dreams into reality."
    },
    {
      sign: "Gemini",
      symbol: "♊",
      element: "Air",
      traits: ["Curious", "Adaptable", "Communicative", "Witty"],
      strengths: ["Mental agility", "Communication", "Versatility"],
      growthAreas: ["Focus", "Depth", "Consistency"],
      description: "Quick-minded and adaptable, you excel at communication and connecting ideas.",
      detailedDescription: "Air element gives you the gift of seeing multiple perspectives and communicating complex ideas."
    },
    {
      sign: "Cancer",
      symbol: "♋",
      element: "Water",
      traits: ["Nurturing", "Intuitive", "Protective", "Emotional"],
      strengths: ["Empathy", "Intuition", "Loyalty"],
      growthAreas: ["Boundaries", "Self-protection", "Objectivity"],
      description: "Deeply intuitive and nurturing, you care for others with profound emotional intelligence.",
      detailedDescription: "Water element flows through you, providing psychic abilities and deep emotional understanding."
    },
    {
      sign: "Leo",
      symbol: "♌",
      element: "Fire",
      traits: ["Confident", "Generous", "Creative", "Dramatic"],
      strengths: ["Leadership", "Creativity", "Warmth"],
      growthAreas: ["Humility", "Listening", "Sharing spotlight"],
      description: "Radiant and generous, you light up rooms with your natural charisma and creativity.",
      detailedDescription: "Fire element burns bright within you, inspiring others and fueling your creative expression."
    },
    {
      sign: "Virgo",
      symbol: "♍",
      element: "Earth",
      traits: ["Analytical", "Practical", "Helpful", "Perfectionist"],
      strengths: ["Attention to detail", "Service", "Organization"],
      growthAreas: ["Self-acceptance", "Perfectionism", "Criticism"],
      description: "Meticulous and helpful, you excel at improving systems and caring for others' needs.",
      detailedDescription: "Earth element grounds your analytical nature, helping you create order and healing in the world."
    },
    {
      sign: "Libra",
      symbol: "♎",
      element: "Air",
      traits: ["Diplomatic", "Harmonious", "Fair", "Social"],
      strengths: ["Balance", "Diplomacy", "Aesthetics"],
      growthAreas: ["Decisiveness", "Self-advocacy", "Conflict resolution"],
      description: "Graceful and diplomatic, you seek beauty and harmony in all relationships.",
      detailedDescription: "Air element helps you see all sides of situations and create balance through understanding."
    },
    {
      sign: "Scorpio",
      symbol: "♏",
      element: "Water",
      traits: ["Intense", "Passionate", "Mysterious", "Transformative"],
      strengths: ["Depth", "Intuition", "Transformation"],
      growthAreas: ["Trust", "Vulnerability", "Letting go"],
      description: "Powerful and transformative, you dive deep into life's mysteries with intense passion.",
      detailedDescription: "Water element runs deep in you, providing psychic abilities and power to transform others."
    },
    {
      sign: "Sagittarius",
      symbol: "♐",
      element: "Fire",
      traits: ["Adventurous", "Philosophical", "Free-spirited", "Optimistic"],
      strengths: ["Wisdom", "Adventure", "Teaching"],
      growthAreas: ["Commitment", "Details", "Sensitivity"],
      description: "Free-spirited and wise, you seek truth and adventure in philosophical exploration.",
      detailedDescription: "Fire element fuels your quest for knowledge and drives you to expand horizons."
    },
    {
      sign: "Capricorn",
      symbol: "♑",
      element: "Earth",
      traits: ["Ambitious", "Disciplined", "Responsible", "Traditional"],
      strengths: ["Perseverance", "Leadership", "Tradition"],
      growthAreas: ["Flexibility", "Playfulness", "Emotional expression"],
      description: "Ambitious and disciplined, you climb mountains with steady determination and wisdom.",
      detailedDescription: "Earth element provides you with unshakeable foundations and the power to achieve lasting success."
    },
    {
      sign: "Aquarius",
      symbol: "♒",
      element: "Air",
      traits: ["Independent", "Humanitarian", "Innovative", "Eccentric"],
      strengths: ["Innovation", "Friendship", "Vision"],
      growthAreas: ["Emotion", "Intimacy", "Tradition"],
      description: "Visionary and humanitarian, you innovate for the collective good with unique perspective.",
      detailedDescription: "Air element connects you to collective consciousness and fuels your revolutionary spirit."
    },
    {
      sign: "Pisces",
      symbol: "♓",
      element: "Water",
      traits: ["Intuitive", "Compassionate", "Artistic", "Spiritual"],
      strengths: ["Deep intuition", "Creative vision", "Emotional intelligence"],
      growthAreas: ["Boundary setting", "Practical decisions", "Self-care habits"],
      description: "Intuitive, compassionate, artistic, and deeply empathetic. You feel everything deeply and possess natural healing abilities.",
      detailedDescription: "Water Element: Your emotions flow like water, adapting to any container while maintaining your essential nature. This gives you incredible empathy and healing abilities."
    }
  ] as ZodiacSign[],

  chinese: {
    animals: [
      {
        name: "Rat",
        traits: ["Intelligent", "Adaptable", "Charming"],
        characteristics: {
          positive: ["Quick wit", "Resourcefulness"],
          challenges: ["Opportunistic", "Restless"]
        },
        description: "Clever and adaptable, you navigate life with intelligence and charm."
      },
      {
        name: "Ox",
        traits: ["Reliable", "Strong", "Determined"],
        characteristics: {
          positive: ["Dependable", "Hardworking"],
          challenges: ["Stubborn", "Slow to change"]
        },
        description: "Strong and reliable, you build lasting success through steady effort."
      },
      {
        name: "Tiger",
        traits: ["Brave", "Competitive", "Confident"],
        characteristics: {
          positive: ["Courage", "Leadership"],
          challenges: ["Impulsive", "Aggressive"]
        },
        description: "Bold and brave, you lead with courage and natural authority."
      },
      {
        name: "Rabbit",
        traits: ["Gentle", "Quiet", "Elegant"],
        characteristics: {
          positive: ["Diplomatic", "Peaceful"],
          challenges: ["Avoidant", "Overly cautious"]
        },
        description: "Gentle and diplomatic, you bring peace and elegance to all situations."
      },
      {
        name: "Dragon",
        traits: ["Energetic", "Intelligent", "Confident"],
        characteristics: {
          positive: ["Charismatic", "Ambitious"],
          challenges: ["Arrogant", "Impatient"]
        },
        description: "Powerful and charismatic, you inspire others with your natural magnetism."
      },
      {
        name: "Snake",
        traits: ["Wise", "Enigmatic", "Intuitive"],
        characteristics: {
          positive: ["Deep wisdom", "Intuition"],
          challenges: ["Secretive", "Jealous"]
        },
        description: "Wise and mysterious, you possess deep intuition and ancient wisdom."
      },
      {
        name: "Horse",
        traits: ["Energetic", "Independent", "Free-spirited"],
        characteristics: {
          positive: ["Freedom-loving", "Energetic"],
          challenges: ["Impatient", "Selfish"]
        },
        description: "Free-spirited and energetic, you gallop through life with independence."
      },
      {
        name: "Goat",
        traits: ["Gentle", "Mild", "Sympathetic"],
        characteristics: {
          positive: ["Artistic", "Compassionate"],
          challenges: ["Pessimistic", "Disorganized"]
        },
        description: "Gentle and artistic, you create beauty and bring compassion to the world."
      },
      {
        name: "Monkey",
        traits: ["Witty", "Intelligent", "Curious"],
        characteristics: {
          positive: ["Clever", "Innovative"],
          challenges: ["Mischievous", "Restless"]
        },
        description: "Clever and playful, you solve problems with wit and innovation."
      },
      {
        name: "Rooster",
        traits: ["Observant", "Hardworking", "Courageous"],
        characteristics: {
          positive: ["Confident", "Organized"],
          challenges: ["Boastful", "Critical"]
        },
        description: "Confident and observant, you herald new beginnings with courage."
      },
      {
        name: "Dog",
        traits: ["Loyal", "Responsible", "Reliable"],
        characteristics: {
          positive: ["Honest", "Faithful"],
          challenges: ["Pessimistic", "Anxious"]
        },
        description: "Loyal and faithful, you protect and serve others with unwavering dedication."
      },
      {
        name: "Pig",
        traits: ["Honest", "Generous", "Reliable"],
        characteristics: {
          positive: ["Honest & loyal", "Generous nature"],
          challenges: ["Overly trusting", "Material focus"]
        },
        description: "Generous, optimistic, and growth-oriented. You approach life with kindness and have a natural ability to nurture others and ideas."
      }
    ],
    elements: [
      {
        name: "Wood",
        description: "Wood energy gives you flexibility, creativity, and the ability to grow through challenges. You're naturally innovative and can bend without breaking."
      },
      {
        name: "Fire",
        description: "Fire energy provides passion, leadership, and dynamic action. You inspire others and create transformative change."
      },
      {
        name: "Earth",
        description: "Earth energy grounds you with stability, practicality, and nurturing abilities. You build lasting foundations."
      },
      {
        name: "Metal",
        description: "Metal energy gives you structure, determination, and the ability to cut through illusions to reach truth."
      },
      {
        name: "Water",
        description: "Water energy flows with adaptability, intuition, and emotional depth. You navigate life with fluid wisdom."
      }
    ]
  },

  vedic: [
    {
      nakshatra: "Ashwini",
      number: 1,
      meaning: "The Horsemen",
      ruler: "Ketu",
      moonSign: "Aries",
      spiritualTraits: ["Healing abilities", "Swift action", "Pioneer spirit"],
      description: "You possess natural healing abilities and pioneer new paths with swift, decisive action.",
      planetaryInfluences: [
        { planet: "Ketu", influence: "Spiritual liberation" },
        { planet: "Mars", influence: "Action and courage" }
      ]
    },
    {
      nakshatra: "Bharani",
      number: 2,
      meaning: "The Bearer",
      ruler: "Venus",
      moonSign: "Aries",
      spiritualTraits: ["Transformation", "Creative power", "Life-death mysteries"],
      description: "You understand life's transformative processes and hold creative power over manifestation.",
      planetaryInfluences: [
        { planet: "Venus", influence: "Beauty and creativity" },
        { planet: "Mars", influence: "Transformation energy" }
      ]
    },
    {
      nakshatra: "Krittika",
      number: 3,
      meaning: "The Cutter",
      ruler: "Sun",
      moonSign: "Aries/Taurus",
      spiritualTraits: ["Purification", "Sharp insight", "Burning away illusions"],
      description: "You have the ability to cut through illusions and purify situations with sharp insight.",
      planetaryInfluences: [
        { planet: "Sun", influence: "Leadership and clarity" },
        { planet: "Agni", influence: "Transformation through fire" }
      ]
    },
    {
      nakshatra: "Rohini",
      number: 4,
      meaning: "The Red One",
      ruler: "Moon",
      moonSign: "Taurus",
      spiritualTraits: ["Growth", "Beauty", "Material manifestation"],
      description: "You excel at creating beauty and manifesting abundance in the material world.",
      planetaryInfluences: [
        { planet: "Moon", influence: "Emotional nurturing" },
        { planet: "Brahma", influence: "Creative power" }
      ]
    },
    {
      nakshatra: "Mrigashira",
      number: 5,
      meaning: "The Deer's Head",
      ruler: "Mars",
      moonSign: "Taurus/Gemini",
      spiritualTraits: ["Seeking", "Curiosity", "Gentle pursuit"],
      description: "You are a gentle seeker who pursues knowledge and truth with curiosity and grace.",
      planetaryInfluences: [
        { planet: "Mars", influence: "Active seeking" },
        { planet: "Soma", influence: "Divine nectar of knowledge" }
      ]
    },
    {
      nakshatra: "Ardra",
      number: 6,
      meaning: "The Moist One",
      ruler: "Rahu",
      moonSign: "Gemini",
      spiritualTraits: ["Transformation", "Storms", "Renewal"],
      description: "You bring necessary storms and transformation that clear the way for new growth.",
      planetaryInfluences: [
        { planet: "Rahu", influence: "Revolutionary change" },
        { planet: "Rudra", influence: "Destructive transformation" }
      ]
    },
    {
      nakshatra: "Punarvasu",
      number: 7,
      meaning: "The Returner",
      ruler: "Jupiter",
      moonSign: "Gemini/Cancer",
      spiritualTraits: ["Renewal", "Optimism", "Return to source"],
      description: "You have the gift of renewal and can help others return to their true nature.",
      planetaryInfluences: [
        { planet: "Jupiter", influence: "Wisdom and expansion" },
        { planet: "Aditi", influence: "Infinite mother energy" }
      ]
    },
    {
      nakshatra: "Pushya",
      number: 8,
      meaning: "The Nourisher",
      ruler: "Saturn",
      moonSign: "Cancer",
      spiritualTraits: ["Nourishment", "Growth", "Spiritual teacher"],
      description: "You are a natural nourisher and spiritual teacher who helps others grow.",
      planetaryInfluences: [
        { planet: "Saturn", influence: "Disciplined nourishment" },
        { planet: "Brihaspati", influence: "Spiritual wisdom" }
      ]
    },
    {
      nakshatra: "Ashlesha",
      number: 9,
      meaning: "The Embrace",
      ruler: "Mercury",
      moonSign: "Cancer",
      spiritualTraits: ["Hypnotic power", "Wisdom", "Coiled energy"],
      description: "You possess hypnotic wisdom and the ability to embrace and transform through your influence.",
      planetaryInfluences: [
        { planet: "Mercury", influence: "Serpent wisdom" },
        { planet: "Nagas", influence: "Coiled kundalini energy" }
      ]
    },
    {
      nakshatra: "Magha",
      number: 10,
      meaning: "The Mighty One",
      ruler: "Ketu",
      moonSign: "Leo",
      spiritualTraits: ["Royal power", "Ancestral connection", "Leadership"],
      description: "You carry royal energy and connect strongly with ancestral wisdom and leadership.",
      planetaryInfluences: [
        { planet: "Ketu", influence: "Past life karma" },
        { planet: "Pitrs", influence: "Ancestral blessings" }
      ]
    },
    {
      nakshatra: "Purva Phalguni",
      number: 11,
      meaning: "The Former Red One",
      ruler: "Venus",
      moonSign: "Leo",
      spiritualTraits: ["Creativity", "Pleasure", "Artistic expression"],
      description: "You bring beauty and creative pleasure to the world through artistic expression.",
      planetaryInfluences: [
        { planet: "Venus", influence: "Beauty and harmony" },
        { planet: "Bhaga", influence: "Good fortune and pleasure" }
      ]
    },
    {
      nakshatra: "Uttara Phalguni",
      number: 12,
      meaning: "The Latter Red One",
      ruler: "Sun",
      moonSign: "Leo/Virgo",
      spiritualTraits: ["Organization", "Service", "Reliable support"],
      description: "You provide organized support and reliable service to help others achieve their goals.",
      planetaryInfluences: [
        { planet: "Sun", influence: "Leadership through service" },
        { planet: "Aryaman", influence: "Noble friendship" }
      ]
    },
    {
      nakshatra: "Hasta",
      number: 13,
      meaning: "The Hand",
      ruler: "Moon",
      moonSign: "Virgo",
      spiritualTraits: ["Skillful hands", "Healing touch", "Dexterity"],
      description: "You have skillful hands and healing touch, able to manifest through dexterous work.",
      planetaryInfluences: [
        { planet: "Moon", influence: "Intuitive skill" },
        { planet: "Savitar", influence: "Divine craftsmanship" }
      ]
    },
    {
      nakshatra: "Chitra",
      number: 14,
      meaning: "The Bright One",
      ruler: "Mars",
      moonSign: "Virgo/Libra",
      spiritualTraits: ["Artistic creation", "Beauty", "Divine architect"],
      description: "You are a divine architect who creates beauty and bright artistic works.",
      planetaryInfluences: [
        { planet: "Mars", influence: "Creative energy" },
        { planet: "Tvastar", influence: "Divine architect" }
      ]
    },
    {
      nakshatra: "Swati",
      number: 15,
      meaning: "The Independent One",
      ruler: "Rahu",
      moonSign: "Libra",
      spiritualTraits: ["Independence", "Movement", "Flexibility"],
      description: "You value independence and move through life with flexible adaptation.",
      planetaryInfluences: [
        { planet: "Rahu", influence: "Independent thinking" },
        { planet: "Vayu", influence: "Wind-like movement" }
      ]
    },
    {
      nakshatra: "Vishakha",
      number: 16,
      meaning: "The Forked One",
      ruler: "Jupiter",
      moonSign: "Libra/Scorpio",
      spiritualTraits: ["Determination", "Goal achievement", "Forked path"],
      description: "You have strong determination to achieve goals despite facing forked paths and choices.",
      planetaryInfluences: [
        { planet: "Jupiter", influence: "Wisdom in choices" },
        { planet: "Indra-Agni", influence: "Power and transformation" }
      ]
    },
    {
      nakshatra: "Anuradha",
      number: 17,
      meaning: "The Following Star",
      ruler: "Saturn",
      moonSign: "Scorpio",
      spiritualTraits: ["Devotion", "Friendship", "Balance"],
      description: "You bring devotion and balance to friendships and relationships.",
      planetaryInfluences: [
        { planet: "Saturn", influence: "Disciplined devotion" },
        { planet: "Mitra", influence: "Divine friendship" }
      ]
    },
    {
      nakshatra: "Jyeshtha",
      number: 18,
      meaning: "The Eldest",
      ruler: "Mercury",
      moonSign: "Scorpio",
      spiritualTraits: ["Protection", "Responsibility", "Elder wisdom"],
      description: "You carry elder wisdom and feel responsibility to protect and guide others.",
      planetaryInfluences: [
        { planet: "Mercury", influence: "Protective communication" },
        { planet: "Indra", influence: "Leadership and protection" }
      ]
    },
    {
      nakshatra: "Mula",
      number: 19,
      meaning: "The Root",
      ruler: "Ketu",
      moonSign: "Sagittarius",
      spiritualTraits: ["Investigation", "Destruction", "Getting to roots"],
      description: "You investigate deeply and destroy what doesn't serve to get to the root truth.",
      planetaryInfluences: [
        { planet: "Ketu", influence: "Spiritual investigation" },
        { planet: "Nirriti", influence: "Destruction of falsehood" }
      ]
    },
    {
      nakshatra: "Purva Ashadha",
      number: 20,
      meaning: "The Former Invincible One",
      ruler: "Venus",
      moonSign: "Sagittarius",
      spiritualTraits: ["Invincibility", "Purification", "Early victory"],
      description: "You possess invincible energy and the ability to purify through early victories.",
      planetaryInfluences: [
        { planet: "Venus", influence: "Invincible beauty" },
        { planet: "Apas", influence: "Water purification" }
      ]
    },
    {
      nakshatra: "Uttara Ashadha",
      number: 21,
      meaning: "The Latter Invincible One",
      ruler: "Sun",
      moonSign: "Sagittarius/Capricorn",
      spiritualTraits: ["Final victory", "Leadership", "Universal good"],
      description: "You achieve final victory through leadership dedicated to universal good.",
      planetaryInfluences: [
        { planet: "Sun", influence: "Universal leadership" },
        { planet: "Vishvadevas", influence: "Universal gods blessing" }
      ]
    },
    {
      nakshatra: "Shravana",
      number: 22,
      meaning: "The Hearing",
      ruler: "Moon",
      moonSign: "Capricorn",
      spiritualTraits: ["Listening", "Learning", "Communication"],
      description: "You excel at listening and learning, becoming a conduit for higher communication.",
      planetaryInfluences: [
        { planet: "Moon", influence: "Intuitive listening" },
        { planet: "Vishnu", influence: "Preservation through knowledge" }
      ]
    },
    {
      nakshatra: "Dhanishta",
      number: 23,
      meaning: "The Wealthiest",
      ruler: "Mars",
      moonSign: "Capricorn/Aquarius",
      spiritualTraits: ["Wealth", "Music", "Fame"],
      description: "You attract wealth and fame through musical and rhythmic abilities.",
      planetaryInfluences: [
        { planet: "Mars", influence: "Dynamic wealth creation" },
        { planet: "Ashta Vasus", influence: "Eight types of abundance" }
      ]
    },
    {
      nakshatra: "Shatabhisha",
      number: 24,
      meaning: "The Hundred Healers",
      ruler: "Rahu",
      moonSign: "Aquarius",
      spiritualTraits: ["Healing", "Mystery", "Independence"],
      description: "You possess hundred forms of healing and work with mysterious independent energy.",
      planetaryInfluences: [
        { planet: "Rahu", influence: "Innovative healing" },
        { planet: "Varuna", influence: "Cosmic waters of healing" }
      ]
    },
    {
      nakshatra: "Purva Bhadrapada",
      number: 25,
      meaning: "The Former Lucky Feet",
      ruler: "Jupiter",
      moonSign: "Aquarius/Pisces",
      spiritualTraits: ["Transformation", "Sacrifice", "Spiritual fire"],
      description: "You transform through sacrifice and carry spiritual fire for purification.",
      planetaryInfluences: [
        { planet: "Jupiter", influence: "Wise transformation" },
        { planet: "Ajaikapat", influence: "One-footed spiritual fire" }
      ]
    },
    {
      nakshatra: "Uttara Bhadrapada",
      number: 26,
      meaning: "The Latter Lucky Feet",
      ruler: "Saturn",
      moonSign: "Pisces",
      spiritualTraits: ["Depth", "Kundalini", "Cosmic serpent"],
      description: "You access cosmic depths and work with kundalini serpent energy.",
      planetaryInfluences: [
        { planet: "Saturn", influence: "Deep spiritual discipline" },
        { planet: "Ahir Budhanya", influence: "Cosmic serpent of depths" }
      ]
    },
    {
      nakshatra: "Revati",
      number: 27,
      meaning: "The Wealthy",
      ruler: "Mercury",
      moonSign: "Pisces",
      spiritualTraits: ["Completion", "Guidance", "Spiritual wealth"],
      description: "You guide others to completion and fulfillment. Your soul carries the wisdom of endings that lead to new beginnings.",
      planetaryInfluences: [
        { planet: "Mercury", influence: "Communication, wisdom" },
        { planet: "Pushan", influence: "Protective guidance" }
      ]
    }
  ] as VedicSign[],

  mayan: [
    {
      daySign: "Imix",
      number: 1,
      meaning: "Crocodile",
      spiritualQualities: ["Nurturing", "Material foundation", "Primal energy"],
      description: "You provide nurturing foundation and primal creative energy to all endeavors.",
      sacredGifts: [
        { gift: "Creation", description: "Ability to birth new ideas and projects" },
        { gift: "Nurturing", description: "Natural caretaker and provider of foundation" }
      ]
    },
    {
      daySign: "Ik",
      number: 2,
      meaning: "Wind",
      spiritualQualities: ["Communication", "Spirit", "Divine breath"],
      description: "You carry divine messages and inspiration through communication and spiritual connection.",
      sacredGifts: [
        { gift: "Communication", description: "Channel for divine messages and wisdom" },
        { gift: "Inspiration", description: "Ability to breathe life into ideas" }
      ]
    },
    {
      daySign: "Ak",
      number: 13,
      meaning: "Reed",
      spiritualQualities: ["Protection", "Guidance", "Spiritual warrior"],
      description: "You're a natural protector and guide, with the ability to help others navigate through life's challenges with wisdom and strength.",
      sacredGifts: [
        { gift: "Protection", description: "Natural guardian energy that shields others from harm" },
        { gift: "Growth", description: "Ability to help others grow and reach their potential" }
      ]
    }
  ] as MayanSign[],

  celtic: [
    {
      tree: "Birch",
      dateRange: "December 24 - January 20",
      meaning: "The Achiever",
      lunarConnection: "New Moon energy brings fresh starts and new beginnings to your spiritual practice.",
      gifts: ["Vision", "Connection", "Guidance", "Wisdom"],
      description: "You embody new beginnings and have the ability to start fresh in any situation.",
      celticWisdom: "Like the birch tree, you are resilient and can thrive in harsh conditions while maintaining your grace."
    },
    {
      tree: "Rowan",
      dateRange: "January 21 - February 17",
      meaning: "The Thinker",
      lunarConnection: "Waxing Moon energy enhances your intuitive and protective abilities.",
      gifts: ["Protection", "Intuition", "Wisdom", "Vision"],
      description: "You possess natural protective abilities and can ward off negative influences.",
      celticWisdom: "The rowan tree's berries were used for protection - you naturally shield others from harm."
    },
    {
      tree: "Ash",
      dateRange: "February 18 - March 17",
      meaning: "The Enchanter",
      lunarConnection: "Your tree's energy waxes and wanes with the moon cycles, giving you natural intuition about timing and rhythms of life.",
      gifts: ["Vision", "Connection", "Guidance", "Wisdom"],
      description: "Connected to the World Tree Yggdrasil, you bridge different worlds and possess deep spiritual insight and connection to universal wisdom.",
      celticWisdom: "As the World Tree, you connect heaven and earth, serving as a bridge between different realms of existence."
    },
    {
      tree: "Alder",
      dateRange: "March 18 - April 14",
      meaning: "The Trailblazer",
      lunarConnection: "Spring energy flows through you, bringing renewal and fresh perspectives.",
      gifts: ["Guidance", "Protection", "Intuition", "Courage"],
      description: "You are a natural pathfinder who helps others navigate new territories.",
      celticWisdom: "Like the alder by the water, you provide guidance and protection on journeys."
    },
    {
      tree: "Willow",
      dateRange: "April 15 - May 12",
      meaning: "The Observer",
      lunarConnection: "Moon energy enhances your intuitive and psychic abilities.",
      gifts: ["Intuition", "Healing", "Flexibility", "Wisdom"],
      description: "You possess deep intuitive wisdom and natural healing abilities.",
      celticWisdom: "The willow bends but does not break, teaching flexibility and resilience."
    },
    {
      tree: "Hawthorn",
      dateRange: "May 13 - June 9",
      meaning: "The Illusionist",
      lunarConnection: "Your connection to fairy realm energy brings magical perspectives.",
      gifts: ["Magic", "Protection", "Creativity", "Hope"],
      description: "You understand the mystical and can work with magical energies.",
      celticWisdom: "Sacred to the fairies, you bridge the magical and mundane worlds."
    },
    {
      tree: "Oak",
      dateRange: "June 10 - July 7",
      meaning: "The Stabilizer",
      lunarConnection: "Steady lunar energy provides strength and endurance.",
      gifts: ["Strength", "Protection", "Leadership", "Wisdom"],
      description: "You are a natural leader with strength and wisdom to guide others.",
      celticWisdom: "The mighty oak stands strong through all seasons, embodying endurance."
    },
    {
      tree: "Holly",
      dateRange: "July 8 - August 4",
      meaning: "The Ruler",
      lunarConnection: "Solar energy during your season enhances leadership abilities.",
      gifts: ["Leadership", "Protection", "Courage", "Honor"],
      description: "You possess natural authority and the ability to protect what matters.",
      celticWisdom: "Holly remains evergreen, symbolizing eternal strength and protection."
    },
    {
      tree: "Hazel",
      dateRange: "August 5 - September 1",
      meaning: "The Knower",
      lunarConnection: "Harvest moon energy brings wisdom and knowledge gathering.",
      gifts: ["Wisdom", "Knowledge", "Intuition", "Truth"],
      description: "You are a natural seeker of wisdom and truth.",
      celticWisdom: "The hazel nut contains wisdom - you help others find inner knowledge."
    },
    {
      tree: "Vine",
      dateRange: "September 2 - September 29",
      meaning: "The Equalizer",
      lunarConnection: "Equinox energy brings balance and harmony to your nature.",
      gifts: ["Balance", "Growth", "Transformation", "Celebration"],
      description: "You understand balance and help others find equilibrium in life.",
      celticWisdom: "The vine grows by adapting and finding support, teaching flexibility."
    },
    {
      tree: "Ivy",
      dateRange: "September 30 - October 27",
      meaning: "The Survivor",
      lunarConnection: "Autumn energy enhances your ability to thrive in any condition.",
      gifts: ["Resilience", "Loyalty", "Determination", "Growth"],
      description: "You possess remarkable resilience and loyalty.",
      celticWisdom: "Ivy grows anywhere and clings faithfully, showing true devotion."
    },
    {
      tree: "Reed",
      dateRange: "October 28 - November 24",
      meaning: "The Inquisitor",
      lunarConnection: "Dark moon energy enhances your ability to see hidden truths.",
      gifts: ["Truth", "Protection", "Secrets", "Guidance"],
      description: "You can see through deception and uncover hidden truths.",
      celticWisdom: "Reeds bend with the wind but remain rooted, teaching adaptability with purpose."
    },
    {
      tree: "Elder",
      dateRange: "November 25 - December 23",
      meaning: "The Seeker",
      lunarConnection: "Winter energy brings deep introspection and spiritual seeking.",
      gifts: ["Wisdom", "Transformation", "Regeneration", "Magic"],
      description: "You seek transformation and regeneration through spiritual wisdom.",
      celticWisdom: "The elder renews itself completely, teaching the power of transformation."
    }
  ] as CelticSign[],
  
  arabic: [
    {
      mansion: "The Two Signs",
      number: 1,
      arabicName: "Al-Sharatain",
      zodiacRange: "0° Aries - 12° 51' Aries",
      keyStar: "Sheratan",
      meaning: "New Beginnings",
      spiritualQualities: ["Courage", "Initiative", "Protection", "Healing"],
      description: "The first lunar mansion brings the energy of fresh starts and bold initiatives.",
      magicalUses: [
        { use: "Journeys", description: "Favorable for starting new journeys and adventures" },
        { use: "Medicine", description: "Good for taking medicine and healing work" },
        { use: "Protection", description: "Offers protection against imprisonment and discord" }
      ]
    },
    {
      mansion: "The Belly",
      number: 2,
      arabicName: "Al-Butain",
      zodiacRange: "12° 51' Aries - 25° 42' Aries",
      keyStar: "—",
      meaning: "Reconciliation",
      spiritualQualities: ["Peace", "Harmony", "Diplomacy", "Leadership"],
      description: "This mansion brings energy for resolving conflicts and finding common ground.",
      magicalUses: [
        { use: "Reconciliation", description: "Excellent for making peace and resolving disputes" },
        { use: "Favor", description: "Gain favor from rulers and authorities" },
        { use: "Healing", description: "Good for taking medicine and health matters" }
      ]
    },
    {
      mansion: "The Pleiades",
      number: 3,
      arabicName: "Al-Thurayya",
      zodiacRange: "25° 42' Aries - 8° 34' Taurus",
      keyStar: "Alcyone",
      meaning: "Abundance",
      spiritualQualities: ["Prosperity", "Success", "Achievement", "Fertility"],
      description: "Known as the gateway of abundance, this mansion attracts all good things.",
      magicalUses: [
        { use: "Acquisition", description: "Attracts wealth and good fortune" },
        { use: "Travel", description: "Favorable for journeys and exploration" },
        { use: "Alchemy", description: "Good for transformation and spiritual work" }
      ]
    },
    {
      mansion: "The Follower",
      number: 4,
      arabicName: "Aldebaran",
      zodiacRange: "8° 34' Taurus - 21° 25' Taurus",
      keyStar: "Aldebaran",
      meaning: "Foundation",
      spiritualQualities: ["Stability", "Building", "Investment", "Strength"],
      description: "This mansion provides the energy for creating solid foundations and lasting structures.",
      magicalUses: [
        { use: "Building", description: "Excellent for construction and foundation work" },
        { use: "Employment", description: "Good for securing jobs and positions" },
        { use: "Investment", description: "Favorable for long-term financial planning" }
      ]
    },
    {
      mansion: "The White Spot",
      number: 5,
      arabicName: "Al-Haq'ah",
      zodiacRange: "21° 25' Taurus - 4° 17' Gemini",
      keyStar: "—",
      meaning: "Purity",
      spiritualQualities: ["Clarity", "Vision", "Insight", "Truth"],
      description: "This mansion brings clarity and helps reveal hidden truths.",
      magicalUses: [
        { use: "Favor", description: "Gain favor and goodwill from others" },
        { use: "Return", description: "Good for safe return from journeys" },
        { use: "Instruction", description: "Excellent for teaching and learning" }
      ]
    },
    {
      mansion: "The Brand",
      number: 6,
      arabicName: "Al-Han'ah",
      zodiacRange: "4° 17' Gemini - 17° 09' Gemini",
      keyStar: "—",
      meaning: "Love & Connection",
      spiritualQualities: ["Love", "Bonds", "Relationship", "Unity"],
      description: "This mansion governs the realm of love, relationships, and emotional bonds.",
      magicalUses: [
        { use: "Love", description: "Attracts romantic love and partnerships" },
        { use: "Hunting", description: "Successful for pursuing goals" },
        { use: "Favor", description: "Gains benevolence from others" }
      ]
    },
    {
      mansion: "The Forearm",
      number: 7,
      arabicName: "Al-Dhira",
      zodiacRange: "17° 09' Gemini - 0° Cancer",
      keyStar: "Castor, Pollux",
      meaning: "Spiritual Quest",
      spiritualQualities: ["Wisdom", "Meditation", "Inspiration", "Reconciliation"],
      description: "This mansion opens pathways to spiritual wisdom and mystical understanding.",
      magicalUses: [
        { use: "Meditation", description: "Enhances spiritual retreats and meditation" },
        { use: "Reconciliation", description: "Brings peace between conflicting parties" },
        { use: "Profit", description: "Good for commerce and gain" }
      ]
    },
    {
      mansion: "The Gap",
      number: 8,
      arabicName: "Al-Nathrah",
      zodiacRange: "0° Cancer - 12° 51' Cancer",
      keyStar: "Praesepe",
      meaning: "Nurturing",
      spiritualQualities: ["Care", "Protection", "Growth", "Nourishment"],
      description: "This mansion provides nurturing energy for growth and development.",
      magicalUses: [
        { use: "Love", description: "Strengthens bonds and relationships" },
        { use: "Friendship", description: "Cultivates lasting friendships" },
        { use: "Travel", description: "Protection during journeys" }
      ]
    },
    {
      mansion: "The Glance",
      number: 9,
      arabicName: "Al-Tarf",
      zodiacRange: "12° 51' Cancer - 25° 42' Cancer",
      keyStar: "—",
      meaning: "Vision",
      spiritualQualities: ["Insight", "Perception", "Awareness", "Caution"],
      description: "This mansion enhances perception and helps see potential dangers.",
      magicalUses: [
        { use: "Harvest", description: "Good for reaping what was sown" },
        { use: "Favor", description: "Gain goodwill from travelers" },
        { use: "Health", description: "Recovery and healing" }
      ]
    },
    {
      mansion: "The Forehead",
      number: 10,
      arabicName: "Al-Jabha",
      zodiacRange: "25° 42' Cancer - 8° 34' Leo",
      keyStar: "Regulus",
      meaning: "Royal Power",
      spiritualQualities: ["Authority", "Love", "Healing", "Creativity"],
      description: "This mansion channels royal energy for leadership and creative expression.",
      magicalUses: [
        { use: "Love", description: "Powerful for marriage and partnerships" },
        { use: "Healing", description: "Excellent for health and childbirth" },
        { use: "Building", description: "Good for creating lasting structures" }
      ]
    },
    {
      mansion: "The Mane",
      number: 11,
      arabicName: "Al-Zubra",
      zodiacRange: "8° 34' Leo - 21° 25' Leo",
      keyStar: "Zosma",
      meaning: "Strength",
      spiritualQualities: ["Power", "Victory", "Courage", "Achievement"],
      description: "This mansion brings the strength and courage needed for conquest.",
      magicalUses: [
        { use: "Victory", description: "Success in battle and competition" },
        { use: "Authority", description: "Gain positions of power" },
        { use: "Wealth", description: "Attract material prosperity" }
      ]
    },
    {
      mansion: "The Changer",
      number: 12,
      arabicName: "Al-Sarfa",
      zodiacRange: "21° 25' Leo - 4° 17' Virgo",
      keyStar: "—",
      meaning: "Transformation",
      spiritualQualities: ["Change", "Release", "Letting Go", "Renewal"],
      description: "This mansion governs transitions and the release of old patterns.",
      magicalUses: [
        { use: "Harvest", description: "Reaping rewards of labor" },
        { use: "Partnership", description: "Creating business alliances" },
        { use: "Freedom", description: "Liberation from captivity" }
      ]
    },
    {
      mansion: "The Howling Dogs",
      number: 13,
      arabicName: "Al-Awwa",
      zodiacRange: "4° 17' Virgo - 17° 09' Virgo",
      keyStar: "—",
      meaning: "Service",
      spiritualQualities: ["Devotion", "Duty", "Service", "Protection"],
      description: "This mansion embodies the spirit of service and protective devotion.",
      magicalUses: [
        { use: "Travel", description: "Safe journeys and voyages" },
        { use: "Harvest", description: "Successful gathering of crops" },
        { use: "Partnership", description: "Strong business relationships" }
      ]
    },
    {
      mansion: "The Unarmed",
      number: 14,
      arabicName: "Al-Simak",
      zodiacRange: "17° 09' Virgo - 0° Libra",
      keyStar: "Spica",
      meaning: "Peace",
      spiritualQualities: ["Harmony", "Balance", "Trade", "Navigation"],
      description: "This mansion brings peaceful energy favorable for cooperation and trade.",
      magicalUses: [
        { use: "Sailing", description: "Excellent for maritime activities" },
        { use: "Partnership", description: "Successful collaborations" },
        { use: "Love", description: "Lasting marital bonds" }
      ]
    },
    {
      mansion: "The Covering",
      number: 15,
      arabicName: "Al-Ghafr",
      zodiacRange: "0° Libra - 12° 51' Libra",
      keyStar: "—",
      meaning: "Friendship",
      spiritualQualities: ["Connection", "Alliance", "Trust", "Goodwill"],
      description: "This mansion cultivates lasting friendships and beneficial relationships.",
      magicalUses: [
        { use: "Friendship", description: "Creating enduring bonds" },
        { use: "Travel", description: "Safe journeys with companions" },
        { use: "Harvesting", description: "Gathering fruits of labor" }
      ]
    },
    {
      mansion: "The Claws",
      number: 16,
      arabicName: "Al-Zubana",
      zodiacRange: "12° 51' Libra - 25° 42' Libra",
      keyStar: "—",
      meaning: "Balance",
      spiritualQualities: ["Justice", "Fairness", "Profit", "Commerce"],
      description: "This mansion brings energy for fair trade and balanced exchanges.",
      magicalUses: [
        { use: "Commerce", description: "Success in buying and selling" },
        { use: "Healing", description: "Recovery from illness" },
        { use: "Protection", description: "Defense against obstacles" }
      ]
    },
    {
      mansion: "The Crown",
      number: 17,
      arabicName: "Al-Iklil",
      zodiacRange: "25° 42' Libra - 8° 34' Scorpio",
      keyStar: "—",
      meaning: "Achievement",
      spiritualQualities: ["Success", "Honor", "Cooperation", "Security"],
      description: "This mansion crowns efforts with success and recognition.",
      magicalUses: [
        { use: "Protection", description: "Guards against thieves" },
        { use: "Teamwork", description: "Successful group efforts" },
        { use: "Love", description: "Strengthening relationships" }
      ]
    },
    {
      mansion: "The Heart",
      number: 18,
      arabicName: "Al-Qalb",
      zodiacRange: "8° 34' Scorpio - 21° 25' Scorpio",
      keyStar: "Antares",
      meaning: "Deep Emotion",
      spiritualQualities: ["Passion", "Healing", "Compassion", "Transformation"],
      description: "This mansion opens the heart to deep emotional healing and connection.",
      magicalUses: [
        { use: "Healing", description: "Powerful for emotional and physical healing" },
        { use: "Love", description: "Deep emotional bonds" },
        { use: "Protection", description: "Defense during conflict" }
      ]
    },
    {
      mansion: "The Sting",
      number: 19,
      arabicName: "Al-Shaulah",
      zodiacRange: "21° 25' Scorpio - 4° 17' Sagittarius",
      keyStar: "—",
      meaning: "Power",
      spiritualQualities: ["Force", "Defense", "Siege", "Obstruction"],
      description: "This mansion provides powerful defensive energy.",
      magicalUses: [
        { use: "Defense", description: "Protection in siege and conflict" },
        { use: "Obstruction", description: "Blocking harmful influences" },
        { use: "Harvest", description: "Gathering resources" }
      ]
    },
    {
      mansion: "The Ostriches",
      number: 20,
      arabicName: "Al-Na'am",
      zodiacRange: "4° 17' Sagittarius - 17° 08' Sagittarius",
      keyStar: "—",
      meaning: "Freedom",
      spiritualQualities: ["Liberation", "Speed", "Hunting", "Capture"],
      description: "This mansion brings swift energy for pursuit and capture.",
      magicalUses: [
        { use: "Hunting", description: "Success in pursuit of goals" },
        { use: "Domestication", description: "Taming wild energies" },
        { use: "Protection", description: "Defense of territory" }
      ]
    },
    {
      mansion: "The Wasteland",
      number: 21,
      arabicName: "Al-Baldah",
      zodiacRange: "17° 08' Sagittarius - 0° Capricorn",
      keyStar: "Albaldah",
      meaning: "Clearing",
      spiritualQualities: ["Destruction", "Clearing", "Healing", "Separation"],
      description: "This mansion clears away obstacles to make room for new growth.",
      magicalUses: [
        { use: "Healing", description: "Clearing illness and disease" },
        { use: "Building", description: "Creating new foundations" },
        { use: "Separation", description: "Ending unhealthy bonds" }
      ]
    },
    {
      mansion: "Fortune of the Slaughterer",
      number: 22,
      arabicName: "Sa'd al-Dhabih",
      zodiacRange: "0° Capricorn - 12° 51' Capricorn",
      keyStar: "—",
      meaning: "Sacrifice & Success",
      spiritualQualities: ["Victory", "Escape", "Profit", "Perseverance"],
      description: "This mansion brings success through sacrifice and perseverance.",
      magicalUses: [
        { use: "Siege", description: "Success in difficult situations" },
        { use: "Revenge", description: "Justice and vindication" },
        { use: "Divorce", description: "Ending partnerships" }
      ]
    },
    {
      mansion: "Fortune of the Swallower",
      number: 23,
      arabicName: "Sa'd Bula",
      zodiacRange: "12° 51' Capricorn - 25° 42' Capricorn",
      keyStar: "—",
      meaning: "Healing",
      spiritualQualities: ["Recovery", "Cure", "Freedom", "Unity"],
      description: "This mansion swallows illness and brings complete healing.",
      magicalUses: [
        { use: "Healing", description: "Powerful for curing diseases" },
        { use: "Partnership", description: "Creating lasting bonds" },
        { use: "Freedom", description: "Release from captivity" }
      ]
    },
    {
      mansion: "Fortune of Fortunes",
      number: 24,
      arabicName: "Sa'd al-Su'ud",
      zodiacRange: "25° 42' Capricorn - 8° 34' Aquarius",
      keyStar: "—",
      meaning: "Greatest Fortune",
      spiritualQualities: ["Success", "Victory", "Love", "Prosperity"],
      description: "The luckiest of all mansions, bringing abundant blessings.",
      magicalUses: [
        { use: "Marriage", description: "Perfect for weddings and unions" },
        { use: "Victory", description: "Success in all endeavors" },
        { use: "Friendship", description: "Lasting beneficial relationships" }
      ]
    },
    {
      mansion: "Fortune of Hidden Things",
      number: 25,
      arabicName: "Sa'd al-Akhbiyah",
      zodiacRange: "8° 34' Aquarius - 21° 25' Aquarius",
      keyStar: "—",
      meaning: "Secrets & Protection",
      spiritualQualities: ["Mystery", "Protection", "Healing", "Union"],
      description: "This mansion guards secrets and provides hidden protection.",
      magicalUses: [
        { use: "Healing", description: "Curing hidden ailments" },
        { use: "Siege", description: "Defense of fortifications" },
        { use: "Partnership", description: "Successful alliances" }
      ]
    },
    {
      mansion: "First Spout",
      number: 26,
      arabicName: "Al-Fargh al-Mukdim",
      zodiacRange: "21° 25' Aquarius - 4° 17' Pisces",
      keyStar: "—",
      meaning: "Flow of Blessings",
      spiritualQualities: ["Prosperity", "Love", "Unity", "Increase"],
      description: "This mansion pours forth blessings like water from a vessel.",
      magicalUses: [
        { use: "Love", description: "Union and marital harmony" },
        { use: "Victory", description: "Success over enemies" },
        { use: "Freedom", description: "Liberation from bondage" }
      ]
    },
    {
      mansion: "Second Spout",
      number: 27,
      arabicName: "Al-Fargh al-Thani",
      zodiacRange: "4° 17' Pisces - 17° 09' Pisces",
      keyStar: "—",
      meaning: "Continued Flow",
      spiritualQualities: ["Increase", "Prosperity", "Healing", "Safety"],
      description: "This mansion continues the flow of prosperity and protection.",
      magicalUses: [
        { use: "Increase", description: "Growth of wealth and goods" },
        { use: "Building", description: "Construction and development" },
        { use: "Travel", description: "Safe journeys by land" }
      ]
    },
    {
      mansion: "Belly of the Fish",
      number: 28,
      arabicName: "Al-Batn al-Hut",
      zodiacRange: "17° 09' Pisces - 0° Aries",
      keyStar: "—",
      meaning: "Completion",
      spiritualQualities: ["Unity", "Increase", "Marriage", "Prosperity"],
      description: "The final mansion completing the cycle, preparing for rebirth.",
      magicalUses: [
        { use: "Marriage", description: "Perfect for unions and partnerships" },
        { use: "Increase", description: "Growth and multiplication" },
        { use: "Healing", description: "Recovery and restoration" }
      ]
    }
  ] as ArabicSign[]
};
