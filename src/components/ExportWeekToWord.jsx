import React from "react";
import { saveAs } from "file-saver";
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, AlignmentType, WidthType, PageOrientation, VerticalAlign
} from "docx";

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
const weekDayNames = [
  "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"
];

function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString("ru-RU");
}

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay() === 0 ? 7 : d.getDay(); // 1=Пн, 7=Вс
  d.setDate(d.getDate() - (day - 1));
  return d;
}

export default function ExportWeekToWord({ schedule, selectedDate }) {
  function handleExport() {
    // Массив дат с понедельника по субботу
    const monday = getMonday(selectedDate);
    const weekDates = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date;
    });

    const allSections = weekDates.map((date, idx) => {
      const dayKey = date.toISOString().slice(0, 10);
      const rowsObj = schedule[dayKey] || {};

      // --- ДВУХКОЛОНОЧНАЯ ШАПКА (аналогично дню) ---
      const headerTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 70, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: "ФИЛИАЛ МОСКОВСКОГО", size: 24, font: "Times New Roman", bold: true })],
                    alignment: AlignmentType.LEFT,
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: "ГОСУДАРСТВЕННОГО УНИВЕРСИТЕТА", size: 24, font: "Times New Roman", bold: true })],
                    alignment: AlignmentType.LEFT,
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: "имени М.В.ЛОМОНОСОВА", size: 24, font: "Times New Roman", bold: true })],
                    alignment: AlignmentType.LEFT,
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: "в городе САРОВЕ", size: 24, font: "Times New Roman" })],
                    alignment: AlignmentType.LEFT,
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: "(Филиал МГУ в г. Сарове)", size: 22, font: "Times New Roman" })],
                    alignment: AlignmentType.LEFT,
                  }),
                ],
                verticalAlign: VerticalAlign.TOP,
              }),
              new TableCell({
                width: { size: 30, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: "«УТВЕРЖДАЮ»", bold: true, size: 24, font: "Times New Roman" })],
                    alignment: AlignmentType.LEFT,
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: "Директор Филиала МГУ Саров", size: 22, font: "Times New Roman" })],
                    alignment: AlignmentType.LEFT,
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: "Член-корр. РАН", size: 22, font: "Times New Roman" })],
                    alignment: AlignmentType.LEFT,
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: "Воеводин В.В.", size: 22, font: "Times New Roman" })],
                    alignment: AlignmentType.LEFT,
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: "«     » ________________ 2025 г.", size: 20, font: "Times New Roman" })],
                    alignment: AlignmentType.LEFT,
                  }),
                ],
                verticalAlign: VerticalAlign.TOP,
              }),
            ]
          })
        ]
      });

      // Только дата
      const dateParagraph = new Paragraph({
        children: [
          new TextRun({
            text: `Дата: ${formatDate(date)}  (${weekDayNames[idx]})`,
            size: 24,
            font: "Times New Roman"
          })
        ],
        alignment: AlignmentType.LEFT,
        spacing: { after: 250 }
      });

      // Таблица расписания (выравнивание по центру)
      const groupHeaderRow = new TableRow({
        children: [
          new TableCell({
            width: { size: 500, type: WidthType.DXA },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "№", bold: true, size: 24, font: "Times New Roman" })]
              })
            ],
            shading: { fill: "DEEAF6" }
          }),
          new TableCell({
            width: { size: 1500, type: WidthType.DXA },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Время", bold: true, size: 24, font: "Times New Roman" })]
              })
            ],
            shading: { fill: "DEEAF6" }
          }),
          ...GROUPS.map(group =>
            new TableCell({
              verticalAlign: VerticalAlign.CENTER,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: group, alignment: AlignmentType.CENTER, bold: true, size: 24, font: "Times New Roman" })]
                })
              ],
              shading: { fill: "DEEAF6" }
            })
          )
        ]
      });

      const pairRows = PAIRS.map(pair => new TableRow({
        children: [
          new TableCell({
            width: { size: 500, type: WidthType.DXA },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: String(pair.num), bold: true, font: "Times New Roman", size: 22 })]
              })
            ]
          }),
          new TableCell({
            width: { size: 1500, type: WidthType.DXA },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: pair.time, font: "Times New Roman", size: 22 })]
              })
            ]
          }),
          ...GROUPS.map(group => {
            const entry = rowsObj[group]?.[pair.num];
            const cellParagraphs = entry
                ? [
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: entry.lesson || "", font: "Times New Roman", size: 22 })]
                    }),
                    ...(Array.isArray(entry.teacher)
                        ? entry.teacher.map(t =>
                            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: t, font: "Times New Roman", size: 22 })] })
                        )
                        : [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: entry.teacher || "", font: "Times New Roman", size: 22 })] })]
                    ),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: entry.room || "", font: "Times New Roman", size: 22 })]
                    }),
                    ...(entry.online ? [
                        new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "(онлайн)", font: "Times New Roman", size: 22 })]
                        })
                    ] : [])
                    ]
                : [new Paragraph({ alignment: AlignmentType.CENTER, text: "" })];

            return new TableCell({
              verticalAlign: VerticalAlign.CENTER,
              children: cellParagraphs
            });
          })
        ]
      }));

      const table = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          groupHeaderRow,
          ...pairRows
        ]
      });

      return {
        properties: { page: { size: { orientation: PageOrientation.LANDSCAPE } } },
        children: [
          headerTable,
          new Paragraph({ text: "", spacing: { after: 180 } }),
          dateParagraph,
          table,
          new Paragraph({ text: "", spacing: { after: 300 } }), // отступ между днями
        ]
      };
    });

    const doc = new Document({
      styles: {
        default: {
          document: {
            run: {
              font: "Times New Roman",
              size: 22
            }
          }
        }
      },
      sections: allSections
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `Расписание_недели.docx`);
    });
  }

  return (
    <button className="export-btn" onClick={handleExport}>
      Экспорт недели в Word (.docx)
    </button>
  );
}
