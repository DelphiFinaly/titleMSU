import React from "react";

export default function ImportWeekFromJson({ setSchedule }) {
  function handleImport() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = JSON.parse(evt.target.result);
          setSchedule(prev => ({ ...prev, ...data }));
          alert("Расписание за неделю успешно загружено!");
        } catch (err) {
          alert("Ошибка при чтении файла расписания.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }
  return (
    <button className="export-btn" style={{ marginTop: 12 }} onClick={handleImport}>
      Импорт JSON (неделя)
    </button>
  );
}
