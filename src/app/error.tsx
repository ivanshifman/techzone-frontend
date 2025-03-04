"use client";

import dynamic from "next/dynamic";

const ErrorTemplate = dynamic(() => import("../components/Error/ErrorTemplate"), {
  ssr: false,
});

const ErrorPage = () => {
  return (
    <ErrorTemplate
      title="500 - Server Error"
      message="Something went wrong. Please try again later."
    />
  );
};

export default ErrorPage;
