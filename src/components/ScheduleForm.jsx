import React, { useState } from "react";
const GROUPS = [
  "ВМ-125", "СКТ-125", "ТФ-125", "ЯФФ-125", "ЛНОФ-125"
];
const PAIRS = [
  { num: 1, time: "09.00 – 10.35" },
  { num: 2, time: "10.45 – 12.20" },
  { num: 3, time: "12.30 – 14.05" },
  { num: 4, time: "15.00 – 16.35" },
  { num: 5, time: "16.45 – 18.20" },
  { num: 6, time: "18.30 – 20.05" },
];

export default function ScheduleForm({
  lessons, teachers, rooms, date, onAdd
}) {
  const [group, setGroup] = useState(GROUPS[0]);
  const [pairNum, setPairNum] = useState(1);
  const [lesson, setLesson] = useState("");
  const [teacher, setTeacher] = useState("");
  const [teachersList, setTeachersList] = useState([]);
  const [room, setRoom] = useState("");
  const [online, setOnline] = useState(false);

  function addTeacher() {
    if (teacher && !teachersList.includes(teacher)) {
      setTeachersList(prev => [...prev, teacher]);
      setTeacher(""); // сбросить выбор
    }
  }

  function removeTeacher(t) {
    setTeachersList(prev => prev.filter(x => x !== t));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!lesson || teachersList.length === 0 || !room || !group || !pairNum) return;
    onAdd({
      date,
      group,
      pairNum,
      time: PAIRS.find(p => p.num === +pairNum).time,
      lesson,
      teacher: teachersList, // это массив!
      room,
      online
    });
    // setLesson(""); setTeachersList([]); setRoom(""); setOnline(false);
  }

  return (
    <form onSubmit={handleSubmit} style={{display:"flex", flexDirection:"column", gap:"12px"}}>
      <label>Группа:
        <select value={group} onChange={e=>setGroup(e.target.value)}>
          {GROUPS.map(g=><option key={g}>{g}</option>)}
        </select>
      </label>
      <label>Пара:
        <select value={pairNum} onChange={e=>setPairNum(e.target.value)}>
          {PAIRS.map(p=><option key={p.num} value={p.num}>{p.num} ({p.time})</option>)}
        </select>
      </label>
      <label>Предмет:
        <select value={lesson} onChange={e=>setLesson(e.target.value)}>
          <option value="">— выбрать —</option>
          {lessons.map(l=><option key={l}>{l}</option>)}
        </select>
      </label>

      {/* --- Новая форма онлайн --- */}
      <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span>онлайн</span>
        <input
          type="checkbox"
          checked={online}
          onChange={e => setOnline(e.target.checked)}
          style={{ width: 18, height: 18 }}
        />
      </label>

      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span>Преподаватель:</span>
        <select value={teacher} onChange={e=>setTeacher(e.target.value)} style={{ flex: 1 }}>
          <option value="">— выбрать —</option>
          {teachers.filter(t => !teachersList.includes(t)).map(t=><option key={t}>{t}</option>)}
        </select>
        <button type="button" style={{
          fontSize: 18,
          padding: "2px 10px",
          borderRadius: "6px",
          border: "1px solid #204290",
          color: "#204290",
          background: "#fff",
          cursor: "pointer",
          marginLeft: 2
        }} onClick={addTeacher}>+</button>
      </label>
      {/* Выбранные преподаватели */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {teachersList.map(t => (
          <div key={t} style={{
            background: "#eef2fa",
            borderRadius: "8px",
            padding: "2px 8px",
            display: "flex",
            alignItems: "center",
            gap: 3
          }}>
            <span>{t}</span>
            <button
              type="button"
              onClick={() => removeTeacher(t)}
              style={{ marginLeft: 2, color: "#204290", border: "none", background: "transparent", cursor: "pointer" }}
              title="Удалить"
            >×</button>
          </div>
        ))}
      </div>

      <label>Аудитория:
        <select value={room} onChange={e=>setRoom(e.target.value)}>
          <option value="">— выбрать —</option>
          {rooms.map(r=><option key={r}>{r}</option>)}
        </select>
      </label>
      <button type="submit" className="add-btn">Добавить в расписание</button>
    </form>
  );
}
