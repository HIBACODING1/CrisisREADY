import { QuizCategory } from "../quiz-types";

export const landslideQuiz: QuizCategory = {
  id: "landslide",
  title: "Landslide Safety",
  badgeTitle: "Landslide Safety Expert",
  emoji: "⛰️",
  description:
    "Learn how to recognise landslide warning signs and respond safely.",

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
            "You are travelling on a mountain road after heavy rain and small rocks begin falling from the slope.",
          question:
            "What is the safest action?",
          options: [
            "Stop beside the unstable slope",
            "Move away from the slope and avoid the area",
            "Stand outside and take photos",
            "Continue driving fast through the danger zone",
          ],
          correctAnswer: 1,
          explanation:
            "Falling rocks may be an early warning of a larger landslide. Move away from unstable slopes and avoid the danger area.",
        },

        {
          scenario:
            "You notice new cracks forming in the ground near a hillside after several days of rain.",
          question:
            "What could this indicate?",
          options: [
            "The ground is becoming stronger",
            "There may be a landslide risk",
            "The area is completely safe",
            "The soil is drying normally",
          ],
          correctAnswer: 1,
          explanation:
            "New ground cracks can be a warning sign that soil or rock is moving and that a landslide may occur.",
        },

        {
          scenario:
            "Trees and utility poles on a hillside suddenly appear to be leaning downhill.",
          question:
            "What should you do?",
          options: [
            "Ignore the change",
            "Stay in the area to watch",
            "Move away and report the warning signs",
            "Climb the slope to inspect it",
          ],
          correctAnswer: 2,
          explanation:
            "Leaning trees and poles may indicate ground movement. Leave the area and report the possible landslide hazard.",
        },

        {
          scenario:
            "A landslide has blocked a road with mud, rocks and debris.",
          question:
            "What is the safest response?",
          options: [
            "Climb over the debris",
            "Walk across it carefully",
            "Stay away and contact local authorities",
            "Try to remove the rocks yourself",
          ],
          correctAnswer: 2,
          explanation:
            "Landslide debris may still be unstable and can move again. Stay away and wait for trained responders.",
        },

        {
          scenario:
            "Heavy rain is continuing in an area known for landslides.",
          question:
            "What should residents do?",
          options: [
            "Ignore weather warnings",
            "Follow official alerts and be ready to evacuate",
            "Go closer to slopes to inspect them",
            "Park vehicles beneath steep hills",
          ],
          correctAnswer: 1,
          explanation:
            "During prolonged rain in landslide-prone areas, residents should monitor official warnings and prepare to evacuate if needed.",
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
            "You hear unusual cracking sounds from a hillside during heavy rain and notice muddy water flowing where it was previously clear.",
          question:
            "What is the safest interpretation?",
          options: [
            "These are normal rain effects",
            "They may be landslide warning signs",
            "The slope is becoming more stable",
            "It is safe to move closer",
          ],
          correctAnswer: 1,
          explanation:
            "Unusual sounds and sudden changes in water flow can indicate movement inside the slope and possible landslide activity.",
        },

        {
          scenario:
            "Your home is near a steep slope and authorities issue a landslide evacuation warning.",
          question:
            "What should your family do?",
          options: [
            "Wait until soil enters the house",
            "Evacuate using the recommended route",
            "Ignore the warning if rain slows down",
            "Stand outside near the slope",
          ],
          correctAnswer: 1,
          explanation:
            "Evacuation warnings should be followed early because landslides can occur suddenly and block escape routes.",
        },

        {
          scenario:
            "A family wants to return home immediately after a landslide stops moving.",
          question:
            "What is the safest choice?",
          options: [
            "Return immediately",
            "Wait until authorities confirm the area is safe",
            "Climb across the damaged slope",
            "Enter damaged buildings without checking them",
          ],
          correctAnswer: 1,
          explanation:
            "Additional landslides may occur and damaged ground can remain unstable. Return only when authorities confirm it is safe.",
        },

        {
          scenario:
            "You are driving through a mountainous area during intense rainfall and see water, mud and small stones crossing the road.",
          question:
            "What should you do?",
          options: [
            "Drive through quickly",
            "Stop directly below the slope",
            "Turn around and use a safer route if possible",
            "Walk through the mud first",
          ],
          correctAnswer: 2,
          explanation:
            "Mud, stones and water crossing a mountain road can signal slope failure. Avoid the area and use another safe route.",
        },

        {
          scenario:
            "After a landslide, damaged electrical wires are lying across wet debris.",
          question:
            "What should you do?",
          options: [
            "Touch the wires to move them",
            "Walk across the debris carefully",
            "Stay away and report the electrical hazard",
            "Cover the wires with mud",
          ],
          correctAnswer: 2,
          explanation:
            "Damaged power lines around wet landslide debris can cause electrocution. Keep a safe distance and report them.",
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
            "Your community is below a steep hillside. After several days of rain, residents notice ground cracks, leaning trees, unusual rumbling sounds and muddy water flowing downhill.",
          question:
            "What is the most appropriate response?",
          options: [
            "Wait until the hillside visibly collapses",
            "Treat the signs as serious, move people away from the slope and notify authorities",
            "Send people uphill to inspect the cracks",
            "Continue normal activities",
          ],
          correctAnswer: 1,
          explanation:
            "Multiple warning signs together indicate a potentially dangerous unstable slope. Early evacuation and notification can save lives.",
        },

        {
          scenario:
            "A landslide occurs near your village and blocks the main road. A second route passes beside another unstable slope.",
          question:
            "What should residents do?",
          options: [
            "Use the unstable second route immediately",
            "Wait for official guidance and use only confirmed safe routes",
            "Climb over the original landslide debris",
            "Create a path through the debris themselves",
          ],
          correctAnswer: 1,
          explanation:
            "After a landslide, nearby slopes may also be unstable. Travel should follow routes confirmed safe by emergency or local authorities.",
        },

        {
          scenario:
            "You are inside a house when you hear a loud rumbling sound and see soil and rocks moving rapidly toward the building.",
          question:
            "What should you do if you still have a safe escape route away from the slide path?",
          options: [
            "Move quickly away from the landslide path",
            "Stand at a window to watch",
            "Run directly toward the moving debris",
            "Go outside and climb the unstable slope",
          ],
          correctAnswer: 0,
          explanation:
            "If a safe escape route exists, move quickly away from the expected path of moving debris and toward safer ground.",
        },

        {
          scenario:
            "Following a major landslide, part of a house appears damaged but family belongings remain inside. There is also a risk of further slope movement.",
          question:
            "What is the safest decision?",
          options: [
            "Enter quickly to retrieve belongings",
            "Wait until professionals confirm the structure and slope are safe",
            "Send one person inside",
            "Climb onto the roof to inspect the slope",
          ],
          correctAnswer: 1,
          explanation:
            "Damaged buildings and unstable slopes can fail without warning. Property recovery should wait until professionals confirm the area is safe.",
        },

        {
          scenario:
            "Your community wants to reduce landslide risk before the next rainy season.",
          question:
            "Which strategy is most effective?",
          options: [
            "Ignore drainage around slopes",
            "Monitor warning signs, improve drainage, avoid unsafe construction and maintain evacuation plans",
            "Remove all vegetation from slopes",
            "Build homes closer to steep unstable hillsides",
          ],
          correctAnswer: 1,
          explanation:
            "Risk reduction combines monitoring, good drainage, safer land use and community evacuation planning.",
        },
      ],
    },
  ],
};