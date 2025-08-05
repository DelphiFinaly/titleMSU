// App.jsx
import React, { useState } from "react";
import ExcelUpload from "./components/ExcelUpload";
import ScheduleForm from "./components/ScheduleForm";
import ScheduleTable from "./components/ScheduleTable";
import ExportToWord from "./components/ExportToWord";
import ExportWeekToWord from "./components/ExportWeekToWord";
import SliderDays from "./components/SliderDays";
import ExportToJson from "./components/ExportToJson";
import ExportWeekToJson from "./components/ExportWeekToJson";
import ImportWeekFromJson from "./components/ImportWeekFromJson";

// Вспомогательная функция для поиска понедельника
function getMonday(d) {
  d = new Date(d);
  const day = d.getDay() || 7; // 1=Пн, 7=Вс
  if (day !== 1) d.setDate(d.getDate() - (day - 1));
  return d;
}

export default function App() {
  // Данные из загруженного Excel
  const [excelData, setExcelData] = useState({ lessons: [], teachers: [], rooms: [] });
  const [schedule, setSchedule] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  // Состояние выбранного курса (1 или 2)
  const [selectedCourse, setSelectedCourse] = useState(1);

  // Вычисляем понедельник и массив дат недели
  const monday = getMonday(selectedDate);
  const weekDates = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date;
  });

  // Вычисляем суффикс курса (125 или 224) и формируем список групп
  const courseSuffix = selectedCourse === 1 ? "125" : "224";
  const GROUPS = ["ВМ", "СКТ", "ТФ", "ЯФФ", "ЛНОФ"].map(
    (prefix) => `${prefix}-${courseSuffix}`
  );

  // Обработчик слайдера дней
  function handleSliderChange(idx) {
    setActiveDayIdx(idx);
    setSelectedDate(weekDates[idx]);
  }

  // Добавление записи в расписание
  function handleAddToSchedule({ date, group, pairNum, lesson, teacher, room, online }) {
    const dateKey = new Date(date).toISOString().slice(0, 10);
    setSchedule((prev) => ({
      ...prev,
      [dateKey]: {
        ...(prev[dateKey] || {}),
        [group]: {
          ...(prev[dateKey]?.[group] || {}),
          [pairNum]: { lesson, teacher, room, online },
        },
      },
    }));
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Левая панель */}
      <div className="left-panel">
        <h2>Table MSU</h2>
        <ExcelUpload setExcelData={setExcelData} />

        <label style={{ marginTop: 18, fontWeight: "bold", display: "block" }}>
          Календарь даты:
          <input
            type="date"
            value={selectedDate.toISOString().slice(0, 10)}
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              setSelectedDate(newDate);
              const newMonday = getMonday(newDate);
              const idx = Math.max(
                0,
                Math.min(
                  5,
                  Math.floor((newDate - newMonday) / (1000 * 60 * 60 * 24))
                )
              );
              setActiveDayIdx(idx);
            }}
            style={{ marginLeft: 8 }}
          />
        </label>

        {/* Выпадающий список выбора курса */}
        <label style={{ marginTop: 18, fontWeight: "bold", display: "block" }}>
          Курс:
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(Number(e.target.value))}
            style={{ marginLeft: 8 }}
          >
            <option value={1}>1 курс</option>
            <option value={2}>2 курс</option>
          </select>
        </label>

        <ScheduleForm
          lessons={excelData.lessons}
          teachers={excelData.teachers}
          rooms={excelData.rooms}
          date={selectedDate}
          onAdd={handleAddToSchedule}
          groups={GROUPS}
        />

        {/* Передаем динамические группы в компоненты экспорта */}
        <ExportToWord groups={GROUPS} schedule={schedule} date={selectedDate} />
        <ExportWeekToWord groups={GROUPS} schedule={schedule} selectedDate={selectedDate} />

        <ExportToJson groups={GROUPS} schedule={schedule} date={selectedDate} />
        <ExportWeekToJson groups={GROUPS} schedule={schedule} selectedDate={selectedDate} />
        <ImportWeekFromJson setSchedule={setSchedule} />
      </div>

      {/* Правая часть: слайдер и таблица */}
      <div style={{ flex: 1, padding: "32px", overflowY: "auto", background: "#fff" }}>
        <SliderDays
          weekDates={weekDates}
          activeIdx={activeDayIdx}
          setActiveIdx={handleSliderChange}
        />
        <div id="print-area">
          <ScheduleTable
            date={weekDates[activeDayIdx]}
            schedule={schedule[weekDates[activeDayIdx].toISOString().slice(0, 10)] || {}}
            groups={GROUPS}
          />
        </div>
      </div>
    </div>
  );
}
