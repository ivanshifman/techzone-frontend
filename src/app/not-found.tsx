"use client";

import { Suspense } from "react";
import ErrorTemplate from "../components/Error/ErrorTemplate";
import Loading from "../components/shared/Loading";

const NotFoundPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <ErrorTemplate
        title="404 - Page Not Found"
        message="The page you are looking for does not exist."
      />
    </Suspense>
  );
};

export default NotFoundPage;
