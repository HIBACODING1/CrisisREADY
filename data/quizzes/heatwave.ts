import { QuizCategory } from "../quiz-types";

export const heatwaveQuiz: QuizCategory = {
  id: "heatwave",
  title: "Heatwave Safety",
  badgeTitle: "Heatwave Safety Expert",
  emoji: "☀️",
  description:
    "Learn how to recognise heat-related illness and stay safe during extreme heat.",

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
            "It is extremely hot outside and an elderly person nearby feels dizzy and weak after staying in the sun.",
          question:
            "What should you do first?",
          options: [
            "Move them to a cooler shaded place",
            "Make them walk more",
            "Give them very hot tea",
            "Leave them alone",
          ],
          correctAnswer: 0,
          explanation:
            "Moving the person to a cooler or shaded area helps reduce further heat exposure.",
        },

        {
          scenario:
            "A heatwave warning has been issued and you need to spend some time outdoors.",
          question:
            "Which action is safest?",
          options: [
            "Avoid drinking water",
            "Wear heavy dark clothing",
            "Drink water and wear light clothing",
            "Stay in direct afternoon sun",
          ],
          correctAnswer: 2,
          explanation:
            "Hydration and light clothing help the body manage extreme heat more safely.",
        },

        {
          scenario:
            "A child has been playing outside in very hot weather and now has a headache and heavy sweating.",
          question:
            "What should you do?",
          options: [
            "Move the child to a cool place and give fluids if conscious",
            "Make the child continue playing",
            "Cover the child with heavy blankets",
            "Ignore the symptoms",
          ],
          correctAnswer: 0,
          explanation:
            "Headache and heavy sweating can be signs of heat exhaustion and should be treated seriously.",
        },

        {
          scenario:
            "You are planning outdoor activity during a heatwave.",
          question:
            "Which time is generally safer?",
          options: [
            "The hottest part of the afternoon",
            "Early morning or later evening",
            "Midday in direct sun",
            "Any time without water",
          ],
          correctAnswer: 1,
          explanation:
            "Early morning and evening are generally cooler and reduce exposure to peak heat.",
        },

        {
          scenario:
            "Someone has been working in hot weather for several hours.",
          question:
            "What is a good way to reduce heat risk?",
          options: [
            "Avoid breaks",
            "Drink water regularly and rest in shade",
            "Wear extra heavy clothing",
            "Stay in direct sunlight",
          ],
          correctAnswer: 1,
          explanation:
            "Regular hydration and cooling breaks reduce the risk of heat-related illness.",
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
            "A person in extreme heat becomes very weak, sweaty and nauseous but is still awake and responsive.",
          question:
            "What is the most appropriate response?",
          options: [
            "Move them to a cool area, loosen clothing and give fluids if they can safely drink",
            "Make them exercise",
            "Cover them with blankets",
            "Leave them in the sun",
          ],
          correctAnswer: 0,
          explanation:
            "These symptoms may indicate heat exhaustion. Cooling and hydration are important while monitoring for worsening symptoms.",
        },

        {
          scenario:
            "A worker is outdoors during a heatwave and must continue essential work.",
          question:
            "Which approach best reduces risk?",
          options: [
            "Work continuously without breaks",
            "Use shade, frequent breaks and regular hydration",
            "Wear extra layers",
            "Avoid water until work is complete",
          ],
          correctAnswer: 1,
          explanation:
            "Frequent cooling breaks, shade and hydration are key protections during unavoidable heat exposure.",
        },

        {
          scenario:
            "Your home becomes very hot during a power outage in a heatwave.",
          question:
            "What should you do?",
          options: [
            "Stay in the hottest room",
            "Move to the coolest available area and seek a cooling location if necessary",
            "Close yourself in a poorly ventilated room",
            "Avoid drinking water",
          ],
          correctAnswer: 1,
          explanation:
            "Reducing heat exposure and relocating to a cooler environment can prevent dangerous overheating.",
        },

        {
          scenario:
            "An elderly family member takes medication and is more vulnerable to extreme heat.",
          question:
            "What is the safest approach?",
          options: [
            "Ignore heat warnings",
            "Check on them regularly and keep them cool and hydrated",
            "Encourage long outdoor walks",
            "Reduce all fluids",
          ],
          correctAnswer: 1,
          explanation:
            "Older adults may be more vulnerable during heatwaves and benefit from frequent monitoring, hydration and cooling.",
        },

        {
          scenario:
            "You are organising an outdoor event during a heatwave.",
          question:
            "Which preparation is most appropriate?",
          options: [
            "Provide no shade",
            "Schedule activities during peak heat",
            "Provide shade, drinking water and cooling breaks",
            "Encourage heavy clothing",
          ],
          correctAnswer: 2,
          explanation:
            "Shade, hydration and reduced exposure are important protections for groups during extreme heat.",
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
            "A person in extreme heat becomes confused, stops sweating and has very hot skin.",
          question:
            "What should you suspect?",
          options: [
            "Normal tiredness",
            "Heat stroke requiring urgent emergency help",
            "Mild dehydration only",
            "A harmless reaction",
          ],
          correctAnswer: 1,
          explanation:
            "Confusion and very hot skin can indicate heat stroke, which is a medical emergency.",
        },

        {
          scenario:
            "You suspect someone has heat stroke and emergency help has been called.",
          question:
            "What should you do while waiting?",
          options: [
            "Begin rapid cooling using available safe methods",
            "Cover them with heavy blankets",
            "Make them exercise",
            "Leave them in direct sunlight",
          ],
          correctAnswer: 0,
          explanation:
            "Heat stroke requires urgent cooling while emergency medical help is on the way.",
        },

        {
          scenario:
            "A city experiences several consecutive days of extreme heat and nighttime temperatures remain high.",
          question:
            "Which group should receive extra attention?",
          options: [
            "Only healthy young adults",
            "Older adults, infants, people with health conditions and those without adequate cooling",
            "Only office workers",
            "Only athletes",
          ],
          correctAnswer: 1,
          explanation:
            "Certain groups are more vulnerable to heat stress and may need additional support during prolonged heatwaves.",
        },

        {
          scenario:
            "Your community is preparing for future heatwaves.",
          question:
            "Which strategy provides the strongest protection?",
          options: [
            "Rely only on individuals to manage alone",
            "Use heat alerts, cooling centres, public education and support for vulnerable people",
            "Close all shaded public spaces",
            "Reduce access to drinking water",
          ],
          correctAnswer: 1,
          explanation:
            "Community heat plans are strongest when they combine warnings, cooling access, education and targeted support.",
        },

        {
          scenario:
            "A family member has signs of serious heat illness but refuses to leave a very hot environment.",
          question:
            "What is the safest decision?",
          options: [
            "Respect the refusal and do nothing",
            "Move them to a cooler environment and seek urgent medical help if serious symptoms are present",
            "Give them heavy clothing",
            "Encourage them to stay in the heat",
          ],
          correctAnswer: 1,
          explanation:
            "Serious heat illness can worsen quickly, so cooling and urgent medical attention may be necessary.",
        },
      ],
    },
  ],
};