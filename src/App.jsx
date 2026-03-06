import { useEffect, useState } from "react";
import BuildPlanPage from "./pages/BuildPlanPage/BuildPlanPage";
import PlanPage from "./pages/PlanPage/PlanPage";
import "./styles/globals.css";

export default function App() {
  const [screen, setScreen] = useState("build"); // always start here
  const [planData, setPlanData] = useState(null);

  // Load last saved plan (but DO NOT auto-open plan page)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lastPlan");
      if (saved) {
        const parsed = JSON.parse(saved);
        setPlanData(parsed);
      }
    } catch {
      // ignore invalid storage
    }
  }, []);

  // ✅ Bulletproof scroll-to-top on screen change (mobile-safe)
  useEffect(() => {
    const scrollTopNow = () => {
      // window
      window.scrollTo(0, 0);

      // document fallbacks (some mobile browsers)
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Run after paint + after layout settles
    requestAnimationFrame(() => {
      scrollTopNow();
      setTimeout(scrollTopNow, 0);
      setTimeout(scrollTopNow, 50);
    });
  }, [screen]);

  return (
    <>
      {screen === "build" && (
        <BuildPlanPage
          onGenerated={(data) => {
            setPlanData(data);

            try {
              localStorage.setItem("lastPlan", JSON.stringify(data));
            } catch {}

            setScreen("plan");
          }}
        />
      )}

      {screen === "plan" && (
        <PlanPage
          plan={planData}
          onBack={() => setScreen("build")}
        />
      )}
    </>
  );
}