"use server";

import { neon } from "@neondatabase/serverless";

const getDb = () => {
  // Using the primary DATABASE_URL as per your neon setup snippet
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured.");
  return neon(url);
};

export async function submitFeedbackAction(data: {
  category: "Blogs" | "Projects" | "Portfolio Website";
  projectName: "Kosha" | "MScada" | null;
  name: string;
  githubId: string;
  email: string;
  feedback: string;
}) {
  try {
    const sql = getDb();

    const finalProjectName =
      data.category === "Projects" ? data.projectName : null;
    const finalGithubId =
      data.githubId.trim() === "" ? null : data.githubId.trim();

    await sql`
      INSERT INTO user_feedback (
        name, email, github_id, category, project_name, feedback_content
      ) VALUES (
        ${data.name}, ${data.email}, ${finalGithubId},
        ${data.category}, ${finalProjectName}, ${data.feedback}
      )
    `;

    return { success: true };
  } catch (error: unknown) {
    console.error("submitFeedbackAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to submit feedback.",
    };
  }
}

export async function getFeedbacksAction() {
  try {
    const sql = getDb();

    // STRICT FILTERING: Only returns approved feedbacks for MScada
    const data = await sql`
      SELECT
        id,
        name,
        email,
        github_id,
        category,
        project_name,
        feedback_content AS feedback,
        created__at      AS created_at,
        status,
        reviewed_at
      FROM user_feedback
      WHERE status = 'approved' AND project_name = 'MScada'
      ORDER BY created__at DESC
    `;

    return { success: true, data: data as unknown[] };
  } catch (error: unknown) {
    console.error("getFeedbacksAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch feedbacks.",
      data: [],
    };
  }
}
