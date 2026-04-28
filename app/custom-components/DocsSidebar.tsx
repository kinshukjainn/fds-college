"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

// ───────────────────────────────────────────────
// Types & Nav Data (No Icons in Navigation)
// ───────────────────────────────────────────────
interface NavItem {
  title: string;
  href: string;
}

const navItems: NavItem[] = [
  { title: "Introduction", href: "/docs/introduction" },
  { title: "Project Info", href: "/docs/project-info" },
  { title: "Development Setup", href: "/docs/setup" },
  { title: "AWS Services used", href: "/docs/aws-services" },
  { title: "Amazon Lambda Function", href: "/docs/lambda-function" },
  { title: "Amazon API Gateway", href: "/docs/amazon-api-gateway" },
  {
    title: "Service Integrations",
    href: "/docs/lambda-integration-with-api-gateway",
  },
  { title: "Open AI Model", href: "/docs/open-ai-oss-model" },
  { title: "Bedrock Model", href: "/docs/about-model" },
  { title: "Response and Request of model", href: "/docs/rar" },
  { title: "Introduction to Model Parameters", href: "/docs/params" },
  { title: "What is an API", href: "/docs/api-intro" },
  { title: "Introduction to SCADA", href: "/docs/intro-scada" },
  { title: "Scada systems working", href: "/docs/working-scada" },
  { title: "UI/UX Guidelines", href: "/docs/uiux-guide" },
  { title: "Contribution Guidelines", href: "/docs/contri" },
];

// ───────────────────────────────────────────────
// Utilitarian Sidebar Component
// ───────────────────────────────────────────────
export function DocsSidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {}, [pathname]);

  // Close sidebar when escape key is pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <>
      {/* ─── Mobile Top Header ─── */}
      <div className="flex items-center justify-between bg-[#202020] px-4 py-2 text-white lg:hidden border-b border-gray-800 z-40 relative">
        <span className=" text-sm font-medium">FDS.ai Docs</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 text-gray-300 hover:text-white transition-colors"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* ─── Mobile Backdrop ─── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#202020]/60 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-[#252525] border-r border-gray-800 overflow-y-auto px-4 py-6
          transition-none lg:sticky lg:h-screen lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${className}
        `}
      >
        {/* Simple Header */}
        <div className="mb-6 hidden lg:block">
          <h2 className=" text-lg font-medium text-white border-b border-gray-100 pb-2">
            <span className="text-red-500 ">M-</span>{" "}
            <span className=" text-white ">Scada</span> Documentation
          </h2>
        </div>

        {/* Plain HTML List Style Navigation */}
        <ul className="flex flex-col gap-2  text-sm">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href} className="list-inside list-square">
                <Link
                  href={item.href}
                  className={`
                    hover:underline inline-block py-1
                    ${isActive ? "text-blue-500 font-medium" : "text-white"}
                  `}
                >
                  {isActive ? `> ${item.title}` : item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
}

export default DocsSidebar;
