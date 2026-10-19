import "server-only";
import { createClient } from "@supabase/supabase-js";
import { connection } from "next/server";
import { readProjectDetails } from "@/lib/admin/projects/details";
import { parseGallery } from "@/lib/admin/projects/helpers";
import { ONGOING_PROJECTS } from "@/lib/projects/ongoing-projects-data";
import { COMPLETED_PROJECTS } from "@/lib/projects/completed-projects-data";
import type { ProjectDetail } from "@/lib/projects/projects-data";
import {
  galleryFrames,
  publicProjectImageUrl,
} from "@/lib/projects/public-project-image";

const aliases: Record<string, string> = {
  "porto-arabia-2a-the-pearl": "porto-arabia-2a",
  "al-asmakh-complex-industrial-area": "al-asmakh-complex",
  "riviera-gardens": "rivera-gardens",
  "riviera-residence": "rivera-residence",
};

export async function getPublishedProjects() {
  await connection();
  // A separate anonymous client must never inherit an administrator's cookies.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } },
  );
  const { data, error } = await supabase.from("projects")
    .select("id,slug,title_en,title_ar,location_en,location_ar,scope_en,scope_ar,project_status,cover_image_url,gallery,qcdd_year,project_details")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });
  if (error) throw new Error("Published projects could not be loaded.");

  const existing: readonly ProjectDetail[] = [...ONGOING_PROJECTS, ...COMPLETED_PROJECTS];
  const projects = (data ?? []).map((row) => {
    const previous = existing.find((project) => project.id === (aliases[row.slug] ?? row.slug));
    const name = { en: row.title_en ?? "", ar: row.title_ar ?? "" };
    const scope = { en: row.scope_en ?? "", ar: row.scope_ar ?? "" };
    const en = scope.en.split(/\r?\n/).map((line: string) => line.trim()).filter(Boolean);
    const ar = scope.ar.split(/\r?\n/).map((line: string) => line.trim()).filter(Boolean);
    const image = publicProjectImageUrl(row.cover_image_url) ?? previous?.image ?? "";
    const gallery = galleryFrames(image, parseGallery(row.gallery)).slice(1);
    const project: ProjectDetail = {
      id: row.slug, image, name,
      category: previous?.category ?? { en: "PROJECT", ar: "مشروع" },
      location: { en: row.location_en ?? "", ar: row.location_ar ?? "" },
      imageAlt: name,
      ...(gallery.length > 0 ? { gallery } : {}),
      ...(en.length === ar.length && en.length > 0
        ? { scopeItems: en.map((text: string, index: number) => ({ en: text, ar: ar[index] })) }
        : { description: scope }),
      qcddYear: typeof row.qcdd_year === "string" ? row.qcdd_year : undefined,
      detailSections: readProjectDetails(row.project_details).map((section) => ({
        key: section.key,
        label: { en: section.label_en, ar: section.label_ar },
        items: section.items,
      })),
    };
    return { project, status: row.project_status };
  });
  return {
    ongoing: projects.filter((entry) => entry.status === "ongoing").map((entry) => entry.project),
    completed: projects.filter((entry) => entry.status === "completed").map((entry) => entry.project),
  };
}
