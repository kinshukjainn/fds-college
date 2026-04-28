"use client";

import React from "react";
import dynamic from "next/dynamic";
import { usePowerSystemMath, PowerData } from "@/lib/engine";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function AdvancedElectricalGraphs({
  data,
}: {
  data: PowerData;
}) {
  const engine = usePowerSystemMath(data);

  const layoutBase = {
    paper_bgcolor: "transparent",
    plot_bgcolor: "transparent",
    font: { family: "Inter, sans-serif", color: "#1f2937" },
    margin: { t: 50, b: 40, l: 50, r: 30 },
    autosize: true,
  };

  const isFaulted = engine.fault.faultType !== "Normal";

  return (
    <div className="space-y-6 mt-8">
      <div className="border-b pb-3 mb-4 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-xl font-medium text-gray-900">
            Advanced Power System Analytics
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Real-time computational modeling powered by Symmetrical Components.
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium shadow-sm border"
          style={{
            backgroundColor: engine.fault.faultColor + "1a",
            borderColor: engine.fault.faultColor,
            color: engine.fault.faultColor,
          }}
        >
          <span
            className="w-2.5 h-2.5 rounded-sm"
            style={{ backgroundColor: engine.fault.faultColor }}
          />
          {engine.fault.faultType}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border-l-4 border-blue-500 shadow-sm p-4 rounded-r-md">
          <p className="text-xs text-gray-500 font-medium uppercase">
            System PF
          </p>
          <p
            className={`text-2xl font-medium ${engine.power.pf < 0.85 ? "text-red-600" : "text-gray-900"}`}
          >
            {engine.power.pf.toFixed(3)}{" "}
            {data.reactivePower > 0 ? "(Lag)" : "(Lead)"}
          </p>
        </div>
        <div className="bg-white border-l-4 border-purple-500 shadow-sm p-4 rounded-r-md">
          <p className="text-xs text-gray-500 font-medium uppercase">
            V₂/V₁ Unbalance
          </p>
          <p className="text-2xl font-medium text-gray-900">
            {(engine.ratios.v2Ratio * 100).toFixed(2)}%
          </p>
        </div>
        <div className="bg-white border-l-4 border-green-500 shadow-sm p-4 rounded-r-md">
          <p className="text-xs text-gray-500 font-medium uppercase">
            Total Apparent Power
          </p>
          <p className="text-2xl font-medium text-gray-900">
            {engine.power.apparentPower.toFixed(2)} kVA
          </p>
        </div>
        <div className="bg-white border-l-4 border-amber-500 shadow-sm p-4 rounded-r-md">
          <p className="text-xs text-gray-500 font-medium uppercase">
            V₀/V₁ Ground Fault
          </p>
          <p className="text-2xl font-medium text-gray-900">
            {(engine.ratios.v0Ratio * 100).toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Instantaneous Waveforms */}
        <div
          className="border rounded-sm p-4 bg-white shadow-sm h-[400px]"
          style={{
            borderColor: isFaulted ? engine.fault.faultColor + "55" : "#e5e7eb",
          }}
        >
          <Plot
            data={[
              {
                x: engine.waveforms.t,
                y: engine.waveforms.waveVa,
                type: "scatter",
                mode: "lines",
                name: "Va",
                line: { color: "#ef4444", width: 2 },
              },
              {
                x: engine.waveforms.t,
                y: engine.waveforms.waveVb,
                type: "scatter",
                mode: "lines",
                name: "Vb",
                line: { color: "#eab308", width: 2 },
              },
              {
                x: engine.waveforms.t,
                y: engine.waveforms.waveVc,
                type: "scatter",
                mode: "lines",
                name: "Vc",
                line: { color: "#3b82f6", width: 2 },
              },
            ]}
            layout={{
              ...layoutBase,
              title: {
                text: "Reconstructed Time-Domain Voltage",
                font: { size: 14 },
              },
              xaxis: { title: { text: "Time (s)" } },
              yaxis: { title: { text: "Voltage (V)" } },
              legend: { orientation: "h", y: -0.2, x: 0.2 },
            }}
            useResizeHandler
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {/* Polar Phasor Diagram (Per-Unit) */}
        <div
          className="border rounded-sm p-4 bg-white shadow-sm h-[400px]"
          style={{
            borderColor: isFaulted ? engine.fault.faultColor + "55" : "#e5e7eb",
          }}
        >
          <Plot
            data={[
              // PU Voltage Phasors
              {
                type: "scatterpolar",
                r: [0, engine.phasors.Va.mag / engine.puBases.vBase],
                theta: [0, engine.phasors.Va.ang * (180 / Math.PI)],
                mode: "lines+markers",
                name: "Va (PU)",
                line: { color: "#ef4444", width: 3 },
              },
              {
                type: "scatterpolar",
                r: [0, engine.phasors.Vb.mag / engine.puBases.vBase],
                theta: [0, engine.phasors.Vb.ang * (180 / Math.PI)],
                mode: "lines+markers",
                name: "Vb (PU)",
                line: { color: "#eab308", width: 3 },
              },
              {
                type: "scatterpolar",
                r: [0, engine.phasors.Vc.mag / engine.puBases.vBase],
                theta: [0, engine.phasors.Vc.ang * (180 / Math.PI)],
                mode: "lines+markers",
                name: "Vc (PU)",
                line: { color: "#3b82f6", width: 3 },
              },
              // PU Current Phasors
              {
                type: "scatterpolar",
                r: [0, data.currentA / engine.puBases.iBase],
                theta: [
                  0,
                  engine.phasors.Va.ang * (180 / Math.PI) -
                    engine.power.pfAngleDeg,
                ],
                mode: "lines+markers",
                name: "Ia (PU)",
                line: { color: "#fca5a5", width: 2, dash: "dot" },
              },
              {
                type: "scatterpolar",
                r: [0, data.currentB / engine.puBases.iBase],
                theta: [
                  0,
                  engine.phasors.Vb.ang * (180 / Math.PI) -
                    engine.power.pfAngleDeg,
                ],
                mode: "lines+markers",
                name: "Ib (PU)",
                line: { color: "#fef08a", width: 2, dash: "dot" },
              },
              {
                type: "scatterpolar",
                r: [0, data.currentC / engine.puBases.iBase],
                theta: [
                  0,
                  engine.phasors.Vc.ang * (180 / Math.PI) -
                    engine.power.pfAngleDeg,
                ],
                mode: "lines+markers",
                name: "Ic (PU)",
                line: { color: "#93c5fd", width: 2, dash: "dot" },
              },
            ]}
            layout={{
              ...layoutBase,
              title: {
                text: "Per-Unit Phasor Diagram (1.0 PU Base)",
                font: { size: 14 },
              },
              polar: {
                angularaxis: { direction: "counterclockwise" },
                radialaxis: { visible: true, ticksuffix: " PU" },
              },
              legend: { orientation: "h", y: -0.2, x: 0.1 },
            }}
            useResizeHandler
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}
