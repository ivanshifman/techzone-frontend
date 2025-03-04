"use client";

import { Suspense } from 'react';
import ErrorTemplate from '../Error/ErrorTemplate';
import Loading from "../shared/Loading";

const SuspenseNotFound = () => (
  <Suspense fallback={<Loading />}>
    <ErrorTemplate
      title="404 - Page Not Found"
      message="The page you are looking for does not exist."
    />
  </Suspense>
);

export default SuspenseNotFound;
