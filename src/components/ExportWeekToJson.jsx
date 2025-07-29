import React from "react";

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay() === 0 ? 7 : d.getDay();
  d.setDate(d.getDate() - (day - 1));
  return d;
}

export default function ExportWeekToJson({ schedule, selectedDate }) {
  function handleExport() {
    const monday = getMonday(selectedDate);
    const weekDates = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date.toISOString().slice(0, 10);
    });

    const weekSchedule = {};
    weekDates.forEach((dateKey) => {
      if (schedule[dateKey]) weekSchedule[dateKey] = schedule[dateKey];
    });

    const json = JSON.stringify(weekSchedule, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "schedule_week.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  return (
    <button className="export-btn" style={{ marginTop: 12 }} onClick={handleExport}>
      Экспорт JSON (неделя)
    </button>
  );
}
