import React from "react";
import { Link } from "@tanstack/react-router";
import { WarningIcon, HouseIcon } from "@phosphor-icons/react";

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-light-gray flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <WarningIcon className="w-24 h-24 text-red" weight="fill" />
        </div>
        <h1 className="text-6xl font-bold text-dark-blue mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-primary-blue mb-4">
          Page Not Found
        </h2>
        <p className="text-dark-gray text-lg mb-8 max-w-md mx-auto">
          Sorry, the page you are looking for does not exist or has been
          moved.
        </p>
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary-blue text-white px-6 py-3 rounded-xl font-medium hover:bg-dark-blue transition-colors"
          >
            <HouseIcon className="w-4 h-4" weight="fill" />
            Go to Home
          </Link>
          <div className="mt-4">
            <button
              onClick={() => window.history.back()}
              className="text-primary-blue hover:text-dark-blue underline"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
