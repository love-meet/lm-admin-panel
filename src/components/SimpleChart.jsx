// import React, { useEffect, useRef } from 'react';

// /**
//  * SimpleChart: lightweight canvas-based chart without external deps.
//  * Props:
//  * - type: 'line' | 'bar'
//  * - labels: string[]
//  * - data: number[]
//  * - color: string (stroke/fill color)
//  * - height: number (px)
//  * - grid: boolean (show grid)
//  */
// export default function SimpleChart({ type = 'line', labels = [], data = [], color = '#22d3ee', height = 256, grid = true }) {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const dpr = window.devicePixelRatio || 1;
//     const width = canvas.parentElement?.clientWidth || 600;
//     canvas.width = width * dpr;
//     canvas.height = height * dpr;
//     canvas.style.width = width + 'px';
//     canvas.style.height = height + 'px';

//     const ctx = canvas.getContext('2d');
//     ctx.scale(dpr, dpr);

//     // Padding
//     const pad = { top: 16, right: 16, bottom: 28, left: 36 };
//     const w = width - pad.left - pad.right;
//     const h = height - pad.top - pad.bottom;

//     // Background
//     ctx.fillStyle = 'transparent';
//     ctx.fillRect(0, 0, width, height);

//     // Axes and grid
//     const maxVal = Math.max(...data, 1);
//     const minVal = Math.min(...data, 0);
//     const yMax = Math.ceil(maxVal * 1.1);
//     const yMin = Math.floor(minVal * 0.9);
//     const yRange = yMax - yMin || 1;
//   ctx.fillStyle = '#fff';
//     ctx.translate(pad.left, pad.top);

//     if (grid) {
//       ctx.strokeStyle = 'rgba(255,255,255,0.08)';
//       ctx.lineWidth = 1;
//       const steps = 4;
//       for (let i = 0; i <= steps; i++) {
//         const y = (h / steps) * i;
//         ctx.beginPath();
//         ctx.moveTo(0, y);
//         ctx.lineTo(w, y);
//         ctx.stroke();
//       }
//     }
//   ctx.fillStyle = '#fff';
//     ctx.fillStyle = 'var(--color-text-secondary)';
//     ctx.font = '12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
//     ctx.textAlign = 'right';
//     ctx.textBaseline = 'middle';
//     const ticks = 4;
//     for (let i = 0; i <= ticks; i++) {
//       const val = yMax - (yRange / ticks) * i;
//       const y = (h / ticks) * i;
//       ctx.fillText(String(Math.round(val)), -8, y);
//     }

//     // X axis labels
//     ctx.textAlign = 'center';
//     ctx.textBaseline = 'top';
//     const n = labels.length;
//     for (let i = 0; i < n; i++) {
//       const x = n === 1 ? w / 2 : (w / (n - 1)) * i;
//       ctx.fillText(labels[i], x, h + 6);
//     }

//     // Plot
//     if (type === 'line') {
//       const points = data.map((v, i) => {
//         const x = data.length === 1 ? w / 2 : (w / (data.length - 1)) * i;
//         const y = h - ((v - yMin) / yRange) * h;
//         return { x, y };
//       });

//       // Area fill
//       ctx.beginPath();
//       points.forEach((p, i) => {
//         if (i === 0) ctx.moveTo(p.x, p.y);
//         else ctx.lineTo(p.x, p.y);
//       });
//       ctx.lineTo(points[points.length - 1]?.x ?? w, h);
//       ctx.lineTo(0, h);
//       ctx.closePath();
//       ctx.fillStyle = hexToRgba(color, 0.15);
//       ctx.fill();

//       // Stroke
//       ctx.beginPath();
//       points.forEach((p, i) => {
//         if (i === 0) ctx.moveTo(p.x, p.y);
//         else ctx.lineTo(p.x, p.y);
//       });
//       ctx.strokeStyle = color;
//       ctx.lineWidth = 2;
//       ctx.stroke();

//       // Dots
//       ctx.fillStyle = color;
//       points.forEach((p) => {
//         ctx.beginPath();
//         ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
//         ctx.fill();
//       });
//     } else if (type === 'bar') {
//       const n = data.length;
//       const gap = 8;
//       const barW = Math.max(6, (w - gap * (n + 1)) / n);
//       ctx.fillStyle = color;
//       for (let i = 0; i < n; i++) {
//         const x = gap + i * (barW + gap);
//         const bh = ((data[i] - yMin) / yRange) * h;
//         const y = h - bh;
//         ctx.fillRect(x, y, barW, bh);
//       }
//     }

//     // Cleanup translation
//     ctx.setTransform(1, 0, 0, 1, 0, 0);
//   }, [type, labels, data, color, height, grid]);

//   return (
//     <div className="w-full">
//       <canvas ref={canvasRef} />
//     </div>
//   );
// }

// function hexToRgba(hex, a = 1) {
//   if (hex.startsWith('rgb')) return hex;
//   let c = hex.replace('#', '');
//   if (c.length === 3) c = c.split('').map((ch) => ch + ch).join('');
//   const num = parseInt(c, 16);
//   const r = (num >> 16) & 255;
//   const g = (num >> 8) & 255;
//   const b = num & 255;
//   return `rgba(${r}, ${g}, ${b}, ${a})`;
// }
