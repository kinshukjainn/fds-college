"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronRight,
  Info,
  Activity,
  Zap,
  TrendingDown,
  Factory,
  Code2,
  Microscope,
  Presentation,
  FileBarChart,
  Briefcase,
  GitBranch,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const projectInfo = {
  title: "AI-Powered Fault Detection",
  description:
    "An advanced technology platform that uses artificial intelligence and machine learning algorithms to automatically identify, diagnose, and predict equipment failures, system anomalies, and operational issues before they cause significant damage or downtime.",
};

type Capability = {
  id: string;
  spec: string;
  title: string;
  body: string;
  icon: LucideIcon;
};

const capabilities: Capability[] = [
  {
    id: "01",
    spec: "< 10ms",
    title: "Real-time monitoring",
    body: "Instant telemetry processing with edge inference. Operators see what's happening as it happens — not after the alarm clears.",
    icon: Zap,
  },
  {
    id: "02",
    spec: "50-70% ↓",
    title: "Predictive maintenance",
    body: "Forecasting equipment degradation lets teams schedule interventions during planned windows instead of reacting to mid-shift failures.",
    icon: Activity,
  },
  {
    id: "03",
    spec: "30-40% ↓",
    title: "Smart cost analytics",
    body: "Reduced downtime, optimized maintenance cycles, and lower energy waste compound into measurable operational savings.",
    icon: TrendingDown,
  },
  {
    id: "04",
    spec: "4 sectors",
    title: "Cross-industry deployment",
    body: "Manufacturing floors, power grids, rail networks, and oil & gas pipelines — one monitoring layer, different telemetry shapes.",
    icon: Factory,
  },
];

type Member = {
  name: string;
  role: string;
  description: string;
  icon: LucideIcon;
};

const teamMembers: Member[] = [
  {
    name: "Smita Kumari",
    role: "Team Lead · Presentation · Design",
    description:
      "Responsible for overall coordination across the team and for presentation design.",
    icon: Presentation,
  },
  {
    name: "Tarun Tripathi",
    role: "Research · Documentation",
    description:
      "For discussions involving algorithms, theoretical research, and developer documentation.",
    icon: Microscope,
  },
  {
    name: "Samarth Vishwakarma",
    role: "Presentations · Report",
    description:
      "Handles project demonstrations, reporting pipelines, and metric aggregation.",
    icon: FileBarChart,
  },
  {
    name: "robert kosha",
    role: "Technical Lead",
    description:
      "Direct technical inquiries here — API guidelines, architecture, and code review.",
    icon: Code2,
  },
];

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#faf9f8] text-gray-900 selection:bg-[#cce3f5] selection:text-black font-rubik">
      {/* ── HEADER BAR ── */}
      <div className="bg-white  borde-gray-200   border-b-2 shaodw-md shadow-gray-400">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Breadcrumbs */}
          <div className="text-[13px] font-medium text-[#0078D4] flex items-center gap-1.5 mb-4 w-fit">
            <Link href="/" className="hover:underline cursor-pointer">
              Home
            </Link>
            <ChevronRight size={14} className="text-gray-500" />
            <span className="text-gray-600">Project Genesis</span>
          </div>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#0078D4] rounded-sm flex items-center justify-center shrink-0">
                <Info size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-medium text-gray-900 tracking-tight leading-tight">
                  Project Genesis
                </h1>
                <p className="text-[13px] text-gray-600 mt-0.5">
                  System architecture, core mission, and organizational team
                  structure.
                </p>
              </div>
            </div>

            {/* Status indicator */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-sm bg-[#f3fcf3] border border-[#cce8cc] text-[#107c10] font-medium text-[12px] tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-sm bg-[#107c10] opacity-75"></span>
                <span className="relative inline-flex rounded-sm h-2 w-2 bg-[#107c10]"></span>
              </span>
              Active Development
            </div>
          </div>
        </div>
      </div>

      {/* ── MISSION BRIEF ── */}
      <section className="relative bg-white border-b border-gray-400 shadow-md shadow-gray-400  overflow-hidden">
        <div
          className="absolute inset-0 opacity-50 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #f3f2f1 1px, transparent 1px), linear-gradient(to bottom, #f3f2f1 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          {/* Section label */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-[12px] uppercase tracking-[0.2em] text-gray-500 font-medium"></span>
            <span className="h-px flex-1 bg-gray-300 max-w-[120px]"></span>
            <span className="text-[12px] uppercase tracking-[0.2em] text-gray-400 font-mono">
              §01
            </span>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-gray-900 leading-[1.1] mb-6"
              >
                Catching the fault{" "}
                <span className="line-through decoration-[#D13438] decoration-2">
                  when it strikes
                </span>
                <br />
                <span className="text-[#0078D4]">before it strikes</span>.
              </motion.h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="lg:col-span-5 lg:pl-8 lg:border-l lg:border-gray-200 flex flex-col justify-end"
            >
              <p className="text-[15px] text-gray-700 leading-relaxed mb-3">
                <span className="text-gray-900 font-medium">
                  {projectInfo.title}
                </span>{" "}
                is an advanced platform that uses machine learning to
                automatically identify, diagnose, and predict equipment
                failures, system anomalies, and operational issues before they
                cause significant damage or downtime.
              </p>
              <div className="text-[12px] uppercase tracking-wider text-gray-500 font-mono mt-2">
                ⏱ Detection horizon · pre-cascade
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES ── */}
      <section className="bg-[#faf9f8] border-b border-gray-500  ">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex items-center gap-4 mb-10">
            <span className="text-[12px] uppercase tracking-[0.2em] text-gray-500 font-medium"></span>
            <span className="h-px flex-1 bg-gray-300 max-w-[120px]"></span>
            <span className="text-[12px] uppercase tracking-[0.2em] text-gray-400 font-mono">
              §02
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2  rounded-sm">
            {capabilities.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <motion.div
                  key={cap.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.08,
                    ease: "easeOut",
                  }}
                  className="bg-white rounded-sm p-7 lg:p-8 flex flex-col gap-3 hover:bg-[#fafafa] transition-colors"
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-[11px] font-mono text-gray-400 tracking-wider">
                      [{cap.id}]
                    </span>
                    <span className="text-[11px] font-mono text-[#0078D4] tracking-wider px-1.5 py-0.5 bg-[#eaf3fb] rounded-sm">
                      {cap.spec}
                    </span>
                  </div>
                  <Icon className="h-5 w-5 text-gray-700 mb-1" />
                  <h3 className="text-[18px] font-medium text-gray-900 tracking-tight">
                    {cap.title}
                  </h3>
                  <p className="text-[13.5px] text-gray-600 leading-relaxed">
                    {cap.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PERSONNEL ROSTER ── */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex items-center gap-4 mb-10">
            <span className="text-[12px] uppercase tracking-[0.2em] text-gray-500 font-medium"></span>
            <span className="h-px flex-1 bg-gray-300 max-w-[120px]"></span>
            <span className="text-[12px] uppercase tracking-[0.2em] text-gray-400 font-mono">
              §03
            </span>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 mb-10">
            <div className="lg:col-span-7">
              <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-gray-900 leading-tight">
                The engineering and research team driving the infrastructure.
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pl-8 lg:border-l lg:border-gray-200 flex flex-col justify-end">
              <p className="text-[14px] text-gray-600 leading-relaxed">
                Direct technical inquiries to the Technical Lead. Subscribe to
                the project repository to receive comments and reviews on your
                patches.
              </p>
              <div className="flex items-center gap-2 mt-3 text-[11px] font-mono text-gray-500">
                <Briefcase className="h-3 w-3" />
                <span>{teamMembers.length} active operators</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamMembers.map((member, i) => {
              const Icon = member.icon;
              const operatorId = `OPS-${String(i + 1).padStart(3, "0")}`;
              return (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.08,
                    ease: "easeOut",
                  }}
                  whileHover={{ y: -2 }}
                  className="group bg-white border border-gray-200 hover:border-[#0078D4] rounded-sm p-6 transition-colors duration-200"
                >
                  <div className="flex items-start gap-4 mb-4">
                    {/* Avatar */}
                    <div className="h-12 w-12 bg-[#eaf3fb] border border-[#0078D4] rounded-sm flex items-center justify-center shrink-0">
                      <span className="text-[14px] font-medium text-[#0078D4]">
                        {initialsOf(member.name)}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* OPS ID + Status */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono text-gray-400 tracking-wider">
                          {operatorId}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-sm bg-[#107C10] opacity-60"></span>
                            <span className="relative inline-flex rounded-sm h-1.5 w-1.5 bg-[#107C10]"></span>
                          </span>
                          <span className="text-[10px] uppercase tracking-wider text-[#107C10] font-medium">
                            Active
                          </span>
                        </div>
                      </div>

                      {/* Name */}
                      <h3 className="text-[16px] font-medium text-gray-900 tracking-tight leading-tight">
                        {member.name}
                      </h3>

                      {/* Role */}
                      <p className="text-[11px] font-medium text-[#0078D4] uppercase tracking-wider mt-1">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-start gap-2.5 text-[13px] text-gray-600 leading-relaxed">
                      <Icon className="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0" />
                      <span>{member.description}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MANIFEST FOOTER ── */}
      <section className="bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-gray-200">
            {[
              { label: "Codename", val: "Genesis" },
              { label: "Classification", val: "Open Source" },
              { label: "Personnel", val: String(teamMembers.length) },
              { label: "Capabilities", val: String(capabilities.length) },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex flex-col gap-1 sm:px-6 lg:px-8 first:pl-0 lg:first:pl-4 last:pr-0"
              >
                <span className="text-2xl lg:text-3xl font-medium text-[#0078D4] tracking-tight">
                  {stat.val}
                </span>
                <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-gray-500 font-mono">
            <GitBranch className="h-3 w-3" />
            <span>† project manifest · genesis/main</span>
            <span>
              · last updated · {new Date().toISOString().split("T")[0]}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
