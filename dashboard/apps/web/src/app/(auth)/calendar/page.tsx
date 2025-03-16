"use client";

import { useState, useEffect } from "react";

import { fetchCalendarEvents } from "@/lib/calendar-service";
import { motion } from "framer-motion";
import { format, isSameDay, parseISO } from "date-fns";
import { CalendarEvent, CalendarSchedule } from "@/container/calendar-schedule";
import { LargeCalendar } from "@/container/large-calendar";
import NavBottomBar from "@/components/nav-bottom-bar";

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Fetch events
  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await fetchCalendarEvents();
        setEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error("Failed to fetch calendar events:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();
  }, []);

  // Filter events when a date is selected
  useEffect(() => {
    if (selectedDate) {
      const filtered = events.filter((event) =>
        isSameDay(parseISO(event.date), selectedDate)
      );
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
    }
  }, [selectedDate, events]);

  // Handle date selection
  const handleSelectDate = (date: Date) => {
    if (selectedDate && isSameDay(date, selectedDate)) {
      // If clicking the same date, clear the filter
      setSelectedDate(undefined);
      setFilteredEvents(events);
    } else {
      setSelectedDate(date);
    }
  };

  // Clear date filter
  const clearDateFilter = () => {
    setSelectedDate(undefined);
    setFilteredEvents(events);
  };

  return (
    <>
      <motion.div
        className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 lg:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="mx-auto max-w-7xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            delay: 0.2,
          }}
        >
          <motion.div className="mb-8">
            <motion.h1
              className="mb-2 text-2xl font-bold text-gray-800 lg:text-3xl"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Your Appointments
            </motion.h1>
            <motion.p
              className="text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              View your upcoming scheduled appointments below.
            </motion.p>

            {selectedDate && (
              <motion.div
                className="mt-4 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">
                  Showing appointments for{" "}
                  {format(selectedDate, "MMMM d, yyyy")}
                </span>
                <button
                  onClick={clearDateFilter}
                  className="ml-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  Clear filter
                </button>
              </motion.div>
            )}
          </motion.div>

          <div className="lg:grid lg:grid-cols-5 lg:gap-8">
            {/* Appointment List - Takes 2 columns on desktop */}
            <motion.div
              className="mb-8 lg:col-span-2 lg:mb-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CalendarSchedule events={filteredEvents} isLoading={isLoading} />
            </motion.div>

            {/* Large Calendar - Takes 3 columns on desktop, hidden on mobile */}
            {!isMobile && (
              <motion.div
                className="lg:col-span-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <LargeCalendar
                  events={events}
                  onSelectDate={handleSelectDate}
                  selectedDate={selectedDate}
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
      <div>
        <NavBottomBar />
      </div>
    </>
  );
}
