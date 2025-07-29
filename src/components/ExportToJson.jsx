import React from "react";

export default function ExportToJson({ schedule, date }) {
  function handleExport() {
    const dateKey = new Date(date).toISOString().slice(0, 10);
    const json = JSON.stringify({ [dateKey]: schedule[dateKey] }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `schedule_${dateKey}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  return (
    <button className="export-btn" style={{ marginTop: 12 }} onClick={handleExport}>
      Экспорт JSON (день)
    </button>
  );
}
