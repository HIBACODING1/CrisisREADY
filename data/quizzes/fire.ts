import { QuizCategory } from "../quiz-types";

export const fireQuiz: QuizCategory = {
  id: "fire",
  title: "Fire Safety",
  badgeTitle: "Fire Safety Expert",
  emoji: "🔥",
  description:
    "Learn how to prevent fires and respond safely during fire emergencies.",

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
            "A fire starts in a building and smoke begins filling the hallway.",
          question:
            "What is the safest way to leave the building?",
          options: [
            "Use the elevator",
            "Use the stairs if safe and stay low under smoke",
            "Hide in a bathroom",
            "Open every door quickly",
          ],
          correctAnswer: 1,
          explanation:
            "Elevators may fail during fires. Use stairs if safe and stay low because cleaner air is usually closer to the floor.",
        },

        {
          scenario:
            "Your clothes accidentally catch fire.",
          question:
            "What should you do?",
          options: [
            "Run quickly",
            "Stop, Drop and Roll",
            "Stand still",
            "Use an elevator",
          ],
          correctAnswer: 1,
          explanation:
            "Stop, Drop and Roll helps smother the flames and reduces the chance of the fire spreading.",
        },

        {
          scenario:
            "You have safely left a burning building, but your phone and wallet are still inside.",
          question:
            "What should you do?",
          options: [
            "Go back inside quickly",
            "Ask someone else to retrieve them",
            "Stay outside and wait for emergency responders",
            "Break a window and enter",
          ],
          correctAnswer: 2,
          explanation:
            "Never re-enter a burning building. Personal safety is more important than belongings.",
        },

        {
          scenario:
            "You see a small electrical fire starting from an appliance.",
          question:
            "What should you avoid doing?",
          options: [
            "Calling for help",
            "Switching off power if safe",
            "Pouring water on the electrical fire",
            "Moving away from the danger",
          ],
          correctAnswer: 2,
          explanation:
            "Water can conduct electricity and increase the risk of electric shock during an electrical fire.",
        },

        {
          scenario:
            "A smoke alarm begins sounding inside your home.",
          question:
            "What should you do?",
          options: [
            "Ignore it",
            "Investigate safely and prepare to evacuate",
            "Remove the batteries",
            "Go back to sleep",
          ],
          correctAnswer: 1,
          explanation:
            "A smoke alarm should always be taken seriously. Check for danger safely and evacuate if needed.",
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
            "You are inside a room during a fire and the door feels hot.",
          question:
            "What should you do before opening it?",
          options: [
            "Open it immediately",
            "Check the door carefully and use another escape route if it is hot",
            "Kick the door open",
            "Stand directly in front of it",
          ],
          correctAnswer: 1,
          explanation:
            "A hot door can indicate fire on the other side. Opening it may expose you to flames or intense heat.",
        },

        {
          scenario:
            "Smoke is entering your room and your normal exit is blocked by fire.",
          question:
            "What is the safest response?",
          options: [
            "Run through the flames",
            "Stay low, close doors if possible and signal for help from a safe location",
            "Hide inside a cupboard",
            "Break every window",
          ],
          correctAnswer: 1,
          explanation:
            "Closing doors can slow smoke and fire spread. Staying low reduces smoke inhalation while you signal for rescue.",
        },

        {
          scenario:
            "A cooking pan catches fire on the stove.",
          question:
            "What should you do if it can be done safely?",
          options: [
            "Carry the burning pan outside",
            "Cover it with a suitable lid and turn off the heat",
            "Throw water on it",
            "Move closer to inspect it",
          ],
          correctAnswer: 1,
          explanation:
            "Covering the pan can remove oxygen from the fire. Water can make some cooking fires worse.",
        },

        {
          scenario:
            "You are helping your family prepare for possible house fires.",
          question:
            "Which preparation is most useful?",
          options: [
            "Only buying a fire extinguisher",
            "Creating and practising an escape plan with meeting points",
            "Blocking unused doors",
            "Removing smoke alarms",
          ],
          correctAnswer: 1,
          explanation:
            "A practised escape plan helps everyone know where to go and where to meet during an emergency.",
        },

        {
          scenario:
            "A fire extinguisher is available, but the fire is already spreading rapidly.",
          question:
            "What should you do?",
          options: [
            "Try fighting it regardless of size",
            "Evacuate and call emergency services",
            "Stand close to watch the flames",
            "Wait until the room fills with smoke",
          ],
          correctAnswer: 1,
          explanation:
            "Extinguishers are for small, manageable fires when escape is still possible. A spreading fire requires evacuation.",
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
            "A fire begins in a multi-storey building. Smoke is spreading through one stairwell while another stairwell appears clear.",
          question:
            "What is the safest evacuation decision?",
          options: [
            "Use the elevator",
            "Use the clear stairwell if it remains safe",
            "Enter the smoke-filled stairwell",
            "Wait in the hallway",
          ],
          correctAnswer: 1,
          explanation:
            "Use a safe stairwell and avoid smoke-filled routes. Elevators may fail or open onto dangerous floors.",
        },

        {
          scenario:
            "You are assisting an elderly family member who moves slowly during a house fire.",
          question:
            "What should you prioritise?",
          options: [
            "Collecting valuables",
            "Helping the person evacuate through the safest available route",
            "Returning for furniture",
            "Waiting for the fire to grow",
          ],
          correctAnswer: 1,
          explanation:
            "People with limited mobility may need assistance. Life safety and early evacuation should take priority.",
        },

        {
          scenario:
            "After a fire appears to be extinguished, part of the building is badly damaged and smoke is still present.",
          question:
            "What should you do?",
          options: [
            "Enter immediately to inspect",
            "Wait until emergency professionals confirm the building is safe",
            "Send someone inside alone",
            "Turn electricity back on",
          ],
          correctAnswer: 1,
          explanation:
            "Fire-damaged buildings may have hidden hot spots, toxic smoke, electrical hazards and structural damage.",
        },

        {
          scenario:
            "A fire starts near fuel or flammable chemicals.",
          question:
            "What is the safest response?",
          options: [
            "Approach closely with water",
            "Move away, evacuate the area and call emergency services",
            "Touch the containers",
            "Try moving the chemicals by hand",
          ],
          correctAnswer: 1,
          explanation:
            "Flammable chemicals can cause rapid fire spread or explosions. Distance and professional emergency response are essential.",
        },

        {
          scenario:
            "Your workplace wants to improve fire preparedness.",
          question:
            "Which strategy provides the strongest overall protection?",
          options: [
            "Only installing extinguishers",
            "Maintaining alarms, clear exits, evacuation plans, staff training and appropriate fire equipment",
            "Locking emergency exits",
            "Depending only on emergency responders",
          ],
          correctAnswer: 1,
          explanation:
            "Effective fire preparedness combines prevention, detection, safe evacuation, training and appropriate fire-fighting equipment.",
        },
      ],
    },
  ],
};