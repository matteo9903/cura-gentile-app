import { createRoot } from "react-dom/client";
import { Capacitor } from "@capacitor/core";
import App from "./App.tsx";
import "./index.css";

// Tag the document with the current platform so CSS can tweak safe-area handling
const platform = Capacitor.getPlatform();
document.documentElement.dataset.platform = platform;

createRoot(document.getElementById("root")!).render(<App />);
