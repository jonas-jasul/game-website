import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import React from "react";
import Skeleton from "react-loading-skeleton";
export const QueryBoundaries = ({ children }) => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary onReset={reset} FallbackComponent={ErrorView}>
        <React.Suspense fallback={<LoadingView />}>
          {children}
        </React.Suspense>
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
);


const LoadingView =()=> (
    <div className="p-5 flex flex-wrap justify-center items-center">
      
        <div className="card lg:card-side bg-base-100 shadow-xl border border-primary p-0" key={index}>
          <figure className="relative w-60 h-72 lg:h-60 lg:w-44">

            <Skeleton containerClassName="flex w-60 h-72 lg:h-60 lg:w-44" />

          </figure>
          <div className="card-body w-60">
            <h2 className="card-title text-xl"><Skeleton /></h2>
            <p><Skeleton /></p>
            <div className="card-actions justify-end">
            <button className="btn btn-primary bg-primary pointer-events-none"><span class="loading loading-infinity loading-lg"></span></button>
            </div>
          </div>
        </div>
      
    </div>
)

const ErrorView = ({ error, resetErrorBoundary }) => {
  return (
    <div>
      <div>{error.message}</div>
      <button title="Retry" onClick={resetErrorBoundary} />
    </div>
  );
};