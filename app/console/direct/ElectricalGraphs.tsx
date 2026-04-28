"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Waves, Activity, AlertTriangle, CheckCircle } from "lucide-react";
import { usePowerSystemMath, PowerData } from "@/lib/engine";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function AdvancedWaveformAnalysis({
  data,
}: {
  data: PowerData;
}) {
  const engine = usePowerSystemMath(data);
  const { fault, health, waveforms, vDev } = engine;
  const isFaulted = fault.faultSeverity !== "none";

  const layoutBase = {
    paper_bgcolor: "transparent",
    plot_bgcolor: "transparent",
    font: {
      family: "JetBrains Mono, Inter, monospace",
      color: "#64748b",
      size: 10,
    },
    margin: { t: 30, b: 30, l: 40, r: 40 },
  };

  return (
    <div
      className="w-full space-y-6 bg-slate-50 p-6 rounded-xl border shadow-inner"
      style={{ borderColor: isFaulted ? fault.faultColor + "55" : "#e2e8f0" }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-4">
          <div
            className="p-3 rounded-lg text-white shadow-md"
            style={{
              backgroundColor: isFaulted ? fault.faultColor : "#0f172a",
            }}
          >
            {isFaulted ? (
              <AlertTriangle className="w-6 h-6" />
            ) : (
              <Activity className="w-6 h-6" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-medium text-slate-900 tracking-tight">
              M-SCADA Diagnostics Engine
            </h2>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm">
            <span className="text-xs text-slate-400 block uppercase font-medium">
              System PF
            </span>
            <span
              className={`text-lg font-medium ${engine.power.pf < 0.85 ? "text-red-500" : "text-emerald-600"}`}
            >
              {engine.power.pf.toFixed(3)}
            </span>
          </div>

          <div
            className="px-4 py-2 rounded-lg shadow-sm border flex items-center gap-2"
            style={{
              backgroundColor: fault.faultColor + "15",
              borderColor: fault.faultColor + "66",
            }}
          >
            {isFaulted ? (
              <AlertTriangle
                className="w-4 h-4"
                style={{ color: fault.faultColor }}
              />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            )}
            <div>
              <span className="text-xs text-slate-400 block uppercase font-medium">
                Fault Status
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: fault.faultColor }}
              >
                {fault.faultType}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Voltage Waveforms */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-sm h-[400px] flex flex-col">
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <Waves className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700 uppercase">
              Transient Capture (Voltage)
            </span>
          </div>
          <Plot
            data={[
              {
                x: waveforms.t,
                y: waveforms.waveVa,
                name: "Va",
                line: { color: "#ef4444", width: 2 },
                type: "scatter",
              },
              {
                x: waveforms.t,
                y: waveforms.waveVb,
                name: "Vb",
                line: { color: "#eab308", width: 2 },
                type: "scatter",
              },
              {
                x: waveforms.t,
                y: waveforms.waveVc,
                name: "Vc",
                line: { color: "#2563eb", width: 2 },
                type: "scatter",
              },
            ]}
            layout={{
              ...layoutBase,
              showlegend: true,
              legend: { orientation: "h", y: -0.15 },
              xaxis: { gridcolor: "#f1f5f9", title: { text: "Time (s)" } },
              yaxis: { gridcolor: "#f1f5f9", title: { text: "Voltage (V)" } },
            }}
            useResizeHandler
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {/* Health Radar (Numerically Meaningful) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl shadow-sm h-[400px] flex flex-col">
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
            <span className="text-sm font-medium text-slate-700 uppercase">
              System Health Profile
            </span>
          </div>
          <Plot
            data={[
              {
                type: "scatterpolar",
                r: [
                  health.pfScore,
                  health.vBalance,
                  health.negSequenceScore,
                  health.pfScore,
                ],
                theta: [
                  "Power Factor",
                  "V-Balance",
                  "Sequence Health",
                  "Power Factor",
                ],
                fill: "toself",
                fillcolor: isFaulted
                  ? fault.faultColor + "22"
                  : "rgba(99, 102, 241, 0.2)",
                line: {
                  color: isFaulted ? fault.faultColor : "#6366f1",
                  width: 2,
                },
              },
            ]}
            layout={{
              ...layoutBase,
              polar: { radialaxis: { visible: true, range: [0, 100] } },
            }}
            useResizeHandler
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {/* Instantaneous Power (Ripples now physically accurate) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-sm h-[300px] flex flex-col">
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
            <span className="text-sm font-medium text-slate-700 uppercase">
              Instantaneous Power P(t)
            </span>
          </div>
          <Plot
            data={[
              {
                x: waveforms.t,
                y: waveforms.pTotal,
                fill: "tozeroy",
                type: "scatter",
                line: {
                  color: isFaulted ? fault.faultColor : "#10b981",
                  width: 2,
                },
                fillcolor: isFaulted
                  ? fault.faultColor + "22"
                  : "rgba(16,185,129,0.15)",
              },
            ]}
            layout={{
              ...layoutBase,
              xaxis: { gridcolor: "#f1f5f9" },
              yaxis: { gridcolor: "#f1f5f9" },
            }}
            useResizeHandler
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {/* Voltage Deviation */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl shadow-sm h-[300px] flex flex-col">
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
            <span className="text-sm font-medium text-slate-700 uppercase">
              Voltage Deviation (%)
            </span>
          </div>
          <Plot
            data={[
              {
                x: ["A", "B", "C"],
                y: vDev,
                type: "bar",
                marker: {
                  color: ["#ef4444", "#eab308", "#3b82f6"],
                  line: {
                    color: vDev.map((d) =>
                      Math.abs(d) > 5 ? fault.faultColor : "transparent",
                    ),
                    width: 2,
                  },
                },
              },
            ]}
            layout={{
              ...layoutBase,
              shapes: [
                {
                  type: "line",
                  y0: 5,
                  y1: 5,
                  x0: -0.5,
                  x1: 2.5,
                  line: { color: "#94a3b8", dash: "dot" },
                },
                {
                  type: "line",
                  y0: -5,
                  y1: -5,
                  x0: -0.5,
                  x1: 2.5,
                  line: { color: "#94a3b8", dash: "dot" },
                },
              ],
            }}
            useResizeHandler
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}
