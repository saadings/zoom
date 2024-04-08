"use client";
import { useEffect, useState } from "react";

const DateTimeDisplay = () => {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    // This function updates the time and date states
    const updateTimeAndDate = () => {
      const now = new Date();
      const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const date = new Intl.DateTimeFormat("en-US", {
        dateStyle: "full",
      }).format(now);

      setTime(time);
      setDate(date);
    };

    // Call updateTimeAndDate initially to set the initial time and date
    updateTimeAndDate();

    // Set up the interval to update time and date every minute
    const intervalId = setInterval(updateTimeAndDate, 60000); // 60000ms = 1 minute

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="flex h-full flex-col justify-between">
      <h2 className="glassmorphism max-w-[270px] rounded py-2 text-center text-base font-normal">
        Upcoming Meeting at: 12:30 PM
      </h2>
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
        <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
      </div>
    </div>
  );
};

export default DateTimeDisplay;
