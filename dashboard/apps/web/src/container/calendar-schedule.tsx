"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Define the event type
export type CalendarEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  color: "blue" | "purple" | "pink";
  expanded?: boolean;
};

interface CalendarScheduleProps {
  events?: CalendarEvent[];
  isLoading?: boolean;
}

export function CalendarSchedule({
  events: initialEvents = [],
  isLoading = false,
}: CalendarScheduleProps) {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  useEffect(() => {
    setEvents(initialEvents.map((event) => ({ ...event, expanded: false })));
  }, [initialEvents]);

  // Group events by date
  const eventsByDate = events.reduce(
    (acc, event) => {
      const dateStr = format(parseISO(event.date), "EEEE, dd MMMM");
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(event);
      return acc;
    },
    {} as Record<string, CalendarEvent[]>
  );

  const toggleExpand = (id: string) => {
    setEvents(
      events.map((event) =>
        event.id === id ? { ...event, expanded: !event.expanded } : event
      )
    );
  };

  // Color mappings
  const colorClasses = {
    blue: {
      bg: "bg-blue-900",
      border: "border-blue-500",
      light: "bg-blue-500",
    },
    purple: {
      bg: "bg-purple-700",
      border: "border-purple-500",
      light: "bg-purple-500",
    },
    pink: {
      bg: "bg-pink-600",
      border: "border-pink-500",
      light: "bg-pink-500",
    },
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const dateGroupVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        mass: 0.5,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-sm"
      >
        <div className="flex flex-col items-center">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 0.7,
                y: 0,
                transition: {
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  duration: 1,
                  delay: i * 0.2,
                },
              }}
              className="mb-3 h-24 w-full rounded-lg bg-gray-200"
            />
          ))}
        </div>
      </motion.div>
    );
  }

  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-sm"
      >
        <h3 className="mb-2 text-lg font-medium text-gray-800">
          No Appointments
        </h3>
        <p className="text-gray-600">
          {"You don't have any scheduled appointments at this time."}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-sm"
    >
      <motion.div
        className="flex items-center justify-between border-b p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="flex items-center gap-2 text-lg font-medium text-gray-800">
          <motion.div
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 500, delay: 0.3 }}
          >
            <CalendarIcon className="h-5 w-5 text-gray-500" />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            Calendar Schedule
          </motion.span>
        </h2>
        <motion.button
          className="text-gray-500"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.button>
      </motion.div>

      <motion.div
        className="divide-y"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {Object.entries(eventsByDate).map(
          ([dateStr, dateEvents], dateIndex) => (
            <motion.div
              key={dateStr}
              className="py-3"
              variants={dateGroupVariants}
            >
              <motion.h3
                className="mb-2 px-4 text-sm font-medium text-gray-700"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * dateIndex + 0.3 }}
              >
                {dateStr}
              </motion.h3>
              <motion.div
                className="space-y-3 px-4"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                <AnimatePresence>
                  {dateEvents.map((event, eventIndex) => (
                    <motion.div
                      key={event.id}
                      className={cn(
                        "cursor-pointer overflow-hidden rounded-lg",
                        event.expanded ? "shadow-md" : "shadow-sm"
                      )}
                      onClick={() => toggleExpand(event.id)}
                      variants={cardVariants}
                      layout
                      whileHover={{
                        scale: 1.02,
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        className={cn(
                          "relative flex items-start p-4 text-white",
                          colorClasses[event.color].bg
                        )}
                        layout
                      >
                        <motion.div
                          className={cn(
                            "absolute top-0 bottom-0 left-0 w-1",
                            colorClasses[event.color].light
                          )}
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ delay: 0.1 * eventIndex + 0.2 }}
                        />
                        <motion.div className="ml-2 flex-1" layout>
                          <div className="flex items-start justify-between">
                            <motion.span
                              className="text-xs font-medium opacity-90"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0.9 }}
                              transition={{ delay: 0.1 * eventIndex + 0.3 }}
                            >
                              {event.time}
                            </motion.span>
                            <AnimatePresence mode="wait">
                              {event.expanded ? (
                                <motion.div
                                  key="up"
                                  initial={{ opacity: 0, rotate: 180 }}
                                  animate={{ opacity: 1, rotate: 0 }}
                                  exit={{ opacity: 0, rotate: 180 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="down"
                                  initial={{ opacity: 0, rotate: -180 }}
                                  animate={{ opacity: 1, rotate: 0 }}
                                  exit={{ opacity: 0, rotate: -180 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          <motion.h4 className="mt-1 font-medium" layout>
                            {event.title}
                          </motion.h4>
                          <motion.p
                            className={cn(
                              "mt-1 text-sm opacity-90",
                              event.expanded ? "block" : "line-clamp-2"
                            )}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.9 }}
                            transition={{
                              delay: 0.1 * eventIndex + 0.4,
                              duration: 0.3,
                            }}
                          >
                            {event.description}
                          </motion.p>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )
        )}
      </motion.div>
    </motion.div>
  );
}

// Simple calendar icon component
function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
