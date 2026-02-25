import { PageHeader } from "@/components/shared/page-header";
import { TimelineForm } from "@/components/timeline/timeline-form";

export default function NewTimelinePage() {
  return (
    <>
      <PageHeader
        title="New Timeline"
        description="Start planning a beautiful new chapter"
      />
      <TimelineForm />
    </>
  );
}
