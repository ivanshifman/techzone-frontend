"use client";

import ErrorTemplate from "../components/Error/ErrorTemplate";

const NotFoundPage = () => {
  return (
    <ErrorTemplate
      title="404 - Page Not Found"
      message="The page you are looking for does not exist."
    />
  );
};

export default NotFoundPage;
