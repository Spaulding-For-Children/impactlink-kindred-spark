import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, Clock, Video, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEventsByMonth, Event } from "@/hooks/useEvents";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, getDay, startOfWeek, endOfWeek } from "date-fns";

const TYPE_COLORS: Record<string, string> = {
  workshop: "bg-violet-500",
  webinar: "bg-sky-500",
  conference: "bg-amber",
  networking: "bg-rose-500",
  training: "bg-emerald-500",
};

export const EventCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const { data: events, isLoading } = useEventsByMonth(year, month);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDay = (day: Date) => {
    return events?.filter((event) => isSameDay(new Date(event.start_date), day)) || [];
  };

  const selectedDayEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar Grid */}
        <div className="flex-1">
          <Card>
            <CardContent className="p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={goToNextMonth}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <h2 className="text-xl font-display font-bold ml-2">
                    {format(currentDate, "MMMM yyyy")}
                  </h2>
                </div>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Today
                </Button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  const dayEvents = getEventsForDay(day);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isToday = isSameDay(day, new Date());
                  const isSelected = selectedDate && isSameDay(day, selectedDate);

                  return (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.01 }}
                      onClick={() => setSelectedDate(day)}
                      className={`
                        relative p-2 min-h-[80px] rounded-lg border text-left transition-all
                        ${!isCurrentMonth ? "opacity-40" : ""}
                        ${isToday ? "border-sage" : "border-border"}
                        ${isSelected ? "bg-sage/10 border-sage" : "hover:bg-muted/50"}
                      `}
                    >
                      <span className={`
                        text-sm font-medium
                        ${isToday ? "bg-sage text-white w-6 h-6 rounded-full flex items-center justify-center" : ""}
                      `}>
                        {format(day, "d")}
                      </span>

                      {/* Event Indicators */}
                      <div className="mt-1 space-y-0.5">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs truncate px-1 py-0.5 rounded ${TYPE_COLORS[event.event_type]} text-white`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-muted-foreground px-1">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Day Events */}
        <div className="lg:w-80">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">
                {selectedDate ? format(selectedDate, "EEEE, MMMM d") : "Select a date"}
              </h3>

              {selectedDate && selectedDayEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p>No events scheduled</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <Badge className={`${TYPE_COLORS[event.event_type]} text-white mb-2`}>
                        {event.event_type}
                      </Badge>
                      <h4 className="font-medium text-sm mb-2">{event.title}</h4>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          <span>
                            {format(new Date(event.start_date), "h:mm a")} - {format(new Date(event.end_date), "h:mm a")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {event.is_virtual ? (
                            <>
                              <Video className="w-3 h-3" />
                              <span>Virtual Event</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="w-3 h-3" />
                              <span>{event.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span className="text-muted-foreground">Event Types:</span>
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded ${color}`} />
            <span className="capitalize">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
