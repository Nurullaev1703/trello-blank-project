import React from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, Home } from "lucide-react";

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-light-gray flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="w-24 h-24 text-red" />
        </div>
        <h1 className="text-6xl font-bold text-dark-blue mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-primary-blue mb-4">
          Страница не найдена
        </h2>
        <p className="text-dark-gray text-lg mb-8 max-w-md mx-auto">
          К сожалению, запрашиваемая вами страница не существует или была
          перемещена.
        </p>
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary-blue text-white px-6 py-3 rounded-xl font-medium hover:bg-dark-blue transition-colors"
          >
            <Home className="w-4 h-4" />
            Вернуться на главную
          </Link>
          <div className="mt-4">
            <button
              onClick={() => window.history.back()}
              className="text-primary-blue hover:text-dark-blue underline"
            >
              Назад
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
