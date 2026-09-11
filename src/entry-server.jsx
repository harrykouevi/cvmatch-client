import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App.jsx";

// Renders the real App tree to an HTML string for a given route.
// Used at build time only (Node). Mirrors the client tree in main.jsx
// but with StaticRouter instead of BrowserRouter.
export function render(url = "/") {
  return renderToString(
    <React.StrictMode>
      <StaticRouter location={url} future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}>
        <App />
      </StaticRouter>
    </React.StrictMode>
  );
}
