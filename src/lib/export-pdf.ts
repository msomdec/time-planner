import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatTime } from "./format-time";
import type { TimelineItem } from "@/types";

interface ExportOptions {
  timelineName: string;
  timelineDescription?: string;
  items: TimelineItem[];
}

export function exportTimelinePdf({
  timelineName,
  timelineDescription,
  items,
}: ExportOptions) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // -- Header accent bar --
  doc.setFillColor(244, 63, 94); // rose-500
  doc.rect(0, 0, pageWidth, 4, "F");

  // -- Title --
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(24, 24, 27);
  doc.text(timelineName, 20, 24);

  // -- Description --
  let yPos = 32;
  if (timelineDescription) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(113, 113, 122);
    const descLines = doc.splitTextToSize(timelineDescription, pageWidth - 40);
    doc.text(descLines, 20, yPos);
    yPos += descLines.length * 5 + 4;
  }

  // -- Generated date --
  doc.setFontSize(9);
  doc.setTextColor(161, 161, 170);
  doc.text(
    `Generated ${new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`,
    20,
    yPos
  );
  yPos += 10;

  // -- Divider --
  doc.setDrawColor(244, 63, 94);
  doc.setLineWidth(0.5);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 8;

  // -- Table --
  if (items.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(11);
    doc.setTextColor(161, 161, 170);
    doc.text("No items in this timeline yet.", 20, yPos);
  } else {
    const tableData = items.map((item, index) => {
      const time = buildTimeString(item);
      const date = item.startDate
        ? new Date(item.startDate).toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
          })
        : "";

      return [String(index + 1), item.name, date, time, item.description || "—"];
    });

    autoTable(doc, {
      startY: yPos,
      head: [["#", "Event", "Date", "Time", "Details"]],
      body: tableData,
      margin: { left: 20, right: 20 },
      styles: {
        fontSize: 9.5,
        cellPadding: 5,
        textColor: [24, 24, 27],
        lineColor: [244, 63, 94],
        lineWidth: 0,
      },
      headStyles: {
        fillColor: [254, 242, 242], // rose-50
        textColor: [190, 18, 60],   // rose-700
        fontStyle: "bold",
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [255, 251, 252],
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center", textColor: [190, 18, 60] },
        1: { cellWidth: 40, fontStyle: "bold" },
        2: { cellWidth: 30 },
        3: { cellWidth: 32 },
        4: { cellWidth: "auto" },
      },
      didParseCell: (data) => {
        // Add a subtle bottom border to each row
        if (data.section === "body") {
          data.cell.styles.lineWidth = { bottom: 0.1 };
          data.cell.styles.lineColor = [228, 228, 231];
        }
      },
    });
  }

  // -- Footer on each page --
  const pageCount = (doc as any).getNumberOfPages() as number;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(161, 161, 170);
    doc.text("Wedding Planner", 20, pageHeight - 10);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, pageHeight - 10, {
      align: "right",
    });
  }

  // -- Save --
  const safeName = timelineName.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  doc.save(`${safeName}-timeline.pdf`);
}

function buildTimeString(item: TimelineItem): string {
  if (!item.startTime && !item.endTime) return "—";
  if (item.startTime && item.endTime)
    return `${formatTime(item.startTime)} – ${formatTime(item.endTime)}`;
  if (item.startTime) return formatTime(item.startTime);
  return `ends ${formatTime(item.endTime!)}`;
}
