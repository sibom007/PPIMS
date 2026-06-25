import { Suspense } from "react";
import { Error } from "@/components/error";
import { Loading } from "@/components/loading";
import { ErrorBoundary } from "react-error-boundary";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { ApplicationList } from "@/feature/teacher-application/components/application-list";

function Page() {
  prefetch(trpc.teacher.getApplication.queryOptions());

  prefetch(trpc.department.getForSelect.queryOptions());

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<Error />}>
        <Suspense fallback={<Loading />}>
          <main className="p-6 space-y-6 w-full max-w-none mx-auto">
            <ApplicationList />
          </main>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}

export default Page;
