import { QuizCategory } from "../quiz-types";

export const floodQuiz: QuizCategory = {
  id: "flood",
  title: "Flood Management",
  badgeTitle: "Flood Management Expert",
  emoji: "🌊",
  description:
    "Learn how to prepare for and respond safely to floods.",

  tiers: [
    // =========================
    // EASY
    // =========================
    {
      id: "easy",
      title: "Easy",

      questions: [
        {
          scenario:
            "Heavy rain has continued for several hours and water is entering nearby streets.",
          question: "What should you do first?",
          options: [
            "Walk through the floodwater",
            "Move toward higher ground",
            "Wait inside a parked car",
            "Stand near electricity poles",
          ],
          correctAnswer: 1,
          explanation:
            "Moving to higher ground reduces the risk of becoming trapped by rising floodwater.",
        },

        {
          scenario:
            "You are travelling when you see floodwater covering the road ahead.",
          question: "What is the safest action?",
          options: [
            "Drive through the water slowly",
            "Walk through the water first",
            "Turn around and find another safe route",
            "Speed through the water",
          ],
          correctAnswer: 2,
          explanation:
            "Floodwater can be much deeper and faster than it appears. Never attempt to drive or walk through it.",
        },

        {
          scenario:
            "Floodwater is rising near electrical poles and damaged power lines.",
          question: "What should you do?",
          options: [
            "Walk closer to inspect the wires",
            "Stay away from the area",
            "Touch the pole to check if it is safe",
            "Walk through nearby floodwater",
          ],
          correctAnswer: 1,
          explanation:
            "Floodwater near electrical equipment may be electrically charged.",
        },

        {
          scenario:
            "Local authorities issue an evacuation warning because the flood is getting worse.",
          question: "What should your family do?",
          options: [
            "Ignore the warning",
            "Wait until water enters the house",
            "Follow the evacuation instructions",
            "Go outside to watch the flood",
          ],
          correctAnswer: 2,
          explanation:
            "Evacuation warnings should be followed as early as possible.",
        },

        {
          scenario:
            "Your family is preparing an emergency kit before the flood season.",
          question:
            "Which item is most important to include?",
          options: [
            "Clean drinking water",
            "Decorative items",
            "Extra furniture",
            "Gaming equipment",
          ],
          correctAnswer: 0,
          explanation:
            "Clean drinking water is essential during floods.",
        },
      ],
    },

    // =========================
    // MODERATE
    // =========================
    {
      id: "moderate",
      title: "Moderate",

      questions: [
        {
          scenario:
            "Your family has two evacuation routes. The shorter road has moving floodwater while the longer road is dry.",
          question: "Which route should you choose?",
          options: [
            "Use the shorter flooded road",
            "Use the longer dry route",
            "Wait for the water to deepen",
            "Walk through the flooded road first",
          ],
          correctAnswer: 1,
          explanation:
            "A dry route is safer even if it is longer.",
        },

        {
          scenario:
            "Floodwater is approaching your home and electricity is still on. The main switch can be reached safely without entering water.",
          question: "What should you do?",
          options: [
            "Leave electricity running",
            "Switch off the main power safely",
            "Touch wet appliances",
            "Stand in water while turning it off",
          ],
          correctAnswer: 1,
          explanation:
            "Electricity may be switched off if the main switch can be reached safely without entering floodwater.",
        },

        {
          scenario:
            "You receive an unverified social media message claiming a dam has collapsed.",
          question: "What should you do?",
          options: [
            "Forward it immediately",
            "Ignore all emergency warnings",
            "Verify it through official sources",
            "Travel toward the dam",
          ],
          correctAnswer: 2,
          explanation:
            "Emergency information should be verified using official sources.",
        },

        {
          scenario:
            "Floodwater begins falling and someone wants to immediately return to a flooded house.",
          question: "What is safest?",
          options: [
            "Return immediately",
            "Wait until authorities confirm it is safe",
            "Enter alone at night",
            "Touch damaged wiring first",
          ],
          correctAnswer: 1,
          explanation:
            "Flooded buildings may contain structural, electrical and contamination hazards.",
        },

        {
          scenario:
            "Your stored drinking water may have been contaminated during flooding.",
          question: "What should you do?",
          options: [
            "Drink it if it looks clear",
            "Use only confirmed safe or properly treated water",
            "Mix it with floodwater",
            "Ignore water safety advice",
          ],
          correctAnswer: 1,
          explanation:
            "Floodwater may contaminate drinking water with sewage, chemicals and microorganisms.",
        },
      ],
    },

    // =========================
    // EXPERT
    // =========================
    {
      id: "expert",
      title: "Expert",

      questions: [
        {
          scenario:
            "Floodwater is rapidly approaching your house. An elderly family member has limited mobility, electricity is still connected, and authorities have issued an evacuation order.",
          question:
            "Which sequence of actions is safest?",
          options: [
            "Pack furniture, then wait for water to rise",
            "Secure the elderly family member, safely disconnect power if possible, take the emergency kit and evacuate",
            "Send the elderly person outside alone",
            "Ignore the evacuation order until water enters",
          ],
          correctAnswer: 1,
          explanation:
            "Protect vulnerable family members first, reduce electrical hazards only if safe, take essential emergency supplies and evacuate promptly.",
        },

        {
          scenario:
            "Your vehicle becomes surrounded by rapidly rising floodwater and the water level continues increasing.",
          question:
            "What is the safest response if you can safely exit toward higher ground?",
          options: [
            "Stay inside regardless of water level",
            "Exit safely and move to higher ground",
            "Restart the vehicle repeatedly",
            "Drive deeper into the flood",
          ],
          correctAnswer: 1,
          explanation:
            "A vehicle can become trapped or swept away. If safe escape toward higher ground is possible, leaving early may be safer.",
        },

        {
          scenario:
            "After a major flood, your house appears structurally damaged and you smell gas near the entrance.",
          question: "What should you do?",
          options: [
            "Enter quickly to inspect everything",
            "Turn electrical switches on",
            "Stay outside and report the hazards to appropriate authorities",
            "Light a flame to locate the gas leak",
          ],
          correctAnswer: 2,
          explanation:
            "Structural damage and suspected gas leaks are serious hazards. Do not enter until qualified personnel assess the property.",
        },

        {
          scenario:
            "A rescue team is evacuating your neighbourhood, but one family member wants to delay evacuation to collect expensive belongings.",
          question: "What is the safest decision?",
          options: [
            "Delay evacuation for valuables",
            "Follow evacuation instructions immediately",
            "Allow one person to stay behind",
            "Return after the rescue team leaves",
          ],
          correctAnswer: 1,
          explanation:
            "Life safety takes priority over property. Delaying evacuation can leave people trapped as conditions worsen.",
        },

        {
          scenario:
            "Several days after flooding, standing water remains around your area and mosquitoes, debris and contamination are increasing.",
          question:
            "Which response best reduces health risk?",
          options: [
            "Let children play in the water",
            "Avoid contact with standing water, use protective equipment when necessary and follow public-health guidance",
            "Drink standing water after filtering it through cloth",
            "Walk barefoot through flooded areas",
          ],
          correctAnswer: 1,
          explanation:
            "Standing floodwater can contain sewage, chemicals, sharp debris and disease risks. Avoid unnecessary contact and follow health guidance.",
        },
      ],
    },
  ],
};