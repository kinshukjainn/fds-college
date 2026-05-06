"use client";

import Link from "next/link";
import React from "react";
import { Settings, Sparkles, ChevronRight } from "lucide-react";

export default function SelectConsolePage() {
  return (
    <div className="min-h-screen bg-[#faf9f8] text-gray-900 ">
      {/* ── AZURE-STYLE HEADER ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="text-[13px] font-medium text-[#0078D4] flex items-center gap-1.5 mb-3 w-fit">
            <span className="hover:underline cursor-pointer">Home</span>
            <ChevronRight size={14} className="text-gray-500" />
            <span className="text-gray-600">Console Setup</span>
          </div>
          <h1 className="text-2xl font-medium text-gray-900 tracking-tight mb-1">
            Select Console Mode
          </h1>
          <p className="text-[13px] text-gray-600">
            Choose how you want to interact with your data and workflows.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── CONSOLE OPTIONS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Manual Console Card */}
          <div className="flex flex-col bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-md transition-shadow p-6 relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-800 text-gray-100 flex items-center justify-center rounded-full  shrink-0">
                <Settings size={22} />
              </div>
              <h2 className="text-[18px] font-medium text-gray-900">
                Manual Console
              </h2>
            </div>

            <p className="text-[13px] text-gray-600 mb-6 min-h-[40px]">
              Full control and flexibility. You dictate every aspect of data
              collection, analysis, and metric tracking.
            </p>

            <div className="flex-grow">
              <h3 className="text-[12px] font-medium text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-100 pb-1">
                Features
              </h3>
              <ul className="space-y-2.5 text-[13px] text-gray-700 mb-8">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-xl bg-gray-400 mt-1.5 shrink-0" />
                  <span>Customize metrics and visualizations</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-xl bg-gray-400 mt-1.5 shrink-0" />
                  <span>Complete transparency in processes</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-xl bg-gray-400 mt-1.5 shrink-0" />
                  <span>Integrate existing tools/workflows</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-xl bg-gray-400 mt-1.5 shrink-0" />
                  <span>No external algorithm dependency</span>
                </li>
              </ul>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-50">
              <Link
                href="/console/manual"
                className="block w-full text-center bg-slate-900 text-white font-semibold  py-2 px-4 rounded-full text-[15px] transition-colors"
              >
                Manual Setup
              </Link>
            </div>
          </div>

          {/* Automated Console Card */}
          <div className="flex flex-col bg-white border border-[#0078D4] border-t-4 rounded-3xl shadow-sm hover:shadow-md transition-shadow p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0078D4] text-white flex items-center justify-center rounded-full shrink-0">
                  <Sparkles size={20} />
                </div>
                <h2 className="text-[18px] font-medium text-gray-900">
                  Automated Console
                </h2>
              </div>
              <span className="bg-[#f3f9fd] text-[#0078D4] border border-[#0078D4] px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide rounded-full hidden sm:block">
                Recommended
              </span>
            </div>

            <p className="text-[13px] text-gray-600 mb-6 min-h-[40px]">
              Let the system handle it. Automatically collects data, identifies
              patterns, and generates insights.
            </p>

            <div className="flex-grow">
              <h3 className="text-[12px] font-medium text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-100 pb-1">
                Features
              </h3>
              <ul className="space-y-2.5 text-[13px] text-gray-700 mb-8">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-xl bg-[#0078D4] mt-1.5 shrink-0" />
                  <span>No manual configuration required</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-xl bg-[#0078D4] mt-1.5 shrink-0" />
                  <span>Real-time processing and updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-xl bg-[#0078D4] mt-1.5 shrink-0" />
                  <span>AI-powered predictions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-xl bg-[#0078D4] mt-1.5 shrink-0" />
                  <span>Saves time and reduces manual work</span>
                </li>
              </ul>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-50">
              <Link
                href="/console/direct"
                className="block w-full text-center bg-slate-900 text-white font-semibold  py-2 px-4 rounded-full text-[15px] transition-colors"
              >
                Automated Setup
              </Link>
            </div>
          </div>
        </div>

        {/* ── COMPARISON TABLE ── */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-[#fafafa]">
            <h2 className="text-[15px] font-medium text-gray-900">
              Quick Comparison
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="bg-[#fafafa] border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-[12px] font-medium text-gray-700 uppercase w-1/3">
                    Feature
                  </th>
                  <th className="px-6 py-3 text-[12px] font-medium text-gray-700 uppercase w-1/3">
                    Automated
                  </th>
                  <th className="px-6 py-3 text-[12px] font-medium text-gray-700 uppercase w-1/3 border-l border-gray-100">
                    Manual
                  </th>
                </tr>
              </thead>
              <tbody className="text-[13px] text-gray-800 divide-y divide-gray-100">
                <tr className="hover:bg-[#f6f6f6] transition-colors">
                  <td className="px-6 py-3 font-medium text-gray-900">
                    Setup Time
                  </td>
                  <td className="px-6 py-3">Minutes</td>
                  <td className="px-6 py-3 text-gray-500 border-l border-gray-100">
                    Hours
                  </td>
                </tr>
                <tr className="hover:bg-[#f6f6f6] transition-colors">
                  <td className="px-6 py-3 font-medium text-gray-900">
                    Customization
                  </td>
                  <td className="px-6 py-3 text-gray-500">Limited</td>
                  <td className="px-6 py-3 border-l border-gray-100">
                    Unlimited
                  </td>
                </tr>
                <tr className="hover:bg-[#f6f6f6] transition-colors">
                  <td className="px-6 py-3 font-medium text-gray-900">
                    Maintenance
                  </td>
                  <td className="px-6 py-3">Minimal</td>
                  <td className="px-6 py-3 text-gray-500 border-l border-gray-100">
                    High
                  </td>
                </tr>
                <tr className="hover:bg-[#f6f6f6] transition-colors">
                  <td className="px-6 py-3 font-medium text-gray-900">
                    AI Insights
                  </td>
                  <td className="px-6 py-3 text-[#0078D4] font-medium">
                    Included
                  </td>
                  <td className="px-6 py-3 text-gray-500 border-l border-gray-100">
                    Optional
                  </td>
                </tr>
                <tr className="hover:bg-[#f6f6f6] transition-colors">
                  <td className="px-6 py-3 font-medium text-gray-900">
                    Learning Curve
                  </td>
                  <td className="px-6 py-3">None</td>
                  <td className="px-6 py-3 text-gray-500 border-l border-gray-100">
                    Moderate
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
