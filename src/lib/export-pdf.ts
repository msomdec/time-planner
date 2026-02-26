import jsPDF from "jspdf";
import { formatTime } from "./format-time";
import type { TimelineItem } from "@/types";

interface ExportOptions {
  timelineName: string;
  timelineDescription?: string;
  items: TimelineItem[];
}

// Layout constants (mm)
const DOT_X = 57;
const CARD_X = 62;
const CARD_W = 128;
const TIME_COL_RIGHT = 53;
const DOT_RADIUS = 1.5;
const CARD_PADDING = 4;
const CARD_RADIUS = 3;
const ITEM_GAP = 2;
const MAX_Y = 282; // page height minus footer reserve

function hexToRgb(hex: string): [number, number, number] {
  const cleaned = hex.replace("#", "");
  const num = parseInt(cleaned, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function measureItemHeight(doc: jsPDF, item: TimelineItem): number {
  let h = CARD_PADDING + 5 + CARD_PADDING; // padding-top + name line + padding-bottom
  if (item.description) {
    const lines = doc.splitTextToSize(item.description, CARD_W - CARD_PADDING * 2);
    const descLines = Math.min(lines.length, 2);
    h += 1 + descLines * 3.5; // gap + line height per desc line
  }
  return h;
}

function drawDateHeader(doc: jsPDF, label: string, y: number): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(190, 18, 60); // rose-700
  doc.text(label, CARD_X, y);

  const textW = doc.getTextWidth(label);
  doc.setDrawColor(252, 228, 236); // rose-200
  doc.setLineWidth(0.3);
  doc.line(CARD_X + textW + 3, y - 1, CARD_X + CARD_W, y - 1);

  return y + 8;
}

function drawTimelineItem(
  doc: jsPDF,
  item: TimelineItem,
  y: number,
  isLastInGroup: boolean,
  cardHeight: number
) {
  const isRange = item.startTime && item.endTime;

  // -- Time column (right-aligned) --
  const timeCenterY = y + CARD_PADDING + 3;
  if (item.startTime) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(24, 24, 27);
    doc.text(formatTime(item.startTime), TIME_COL_RIGHT, timeCenterY, {
      align: "right",
    });
    if (isRange) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(161, 161, 170);
      doc.text(`to ${formatTime(item.endTime!)}`, TIME_COL_RIGHT, timeCenterY + 4, {
        align: "right",
      });
    }
  } else {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(161, 161, 170);
    doc.text("—", TIME_COL_RIGHT, timeCenterY, { align: "right" });
  }

  // -- Dot --
  const dotY = timeCenterY - 0.5;
  const [r, g, b] = hexToRgb(item.color ?? "#f43f5e");
  doc.setFillColor(r, g, b);
  doc.circle(DOT_X, dotY, DOT_RADIUS, "F");
  // White border on the dot
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.6);
  doc.circle(DOT_X, dotY, DOT_RADIUS, "S");

  // -- Connector line --
  if (!isLastInGroup) {
    doc.setDrawColor(252, 228, 236); // rose-200
    doc.setLineWidth(0.3);
    doc.line(DOT_X, dotY + DOT_RADIUS + 0.5, DOT_X, y + cardHeight + ITEM_GAP);
  }

  // -- Card background --
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(254, 226, 234); // rose-100
  doc.setLineWidth(0.3);
  doc.roundedRect(CARD_X, y, CARD_W, cardHeight, CARD_RADIUS, CARD_RADIUS, "FD");

  // -- Event name --
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(24, 24, 27);

  const nameMaxW = CARD_W - CARD_PADDING * 2;

  let displayName = item.name;
  if (doc.getTextWidth(displayName) > nameMaxW) {
    while (displayName.length > 0 && doc.getTextWidth(displayName + "…") > nameMaxW) {
      displayName = displayName.slice(0, -1);
    }
    displayName += "…";
  }
  const nameY = y + CARD_PADDING + 3.5;
  doc.text(displayName, CARD_X + CARD_PADDING, nameY);

  // -- Description --
  if (item.description) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(113, 113, 122);
    const allLines: string[] = doc.splitTextToSize(
      item.description,
      CARD_W - CARD_PADDING * 2
    );
    const lines = allLines.slice(0, 2);
    if (allLines.length > 2) {
      // Truncate last visible line with ellipsis
      let lastLine = lines[1];
      while (lastLine.length > 0 && doc.getTextWidth(lastLine + "…") > CARD_W - CARD_PADDING * 2) {
        lastLine = lastLine.slice(0, -1);
      }
      lines[1] = lastLine + "…";
    }
    const descY = nameY + 5;
    doc.text(lines, CARD_X + CARD_PADDING, descY);
  }
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

  // -- Items grouped by date --
  if (items.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(11);
    doc.setTextColor(161, 161, 170);
    doc.text("No items in this timeline yet.", 20, yPos);
  } else {
    // Group items by date
    const groups: { date: string | null; items: TimelineItem[] }[] = [];
    for (const item of items) {
      const date = item.startDate ?? null;
      const last = groups[groups.length - 1];
      if (last && last.date === date) {
        last.items.push(item);
      } else {
        groups.push({ date, items: [item] });
      }
    }

    for (const group of groups) {
      // Date section header
      const dateLabel = group.date
        ? new Date(group.date + "T00:00:00").toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : "Unscheduled";

      // Check if date header fits
      if (yPos + 8 > MAX_Y) {
        doc.addPage();
        doc.setFillColor(244, 63, 94);
        doc.rect(0, 0, pageWidth, 1.5, "F");
        yPos = 12;
      }

      yPos = drawDateHeader(doc, dateLabel, yPos);

      for (let i = 0; i < group.items.length; i++) {
        const item = group.items[i];
        const isLast = i === group.items.length - 1;
        const cardH = measureItemHeight(doc, item);

        // Page break check
        if (yPos + cardH > MAX_Y) {
          doc.addPage();
          doc.setFillColor(244, 63, 94);
          doc.rect(0, 0, pageWidth, 1.5, "F");
          yPos = 12;
        }

        drawTimelineItem(doc, item, yPos, isLast, cardH);
        yPos += cardH + ITEM_GAP;
      }

      yPos += 4; // gap between groups
    }
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
