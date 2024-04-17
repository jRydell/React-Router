import React from "react";
import { useRouteError } from "react-router-dom";

type RouteError = {
  statusText?: string;
  message?: string;

  // Add any other properties you expect in the error object
};

const ErrorPage: React.FC = () => {
  const error = useRouteError();

  if (!error || typeof error !== "object") {
    return (
      <div id="error-page">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>Error information is not available.</i>
        </p>
      </div>
    );
  }

  const routeError = error as RouteError;

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{routeError.statusText || routeError.message}</i>
      </p>
    </div>
  );
};

export default ErrorPage;
