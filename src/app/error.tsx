"use client";

import ErrorTemplate from "../components/Error/ErrorTemplate";

export const dynamic = "force-dynamic";

const ErrorPage = () => {
  return (
    <ErrorTemplate
      title="500 - Server Error"
      message="Something went wrong. Please try again later."
    />
  );
};

export default ErrorPage;
