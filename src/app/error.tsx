"use client";

import ErrorTemplate from "../components/Error/ErrorTemplate";

const ErrorPage = () => {
  return (
    <ErrorTemplate
      title="500 - Server Error"
      message="Something went wrong. Please try again later."
    />
  );
};

export default ErrorPage;
