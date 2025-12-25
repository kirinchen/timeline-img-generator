import { Orientation, TimeInterval, type TimelineConfig, type TimelineEvent } from '../types';

/**
 * Helper to wrap text into lines
 */
function getLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

/**
 * Main render function
 */
export const renderTimeline = (
  canvas: HTMLCanvasElement,
  config: TimelineConfig,
  events: TimelineEvent[]
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const {
    width,
    height,
    startDate,
    endDate,
    orientation,
    themeColor,
    backgroundColor,
    fontSize,
    textColor
  } = config;

  // Clear canvas
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // Setup Dates
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const range = end - start;

  // Safety check to avoid division by zero
  if (range <= 0) return;

  const padding = 60;
  const isHorizontal = orientation === Orientation.Horizontal;

  // Draw Main Axis
  ctx.beginPath();
  ctx.strokeStyle = themeColor;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';

  if (isHorizontal) {
    const centerY = height / 2;
    ctx.moveTo(padding, centerY);
    ctx.lineTo(width - padding, centerY);
  } else {
    const centerX = width / 2;
    ctx.moveTo(centerX, padding);
    ctx.lineTo(centerX, height - padding);
  }
  ctx.stroke();

  // Draw Ticks (Axis Labels)
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${fontSize}px Inter, sans-serif`;

  // Determine tick steps
  const tickDates: Date[] = [];
  const cursorDate = new Date(start);

  // Limit max ticks to avoid freezing
  let iterations = 0;
  while (cursorDate.getTime() <= end && iterations < 1000) {
    tickDates.push(new Date(cursorDate));

    switch (config.interval) {
      case TimeInterval.Daily:
        cursorDate.setDate(cursorDate.getDate() + 1);
        break;
      case TimeInterval.Weekly:
        cursorDate.setDate(cursorDate.getDate() + 7);
        break;
      case TimeInterval.Monthly:
        cursorDate.setMonth(cursorDate.getMonth() + 1);
        break;
      case TimeInterval.Yearly:
        cursorDate.setFullYear(cursorDate.getFullYear() + 1);
        break;
    }
    iterations++;
  }

  tickDates.forEach((date) => {
    const time = date.getTime();
    const ratio = (time - start) / range;

    // Skip if out of bounds (can happen with monthly/yearly math)
    if (ratio < 0 || ratio > 1) return;

    ctx.beginPath();
    ctx.fillStyle = themeColor;

    if (isHorizontal) {
      const x = padding + ratio * (width - 2 * padding);
      const y = height / 2;

      // Tick mark
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = textColor;
      // Simple date formatting based on interval
      let label = date.toISOString().split('T')[0];
      if (config.interval === TimeInterval.Monthly) {
        label = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      } else if (config.interval === TimeInterval.Yearly) {
        label = date.getFullYear().toString();
      }

      ctx.fillText(label, x, y + 25);
    } else {
      const x = width / 2;
      const y = padding + ratio * (height - 2 * padding);

      // Tick mark
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = textColor;
      let label = date.toISOString().split('T')[0];
      if (config.interval === TimeInterval.Monthly) {
        label = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      } else if (config.interval === TimeInterval.Yearly) {
        label = date.getFullYear().toString();
      }

      ctx.textAlign = 'right';
      ctx.fillText(label, x - 20, y);
    }
  });

  // Draw Events
  events.forEach((event, index) => {
    const time = new Date(event.date).getTime();
    if (time < start || time > end) return;

    const ratio = (time - start) / range;

    // Alternating placement
    const isOdd = index % 2 !== 0;

    ctx.font = `bold ${fontSize + 2}px Inter, sans-serif`;

    // Connector configuration
    const connectorLength = isHorizontal ? 60 : 80;
    // Stagger based on odd/even to avoid collision
    const stagger = isOdd ? 1 : -1;

    if (isHorizontal) {
      const x = padding + ratio * (width - 2 * padding);
      const y = height / 2;
      const contentY = y + (connectorLength * stagger);

      // Node
      ctx.beginPath();
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 3;
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Line to content
      ctx.beginPath();
      ctx.strokeStyle = themeColor + '80'; // transparent version
      ctx.lineWidth = 1;
      ctx.moveTo(x, y + (10 * stagger)); // Start slightly off the node
      ctx.lineTo(x, contentY);
      ctx.stroke();

      // Content Box Logic
      ctx.textAlign = 'center';
      ctx.textBaseline = isOdd ? 'top' : 'bottom';

      // Title
      ctx.fillStyle = textColor;
      const textYStart = isOdd ? contentY + 5 : contentY - 5;
      ctx.fillText(event.title, x, textYStart);

      // Description
      ctx.font = `normal ${fontSize - 2}px Inter, sans-serif`;
      ctx.fillStyle = textColor + '99'; // muted
      const lines = getLines(ctx, event.description, 180); // max width 180px

      let descY = textYStart + (isOdd ? (fontSize * 1.5) : -(fontSize * 1.5));

      lines.forEach((line, i) => {
        if (isOdd) {
          ctx.fillText(line, x, descY + (i * fontSize * 1.2));
        } else {
          // For bottom-aligned (even), we need to draw upwards
          const totalHeight = lines.length * fontSize * 1.2;
          ctx.fillText(line, x, descY - totalHeight + (i * fontSize * 1.2) + fontSize);
        }
      });

    } else {
      // Vertical
      const x = width / 2;
      const y = padding + ratio * (height - 2 * padding);
      const contentX = x + (connectorLength * stagger);

      // Node
      ctx.beginPath();
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 3;
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Line to content
      ctx.beginPath();
      ctx.strokeStyle = themeColor + '80';
      ctx.lineWidth = 1;
      ctx.moveTo(x + (10 * stagger), y);
      ctx.lineTo(contentX, y);
      ctx.stroke();

      // Content Text
      ctx.textAlign = isOdd ? 'left' : 'right';
      ctx.textBaseline = 'middle';

      // Title
      ctx.fillStyle = textColor;
      ctx.font = `bold ${fontSize + 2}px Inter, sans-serif`;
      const textXStart = isOdd ? contentX + 10 : contentX - 10;
      ctx.fillText(event.title, textXStart, y - 10);

      // Description
      ctx.fillStyle = textColor + '99';
      ctx.font = `normal ${fontSize - 2}px Inter, sans-serif`;
      const lines = getLines(ctx, event.description, 200);

      lines.forEach((line, i) => {
        ctx.fillText(line, textXStart, y + 10 + (i * fontSize * 1.2));
      });
    }
  }); // ✅ 這裡補上了之前漏掉的 closing parenthesis 和 semicolon
};