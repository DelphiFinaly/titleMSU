// ExportWeekToJson.jsx
import React from "react";

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay() === 0 ? 7 : d.getDay();
  if (day !== 1) d.setDate(d.getDate() - (day - 1));
  return d;
}

export default function ExportWeekToJson({ schedule, selectedDate, groups }) {
  function handleExport() {
    const monday = getMonday(selectedDate);
    const weekDates = Array.from({ length: 6 }, (_, i) => {
      const dt = new Date(monday);
      dt.setDate(monday.getDate() + i);
      return dt.toISOString().slice(0, 10);
    });

    // Собираем данные недели по выбранным группам
    const weekData = weekDates.reduce((acc, dateKey) => {
      const rowsObj = schedule[dateKey] || {};
      acc[dateKey] = groups.reduce((grpAcc, group) => {
        grpAcc[group] = rowsObj[group] || {};
        return grpAcc;
      }, {});
      return acc;
    }, {});

    const json = JSON.stringify(weekData, null, 2);
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
    <button type="button" className="export-btn" style={{ marginTop: 12 }} onClick={handleExport}>
      Экспорт JSON (неделя)
    </button>
  );
}
