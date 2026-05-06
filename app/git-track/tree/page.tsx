"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Folder,
  FileCode2,
  FileText,
  FileJson,
  Image as ImageIcon,
  Terminal,
  FileBox,
  Database,
  File as DefaultFile,
  ChevronRight,
  ArrowLeft,
  Github,
  GitBranch,
} from "lucide-react";
import Link from "next/link";

// ============================================================================
// Configuration & Types
// ============================================================================

const GITHUB_CONFIG = {
  username: "kinshukjainn",
  repository: "m-scada",
  branch: "master",
};

interface GithubTreeItem {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
  url: string;
}

// ============================================================================
// Utility Functions
// ============================================================================

const formatBytes = (bytes: number = 0, decimals = 1) => {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const getFileInfo = (filename: string) => {
  const ext = filename.split(".").pop()?.toLowerCase();
  const iconProps = { size: 16, className: "shrink-0" };

  switch (ext) {
    case "js":
    case "jsx":
      return {
        lang: "JavaScript",
        icon: <FileCode2 {...iconProps} className="text-yellow-400" />,
      };
    case "ts":
    case "tsx":
      return {
        lang: "TypeScript",
        icon: <FileCode2 {...iconProps} className="text-blue-500" />,
      };
    case "json":
      return {
        lang: "JSON",
        icon: <FileJson {...iconProps} className="text-gray-600" />,
      };
    case "html":
      return {
        lang: "HTML",
        icon: <FileCode2 {...iconProps} className="text-orange-500" />,
      };
    case "css":
      return {
        lang: "CSS",
        icon: <FileCode2 {...iconProps} className="text-purple-500" />,
      };
    case "md":
      return {
        lang: "Markdown",
        icon: <FileText {...iconProps} className="text-slate-700" />,
      };
    case "png":
    case "jpg":
    case "svg":
      return {
        lang: "Image",
        icon: <ImageIcon {...iconProps} className="text-pink-500" />,
      };
    case "sh":
      return {
        lang: "Shell",
        icon: <Terminal {...iconProps} className="text-green-500" />,
      };
    case "sql":
      return {
        lang: "SQL",
        icon: <Database {...iconProps} className="text-amber-500" />,
      };
    case "lock":
      return {
        lang: "Lockfile",
        icon: <FileBox {...iconProps} className="text-gray-400" />,
      };
    default:
      return {
        lang: "Text",
        icon: <DefaultFile {...iconProps} className="text-gray-400" />,
      };
  }
};

// ============================================================================
// Main Component
// ============================================================================

export default function RepositoryViewer() {
  const [treeData, setTreeData] = useState<GithubTreeItem[]>([]);
  const [isLoadingTree, setIsLoadingTree] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // -- View States --
  const [viewMode, setViewMode] = useState<"tree" | "blob">("tree");
  const [currentPath, setCurrentPath] = useState<string>("");

  // -- File Content States --
  const [fileContent, setFileContent] = useState<string>("");
  const [isFileLoading, setIsFileLoading] = useState(false);

  useEffect(() => {
    fetchRepositoryTree();
  }, []);

  const fetchRepositoryTree = async () => {
    setIsLoadingTree(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repository}/git/trees/${GITHUB_CONFIG.branch}?recursive=1`,
        { headers: { Accept: "application/vnd.github.v3+json" } },
      );
      if (!response.ok) throw new Error("Failed to fetch repository tree.");
      const data = await response.json();
      setTreeData(data.tree);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoadingTree(false);
    }
  };

  const fetchFileContent = async (filePath: string) => {
    setIsFileLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repository}/${GITHUB_CONFIG.branch}/${filePath}`,
      );
      if (!response.ok) throw new Error("Failed to load file content.");
      const text = await response.text();
      setFileContent(text);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Unknown error reading file",
      );
    } finally {
      setIsFileLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // Navigation
  // --------------------------------------------------------------------------

  const handleNavigate = (path: string, type: "blob" | "tree") => {
    setCurrentPath(path);
    if (type === "tree") {
      setViewMode("tree");
    } else {
      setViewMode("blob");
      fetchFileContent(path);
    }
  };

  const jumpToPath = (path: string) => {
    setCurrentPath(path);
    setViewMode("tree");
  };

  const currentItems = useMemo(() => {
    const items = treeData.filter((item) => {
      if (currentPath === "" || viewMode === "blob") {
        return !item.path.includes("/");
      } else {
        const prefix = currentPath + "/";
        if (!item.path.startsWith(prefix)) return false;
        return !item.path.slice(prefix.length).includes("/");
      }
    });

    return items.sort((a, b) => {
      if (a.type === b.type) return a.path.localeCompare(b.path);
      return a.type === "tree" ? -1 : 1;
    });
  }, [treeData, currentPath, viewMode]);

  const pathBreadcrumbs = currentPath.split("/").filter(Boolean);

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
              </div>
            </div>
          </div>

          <Link href="/git-track">
            <button className="flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 shadow-sm px-4 py-2 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all">
              <ArrowLeft size={16} />
              Back to commits
            </button>
          </Link>
        </div>

        {/* ── ERROR DISPLAY ── */}
        {error && (
          <div className="p-4 mb-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-xl bg-red-500" />
            {error}
          </div>
        )}

        {/* ── MAIN EXPLORER CARD ── */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
          {/* Breadcrumb Header inside the card */}
          <div className="bg-gray-50/80 border-b border-gray-200 px-4 py-3.5 flex items-center gap-1.5 text-sm font-medium overflow-x-auto">
            <span
              onClick={() => jumpToPath("")}
              className="text-blue-600 hover:underline cursor-pointer whitespace-nowrap"
            >
              {GITHUB_CONFIG.repository}
            </span>
            {pathBreadcrumbs.map((part, index) => {
              const buildPath = pathBreadcrumbs.slice(0, index + 1).join("/");
              const isLast = index === pathBreadcrumbs.length - 1;
              const isCurrentFile = isLast && viewMode === "blob";

              return (
                <React.Fragment key={buildPath}>
                  <ChevronRight size={16} className="text-gray-400 shrink-0" />
                  <span
                    onClick={() => !isCurrentFile && jumpToPath(buildPath)}
                    className={`whitespace-nowrap transition-colors ${
                      isCurrentFile
                        ? "text-gray-900 font-semibold"
                        : "text-blue-600 hover:underline cursor-pointer"
                    }`}
                  >
                    {part}
                  </span>
                </React.Fragment>
              );
            })}
          </div>

          {/* ── CONTENT AREA ── */}
          {viewMode === "tree" ? (
            /* ================= FOLDER VIEW ================= */
            <div className="flex flex-col">
              {isLoadingTree ? (
                <div className="p-8 text-center text-sm text-gray-500 flex flex-col items-center gap-3">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-xl animate-spin" />
                  Fetching repository...
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {currentPath !== "" && (
                    <div
                      onClick={() => {
                        const pathParts = currentPath.split("/");
                        pathParts.pop();
                        jumpToPath(pathParts.join("/"));
                      }}
                      className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      <div className="w-8 flex justify-center">
                        <Folder
                          size={18}
                          className="text-blue-400 fill-blue-100"
                        />
                      </div>
                      <div className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
                        ..
                      </div>
                    </div>
                  )}

                  {currentItems.map((item) => {
                    const itemName = item.path.split("/").pop() || item.path;
                    const isFolder = item.type === "tree";
                    const { lang, icon } = isFolder
                      ? {
                          lang: "Directory",
                          icon: (
                            <Folder
                              size={18}
                              className="text-blue-400 fill-blue-100 shrink-0"
                            />
                          ),
                        }
                      : getFileInfo(itemName);

                    return (
                      <div
                        key={item.sha}
                        onClick={() => handleNavigate(item.path, item.type)}
                        className="flex flex-col sm:flex-row sm:items-center px-4 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer group gap-2 sm:gap-4"
                      >
                        <div className="flex-1 min-w-0 flex items-center gap-3">
                          <div className="w-6 flex justify-center items-center shrink-0">
                            {icon}
                          </div>
                          <span
                            className={`truncate text-sm transition-colors ${
                              isFolder
                                ? "text-gray-800 font-medium group-hover:text-blue-600"
                                : "text-gray-600 group-hover:text-blue-600 group-hover:underline"
                            }`}
                          >
                            {itemName}
                          </span>
                        </div>
                        <div className="flex flex-row items-center gap-6 shrink-0 text-gray-400 text-xs sm:text-sm pl-9 sm:pl-0 sm:w-[200px] justify-between sm:justify-end">
                          <span className="w-20 text-left sm:text-right">
                            {lang}
                          </span>
                          <span className="w-20 text-left sm:text-right">
                            {isFolder ? "" : formatBytes(item.size)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* ================= CODE/BLOB VIEW ================= */
            <div className="flex flex-col bg-white">
              {isFileLoading ? (
                <div className="p-12 text-center text-sm text-gray-500 flex flex-col items-center gap-3">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-xl animate-spin" />
                  Loading file content...
                </div>
              ) : (
                <div className="relative overflow-hidden">
                  <pre className="p-6 m-0 text-[13px] leading-relaxed font-mono text-gray-800 bg-[#fbfbfb] overflow-x-auto min-h-[300px]">
                    <code>{fileContent}</code>
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
