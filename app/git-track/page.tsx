"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Github,
  GitBranch,
  FolderTree,
  Search,
  Filter,
  Clock,
  GitCommitHorizontal,
  Code2,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================

interface CommitAuthor {
  name: string;
  email: string;
  date: string;
}

interface CommitData {
  message: string;
  author: CommitAuthor;
}

interface GithubCommit {
  sha: string;
  html_url: string;
  commit: CommitData;
  author: {
    login: string;
    avatar_url: string;
  } | null;
}

// ============================================================================
// Configuration
// ============================================================================

const GITHUB_CONFIG = {
  username: "kinshukjainn",
  repository: "m-scada",
  branch: "master",
  perPage: 100,
  maxPages: 10,
};

const COMMIT_TYPES = [
  { id: "all", label: "All Types" },
  { id: "feat", label: "Features" },
  { id: "fix", label: "Bug Fixes" },
  { id: "chore", label: "Chores" },
  { id: "docs", label: "Documentation" },
  { id: "refactor", label: "Refactors" },
];

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

const getCommitTitle = (message: string) => message.split("\n")[0];

// ============================================================================
// Main Component
// ============================================================================

export default function ChangelogTracker() {
  const [commits, setCommits] = useState<GithubCommit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchingProgress, setFetchingProgress] = useState<number>(0);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateRange] = useState({ start: "", end: "" });
  const [showFilters, setShowFilters] = useState(false);

  const fetchCommits = async () => {
    setLoading(true);
    setError(null);
    setFetchingProgress(0);

    try {
      let allCommits: GithubCommit[] = [];
      let page = 1;
      let shouldFetchMore = true;

      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      while (shouldFetchMore && page <= GITHUB_CONFIG.maxPages) {
        setFetchingProgress(page);

        const response = await fetch(
          `https://api.github.com/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repository}/commits?sha=${GITHUB_CONFIG.branch}&per_page=${GITHUB_CONFIG.perPage}&page=${page}`,
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
            },
          },
        );

        if (!response.ok) {
          if (response.status === 403)
            throw new Error("GitHub API rate limit exceeded.");
          if (response.status === 404) throw new Error("Repository not found.");
          throw new Error(
            `Failed to fetch commits (Status: ${response.status})`,
          );
        }

        const data: GithubCommit[] = await response.json();

        if (data.length === 0) {
          break;
        }

        allCommits = [...allCommits, ...data];

        const oldestDateInBatch = new Date(
          data[data.length - 1].commit.author.date,
        );

        if (oldestDateInBatch < oneYearAgo) {
          shouldFetchMore = false;
        } else {
          page++;
        }
      }

      setCommits(allCommits);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommits();
  }, []);

  // --------------------------------------------------------------------------
  // Data Processing & Filtering
  // --------------------------------------------------------------------------

  const uniqueAuthors = useMemo(() => {
    return Array.from(new Set(commits.map((c) => c.commit.author.name)));
  }, [commits]);

  const displayCommits = useMemo(() => {
    return commits.filter((commit) => {
      const msg = commit.commit.message.toLowerCase();
      const authorName = commit.commit.author.name;
      const commitDate = new Date(commit.commit.author.date);
      const sha = commit.sha.toLowerCase();

      if (
        searchQuery &&
        !msg.includes(searchQuery.toLowerCase()) &&
        !sha.includes(searchQuery.toLowerCase())
      )
        return false;
      if (authorFilter !== "all" && authorName !== authorFilter) return false;
      if (
        typeFilter !== "all" &&
        !(msg.startsWith(`${typeFilter}:`) || msg.startsWith(`${typeFilter}(`))
      )
        return false;

      if (dateRange.start) {
        const startDate = new Date(dateRange.start);
        startDate.setHours(0, 0, 0, 0);
        if (commitDate < startDate) return false;
      }
      if (dateRange.end) {
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999);
        if (commitDate > endDate) return false;
      }
      return true;
    });
  }, [commits, searchQuery, authorFilter, typeFilter, dateRange]);

  const lastChangeDate =
    commits.length > 0
      ? new Date(commits[0].commit.author.date).toUTCString()
      : "N/A";

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-900  p-4 sm:p-8 selection:bg-blue-200">
      <div className="max-w-5xl mx-auto">
        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white border border-gray-200 shadow-sm rounded-xl">
              <Github className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h1 className="text-xl font-semibold flex items-center gap-1.5 text-gray-900">
                <span className="text-blue-600 hover:underline cursor-pointer">
                  {GITHUB_CONFIG.username}
                </span>
                <span className="text-gray-400 font-light">/</span>
                <span className="font-bold cursor-pointer hover:text-blue-600 transition-colors">
                  {GITHUB_CONFIG.repository}
                </span>
              </h1>
              <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
                <GitBranch className="w-3.5 h-3.5" />
                <span className="font-medium bg-gray-100 px-1.5 py-0.5 rounded-xl text-gray-700">
                  {GITHUB_CONFIG.branch}
                </span>
                <span className="text-gray-300 mx-1">•</span>
                <span>Updated: {lastChangeDate}</span> {/* <-- Added here */}
                <span>Commits History</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl transition-all border ${
                showFilters
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-white border-gray-200 text-gray-600 shadow-sm hover:bg-gray-50"
              }`}
            >
              <Filter size={16} />
              Filters
            </button>
            <Link href="/git-track/tree">
              <button className="flex items-center gap-1.5 text-sm font-medium text-white bg-gray-900 border border-gray-800 shadow-sm px-4 py-2 rounded-xl hover:bg-gray-800 transition-all">
                <FolderTree size={16} />
                View Files
              </button>
            </Link>
          </div>
        </div>

        {/* ── FILTERS BLOCK ── */}
        {showFilters && (
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 mb-6 animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <label className="flex flex-col gap-1.5">
                <span className="text-gray-700 font-medium text-sm flex items-center gap-1">
                  <Search size={14} className="text-gray-400" /> Search
                </span>
                <input
                  type="text"
                  placeholder="author, date, hash, msg..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-gray-700 font-medium text-sm">
                  Author
                </span>
                <select
                  value={authorFilter}
                  onChange={(e) => setAuthorFilter(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  <option value="all">All Authors</option>
                  {uniqueAuthors.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-gray-700 font-medium text-sm">Type</span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  {COMMIT_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setAuthorFilter("all");
                  setTypeFilter("all");
                }}
                className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 text-sm border border-gray-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* ── ERROR & LOADING STATES ── */}
        {loading && (
          <div className="p-12 text-center text-sm text-gray-500 flex flex-col items-center gap-3 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-xl animate-spin" />
            Fetching repository history (Page {fetchingProgress})...
          </div>
        )}

        {error && (
          <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl mb-6 flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-xl bg-red-500" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchCommits}
              className="text-red-700 hover:bg-red-100 px-3 py-1 rounded-xl transition-colors font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && displayCommits.length === 0 && (
          <div className="p-12 text-center text-sm text-gray-500 bg-white border border-gray-200 rounded-xl shadow-sm">
            No commits found matching your search criteria.
          </div>
        )}

        {/* ── COMMITS TIMELINE / LIST ── */}
        {!loading && !error && displayCommits.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100">
              {displayCommits.map((commit, index) => {
                const title = getCommitTitle(commit.commit.message);
                const isLatest = index === 0;

                return (
                  <div
                    key={commit.sha}
                    className="group flex flex-col sm:flex-row sm:items-start justify-between p-4 hover:bg-gray-50 transition-colors gap-4"
                  >
                    <div className="flex gap-3 items-start min-w-0">
                      {/* Optional Avatar, fallback to default icon if missing */}
                      <div className="shrink-0 mt-0.5">
                        {commit.author?.avatar_url ? (
                          <Image
                            src={commit.author.avatar_url}
                            alt={commit.commit.author.name}
                            width={32}
                            height={32}
                            className="rounded-xl border border-gray-200"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500">
                            <GitCommitHorizontal size={16} />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-gray-900 text-[15px] truncate max-w-full">
                            {title}
                          </span>
                          {isLatest && (
                            <span className="bg-blue-50 text-blue-600 border border-blue-200 text-[11px] font-semibold px-2 py-0.5 rounded-xl leading-tight shrink-0">
                              Latest
                            </span>
                          )}
                        </div>

                        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1 text-[13px] text-gray-500">
                          <span className="font-medium text-gray-700">
                            {commit.commit.author.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {timeAgo(commit.commit.author.date)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons / Links */}
                    <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:mt-0 mt-2 ml-11 sm:ml-0">
                      <a
                        href={commit.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-mono text-gray-500 bg-gray-50 border border-gray-200 hover:border-gray-300 hover:text-gray-900 px-2.5 py-1.5 rounded-xl transition-all"
                        title="View Commit"
                      >
                        <GitCommitHorizontal size={14} />
                        {commit.sha.substring(0, 7)}
                      </a>

                      <a
                        href={commit.html_url.replace("/commit/", "/tree/")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                        title="Browse Files at this point"
                      >
                        <Code2 size={16} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination / Load More Footer */}
            <div className="bg-gray-50/80 border-t border-gray-100 p-3 text-center">
              <button className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors focus:outline-none">
                Showing {displayCommits.length} commits
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
