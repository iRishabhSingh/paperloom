import { cookies } from "next/headers";
import { getAuthUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import { SharedUser } from "@/types/types";
import PDFOverview from "@/components/dashboard/PDFOverview";

async function getPdfData(id: string) {
  const cookieStore = cookies();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/pdfs/${id}`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    },
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function PDFOverviewPage({
  params,
}: {
  params: { pdfId: string };
}) {
  const user = await getAuthUser();
  const pdf = await getPdfData(params.pdfId);

  if (!pdf) return notFound();

  // Updated access check
  interface SharedUserType {
    userId: string;
    inviteeEmail?: string;
    status: string;
  }

  interface PdfType {
    ownerId: string;
    sharedUsers: SharedUserType[];
    // Add other properties as needed
  }

  interface UserType {
    id?: string;
    email?: string;
  }

  const canAccess: boolean =
    (pdf as PdfType).ownerId === (user as UserType)?.id ||
    (pdf as PdfType).sharedUsers.some(
      (su: SharedUserType) =>
        (su.userId === (user as UserType)?.id ||
          su.inviteeEmail === (user as UserType)?.email) &&
        su.status === "ACCEPTED",
    );

  if (!canAccess) return notFound();

  // Enhanced access check
  const isOwner = pdf.ownerId === user?.id;
  const isSharedUser = pdf.sharedUsers?.some(
    (sharedUser: SharedUser) =>
      sharedUser.userId === user?.id && sharedUser.status === "ACCEPTED",
  );

  if (!isOwner && !isSharedUser) return notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <PDFOverview
        pdf={pdf}
        userId={user?.id ?? ""}
        basePath={`/dashboard/pdfs/${params.pdfId}`}
      />
    </div>
  );
}
