import { setProjectPublishedAction } from "@/lib/admin/projects/actions";

export function PublishToggle({
  id,
  published,
}: {
  id: string;
  published: boolean;
}) {
  return (
    <form action={setProjectPublishedAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="published" value={published ? "false" : "true"} />
      <button className="oms-admin-table-action" type="submit">
        {published ? "Unpublish" : "Publish"}
      </button>
    </form>
  );
}
