import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ContentProvider } from "./context/ContentContext";
import './styles/kidspark-type.css';
import './styles/kidspark-motion.css';
import { startAppUpdates } from './pwa/appUpdates';
startAppUpdates();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ContentProvider>
      <App />
    </ContentProvider>
  </StrictMode>
);
