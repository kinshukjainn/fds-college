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
  const iconProps = { size: 14, className: "text-[#555] shrink-0" };

  switch (ext) {
    case "js":
    case "jsx":
      return {
        lang: "JavaScript",
        icon: <FileCode2 {...iconProps} className="text-[#f1e05a] shrink-0" />,
      };
    case "ts":
    case "tsx":
      return {
        lang: "TypeScript",
        icon: <FileCode2 {...iconProps} className="text-[#3178c6] shrink-0" />,
      };
    case "json":
      return {
        lang: "JSON",
        icon: <FileJson {...iconProps} className="text-[#292929] shrink-0" />,
      };
    case "html":
      return {
        lang: "HTML",
        icon: <FileCode2 {...iconProps} className="text-[#e34c26] shrink-0" />,
      };
    case "css":
      return {
        lang: "CSS",
        icon: <FileCode2 {...iconProps} className="text-[#563d7c] shrink-0" />,
      };
    case "md":
      return {
        lang: "Markdown",
        icon: <FileText {...iconProps} className="text-[#000000] shrink-0" />,
      };
    case "png":
    case "jpg":
    case "svg":
      return {
        lang: "Image",
        icon: <ImageIcon {...iconProps} className="text-[#a012a6] shrink-0" />,
      };
    case "sh":
      return {
        lang: "Shell",
        icon: <Terminal {...iconProps} className="text-[#89e051] shrink-0" />,
      };
    case "sql":
      return {
        lang: "SQL",
        icon: <Database {...iconProps} className="text-[#e38c00] shrink-0" />,
      };
    case "lock":
      return { lang: "Lockfile", icon: <FileBox {...iconProps} /> };
    default:
      return { lang: "Text", icon: <DefaultFile {...iconProps} /> };
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

  // 1. Fetch the entire folder structure once
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

  // 2. Fetch the actual code on-the-fly when a file is clicked
  const fetchFileContent = async (filePath: string) => {
    setIsFileLoading(true);
    setError(null);
    try {
      // Using GitHub's raw content URL for direct text retrieval
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
    setViewMode("tree"); // Always default back to tree when clicking a breadcrumb folder
  };

  // Filter items for current directory view
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
    <div className="min-h-screen bg-white text-black  text-[14px] sm:text-[15px] p-2 sm:p-4 selection:bg-[#cceeff]">
      <div className="max-w-7xl mx-auto">
        {/* ── TOP HEADER (Breadcrumbs) ── */}
        <div className="mb-1">
          <h1 className="text-[20px] sm:text-[24px] font-medium m-0 p-0 flex flex-wrap items-center gap-1.5 leading-tight">
            <Link href="/git-track">
              <span className="text-black hover:underline cursor-pointer">
                tree
              </span>{" "}
            </Link>
            /{" "}
            <span className="text-black hover:underline cursor-pointer">
              {GITHUB_CONFIG.repository}
            </span>
          </h1>
        </div>

        <div className="text-[13px] sm:text-[14px] mb-3">
          <Link href="/git-track">
            <span className="font-medium text-white px-2 py-1 bg-red-600 rounded-xs">
              Back to commits page
            </span>
          </Link>
        </div>

        {/* ── META INFO TABLE ── */}
        <div className="bg-[#f4f4f4] border-t border-b border-[#cccccc] py-3 px-2 sm:px-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-y-1 sm:gap-x-4 text-[13px] sm:text-[14px]">
            <div className="text-[#555555]">repository</div>
            <div className=" font-medium">
              {GITHUB_CONFIG.username}/{GITHUB_CONFIG.repository}
            </div>

            <div className="text-[#555555]">path</div>
            <div className="flex flex-wrap items-center gap-1 ">
              <span
                onClick={() => jumpToPath("")}
                className="text-black hover:underline cursor-pointer"
              >
                [{GITHUB_CONFIG.repository}]
              </span>
              {pathBreadcrumbs.map((part, index) => {
                const buildPath = pathBreadcrumbs.slice(0, index + 1).join("/");
                // If it's the last item and we are in blob view, don't make it clickable (it's the current file)
                const isLast = index === pathBreadcrumbs.length - 1;
                const isCurrentFile = isLast && viewMode === "blob";

                return (
                  <React.Fragment key={buildPath}>
                    <span>/</span>
                    <span
                      onClick={() => !isCurrentFile && jumpToPath(buildPath)}
                      className={
                        isCurrentFile
                          ? "text-black font-medium"
                          : "text-black hover:underline cursor-pointer"
                      }
                    >
                      {part}
                    </span>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── SECTION HEADER ── */}
        <div className="bg-[#e8e8e8] border-t border-b border-[#cccccc] py-1.5 px-2 font-medium mb-2 flex justify-between">
          <span>{viewMode === "tree" ? "tree directory" : "File Content"}</span>
        </div>

        {/* ── ERROR DISPLAY ── */}
        {error && (
          <div className="p-4 text-[#cc0000] font-medium bg-[#ffdddd] border border-[#cc0000] mb-4">
            Error: {error}
          </div>
        )}

        {/* ── CONDITIONAL RENDERING: TREE vs BLOB(Code) ── */}

        {viewMode === "tree" ? (
          /* ================= FOLDER VIEW ================= */
          <div className="w-full flex flex-col border-b border-[#eee]">
            {isLoadingTree ? (
              <div className="p-4 text-[#555] italic">
                Fetching repository tree...
              </div>
            ) : (
              <>
                {currentPath !== "" && (
                  <div
                    onClick={() => {
                      const pathParts = currentPath.split("/");
                      pathParts.pop();
                      jumpToPath(pathParts.join("/"));
                    }}
                    className="bg-white flex items-center py-1.5 px-2 hover:bg-[#eef3f8] transition-colors gap-2 cursor-pointer border-b border-[#f4f4f4]"
                  >
                    <div className="w-5 flex justify-center">
                      <Folder size={14} className="text-black fill-blue-100" />
                    </div>
                    <div className="text-black hover:underline  text-[13px] font-medium select-none">
                      ..
                    </div>
                  </div>
                )}

                {currentItems.map((item, index) => {
                  const itemName = item.path.split("/").pop() || item.path;
                  const isFolder = item.type === "tree";
                  const { lang, icon } = isFolder
                    ? {
                        lang: "Directory",
                        icon: (
                          <Folder
                            size={14}
                            className="text-black  fill-blue-100 shrink-0"
                          />
                        ),
                      }
                    : getFileInfo(itemName);
                  const rowClass =
                    index % 2 === 0 ? "bg-white" : "bg-[#f8f8f8]";

                  return (
                    <div
                      key={item.sha}
                      onClick={() => handleNavigate(item.path, item.type)}
                      className={`${rowClass} flex flex-col md:flex-row md:items-center py-1.5 px-2 hover:bg-[#eef3f8] transition-colors gap-1 md:gap-4 cursor-pointer`}
                    >
                      <div className="flex-1 min-w-0 flex items-center gap-2">
                        <div className="w-5 flex justify-center items-center shrink-0">
                          {icon}
                        </div>
                        <span
                          className={`truncate  text-[13px] ${isFolder ? "text-black hover:underline font-medium" : "text-[#333] font-medium hover:underline"}`}
                        >
                          {itemName}
                          {isFolder && "/"}
                        </span>
                      </div>
                      <div className="flex flex-row md:flex-row gap-4 shrink-0 text-[#555] text-[12px] md:text-[13px] pl-7 md:pl-0 md:w-[250px] justify-between md:justify-end">
                        <span className="w-[80px] text-left md:text-right">
                          {lang}
                        </span>
                        <span className="w-[80px] text-left md:text-right ">
                          {isFolder ? "-" : formatBytes(item.size)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        ) : (
          /* ================= CODE/BLOB VIEW ================= */
          <div className="w-full">
            {isFileLoading ? (
              <div className="p-4 text-[#555] italic border border-[#ccc] bg-[#f8f8f8]">
                Loading file contents...
              </div>
            ) : (
              <div className="border border-[#ccc] bg-[#f8f8f8] overflow-x-auto">
                <pre className="p-4 m-0 text-[13px] font-medium  leading-snug text-[#333]">
                  <code>{fileContent}</code>
                </pre>
              </div>
            )}

            <div className="mt-4">
              <button
                onClick={() => {
                  // Navigate up one folder level from the file
                  const pathParts = currentPath.split("/");
                  pathParts.pop();
                  jumpToPath(pathParts.join("/"));
                }}
                className="bg-[#e0e0e0] border border-[#999] px-3 py-1 hover:bg-[#ccc] cursor-pointer text-[13px]"
              >
                &laquo; Back to folder
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
