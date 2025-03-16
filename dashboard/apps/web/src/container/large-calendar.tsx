"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  isToday,
} from "date-fns";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "./calendar-schedule";

interface LargeCalendarProps {
  events: CalendarEvent[];
  onSelectDate?: (date: Date) => void;
  selectedDate?: Date;
}

export function LargeCalendar({
  events,
  onSelectDate,
  selectedDate,
}: LargeCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get days for the current month view
  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  // Get day names for the header
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get dates that have events
  const datesWithEvents = events.map((event) => parseISO(event.date));

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  // Handle date selection
  const handleSelectDate = (date: Date) => {
    if (onSelectDate && isSameMonth(date, currentMonth)) {
      onSelectDate(date);
    }
  };

  // Get event colors for a specific date
  const getEventColorsForDate = (date: Date) => {
    return events
      .filter((event) => isSameDay(parseISO(event.date), date))
      .map((event) => event.color);
  };

  return (
    <motion.div
      className="overflow-hidden rounded-lg bg-white shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Calendar Header */}
      <div className="flex items-center justify-between border-b p-4">
        <motion.h2
          className="text-xl font-semibold text-gray-800"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {format(currentMonth, "MMMM yyyy")}
        </motion.h2>
        <div className="flex space-x-2">
          <motion.button
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevMonth}
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </motion.button>
          <motion.button
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextMonth}
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </motion.button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b">
        {weekDays.map((day, i) => (
          <motion.div
            key={day}
            className={cn(
              "py-3 text-center text-sm font-medium",
              i === 0 || i === 6 ? "text-gray-500" : "text-gray-700"
            )}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i + 0.3 }}
          >
            {day}
          </motion.div>
        ))}
      </div>

      {/* Calendar Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={format(currentMonth, "yyyy-MM")}
          className="grid grid-cols-7 gap-px bg-gray-100 p-px"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
        >
          {/* Empty cells for days before the first of the month */}
          {Array.from({ length: firstDayOfMonth.getDay() }).map((_, i) => (
            <div key={`empty-start-${i}`} className="aspect-square bg-white" />
          ))}

          {/* Days of the month */}
          {daysInMonth.map((day, i) => {
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const hasEvents = datesWithEvents.some((date) =>
              isSameDay(date, day)
            );
            const eventColors = getEventColorsForDate(day);
            const isTodayDate = isToday(day);

            return (
              <motion.div
                key={format(day, "yyyy-MM-dd")}
                className={cn(
                  "relative aspect-square bg-white p-1",
                  hasEvents ? "cursor-pointer" : "cursor-default"
                )}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.01 * i, duration: 0.2 }}
                whileHover={hasEvents ? { scale: 1.05 } : {}}
                whileTap={hasEvents ? { scale: 0.95 } : {}}
                onClick={() => hasEvents && handleSelectDate(day)}
              >
                <div
                  className={cn(
                    "flex h-full w-full flex-col items-center justify-center rounded-lg",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : isTodayDate
                        ? "bg-gray-100"
                        : ""
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isSelected
                        ? "text-white"
                        : isTodayDate
                          ? "text-primary"
                          : "text-gray-700"
                    )}
                  >
                    {format(day, "d")}
                  </span>

                  {/* Event indicators */}
                  {hasEvents && (
                    <div className="mt-1 flex space-x-1">
                      {eventColors.map((color, i) => (
                        <motion.div
                          key={`${format(day, "yyyy-MM-dd")}-${i}`}
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            color === "blue"
                              ? "bg-blue-500"
                              : color === "purple"
                                ? "bg-purple-500"
                                : "bg-pink-500"
                          )}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Empty cells for days after the last of the month */}
          {Array.from({ length: 6 - lastDayOfMonth.getDay() }).map((_, i) => (
            <div key={`empty-end-${i}`} className="aspect-square bg-white" />
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
