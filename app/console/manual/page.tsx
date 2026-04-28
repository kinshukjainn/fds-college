"use client";

import React, { useState } from "react";
import { RiGeminiFill } from "react-icons/ri";
import { motion } from "framer-motion";
import Image from "next/image";

import {
  Activity,
  Zap,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  Loader2,
  ChevronRight,
  Info,
  Settings2,
} from "lucide-react";
import { runDiagnosticAnalysis, DiagnosticResponse } from "@/lib/api_call";
import ElectricalGraphs from "./ElectricalGraphs";
import AdvancedWaveformAnalysis from "./AdvancedWaveformAnalysis";

export interface FormData {
  voltageA: number;
  voltageB: number;
  voltageC: number;
  currentA: number;
  currentB: number;
  currentC: number;
  seqPositive: number;
  seqNegative: number;
  seqZero: number;
  activePower: number;
  reactivePower: number;
  // New System Config fields matching the deterministic backend
  sysVoltageLevel: number;
  xrRatio: number;
  nominalFreq: number;
  faultMVA: number;
}

export default function ElectricalDiagnosticConsole() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    voltageA: 230,
    voltageB: 228,
    voltageC: 205,
    currentA: 50,
    currentB: 52,
    currentC: 85,
    seqPositive: 60,
    seqNegative: 12,
    seqZero: 8,
    activePower: 35.5,
    reactivePower: 15.2,
    // Defaults for the new deterministic thresholding engine
    sysVoltageLevel: 0.415, // 415V LV Distribution
    xrRatio: 5.0,
    nominalFreq: 50,
    faultMVA: 25,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: parseFloat(e.target.value) || 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // FIX: We now send formData exactly as-is, because the keys
      // strictly match the backend validation schema (voltageA, etc.)
      const diagnosticData = await runDiagnosticAnalysis(formData);
      setResult(diagnosticData);
    } catch (err: unknown) {
      // Safely narrow the type from 'unknown' to standard Error
      if (err instanceof Error) {
        // If you are using Axios, the error might have a response object attached to it.
        // We safely duck-type it here to avoid ESLint 'any' errors without needing to import AxiosError.
        const axiosError = err as Error & {
          response?: { data?: { message?: string } };
        };

        if (axiosError.response?.data?.message) {
          setError(axiosError.response.data.message);
        } else {
          setError(err.message);
        }
      } else {
        setError("An unexpected error occurred while processing telemetry.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case "CRITICAL":
        return "text-[#a80000] bg-[#fde7e9] border-[#f1bbbc]";
      case "HIGH":
        return "text-[#835b00] bg-[#fff4ce] border-[#f5dfa0]";
      case "MEDIUM":
        return "text-[#835b00] bg-[#fff4ce] border-[#f5dfa0]";
      case "LOW":
        return "text-[#107c10] bg-[#dff6dd] border-[#b4e0b2]";
      case "NORMAL":
        return "text-[#107c10] bg-[#dff6dd] border-[#b4e0b2]";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] text-[#333] p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto space-y-4 lg:space-y-6">
        {/* Header - Azure Info Banner */}
        <div className="p-4 rounded bg-[#f0f6ff] border border-[#c7dffb] flex items-start gap-3 shadow-sm">
          <Info className="w-4 h-4 text-[#0078d4] mt-0.5 shrink-0" />
          <div>
            <h1 className="text-sm font-medium text-[#1b1b1f] mb-0.5">
              Deterministic Diagnostics Engine v3.0
            </h1>
            <p className="text-[13px] text-[#333] leading-relaxed">
              This analysis utilizes a strict physics-based calculation engine
              for fault detection and symmetrical component analysis. Natural
              language generation is applied post-calculation for human-readable
              reporting.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
          {/* Form Section - Sticky Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-4 lg:sticky lg:top-6">
            <form
              onSubmit={handleSubmit}
              className="space-y-5 bg-white border border-[#e0e0e0] shadow-sm rounded p-5 sm:p-6"
            >
              {/* NEW: System Configuration (Drives Backend Thresholds) */}
              <div>
                <h3 className="text-xs font-medium text-[#1b1b1f] mb-3 flex items-center gap-2 pb-2 border-b border-[#ededed]">
                  <Settings2 className="w-3.5 h-3.5 text-[#0078d4]" /> System
                  Config
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-medium text-[#616161] mb-1 uppercase">
                      Sys Voltage (kV)
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      name="sysVoltageLevel"
                      value={formData.sysVoltageLevel}
                      onChange={handleChange}
                      className="w-full px-2 py-1.5 border border-[#c8c8c8] rounded-sm text-sm focus:ring-1 focus:ring-[#0078d4] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#616161] mb-1 uppercase">
                      Freq (Hz)
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      name="nominalFreq"
                      value={formData.nominalFreq}
                      onChange={handleChange}
                      className="w-full px-2 py-1.5 border border-[#c8c8c8] rounded-sm text-sm focus:ring-1 focus:ring-[#0078d4] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Voltages */}
              <div>
                <h3 className="text-xs font-medium text-[#1b1b1f] mb-3 flex items-center gap-2 pb-2 border-b border-[#ededed]">
                  <Zap className="w-3.5 h-3.5 text-[#0078d4]" /> Phase Voltages
                  (V)
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {(["A", "B", "C"] as const).map((phase) => (
                    <div key={`v${phase}`}>
                      <label className="block text-[10px] font-medium text-[#616161] mb-1">
                        PHASE {phase}
                      </label>
                      <input
                        type="number"
                        step="any"
                        required
                        name={`voltage${phase}`}
                        value={formData[`voltage${phase}` as keyof FormData]}
                        onChange={handleChange}
                        className="w-full px-2 py-1.5 border border-[#c8c8c8] rounded-sm text-sm focus:ring-1 focus:ring-[#0078d4] focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Currents */}
              <div>
                <h3 className="text-xs font-medium text-[#1b1b1f] mb-3 flex items-center gap-2 pb-2 border-b border-[#ededed]">
                  <Activity className="w-3.5 h-3.5 text-[#0078d4]" /> Phase
                  Currents (A)
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {(["A", "B", "C"] as const).map((phase) => (
                    <div key={`i${phase}`}>
                      <label className="block text-[10px] font-medium text-[#616161] mb-1">
                        PHASE {phase}
                      </label>
                      <input
                        type="number"
                        step="any"
                        required
                        name={`current${phase}`}
                        value={formData[`current${phase}` as keyof FormData]}
                        onChange={handleChange}
                        className="w-full px-2 py-1.5 border border-[#c8c8c8] rounded-sm text-sm focus:ring-1 focus:ring-[#0078d4] focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Sequence Components */}
              <div>
                <h3 className="text-xs font-medium text-[#1b1b1f] mb-3 flex items-center gap-2 pb-2 border-b border-[#ededed]">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#0078d4]" />{" "}
                  Sequence (V/A)
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-medium text-[#616161] mb-1">
                      POS (1)
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      name="seqPositive"
                      value={formData.seqPositive}
                      onChange={handleChange}
                      className="w-full px-2 py-1.5 border border-[#c8c8c8] rounded-sm text-sm focus:ring-1 focus:ring-[#0078d4] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#616161] mb-1">
                      NEG (2)
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      name="seqNegative"
                      value={formData.seqNegative}
                      onChange={handleChange}
                      className="w-full px-2 py-1.5 border border-[#c8c8c8] rounded-sm text-sm focus:ring-1 focus:ring-[#0078d4] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#616161] mb-1">
                      ZERO (0)
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      name="seqZero"
                      value={formData.seqZero}
                      onChange={handleChange}
                      className="w-full px-2 py-1.5 border border-[#c8c8c8] rounded-sm text-sm focus:ring-1 focus:ring-[#0078d4] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Power */}
              <div>
                <h3 className="text-xs font-medium text-[#1b1b1f] mb-3 flex items-center gap-2 pb-2 border-b border-[#ededed]">
                  <Info className="w-3.5 h-3.5 text-[#0078d4]" /> System Power
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-medium text-[#616161] mb-1 uppercase">
                      Active (kW)
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      name="activePower"
                      value={formData.activePower}
                      onChange={handleChange}
                      className="w-full px-2 py-1.5 border border-[#c8c8c8] rounded-sm text-sm focus:ring-1 focus:ring-[#0078d4] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#616161] mb-1 uppercase">
                      Reactive (kVAR)
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      name="reactivePower"
                      value={formData.reactivePower}
                      onChange={handleChange}
                      className="w-full px-2 py-1.5 border border-[#c8c8c8] rounded-sm text-sm focus:ring-1 focus:ring-[#0078d4] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0078d4] hover:bg-[#106ebe] text-white font-medium py-2.5 px-4 rounded transition-colors flex items-center cursor-pointer justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-2 shadow-sm"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <RiGeminiFill className="w-5 h-5" />
                )}
                {loading ? "Computing... Please wait" : "Run Diagnostic"}
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-8 xl:col-span-9">
            {error && (
              <div className="p-4 bg-[#fde7e9] border border-[#f1bbbc] rounded text-[#a80000] flex gap-3 items-start mb-4 shadow-sm">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-1">
                    Diagnostic Pipeline Failed
                  </p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {!result && !loading && !error && (
              <div className="h-full min-h-[500px] border border-[#e0e0e0] shadow-sm rounded flex flex-col items-center justify-center text-[#333] p-6 text-center bg-white">
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "150px",
                  }}
                >
                  <Image
                    className="animate-pulse opacity-60"
                    src="/transformer.png"
                    alt="loader"
                    fill
                    style={{ objectFit: "contain" }}
                    sizes="100vw"
                    priority
                  />
                </div>
                <h3 className="text-lg font-medium text-[#1b1b1f] mb-2 mt-4">
                  Awaiting Telemetry Analysis
                </h3>
                <p className="text-sm max-w-md text-[#616161]">
                  Enter system parameters and system configuration in the
                  console. The physics engine will calculate sequence
                  components, unbalance, and output a generated waveform
                  profile.
                </p>
              </div>
            )}

            {loading && (
              <div className="relative h-full min-h-[500px] flex flex-col items-center justify-center bg-white shadow-sm rounded border border-[#e0e0e0] overflow-hidden">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute w-72 h-72 bg-[#0078d4] rounded-full blur-[80px] -z-10 pointer-events-none"
                />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col items-center space-y-6 z-10"
                >
                  <div className="relative flex items-center justify-center p-4 bg-[#f0f6ff] rounded-full border border-[#c7dffb]">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <RiGeminiFill className="w-10 h-10 text-[#0078d4] relative z-10" />
                    </motion.div>
                  </div>
                  <div className="text-center space-y-2 flex flex-col items-center">
                    <h3 className="text-lg font-medium text-[#1b1b1f] tracking-tight">
                      Computing Inverse Fortescue Transforms...
                    </h3>
                    <p className="text-sm font-medium text-[#0078d4] animate-pulse">
                      Running deterministic threshold checks
                    </p>
                  </div>
                </motion.div>
              </div>
            )}

            {result && !loading && (
              <div className="flex flex-col gap-4 lg:gap-6">
                {/* AI Result Card */}
                <div className="border border-[#e0e0e0] rounded overflow-hidden bg-white shadow-sm">
                  <div
                    className={`p-6 sm:p-8 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${getSeverityColor(result.severity)}`}
                  >
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider opacity-80 mb-1">
                        System Status: {result.severity}
                      </p>
                      <h2 className="text-xl sm:text-2xl font-medium tracking-tight">
                        {result.status}
                      </h2>
                    </div>
                    <div className="sm:text-right bg-white/60 backdrop-blur-sm px-4 py-2.5 rounded border border-current/10">
                      <div className="text-3xl font-black">
                        {result.confidence}%
                      </div>
                      <div className="text-[10px] font-medium uppercase tracking-wider opacity-80">
                        Deterministic Confidence
                      </div>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-[11px] font-medium text-[#616161] uppercase tracking-wide mb-2">
                          Fault Localization
                        </h4>
                        <div className="inline-flex items-center gap-2 bg-[#fafafa] border border-[#e0e0e0] px-3 py-1.5 rounded">
                          <Zap className="w-4 h-4 text-[#c67d09]" />
                          <p className="text-sm text-[#1b1b1f] font-medium">
                            {result.fault_localization}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-medium text-[#616161] uppercase tracking-wide mb-3">
                        Technical Analysis
                      </h4>
                      <div className="text-sm text-[#444] leading-relaxed bg-[#fafafa] p-5 rounded border border-[#ededed]">
                        {result.analysis}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-medium text-[#616161] uppercase tracking-wide mb-4">
                        Diagnostic Reasoning Steps
                      </h4>
                      <ul className="space-y-0 bg-white border border-[#ededed] rounded overflow-hidden">
                        {result.diagnostic_reasoning?.map((step, idx) => (
                          <li
                            key={idx}
                            className="flex gap-3 text-sm text-[#444] items-start px-4 py-3 border-b border-[#f5f5f5] last:border-b-0"
                          >
                            <div className="mt-0.5 p-1 bg-[#f0f6ff] text-[#0078d4] rounded">
                              <ChevronRight className="w-3 h-3 shrink-0" />
                            </div>
                            <span className="font-medium">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {result.recommended_actions?.length > 0 && (
                      <div className="pt-6 border-t border-[#ededed]">
                        <h4 className="text-[11px] font-medium text-[#616161] uppercase tracking-wide mb-4 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-[#107c10]" />{" "}
                          Recommended Corrective Actions
                        </h4>
                        <div className="grid gap-2">
                          {result.recommended_actions.map((act, idx) => (
                            <div
                              key={idx}
                              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-[#e0e0e0] rounded hover:border-[#0078d4] transition-colors gap-3"
                            >
                              <span className="font-medium text-[#333] text-sm">
                                {act.action}
                              </span>
                              <span
                                className={`text-[10px] px-3 py-1.5 rounded font-medium tracking-wider self-start sm:self-auto ${
                                  act.urgency?.toUpperCase() === "IMMEDIATE"
                                    ? "bg-[#fde7e9] text-[#a80000]"
                                    : act.urgency?.toUpperCase() === "SCHEDULED"
                                      ? "bg-[#fff4ce] text-[#835b00]"
                                      : "bg-[#dff6dd] text-[#107c10]"
                                }`}
                              >
                                {act.urgency}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Plotly Components */}
                <div className="bg-white border border-[#e0e0e0] rounded p-6 sm:p-8 shadow-sm">
                  <ElectricalGraphs data={formData} />
                </div>
                <div className="bg-white border border-[#e0e0e0] rounded p-6 sm:p-8 shadow-sm">
                  <AdvancedWaveformAnalysis data={formData} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
