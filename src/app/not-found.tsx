"use client";

import { Suspense } from "react";
import ErrorTemplate from "../components/Error/ErrorTemplate";

export const dynamic = "force-dynamic";

const NotFoundPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <ErrorTemplate
      title="404 - Page Not Found"
      message="The page you are looking for does not exist."
    />
    
    </Suspense>
  );
};

export default NotFoundPage;
