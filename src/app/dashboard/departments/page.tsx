import {  DepartmentList } from "@/feature/department/components/department-list";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { Error } from "@/components/error";
import { Loading } from "@/components/loading";

function Page() {
  prefetch(trpc.department.getAll.queryOptions());
  return (
    <HydrateClient>
      <ErrorBoundary fallback={<Error />}>
        <Suspense fallback={<Loading />}>
          <main className="p-6 space-y-6 w-full max-w-none mx-auto">
            <DepartmentList />
          </main>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}

export default Page;
