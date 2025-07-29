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
  const [excelData, setExcelData] = useState({ lessons: [], teachers: [], rooms: [] });
  const [schedule, setSchedule] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Для слайдера дней недели
  const [activeDayIdx, setActiveDayIdx] = useState(0); // 0 - понедельник

  // Находим понедельник текущей недели для выбранной даты
  const monday = getMonday(selectedDate);

  // Массив дат с понедельника по субботу
  const weekDates = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date;
  });

  // Обновить дату и выбранный день при выборе дня недели на слайдере
  function handleSliderChange(idx) {
    setActiveDayIdx(idx);
    setSelectedDate(weekDates[idx]);
  }

  // Добавление расписания по форме
  function handleAddToSchedule({ date, group, pairNum, lesson, teacher, room, online }) {
  const dateKey = new Date(date).toISOString().slice(0,10);
  setSchedule(prev => ({
    ...prev,
    [dateKey]: {
      ...(prev[dateKey] || {}),
      [group]: {
        ...(prev[dateKey]?.[group] || {}),
        [pairNum]: { lesson, teacher, room, online }
      }
    }
  }));
}


  return (
    <div style={{display:"flex", minHeight: "100vh"}}>
      {/* Левая панель */}
      <div className="left-panel">
        <h2>Table MSU</h2>
        <ExcelUpload setExcelData={setExcelData} />
        <label style={{marginTop: 18, fontWeight: "bold"}}>Календарь даты:
          <input
            type="date"
            value={selectedDate.toISOString().slice(0,10)}
            onChange={e => {
              setSelectedDate(new Date(e.target.value));
              // Пересчитать активный день слайдера
              const monday = getMonday(new Date(e.target.value));
              const d = new Date(e.target.value);
              const idx = Math.max(0, Math.min(5, Math.floor((d - monday) / (1000*60*60*24))));
              setActiveDayIdx(idx);
            }}
            style={{marginLeft: 8}}
          />
        </label>
        <ScheduleForm
          lessons={excelData.lessons}
          teachers={excelData.teachers}
          rooms={excelData.rooms}
          date={selectedDate}
          onAdd={handleAddToSchedule}
        />
        <ExportToWord
          schedule={schedule}
          date={selectedDate}
        />
        <ExportToJson
          schedule={schedule}
          date={selectedDate}
        />
        <ExportWeekToWord
          schedule={schedule}
          selectedDate={selectedDate}
        />
        <ExportWeekToJson
          schedule={schedule}
          selectedDate={selectedDate}
        />
        <ImportWeekFromJson setSchedule={setSchedule} 
        />
      </div>
      {/* Правая часть: Слайдер и расписание */}
      <div style={{flex:1, padding:"32px", overflowY:"auto", background: "#fff"}}>
        <SliderDays
          weekDates={weekDates}
          activeIdx={activeDayIdx}
          setActiveIdx={handleSliderChange}
        />
        <div id="print-area">
          <ScheduleTable
            date={weekDates[activeDayIdx]}
            schedule={schedule[weekDates[activeDayIdx].toISOString().slice(0,10)] || {}}
          />
        </div>
      </div>
    </div>
  );
}
