import { sendGAEvent } from "@next/third-parties/google";

/**
 * The handful of actions worth knowing about on a portfolio: did someone open
 * the resume, reach for contact, or click through to a project. Page views are
 * collected by the GA tag itself.
 *
 * A no-op until NEXT_PUBLIC_GA_ID is set, so local development and preview
 * builds never send anything.
 */
export function track(
  event: "resume_open" | "contact_click" | "project_open" | "social_click",
  params: Record<string, string> = {},
) {
  if (!process.env.NEXT_PUBLIC_GA_ID) return;
  sendGAEvent("event", event, params);
}
