import { CalendarEvent } from "@/container/calendar-schedule";

// This function would be replaced with actual API calls in a real application
export async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Current date for more realistic sample data
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  // Sample data with dates spread across the current month
  return [
    {
      id: "1",
      title: "Mobile app with prototype",
      description: "Create two mobile app designs and prototype strongest key interactions",
      date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-15`,
      time: "10:00",
      color: "blue",
    },
    {
      id: "2",
      title: "UI design: moodboard creation",
      description: "Create UI design fit all categories, and also make a video specification",
      date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-09`,
      time: "09:00",
      color: "purple",
    },
    {
      id: "3",
      title: "Landing page and responsive",
      description: "Create landing page from any theme, and make it fast, responsive and beautiful",
      date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-22`,
      time: "12:00",
      color: "pink",
    },
    {
      id: "4",
      title: "Brand identity workshop",
      description: "Collaborative session to define brand values, vision, and visual direction",
      date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-09`,
      time: "14:30",
      color: "blue",
    },
    {
      id: "5",
      title: "User testing session",
      description: "Conduct usability testing with 5 participants to validate new features",
      date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-22`,
      time: "15:45",
      color: "purple",
    },
    {
      id: "6",
      title: "Client presentation",
      description: "Present final designs and get feedback for revisions",
      date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-28`,
      time: "11:00",
      color: "pink",
    },
    {
      id: "7",
      title: "Project kickoff meeting",
      description: "Initial meeting to discuss project goals, timeline, and deliverables",
      date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-03`,
      time: "09:30",
      color: "blue",
    },
    {
      id: "8",
      title: "Design review",
      description: "Internal review of design progress with the creative team",
      date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-17`,
      time: "13:15",
      color: "purple",
    },
  ];
}

