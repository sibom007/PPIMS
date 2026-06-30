import { Suspense } from "react";
import { Error } from "@/components/error";
import { Loading } from "@/components/loading";
import { ErrorBoundary } from "react-error-boundary";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { SemesterList } from "@/feature/semester/components/semester-list";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Page() {
  prefetch(trpc.academic.getAcademicSessions.queryOptions());
  prefetch(trpc.semester.getSemesters.queryOptions());
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <HydrateClient>
      <ErrorBoundary fallback={<Error />}>
        <Suspense fallback={<Loading />}>
          <main className="p-6 space-y-6 w-full max-w-none mx-auto">
            <SemesterList currentUser={session?.user ?? null} />
          </main>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
