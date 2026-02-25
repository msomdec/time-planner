import { PageHeader } from "@/components/shared/page-header";
import { DocumentList } from "@/components/documents/document-list";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function DocumentsPage() {
  return (
    <>
      <PageHeader
        title="Document Library"
        description="All your wedding documents in one place"
      />
      <Card className="glass border-rose-100">
        <CardContent className="pt-6">
          <DocumentList scope="all" />
        </CardContent>
      </Card>
    </>
  );
}
