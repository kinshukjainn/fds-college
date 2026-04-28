"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { getFeedbacksAction } from "../api/fdb/actions"; // Adjust path as needed

type Feedback = {
  id: number;
  created_at: string;
  category: "Blogs" | "Projects" | "Portfolio Website";
  project_name: string | null;
  name: string;
  github_id: string | null;
  email: string;
  feedback: string;
};

interface MarkdownComponentProps {
  node?: unknown;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Updated to only include MScada
const PROJECTS = ["MScada"];

// ============================================================================
// Utility Functions
// ============================================================================

const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} mins ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days < 30) return `${days} days ago`;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const getIssueTitle = (markdownText: string) => {
  const raw = markdownText.replace(/[#*`>\-_]/g, "").trim();
  const firstLine = raw.split("\n")[0];
  return firstLine.length > 80 ? firstLine.slice(0, 80) + "..." : firstLine;
};

// ============================================================================
// Main Component
// ============================================================================

export default function FeedbacksList() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterProject, setFilterProject] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      // Calling the Next.js server action directly
      const result = await getFeedbacksAction();

      if (!result.success) throw new Error(result.error || "Failed to fetch.");

      // DB already filters for 'MScada' and 'approved'
      setFeedbacks((result.data as Feedback[]) || []);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred.";
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = feedbacks.filter((fb) => {
    if (filterProject !== "all" && fb.project_name !== filterProject)
      return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        fb.name.toLowerCase().includes(q) ||
        fb.email.toLowerCase().includes(q) ||
        (fb.github_id?.toLowerCase().includes(q) ?? false) ||
        fb.feedback.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const lastChangeDate =
    feedbacks.length > 0
      ? new Date(feedbacks[0].created_at).toUTCString()
      : "N/A";

  return (
    <div className="min-h-screen bg-white text-black  text-[14px] sm:text-[15px] p-2 sm:p-4 selection:bg-[#cceeff]">
      <div className="max-w-7xl mx-auto">
        {/* ── TOP HEADER (Breadcrumbs) ── */}
        <div className="mb-1">
          <h1 className="text-[20px] sm:text-[24px] font-medium m-0 p-0">
            <a href="#" className="text-[#0000ee] hover:underline no-underline">
              projects
            </a>{" "}
            /{" "}
            <a href="#" className="text-[#0000ee] hover:underline no-underline">
              mscada.git
            </a>{" "}
            / logs
          </h1>
        </div>

        {/* ── META INFO TABLE ── */}
        <div className=" py-3 px-2 sm:px-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-y-1 sm:gap-x-4 text-[13px] sm:text-[14px]">
            <div className="text-[#555555] font-medium">description</div>
            <div>MScada Issue Tracker & Feedback Archive</div>

            <div className="text-[#555555] font-medium">latest report</div>
            <div>
              {lastChangeDate} ({feedbacks.length} total issues)
            </div>

            <div className="text-[#555555] font-medium">rules</div>
            <div>Avoid duplicate reports. Include reproduction steps.</div>

            {/* Classic-style Filters Toggle */}
            <div className="text-[#555555] mt-2 sm:mt-0 font-medium">
              filters
            </div>
            <div className="mt-2 sm:mt-0">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-[#0000ee] hover:underline bg-transparent font-medium  border-none p-0 cursor-pointer"
              >
                {showFilters
                  ? "hide search & filters"
                  : "show search & filters"}
              </button>
            </div>
          </div>
        </div>

        {/* ── FILTERS BLOCK ── */}
        {showFilters && (
          <div className=" p-3 mb-4 text-[13px]">
            <div className="flex flex-wrap gap-4 items-end">
              <label className="flex flex-col gap-1">
                <span className="font-medium">Search:</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Keywords, email, etc..."
                  className="border-2 rounded  border-gray-700  px-1 py-0.5 w-48"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-medium">Project Target:</span>
                <select
                  value={filterProject}
                  onChange={(e) => setFilterProject(e.target.value)}
                  className="border border-[#999] px-1 py-0.5"
                >
                  <option value="all">all projects</option>
                  {PROJECTS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </label>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterProject("all");
                }}
                className="bg-[#e0e0e0] rounded border border-[#999] px-2 py-0.5 hover:bg-[#ccc] cursor-pointer"
              >
                clear
              </button>
              <button
                onClick={fetchFeedbacks}
                className="bg-[#e0e0e0] border border-[#999] px-2 py-0.5 hover:bg-[#ccc] rounded  cursor-pointer ml-auto"
              >
                refresh archive
              </button>
            </div>
          </div>
        )}

        {/* ── SECTION HEADER ── */}
        <div className=" py-1.5 px-2 font-medium mb-2 flex justify-between">
          <span className="text-xl ">Issues log</span>
          <span className="font-normal text-[13px] text-[#555]">
            showing {filtered.length} matching
          </span>
        </div>

        {/* ── ERROR & LOADING STATES ── */}
        {isLoading && (
          <div className="p-4 text-[#555] ">
            Loading... till then enjoy coffee..
          </div>
        )}

        {errorMsg && (
          <div className="p-4 text-[#cc0000] font-medium bg-[#ffdddd] border border-[#cc0000] mb-4">
            Error: {errorMsg}
            <button
              onClick={fetchFeedbacks}
              className="ml-4 underline text-[#0000ee] bg-transparent border-none cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !errorMsg && filtered.length === 0 && (
          <div className="p-4 text-[#555]  border border-[#eee]">
            wooow.. so perfect app..no fixes found .. come again later
          </div>
        )}

        {/* ── LIST ── */}
        {!isLoading && !errorMsg && filtered.length > 0 && (
          <div className="w-full flex flex-col border-b border-[#eee]">
            {filtered.map((fb, index) => {
              const isOpen = expandedId === fb.id;
              const title = getIssueTitle(fb.feedback);
              const rowClass = index % 2 === 0 ? "bg-white" : "bg-[#f8f8f8]";

              return (
                <div key={fb.id} className="flex flex-col">
                  {/* Row */}
                  <div
                    onClick={() => setExpandedId(isOpen ? null : fb.id)}
                    className={`${rowClass} flex flex-col md:flex-row md:items-center py-2 px-2 hover:bg-[#eef3f8] transition-colors gap-1 md:gap-4 cursor-pointer`}
                  >
                    {/* Time & Reporter */}
                    <div className="flex flex-row md:flex-row gap-2 md:gap-4 shrink-0 text-gray-700  text-[13px] md:w-[220px]">
                      <span className="w-[85px] shrink-0">
                        {timeAgo(fb.created_at)}
                      </span>
                      <a
                        href={`mailto:${fb.name}`}
                        className="truncate text-blue-800 underline  w-[148px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {fb.email}
                      </a>
                    </div>

                    {/* Issue Title & Tag */}
                    <div className="flex-1 min-w-0 font-medium text-black flex items-center flex-wrap gap-2 text-[14px]">
                      <span className="break-words">{title}</span>
                      {fb.project_name && (
                        <span className="bg-[#ccffcc] border border-[#000000] text-black text-[12px] font-medium px-2 py-1 leading-tight whitespace-nowrap">
                          {fb.project_name}
                        </span>
                      )}
                    </div>

                    {/* Expand Link */}
                    <div className="shrink-0 text-[12px] md:text-[13px] text-[#0000ee] bg-yellow-200 border border-black  w-max px-2  font-medium  mt-1 md:mt-0 md:text-right">
                      {isOpen ? "Hide" : "Read"}
                    </div>
                  </div>

                  {/* Expanded Content Area */}
                  {isOpen && (
                    <div className="border-l-[4px] border-[#0000ee] bg-[#fdfdfd] border-y border-y-[#eee] p-4 ml-2 my-2 text-[13px]">
                      <div className="mb-4 pb-2 border-b border-[#eee] text-[#555] flex flex-wrap gap-4">
                        <span>
                          <strong>Issue id:</strong> #{fb.id}
                        </span>
                        <span>
                          <strong>Reporter:</strong>{" "}
                          <a className="text-blue-800 font-medium hover:underline">
                            {fb.name}
                          </a>
                        </span>
                        {fb.github_id && (
                          <span>
                            <strong>GitHub:</strong>{" "}
                            <a
                              href={`https://github.com/${fb.github_id.replace("@", "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#0000ee] hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              @{fb.github_id.replace("@", "")}
                            </a>
                          </span>
                        )}
                      </div>

                      <div className="text-black leading-normal break-words [&_p]:mb-3 [&_p:last-child]:mb-0 [&_h1]:text-[16px] [&_h1]:font-medium [&_h1]:mb-3 [&_h1]:mt-4 [&_h1]:border-b [&_h1]:border-[#eee] [&_h1]:pb-1 [&_h2]:text-[15px] [&_h2]:font-medium [&_h2]:mb-2 [&_h2]:mt-3 [&_h3]:text-[14px] [&_h3]:font-medium [&_h3]:mb-1 [&_h3]:mt-2 [&_a]:text-[#0000ee] [&_a:hover]:underline [&_a]:break-all [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_li]:mb-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_blockquote]:border-l-[3px] [&_blockquote]:border-[#ccc] [&_blockquote]:pl-3 [&_blockquote]:text-[#555] [&_blockquote]:my-3 [&_code]:bg-[#f4f4f4] [&_code]:border [&_code]:border-[#ddd] [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[12px] [&_pre]:bg-[#f4f4f4] [&_pre]:border [&_pre]:border-[#ccc] [&_pre]:p-3 [&_pre]:overflow-x-auto [&_pre]:my-4 [&_pre_code]:bg-transparent [&_pre_code]:border-0 [&_pre_code]:p-0 [&_pre_code]:text-[13px]">
                        <ReactMarkdown
                          components={{
                            code({
                              inline,
                              className,
                              children,
                              ...props
                            }: MarkdownComponentProps) {
                              return !inline ? (
                                <pre>
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                </pre>
                              ) : (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {fb.feedback}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Indicator */}
        {!isLoading && !errorMsg && filtered.length > 0 && (
          <div className="mt-2 px-2 text-[#0000ee] text-[13px] font-medium cursor-pointer hover:underline">
            ...
          </div>
        )}
      </div>
    </div>
  );
}
