"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Info,
  Terminal,
  MessageSquare,
  Github,
  Boxes,
  Menu,
  X,
} from "lucide-react";
import { IoBugSharp } from "react-icons/io5";

// Array of navigation items to keep the JSX clean and DRY
const NAV_LINKS = [
  { path: "/about-info", icon: Info, label: "About" },
  { path: "/git-track", icon: Boxes, label: "Logs" },
  { path: "/console", icon: Terminal, label: "Console" },
  { path: "/issues", icon: IoBugSharp, label: "Issues" },
  { path: "/tech", icon: IoBugSharp, label: "Infrastructure" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 sm:h-14 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-1 text-[16px] sm:text-lg font-bold text-gray-900 hover:text-[#0078D4] transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            M-<span className="text-gray-900">Scada</span>_
          </Link>
          {/* Desktop Navigation (Azure Top-Nav Style) */}
          <nav className="hidden md:flex md:items-center h-full ml-8">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-center gap-1.5 h-full px-4 text-[15px] font-medium transition-colors border-b-2 ${
                    isActive
                      ? "border-[#0078D4] text-[#0078D4] bg-[#f3f9fd]"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex-1" />
          {/* Desktop Right Actions (External Links) */}
          <div className="hidden md:flex md:items-center md:gap-3">
            <a
              href="https://github.com/kinshukjainn/fds-college"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[13px] font-semibold text-gray-100 bg-black border border-gray-300 hover:bg-gray-50 px-4 py-1.5 rounded-full transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
            <a
              href="https://fdb.cloudkinshuk.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[13px] font-medium text-white bg-[#0078D4] border border-transparent hover:bg-[#005a9e] px-4 py-1.5 rounded-full transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Feedback</span>
            </a>
          </div>
          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl md:hidden transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu (Azure Sidebar/Dropdown Style) */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-b border-gray-200 transition-all duration-200 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col py-2">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-6 py-3 text-[14px] font-medium transition-colors border-l-2 ${
                  isActive
                    ? "border-[#0078D4] text-[#0078D4] bg-[#f3f9fd]"
                    : "border-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                {link.label}
              </Link>
            );
          })}

          <div className="w-full h-px bg-gray-100 my-2" />

          {/* Mobile External Links */}
          <div className="flex flex-col px-4 pb-4 pt-2 gap-2">
            <a
              href="https://github.com/kinshukjainn/mscada"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl px-4 py-2.5 text-[14px] font-medium transition-colors"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <a
              href="https://clkfeedbacks.cloudkinshuk.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#0078D4] hover:bg-[#005a9e] text-white rounded-xl px-4 py-2.5 text-[14px] font-medium transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              Feedback
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
