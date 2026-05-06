"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { getFeedbacksAction } from "../api/fdb/actions"; // Adjust path as needed
import {
  MessageSquare,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Github,
  User,
  Calendar,
  RefreshCw,
  Inbox,
} from "lucide-react";

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
      const result = await getFeedbacksAction();
      if (!result.success) throw new Error(result.error || "Failed to fetch.");
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
    <div className="min-h-screen bg-gray-50/50 text-gray-900 font-sans p-4 sm:p-8 selection:bg-blue-200">
      <div className="max-w-5xl mx-auto">
        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white border border-gray-200 shadow-sm rounded-xl">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Feedback & Issues
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <span>MScada Tracker</span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> Last report: {lastChangeDate}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-all border ${
                showFilters
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-white border-gray-200 text-gray-600 shadow-sm hover:bg-gray-50"
              }`}
            >
              <Filter size={16} />
              Filters
            </button>
            <button
              onClick={fetchFeedbacks}
              className="flex items-center gap-2 text-sm font-medium text-white bg-gray-900 border border-gray-800 shadow-sm px-4 py-2 rounded-xl hover:bg-gray-800 transition-all"
            >
              <RefreshCw
                size={16}
                className={isLoading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* ── FILTERS BLOCK ── */}
        {showFilters && (
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 mb-6 animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
              <label className="flex flex-col gap-1.5">
                <span className="text-gray-700 font-medium text-sm flex items-center gap-1.5">
                  <Search size={14} className="text-gray-400" /> Search Issues
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Keywords, email, author..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-gray-700 font-medium text-sm">
                  Target
                </span>
                <select
                  value={filterProject}
                  onChange={(e) => setFilterProject(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  <option value="all">All Projects</option>
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
                className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-medium transition-colors focus:outline-none text-sm border border-gray-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* ── ERROR & LOADING STATES ── */}
        {isLoading && (
          <div className="p-12 text-center text-sm text-gray-500 flex flex-col items-center gap-3 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-xl animate-spin" />
            Loading feedback archive...
          </div>
        )}

        {errorMsg && (
          <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl mb-6 flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-xl bg-red-500" />
              <span className="font-medium">{errorMsg}</span>
            </div>
            <button
              onClick={fetchFeedbacks}
              className="text-red-700 hover:bg-red-100 px-3 py-1 rounded-xl transition-colors font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !errorMsg && filtered.length === 0 && (
          <div className="p-16 text-center text-gray-500 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col items-center gap-3">
            <Inbox size={48} className="text-gray-300" />
            <p className="text-base font-medium text-gray-900">
              No issues found
            </p>
            <p className="text-sm">
              We couldn&apos;t find any feedback matching your criteria.
            </p>
          </div>
        )}

        {/* ── LIST ── */}
        {!isLoading && !errorMsg && filtered.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {/* Header row for context */}
            <div className="bg-gray-50/80 border-b border-gray-100 px-6 py-3 flex justify-between items-center text-sm font-medium text-gray-500">
              <span>{filtered.length} Open Issues</span>
            </div>

            <div className="divide-y divide-gray-100">
              {filtered.map((fb) => {
                const isOpen = expandedId === fb.id;
                const title = getIssueTitle(fb.feedback);

                return (
                  <div key={fb.id} className="flex flex-col transition-colors">
                    {/* ── ROW HEADER ── */}
                    <div
                      onClick={() => setExpandedId(isOpen ? null : fb.id)}
                      className={`flex flex-col sm:flex-row sm:items-start p-4 sm:p-6 cursor-pointer group ${
                        isOpen ? "bg-blue-50/30" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex gap-4 items-start flex-1 min-w-0">
                        {/* Avatar Placeholder */}
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-100 to-blue-50 border border-blue-200 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-blue-700 font-semibold text-sm">
                            {fb.name.charAt(0).toUpperCase()}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-base font-semibold text-gray-900 truncate max-w-full group-hover:text-blue-600 transition-colors">
                              {title}
                            </h3>
                            {fb.project_name && (
                              <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium px-2 py-0.5 rounded-xl shrink-0">
                                {fb.project_name}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5">
                              <User size={14} className="text-gray-400" />
                              <span className="font-medium text-gray-700">
                                {fb.name}
                              </span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Calendar size={14} className="text-gray-400" />
                              {timeAgo(fb.created_at)}
                            </span>
                            <span className="text-gray-400 text-xs">
                              #{fb.id}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 sm:mt-0 ml-14 sm:ml-4 shrink-0 flex items-center justify-end">
                        <div
                          className={`p-1.5 rounded-xl transition-colors ${
                            isOpen
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600"
                          }`}
                        >
                          {isOpen ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ── EXPANDED CONTENT ── */}
                    {isOpen && (
                      <div className="bg-white border-t border-gray-100 px-4 sm:px-6 py-6 ml-0 sm:ml-[60px] animate-in slide-in-from-top-1 fade-in duration-200">
                        {/* Reporter Details Box */}
                        <div className="flex flex-wrap items-center gap-4 p-3 mb-6 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Email:</span>
                            <a
                              href={`mailto:${fb.email}`}
                              onClick={(e) => e.stopPropagation()}
                              className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                            >
                              {fb.email}
                            </a>
                          </div>
                          {fb.github_id && (
                            <>
                              <div className="w-px h-4 bg-gray-300 hidden sm:block"></div>
                              <div className="flex items-center gap-2">
                                <Github size={14} className="text-gray-500" />
                                <a
                                  href={`https://github.com/${fb.github_id.replace("@", "")}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                                >
                                  @{fb.github_id.replace("@", "")}
                                </a>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Markdown Body styling adjusted for modern look */}
                        <div
                          className="text-gray-700 leading-relaxed break-words text-[15px]
                          [&_p]:mb-4 [&_p:last-child]:mb-0 
                          [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:text-gray-900 [&_h1]:mb-4 [&_h1]:pb-2 [&_h1]:border-b [&_h1]:border-gray-200 
                          [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:mb-3 [&_h2]:mt-6 
                          [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mb-2 [&_h3]:mt-4 
                          [&_a]:text-blue-600 [&_a:hover]:underline [&_a]:break-all 
                          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1
                          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1
                          [&_blockquote]:border-l-4 [&_blockquote]:border-gray-200 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-500 [&_blockquote]:my-4 
                          [&_code]:bg-gray-100 [&_code]:text-pink-600 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-xl [&_code]:text-sm [&_code]:font-mono
                          [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:my-5 [&_pre]:shadow-sm
                          [&_pre_code]:bg-transparent [&_pre_code]:text-gray-100 [&_pre_code]:p-0 [&_pre_code]:text-sm"
                        >
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

            <div className="bg-gray-50/80 border-t border-gray-100 p-3 text-center">
              <span className="text-sm font-medium text-gray-500">
                End of results
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
