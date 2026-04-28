"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Consoleheader() {
  const pathname = usePathname();

  // Check current route
  const isConsoleHome = pathname === "/console";
  const isManual = pathname === "/console/manual";
  const isDirect = pathname === "/console/direct";

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 h-14 flex items-center px-4 sm:px-6 shadow-sm">
      <div className="flex w-full items-center justify-between mx-auto max-w-full">
        {/* Left side - Breadcrumbs / Branding */}
        <nav aria-label="Breadcrumb" className="flex items-center min-w-0">
          {isConsoleHome && (
            <h1 className="font-medium text-lg sm:text-xl tracking-tight text-gray-900 truncate">
              Principal Console
            </h1>
          )}

          {(isManual || isDirect) && (
            <ol
              role="list"
              className="flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base min-w-0"
            >
              <li className="flex-shrink-0">
                <Link
                  href="/console"
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
                >
                  Console
                </Link>
              </li>

              <li className="flex items-center text-gray-300 flex-shrink-0">
                <span className="text-xl leading-none select-none font-light">
                  |
                </span>
              </li>

              <li className="truncate">
                <h1
                  className="font-medium text-gray-900 truncate"
                  aria-current="page"
                >
                  {isManual && "Manual Console"}
                  {isDirect && "Automated Console"}
                </h1>
              </li>
            </ol>
          )}
        </nav>

        {/* Right side - Optional actions */}
        <div className="flex items-center gap-3 text-gray-500 ml-4 flex-shrink-0">
          {/* Action slots */}
        </div>
      </div>
    </header>
  );
}
