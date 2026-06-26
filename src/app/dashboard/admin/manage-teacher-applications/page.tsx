import { Suspense } from "react";
import { Error } from "@/components/error";
import { Loading } from "@/components/loading";
import { ErrorBoundary } from "react-error-boundary";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { AdminReviewList } from "@/feature/teacher-application/components/admin-review-list";

export default function Page() {
  prefetch(trpc.teacher.getTeacherApplications.queryOptions({}));

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<Error />}>
        <Suspense fallback={<Loading />}>
          <main className="p-6 space-y-6 w-full max-w-none mx-auto">
            <AdminReviewList />
          </main>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
