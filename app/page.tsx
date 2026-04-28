"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AIIndustrialHome() {
  const words = [
    "High-performance",
    "Production-grade",
    "Low-latency",
    "Open Source",
    "Scalable",
    "Modular",
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [words.length]);

  // Sine wave with embedded anomalies — drives the "Why AI" visual
  const waveformPath = useMemo(() => {
    const points = [];
    const W = 800;
    for (let x = 0; x <= W; x += 2) {
      let y = 120 + 32 * Math.sin(x * 0.045);
      // Subtle precursor distortion (only AI catches this)
      if (x > 280 && x < 340) y += 8 * Math.sin((x - 280) * 0.4);
      // Major fault event (everyone catches eventually)
      if (x > 540 && x < 600) y -= 45 * Math.sin((x - 540) * 0.05);
      points.push(`${x},${y.toFixed(1)}`);
    }
    return `M ${points.join(" L ")}`;
  }, []);

  return (
    <div className="min-h-screen bg-[#faf9f8] text-gray-900 selection:bg-[#cce3f5] selection:text-black font-rubik">
      {/* ── HERO SECTION ── */}
      <section className="relative pt-16 pb-16 md:pt-24 md:pb-24 overflow-hidden border-b border-gray-200 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Column */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-[#f3fcf3] border border-[#cce8cc] text-[#107c10] font-medium text-[13px] tracking-wide mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#107c10] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#107c10]"></span>
              </span>
              System Status: Operational
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-gray-900 mb-6 leading-tight flex flex-wrap items-center gap-x-2 sm:gap-x-3">
              <span>A</span>
              <div className="relative flex items-center justify-center min-w-[200px] sm:min-w-[280px] h-[1.2em]">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={words[index]}
                    initial={{ opacity: 0, filter: "blur(8px)", y: 10 }}
                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                    exit={{ opacity: 0, filter: "blur(8px)", y: -10 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-[#0078D4] absolute left-0 inline-block whitespace-nowrap"
                  >
                    {words[index]}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span>version of SCADA</span>
            </h1>

            <p className="text-[15px] sm:text-[16px] text-gray-600 leading-relaxed max-w-xl mb-8">
              MScada is a next-generation, also known as{" "}
              <span className="text-gray-800 font-medium px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded-sm text-[14px]">
                Modern Scada
              </span>
              , an{" "}
              <span className="font-medium text-gray-800 border-b border-gray-300">
                open source
              </span>{" "}
              monitoring layer that elevates traditional SCADA systems with
              intelligent capabilities. By combining real-time telemetry
              processing, machine learning based fault detection, and
              millisecond level event analysis, it delivers deeper operational
              insight, faster anomaly detection, and smarter automation.
            </p>

            {/* ── CONSOLE SELECTOR CTAs ── */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/manual"
                className="group flex items-center gap-3 px-5 py-3.5 bg-white border border-gray-300 hover:border-gray-900 rounded-2xl transition-all"
              >
                <div className="flex flex-col items-start">
                  <span className="text-[11px] uppercase tracking-[0.15em] text-gray-500 group-hover:text-gray-700 font-medium">
                    Mode 01
                  </span>
                  <span className="text-[15px] font-medium text-gray-900">
                    Manual Console →
                  </span>
                </div>
              </Link>

              <Link
                href="/direct"
                className="group flex items-center gap-3 px-5 py-3.5 bg-[#0078D4] hover:bg-[#106EBE] border border-[#0078D4] hover:border-[#106EBE] rounded-2xl transition-all shadow-sm"
              >
                <div className="flex flex-col items-start">
                  <span className="text-[11px] uppercase tracking-[0.15em] text-blue-100 font-medium">
                    Mode 02 · AI
                  </span>
                  <span className="text-[15px] font-medium text-white">
                    Automated Console →
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="w-full flex justify-center items-center lg:justify-end">
            <div className="relative w-full max-w-[600px] bg-white border border-gray-200 shadow-sm rounded-sm p-2">
              <div className="aspect-[4/3] relative w-full overflow-hidden bg-[#f3f2f1]">
                <Image
                  src="/housepower.png"
                  alt="Predictive Intelligence Dashboard"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── METRICS SECTION ── */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-gray-200">
            {[
              { label: "Operating Efficiency", val: "+34%" },
              { label: "Grid Availability", val: "99.99%" },
              { label: "Detection Latency", val: "< 10ms" },
              { label: "False Positives", val: "0.02%" },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex flex-col gap-1 sm:px-6 lg:px-8 first:pl-0 lg:first:pl-4 last:pr-0"
              >
                <span className="text-3xl lg:text-4xl font-medium text-[#0078D4] tracking-tight">
                  {stat.val}
                </span>
                <span className="text-[12px] font-medium text-gray-500 uppercase tracking-wide">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY AI · THE UNIQUE SECTION ── */}
      <section className="relative bg-[#faf9f8] border-b border-gray-200 overflow-hidden">
        {/* Schematic grid background */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          {/* Section label */}
          <div className="flex items-center gap-4 mb-10">
            <span className="text-[12px] uppercase tracking-[0.2em] text-gray-500 font-medium"></span>
            <span className="h-px flex-1 bg-gray-300 max-w-[120px]"></span>
            <span className="text-[12px] uppercase tracking-[0.2em] text-gray-400 font-mono">
              §02
            </span>
          </div>

          {/* Editorial headline */}
          <div className="grid lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-7">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-gray-900 leading-[1.05]">
                The grid speaks in{" "}
                <span className="text-[#0078D4]">milliseconds</span>.
                <br />
                Most systems listen in{" "}
                <span className="line-through decoration-[#D13438] decoration-2">
                  seconds
                </span>
                .
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pl-8 lg:border-l lg:border-gray-300 flex flex-col justify-end">
              <p className="text-[15px] text-gray-600 leading-relaxed mb-4">
                In August 2003, a single sagging power line in Ohio cascaded
                into the largest blackout in North American history. 50 million
                people, two days, $6 billion. Traditional SCADA had logged the
                fault. No one read the alarm in time.
              </p>
              <div className="text-[12px] uppercase tracking-wider text-gray-500 font-mono">
                ⚠ Signal logged · Operator response: 4m 12s
              </div>
            </div>
          </div>

          {/* ── LIVE WAVEFORM PANEL (HMI-styled) ── */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden mb-16">
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#D13438]"></span>
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FFB900]"></span>
                  <span className="h-2.5 w-2.5 rounded-full bg-[#107C10]"></span>
                </div>
                <span className="text-[12px] font-mono text-gray-600">
                  channel_03 · grid.bus.07 · 50.000Hz
                </span>
              </div>
              <div className="flex items-center gap-2 text-[12px] font-mono text-[#107C10]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#107C10] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#107C10]"></span>
                </span>
                LIVE
              </div>
            </div>

            {/* Waveform SVG */}
            <div className="relative bg-[#fcfcfc]">
              <svg
                viewBox="0 0 800 240"
                className="w-full h-auto"
                preserveAspectRatio="none"
              >
                <defs>
                  <pattern
                    id="wgrid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="#f3f2f1"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="800" height="240" fill="url(#wgrid)" />

                {/* Static thresholds (traditional SCADA) */}
                <line
                  x1="0"
                  y1="65"
                  x2="800"
                  y2="65"
                  stroke="#FFB900"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <line
                  x1="0"
                  y1="175"
                  x2="800"
                  y2="175"
                  stroke="#FFB900"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <text
                  x="8"
                  y="60"
                  className="fill-[#FFB900]"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  threshold_high
                </text>
                <text
                  x="8"
                  y="187"
                  className="fill-[#FFB900]"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  threshold_low
                </text>

                {/* Center line */}
                <line
                  x1="0"
                  y1="120"
                  x2="800"
                  y2="120"
                  stroke="#d1d5db"
                  strokeWidth="0.5"
                />

                {/* Animated drawn waveform */}
                <motion.path
                  d={waveformPath}
                  stroke="#0078D4"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />

                {/* AI early-detection marker */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                >
                  <motion.circle
                    cx="310"
                    cy="135"
                    r="14"
                    fill="none"
                    stroke="#0078D4"
                    strokeWidth="1.5"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0.3, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ transformOrigin: "310px 135px" }}
                  />
                  <circle cx="310" cy="135" r="4" fill="#0078D4" />
                  <line
                    x1="310"
                    y1="135"
                    x2="310"
                    y2="30"
                    stroke="#0078D4"
                    strokeDasharray="2 2"
                    strokeWidth="0.8"
                  />
                  <text
                    x="316"
                    y="28"
                    className="fill-[#0078D4]"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="500"
                  >
                    AI · t+12ms · precursor pattern
                  </text>
                </motion.g>

                {/* Traditional SCADA detection marker */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2, duration: 0.5 }}
                >
                  <motion.circle
                    cx="568"
                    cy="76"
                    r="18"
                    fill="none"
                    stroke="#D13438"
                    strokeWidth="1.5"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0.2, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ transformOrigin: "568px 76px" }}
                  />
                  <circle cx="568" cy="76" r="4" fill="#D13438" />
                  <line
                    x1="568"
                    y1="76"
                    x2="568"
                    y2="220"
                    stroke="#D13438"
                    strokeDasharray="2 2"
                    strokeWidth="0.8"
                  />
                  <text
                    x="574"
                    y="218"
                    className="fill-[#D13438]"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="500"
                  >
                    SCADA · t+220ms · threshold breach
                  </text>
                </motion.g>

                {/* Sweeping scan line */}
                <motion.line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="240"
                  stroke="#0078D4"
                  strokeWidth="1"
                  opacity="0.3"
                  animate={{ x1: [0, 800], x2: [0, 800] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
              </svg>
            </div>

            {/* Panel readout */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-t border-gray-200 bg-gray-50 text-[11px] font-mono text-gray-600">
              <span>amplitude · 230kV</span>
              <span>sample · 10kHz</span>
              <span className="text-[#0078D4]">ai_confidence · 0.987</span>
              <span>events · 2 detected</span>
            </div>
          </div>

          {/* ── THREE PILLARS ── */}
          <div className="grid md:grid-cols-3 gap-px bg-gray-200 border border-gray-200 mb-16">
            {[
              {
                num: "01",
                spec: "< 10ms",
                title: "Sub-millisecond response",
                body: "Inference runs at the edge, before fault propagation begins. Rule-based SCADA waits for thresholds — by then, the cascade has started.",
              },
              {
                num: "02",
                spec: "94 features",
                title: "Pattern recognition",
                body: "The model learns the fingerprints of failure: harmonic distortion, micro-arcing, thermal drift. Subtle precursors that no static threshold can encode.",
              },
              {
                num: "03",
                spec: "T-minus prediction",
                title: "Predictive isolation",
                body: "Forecasts cascading failures across substations and isolates the affected segment before downstream equipment is exposed to the fault current.",
              },
            ].map((pillar, i) => (
              <div
                key={i}
                className="bg-white p-7 lg:p-8 flex flex-col gap-3 hover:bg-[#fafafa] transition-colors"
              >
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-[11px] font-mono text-gray-400 tracking-wider">
                    [{pillar.num}]
                  </span>
                  <span className="text-[11px] font-mono text-[#0078D4] tracking-wider px-1.5 py-0.5 bg-[#eaf3fb] rounded-sm">
                    {pillar.spec}
                  </span>
                </div>
                <h3 className="text-[20px] font-medium text-gray-900 tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-[14px] text-gray-600 leading-relaxed">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>

          {/* ── DETECTION TIMELINE ── */}
          <div>
            <div className="flex items-baseline justify-between mb-6 flex-wrap gap-2">
              <h3 className="text-[20px] md:text-[22px] font-medium text-gray-900 tracking-tight">
                Detection latency, charted against the fault.
              </h3>
              <span className="text-[12px] font-mono text-gray-500">
                T = time since fault initiation
              </span>
            </div>

            <div className="bg-white border border-gray-200 rounded-sm p-6 lg:p-8">
              <div className="space-y-5">
                {[
                  {
                    label: "MScada AI",
                    sublabel: "edge inference",
                    width: "1%",
                    time: "12ms",
                    color: "#0078D4",
                    bg: "#eaf3fb",
                    status: "Isolated",
                  },
                  {
                    label: "Traditional SCADA",
                    sublabel: "threshold trigger",
                    width: "8%",
                    time: "220ms",
                    color: "#FFB900",
                    bg: "#fff8e1",
                    status: "Alarmed",
                  },
                  {
                    label: "Operator response",
                    sublabel: "human-in-the-loop",
                    width: "48%",
                    time: "2,400ms",
                    color: "#D13438",
                    bg: "#fde7e9",
                    status: "Acknowledged",
                  },
                  {
                    label: "Cascade onset",
                    sublabel: "downstream failure",
                    width: "100%",
                    time: "5,000ms",
                    color: "#1f1f1f",
                    bg: "#f3f2f1",
                    status: "Critical",
                  },
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-12 md:col-span-3">
                      <div className="text-[14px] font-medium text-gray-900">
                        {row.label}
                      </div>
                      <div className="text-[11px] text-gray-500 font-mono">
                        {row.sublabel}
                      </div>
                    </div>
                    <div className="col-span-9 md:col-span-7">
                      <div className="relative h-7 bg-gray-100 rounded-sm overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: row.width }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 1.2,
                            delay: i * 0.15,
                            ease: "easeOut",
                          }}
                          className="absolute inset-y-0 left-0 flex items-center justify-end pr-0"
                          style={{ background: row.bg }}
                        >
                          <span
                            className="h-full w-0.5"
                            style={{ background: row.color }}
                          ></span>
                        </motion.div>
                      </div>
                    </div>
                    <div className="col-span-3 md:col-span-2 flex flex-col items-end">
                      <span
                        className="text-[14px] font-mono font-medium"
                        style={{ color: row.color }}
                      >
                        {row.time}
                      </span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                        {row.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-gray-500 font-mono">
                <span>
                  † based on IEEE 1547 fault classification benchmarks
                </span>
                <span>· 230kV distribution network simulation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VISUALS & ARCHITECTURE ── */}
      <section className="py-16 md:py-24 bg-[#faf9f8]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          <div>
            <div className="mb-6 border-b border-gray-200 pb-2">
              <h2 className="text-xl md:text-2xl font-medium tracking-tight text-gray-900">
                Console Preview
              </h2>
            </div>
            <div className="bg-white border border-gray-200 p-2 shadow-sm rounded-sm">
              <div className="aspect-[16/9] relative w-full bg-[#f3f2f1]">
                <Image
                  src="/nwcon.png"
                  alt="Console Dashboard Preview"
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="mb-6 border-b border-gray-200 pb-2">
              <h2 className="text-xl md:text-2xl font-medium tracking-tight text-gray-900 mb-2">
                Core Framework Architecture
              </h2>
              <p className="text-[14px] text-gray-600 max-w-3xl leading-relaxed">
                A distributed, edge-first architecture designed for
                high-availability environments including steel manufacturing,
                rail networks, and heavy power distribution.
              </p>
            </div>
            <div className="bg-white border border-gray-200 p-2 shadow-sm rounded-sm">
              <div className="aspect-[16/9] relative w-full bg-[#f3f2f1]">
                <Image
                  src="/flowdia.png"
                  alt="Framework Architecture"
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
