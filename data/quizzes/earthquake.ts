import { QuizCategory } from "../quiz-types";

export const earthquakeQuiz: QuizCategory = {
  id: "earthquake",
  title: "Earthquake Preparedness",
  badgeTitle: "Earthquake Preparedness Expert",
  emoji: "🌍",
  description:
    "Learn how to protect yourself before, during and after earthquakes.",

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
            "You are inside your home when strong shaking suddenly begins.",
          question:
            "What should you do during the shaking?",
          options: [
            "Run outside immediately",
            "Stand beside a window",
            "Drop, Cover and Hold On",
            "Use the elevator",
          ],
          correctAnswer: 2,
          explanation:
            "Drop to the ground, take cover under sturdy furniture if possible, and hold on until the shaking stops.",
        },

        {
          scenario:
            "You are outdoors when an earthquake begins and buildings and electric poles are nearby.",
          question:
            "Where should you move?",
          options: [
            "Next to a building wall",
            "Under an electric pole",
            "To an open area away from buildings and wires",
            "Inside the nearest elevator",
          ],
          correctAnswer: 2,
          explanation:
            "Open areas away from buildings, walls, trees and power lines reduce the risk of being struck by falling objects.",
        },

        {
          scenario:
            "You are in a tall building when an earthquake begins.",
          question:
            "Should you use the elevator to escape?",
          options: [
            "Yes, immediately",
            "Only if other people use it",
            "No, avoid elevators during and after shaking",
            "Yes, if the lights are working",
          ],
          correctAnswer: 2,
          explanation:
            "Elevators can stop working or become damaged during earthquakes. Use stairs after shaking stops if evacuation is necessary.",
        },

        {
          scenario:
            "The earthquake has stopped and you smell gas inside your home.",
          question:
            "What should you do?",
          options: [
            "Light a match to find the leak",
            "Turn electrical switches on",
            "Leave the area and report the possible leak",
            "Stay inside and ignore it",
          ],
          correctAnswer: 2,
          explanation:
            "Gas leaks can cause fire or explosion. Avoid flames and electrical switches and leave the area safely.",
        },

        {
          scenario:
            "After an earthquake, broken glass is scattered across the floor.",
          question:
            "What should you do before walking around?",
          options: [
            "Walk barefoot",
            "Put on sturdy shoes",
            "Run across the glass",
            "Ask a child to clear it",
          ],
          correctAnswer: 1,
          explanation:
            "Sturdy shoes help protect your feet from broken glass, debris and sharp objects.",
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
            "You are in bed when strong shaking begins during the night. There is no heavy object directly above you.",
          question:
            "What is generally the safest action?",
          options: [
            "Jump up and run outside immediately",
            "Stay in bed and protect your head and neck with a pillow",
            "Stand next to a window",
            "Use the elevator",
          ],
          correctAnswer: 1,
          explanation:
            "If you are already in bed and there is no immediate overhead danger, staying there while protecting your head and neck can reduce injury.",
        },

        {
          scenario:
            "You are driving when an earthquake begins.",
          question:
            "What should you do?",
          options: [
            "Accelerate quickly",
            "Stop under a bridge",
            "Pull over safely away from structures and remain in the vehicle",
            "Exit the vehicle in moving traffic",
          ],
          correctAnswer: 2,
          explanation:
            "Pull over safely away from bridges, buildings, trees and power lines, then remain in the vehicle until the shaking stops.",
        },

        {
          scenario:
            "After the main earthquake, your family wants to relax because the danger appears to be over.",
          question:
            "What should you remind them about?",
          options: [
            "Aftershocks may occur",
            "There will never be another shake",
            "Electricity is automatically safe",
            "Damaged buildings cannot collapse",
          ],
          correctAnswer: 0,
          explanation:
            "Aftershocks can occur after the main earthquake and may further damage weakened structures.",
        },

        {
          scenario:
            "You notice a large crack in a wall and part of the ceiling has fallen after an earthquake.",
          question:
            "What is the safest response?",
          options: [
            "Remain inside to inspect everything",
            "Avoid the damaged area and leave if it is safe to do so",
            "Stand under the damaged ceiling",
            "Repair it during aftershocks",
          ],
          correctAnswer: 1,
          explanation:
            "Visible structural damage can indicate an unsafe building. Avoid damaged areas and follow safety guidance.",
        },

        {
          scenario:
            "Mobile phone networks are overloaded after a major earthquake.",
          question:
            "What is a good communication approach?",
          options: [
            "Keep making long phone calls repeatedly",
            "Use short text messages when possible",
            "Ignore family members",
            "Call emergency services for non-emergencies",
          ],
          correctAnswer: 1,
          explanation:
            "Text messages may use less network capacity than voice calls and can help keep emergency systems available.",
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
            "A major earthquake has damaged your building. You smell gas, hear cracking sounds and notice debris near the main exit.",
          question:
            "Which response is safest?",
          options: [
            "Turn on lights and inspect every room",
            "Use flames to locate the gas leak",
            "Avoid ignition sources, leave through a safe route if possible and report the hazards",
            "Stay inside until another earthquake occurs",
          ],
          correctAnswer: 2,
          explanation:
            "Possible gas leaks and structural damage are major hazards. Avoid flames and electrical switches and evacuate safely if possible.",
        },

        {
          scenario:
            "An earthquake triggers a tsunami warning while you are in a coastal area.",
          question:
            "What should you do?",
          options: [
            "Go to the beach to observe the water",
            "Move quickly to higher ground or inland according to evacuation guidance",
            "Wait for visible waves",
            "Stay inside a vehicle near the shoreline",
          ],
          correctAnswer: 1,
          explanation:
            "Strong coastal earthquakes can generate tsunamis. Do not wait to see a wave; move to higher ground and follow evacuation guidance.",
        },

        {
          scenario:
            "You are trapped under debris after an earthquake and cannot safely move.",
          question:
            "Which action is most appropriate?",
          options: [
            "Light a match",
            "Shout continuously until exhausted",
            "Protect your breathing, tap on pipes or walls and use a whistle if available",
            "Move heavy debris without checking stability",
          ],
          correctAnswer: 2,
          explanation:
            "Avoid flames because gas may be present. Conserving energy and using tapping or a whistle can help rescuers locate you.",
        },

        {
          scenario:
            "You are helping organise a family earthquake preparedness plan before any disaster occurs.",
          question:
            "Which preparation provides the strongest overall protection?",
          options: [
            "Only buying bottled water",
            "Securing heavy furniture, preparing supplies, identifying safe places and planning family communication",
            "Keeping heavy objects on high shelves",
            "Depending entirely on emergency services",
          ],
          correctAnswer: 1,
          explanation:
            "Earthquake preparedness works best when structural hazards, emergency supplies, safe locations and communication plans are addressed together.",
        },

        {
          scenario:
            "Following a major earthquake, officials warn that a damaged building may collapse during aftershocks, but valuable belongings remain inside.",
          question:
            "What should you do?",
          options: [
            "Enter quickly before another aftershock",
            "Send someone else inside",
            "Stay out until qualified authorities confirm the building is safe",
            "Enter only if the belongings are expensive",
          ],
          correctAnswer: 2,
          explanation:
            "Damaged structures may collapse during aftershocks. Personal safety is more important than recovering property.",
        },
      ],
    },
  ],
};