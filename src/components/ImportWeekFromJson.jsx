// ImportWeekFromJson.jsx
import React from "react";

export default function ImportWeekFromJson({ setSchedule, groups }) {
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
          // Фильтруем только нужные группы из импортированных данных
          const filteredData = {};
          for (const [dateKey, groupData] of Object.entries(data)) {
            filteredData[dateKey] = {};
            for (const group of groups) {
              if (groupData[group]) {
                filteredData[dateKey][group] = groupData[group];
              }
            }
          }
          setSchedule((prev) => ({ ...prev, ...filteredData }));
          alert("Расписание за неделю успешно загружено!");
        } catch (err) {
          console.error(err);
          alert("Ошибка при чтении файла расписания.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  return (
    <button
      type="button"
      className="export-btn"
      style={{ marginTop: 12 }}
      onClick={handleImport}
    >
      Импорт JSON (неделя)
    </button>
  );
}
