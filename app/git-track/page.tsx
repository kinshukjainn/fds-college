"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";

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
    <div className="min-h-screen bg-white text-gray-900 text-[14px] sm:text-[15px] p-4 md:p-6 lg:p-8 selection:bg-blue-100">
      <div className="max-w-7xl mx-auto">
        {/* ── TOP HEADER (Breadcrumbs & Links) ── */}
        <div className="mb-2">
          <h1 className="text-[20px] sm:text-[24px] font-medium m-0 p-0 text-gray-900 break-words">
            <Link href="#" className="hover:underline text-gray-900">
              Github
            </Link>{" "}
            <span className="text-gray-400 mx-1">/</span>{" "}
            <Link href="#" className="hover:underline text-gray-900">
              {GITHUB_CONFIG.repository}
            </Link>{" "}
            <span className="text-gray-400 mx-1">/</span> summary
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[14px] sm:text-[15px] mb-6">
          <span className="text-gray-600">summary |</span>
          <Link
            href="/git-track/tree"
            className="inline-flex items-center text-white font-medium px-2 py-1 bg-green-500 hover:bg-green-600 transition-colors no-underline"
          >
            View repo tree &rarr;
          </Link>
        </div>

        {/* ── META INFO TABLE ── */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg py-4 px-4 sm:px-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-y-3 sm:gap-x-4 text-[14px]">
            <div className="text-gray-900 font-medium">Description</div>
            <div className="text-gray-700">
              {GITHUB_CONFIG.repository} git repo
            </div>

            <div className="text-gray-900 font-medium">Last change</div>
            <div className="text-gray-700">{lastChangeDate}</div>

            <div className="text-gray-900 font-medium">URL</div>
            <div>
              <a
                href={`https://github.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repository}`}
                className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://github.com/{GITHUB_CONFIG.username}/
                {GITHUB_CONFIG.repository}.git
              </a>
            </div>

            <div className="text-gray-900 font-medium mt-2 sm:mt-0">
              Filters
            </div>
            <div className="mt-1 sm:mt-0">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="text-blue-700 hover:text-blue-800 underline font-medium italic transition-colors"
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
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-5 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <label className="flex flex-col gap-1.5">
                <span className="text-gray-900 font-medium text-sm">
                  Search:
                </span>
                <input
                  type="text"
                  placeholder="author, date, time, msg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-gray-900 font-medium text-sm">
                  Author:
                </span>
                <select
                  value={authorFilter}
                  onChange={(e) => setAuthorFilter(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                >
                  <option value="all">all</option>
                  {uniqueAuthors.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-gray-900 font-medium text-sm">Type:</span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
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
                className="w-full sm:w-auto bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* ── SECTION HEADER ── */}
        <div className="py-2 text-2xl sm:text-3xl font-medium mb-4 text-gray-900 border-b-2 border-gray-100">
          Commits List
        </div>

        {/* ── ERROR & LOADING STATES ── */}
        {loading && (
          <div className="p-4 sm:p-6 text-gray-600 bg-gray-50 border border-gray-200 rounded-lg animate-pulse">
            Fetching repository history (page {fetchingProgress})...
          </div>
        )}

        {error && (
          <div className="p-4 sm:p-6 text-red-700 font-medium bg-red-50 border border-red-200 rounded-lg mb-6 flex flex-wrap items-center gap-4 justify-between">
            <span>Error: {error}</span>
            <button
              onClick={fetchCommits}
              className="text-red-700 underline hover:text-red-800 transition-colors font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && displayCommits.length === 0 && (
          <div className="p-6 text-gray-500 bg-gray-50 border border-gray-200 rounded-lg text-center">
            No commits found matching the current criteria.
          </div>
        )}

        {/* ── LIST ── */}
        {!loading && !error && displayCommits.length > 0 && (
          <div className="w-full flex flex-col border border-gray-200 rounded-lg overflow-hidden">
            {displayCommits.map((commit, index) => {
              const title = getCommitTitle(commit.commit.message);
              // Classic alternating row colors matched to original intent but cleaner
              const rowClass = index % 2 === 0 ? "bg-white" : "bg-gray-50";

              return (
                <div
                  key={commit.sha}
                  className={`${rowClass} flex flex-col lg:flex-row lg:items-center py-3 sm:py-4 px-4 sm:px-6 hover:bg-blue-50/50 transition-colors border-b last:border-b-0 border-gray-200 gap-3 lg:gap-6`}
                >
                  {/* Time & Author */}
                  <div className="flex flex-row items-center gap-3 lg:w-[280px] shrink-0">
                    <span className="text-gray-500 text-[13px] w-[90px] shrink-0">
                      {timeAgo(commit.commit.author.date)}
                    </span>
                    <span className="truncate text-red-600 font-medium text-[14px]">
                      @{commit.commit.author.name}
                    </span>
                  </div>

                  {/* Message & Tag */}
                  <div className="flex-1 min-w-0 font-medium text-gray-900 flex flex-wrap items-center gap-2 text-[14px] sm:text-[15px]">
                    <span className="break-words">{title}</span>
                    {index === 0 && (
                      <span className="bg-green-100 border border-green-500 text-green-800 text-[11px] font-medium px-2 py-0.5 rounded-md leading-tight shrink-0">
                        master
                      </span>
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex flex-wrap items-center gap-2 lg:justify-end shrink-0 text-[13px] text-blue-600 mt-1 lg:mt-0 font-medium">
                    <a
                      href={commit.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-800 hover:underline transition-colors"
                    >
                      commit
                    </a>
                    <span className="text-gray-300">|</span>
                    <a
                      href={commit.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-800 hover:underline transition-colors"
                    >
                      commitdiff
                    </a>
                    <span className="text-gray-300">|</span>
                    <a
                      href={commit.html_url.replace("/commit/", "/tree/")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-800 hover:underline transition-colors"
                    >
                      tree
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Indicator */}
        {!loading && !error && displayCommits.length > 0 && (
          <div className="mt-4 px-2 text-center">
            <button className="text-blue-600 hover:text-blue-800 text-[14px] font-medium hover:underline transition-colors focus:outline-none">
              Load more...
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
