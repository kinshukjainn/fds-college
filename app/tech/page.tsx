"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiFramer,
  SiThreedotjs,
  SiSupabase,
  SiPlotly,
  SiOpenai,
  SiRadixui,
  SiAxios,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
import {
  Layers,
  Cpu,
  Cloud,
  Database,
  Activity,
  Code2,
  Boxes,
  Zap,
  Network,
  Eye,
  Globe,
  Lock,
  Hexagon,
  Sparkles,
  Server,
  Workflow,
  GitBranch,
  Terminal,
  ArrowRight,
} from "lucide-react";
import type { IconType } from "react-icons";
import type { LucideIcon } from "lucide-react";

type StackItem = {
  name: string;
  version: string;
  note: string;
  icon: IconType | LucideIcon;
};

type StackGroup = {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  items: StackItem[];
};

const stack: StackGroup[] = [
  {
    id: "01",
    title: "Framework & Runtime",
    subtitle: "Application foundation",
    icon: Code2,
    items: [
      {
        name: "Next.js",
        version: "16.1.6",
        note: "Turbopack · App Router",
        icon: SiNextdotjs,
      },
      {
        name: "React",
        version: "19.2.3",
        note: "Concurrent features",
        icon: SiReact,
      },
      {
        name: "TypeScript",
        version: "5.x",
        note: "Strict type safety",
        icon: SiTypescript,
      },
      {
        name: "Node.js",
        version: "22 LTS",
        note: "Server runtime",
        icon: SiNodedotjs,
      },
    ],
  },
  {
    id: "02",
    title: "Interface & Styling",
    subtitle: "Visual layer",
    icon: Layers,
    items: [
      {
        name: "Tailwind CSS",
        version: "4.x",
        note: "Utility-first styling",
        icon: SiTailwindcss,
      },
      {
        name: "Radix UI",
        version: "1.x",
        note: "Headless primitives",
        icon: SiRadixui,
      },
      {
        name: "Lucide React",
        version: "0.563",
        note: "Icon system",
        icon: Hexagon,
      },
      {
        name: "React Icons",
        version: "5.5",
        note: "Brand icon library",
        icon: Sparkles,
      },
    ],
  },
  {
    id: "03",
    title: "Motion & Visualization",
    subtitle: "Movement and graphics",
    icon: Activity,
    items: [
      {
        name: "Framer Motion",
        version: "12.34",
        note: "Animation engine",
        icon: SiFramer,
      },
      {
        name: "Three.js",
        version: "0.182",
        note: "WebGL rendering",
        icon: SiThreedotjs,
      },
      {
        name: "React Three Fiber",
        version: "9.5",
        note: "R3F renderer",
        icon: Boxes,
      },
      {
        name: "Plotly.js",
        version: "3.4",
        note: "Data visualization",
        icon: SiPlotly,
      },
    ],
  },
  {
    id: "04",
    title: "Data & Authentication",
    subtitle: "State and identity",
    icon: Database,
    items: [
      {
        name: "Clerk",
        version: "7.0.4",
        note: "Auth & user management",
        icon: Lock,
      },
      {
        name: "Neon",
        version: "1.1.0",
        note: "Serverless Postgres",
        icon: Database,
      },
      {
        name: "Supabase",
        version: "2.97",
        note: "Backend-as-a-service",
        icon: SiSupabase,
      },
      { name: "Axios", version: "1.13.4", note: "HTTP client", icon: SiAxios },
    ],
  },
  {
    id: "05",
    title: "AI & Inference",
    subtitle: "Intelligence layer",
    icon: Cpu,
    items: [
      {
        name: "AWS Bedrock",
        version: "managed",
        note: "LLM gateway",
        icon: FaAws,
      },
      {
        name: "OpenAI OSS 120B",
        version: "open-source",
        note: "Foundation model · 120B parameters",
        icon: SiOpenai,
      },
    ],
  },
  {
    id: "06",
    title: "Cloud Infrastructure",
    subtitle: "AWS deployment surface",
    icon: Cloud,
    items: [
      {
        name: "AWS Amplify",
        version: "managed",
        note: "Serverless hosting",
        icon: FaAws,
      },
      {
        name: "AWS Lambda",
        version: "managed",
        note: "Serverless functions",
        icon: Zap,
      },
      {
        name: "API Gateway",
        version: "managed",
        note: "API routing & auth",
        icon: Network,
      },
      {
        name: "Route 53",
        version: "managed",
        note: "DNS management",
        icon: Globe,
      },
      {
        name: "CloudWatch",
        version: "managed",
        note: "Logs & monitoring",
        icon: Eye,
      },
    ],
  },
];

const pipeline = [
  { label: "Browser", sub: "client", icon: Globe },
  { label: "Route 53", sub: "DNS", icon: Network },
  { label: "Amplify", sub: "edge", icon: Cloud },
  { label: "Next.js", sub: "App Router", icon: Server },
  { label: "API Gateway", sub: "auth", icon: Workflow },
  { label: "Lambda", sub: "compute", icon: Zap },
  { label: "Bedrock", sub: "OSS 120B", icon: Cpu },
];

export default function TechPage() {
  const totalCount = stack.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <div className="min-h-screen bg-[#faf9f8] text-gray-900 selection:bg-[#cce3f5] selection:text-black font-rubik">
      {/* ── HERO ── */}
      <section className="relative bg-white border-b border-gray-200 overflow-hidden">
        {/* Schematic grid background */}
        <div
          className="absolute inset-0 opacity-50 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #f3f2f1 1px, transparent 1px), linear-gradient(to bottom, #f3f2f1 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-20 md:pb-16">
          {/* Section label */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-[12px] uppercase tracking-[0.2em] text-gray-500 font-medium"></span>
            <span className="h-px flex-1 bg-gray-300 max-w-[120px]"></span>
            <span className="text-[12px] uppercase tracking-[0.2em] text-gray-400 font-mono">
              §tech
            </span>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-gray-900 leading-[1.05] mb-6"
              >
                Built with the tools that{" "}
                <span className="text-[#0078D4]">ship to production</span>.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="text-[15px] sm:text-[16px] text-gray-600 leading-relaxed max-w-2xl"
              >
                A complete software bill of materials for the MScada platform —
                every framework, library, and cloud service powering the
                monitoring layer, organized by responsibility.
              </motion.p>
            </div>

            {/* Build status panel */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
              className="lg:col-span-4 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2 text-[12px] font-mono text-gray-600">
                  <GitBranch className="h-3.5 w-3.5" />
                  <span>main · 7f3a2c1</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] font-mono text-[#107C10]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-xl bg-[#107C10] opacity-75"></span>
                    <span className="relative inline-flex rounded-xl h-2 w-2 bg-[#107C10]"></span>
                  </span>
                  DEPLOYED
                </div>
              </div>
              <div className="px-4 py-3 space-y-1.5 text-[12px] font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-500">build</span>
                  <span className="text-[#107C10]">passing ✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">region</span>
                  <span className="text-gray-700">ap-south-1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">runtime</span>
                  <span className="text-gray-700">node@22</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">packages</span>
                  <span className="text-[#0078D4]">{totalCount} tracked</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── REQUEST PIPELINE STRIP ── */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-5">
            <Terminal className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-[11px] uppercase tracking-[0.18em] text-gray-500 font-medium">
              Request Pipeline
            </span>
            <span className="h-px flex-1 bg-gray-200" />
            <span className="text-[11px] font-mono text-gray-400">
              avg · 84ms
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2">
            {pipeline.map((step, i) => (
              <React.Fragment key={step.label}>
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-center gap-2.5 px-3 py-2 bg-gray-50 hover:bg-[#eaf3fb] border border-gray-200 hover:border-[#0078D4] rounded-xl transition-colors flex-shrink-0"
                >
                  <step.icon className="h-3.5 w-3.5 text-[#0078D4]" />
                  <div className="flex flex-col">
                    <span className="text-[12px] font-medium text-gray-900 leading-tight">
                      {step.label}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono leading-tight">
                      {step.sub}
                    </span>
                  </div>
                </motion.div>
                {i < pipeline.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.08 + 0.05 }}
                    className="text-gray-300 flex-shrink-0"
                  >
                    <ArrowRight className="h-3 w-3" />
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── STACK GROUPS ── */}
      <section className="bg-[#faf9f8]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 space-y-16">
          {stack.map((group, gi) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Group header */}
              <div className="flex items-baseline justify-between flex-wrap gap-3 mb-6 pb-3 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-gray-400 tracking-wider">
                    [{group.id}]
                  </span>
                  <group.icon className="h-4 w-4 text-[#0078D4]" />
                  <h2 className="text-[20px] md:text-[22px] font-medium tracking-tight text-gray-900">
                    {group.title}
                  </h2>
                  <span className="text-[13px] text-gray-500 hidden sm:inline">
                    — {group.subtitle}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-gray-400">
                  {group.items.length}{" "}
                  {group.items.length === 1 ? "item" : "items"}
                </span>
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {group.items.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{
                        duration: 0.4,
                        delay: gi * 0.02 + i * 0.05,
                        ease: "easeOut",
                      }}
                      whileHover={{ y: -2 }}
                      className="group bg-white border border-gray-200 hover:border-[#0078D4] rounded-xl p-5 transition-colors duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="h-10 w-10 flex items-center justify-center bg-gray-50 group-hover:bg-[#eaf3fb] border border-gray-200 group-hover:border-[#0078D4] rounded-xl transition-colors">
                          <Icon className="h-5 w-5 text-gray-700 group-hover:text-[#0078D4] transition-colors" />
                        </div>
                        <span className="text-[10px] font-mono text-[#0078D4] tracking-wider px-1.5 py-0.5 bg-[#eaf3fb] rounded-xl">
                          v{item.version}
                        </span>
                      </div>
                      <h3 className="text-[15px] font-medium text-gray-900 mb-1 tracking-tight">
                        {item.name}
                      </h3>
                      <p className="text-[12.5px] text-gray-500 leading-relaxed">
                        {item.note}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── MANIFEST FOOTER ── */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-gray-200">
            {[
              { label: "Total Packages", val: String(totalCount) },
              { label: "Categories", val: String(stack.length) },
              { label: "Cloud Provider", val: "AWS" },
              { label: "License", val: "OSS" },
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
            <span>† manifest generated from package.json</span>
            <span>· last sync · {new Date().toISOString().split("T")[0]}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
