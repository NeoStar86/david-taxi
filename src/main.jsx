import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import ThemeApplier from "./components/ThemeApplier.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { SiteDataProvider } from "./context/SiteDataContext.jsx";
import { VehicleFlowProvider } from "./context/VehicleFlowContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SiteDataProvider>
      <ThemeApplier />
      <LanguageProvider>
        <VehicleFlowProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </VehicleFlowProvider>
      </LanguageProvider>
    </SiteDataProvider>
  </StrictMode>,
);
