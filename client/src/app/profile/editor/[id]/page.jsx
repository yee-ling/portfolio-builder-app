import EditorDetails from "@/components/EditorDetails";

export default function DraftPage({ params }) {
  const { id } = params;
  return <EditorDetails id={id} />;
}
