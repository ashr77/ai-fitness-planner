import AppShell from "../../components/common/AppShell/AppShell";
import Card from "../../components/common/Card/Card";
import Input from "../../components/common/Input/Input";
import Segmented from "../../components/common/Segmented/Segmented";
import NumberPill from "../../components/common/NumberPill/NumberPill";
import Button from "../../components/common/Button/Button";
import "./BuildPlanPage.css";
import { useMemo, useState } from "react";

import { callOpenRouter } from "../../api/openrouter";
import { extractJsonObject } from "../../api/parseJson";
import { validatePlan } from "../../api/validatePlan";
import { SYSTEM_PROMPT } from "../../api/systemPrompt";

function IconLoseFat() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2c.8 2.3-.2 4.1-1.3 5.6C9.4 9.5 8 10.8 8 13a4 4 0 0 0 8 0c0-1.7-1-3-2-4.2-.7-.9-1.4-1.8-1.6-2.8C12.1 4.8 12 3.6 12 2Zm0 20a6 6 0 0 1-6-6c0-2.9 1.7-4.7 3.1-6.1C10.4 8.6 11.2 7.7 11.6 6c.8 1.7 2 3 3 4.2 1.1 1.4 2.4 2.9 2.4 5.8a6 6 0 0 1-6 6Z"
      />
    </svg>
  );
}

function IconBuildMuscle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M9 6a2 2 0 1 1 4 0v2h2.2a2 2 0 0 1 2 2v2.2a3.8 3.8 0 0 1-3.8 3.8H9.8A3.8 3.8 0 0 1 6 14.2V12a2 2 0 0 1 2-2H9V6Zm2 0v4H8a.5.5 0 0 0-.5.5v3.7A2.8 2.8 0 0 0 10.3 17h4.1a2.8 2.8 0 0 0 2.8-2.8v-3.7a.5.5 0 0 0-.5-.5H13V6a1 1 0 1 0-2 0Z"
      />
      <path
        fill="currentColor"
        d="M3.5 11h2v2h-2a1 1 0 0 1 0-2Zm15 0h2a1 1 0 0 1 0 2h-2v-2Z"
      />
    </svg>
  );
}

function IconEndurance() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M13 3a9 9 0 1 1-9 9h2a7 7 0 1 0 7-7V3Zm1 2v6l4 2-.9 1.8L12 12V5h2Z"
      />
    </svg>
  );
}

function IconMobility() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 3a2 2 0 1 1 0 4a2 2 0 0 1 0-4Zm-1 6h2l1 4h3a1 1 0 0 1 0 2h-3.3l-.6 2H16a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2h2.9l-.6-2H7a1 1 0 0 1 0-2h3l1-4Z"
      />
    </svg>
  );
}

function IconGeneral() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2l3 7h7l-5.7 4.2L18.5 21L12 16.8L5.5 21l2.2-7.8L2 9h7l3-7Zm0 5.2L10.9 9H8.3l2.1 1.5-.8 2.7L12 11.7l2.4 1.5-.8-2.7L15.7 9h-2.6L12 7.2Z"
      />
    </svg>
  );
}

function IconStrength() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 10h2V8a2 2 0 0 1 2-2h2v2H8v8h4v2H8a2 2 0 0 1-2-2v-2H4v-4Zm16 0h-2V8a2 2 0 0 0-2-2h-2v2h2v8h-4v2h4a2 2 0 0 0 2-2v-2h2v-4ZM9 11h6v2H9v-2Z"
      />
    </svg>
  );
}

const GOAL_OPTIONS = [
  { label: "Lose Fat", value: "lose_fat", icon: <IconLoseFat /> },
  { label: "Build Muscle", value: "build_muscle", icon: <IconBuildMuscle /> },
  { label: "Endurance", value: "endurance", icon: <IconEndurance /> },
  { label: "Mobility", value: "mobility", icon: <IconMobility /> },
  { label: "General", value: "general", icon: <IconGeneral /> },
  { label: "Strength", value: "strength", icon: <IconStrength /> },
];

function friendlyErrorMessage(message) {
  if (!message) return "Something went wrong.";

  // common OpenRouter rate limit patterns
  if (message.includes("429") || message.toLowerCase().includes("rate-limited")) {
    return "API is busy right now (rate-limited). Please wait 10–20 seconds and try again.";
  }

  if (message.toLowerCase().includes("timeout")) {
    return "Request timed out. Please try again, or switch to a faster free model.";
  }

  if (message.toLowerCase().includes("missing openrouter api key")) {
    return "Missing API key. Please set VITE_OPENROUTER_KEY in .env and restart.";
  }

  // If message contains a JSON blob, strip it
  const jsonStart = message.indexOf("{");
  if (jsonStart !== -1) {
    return message.slice(0, jsonStart).trim();
  }

  // limit very long messages
  if (message.length > 140) return message.slice(0, 140) + "…";

  return message;
}

export default function BuildPlanPage({ onGenerated }) {
  const [age, setAge] = useState("28");
  const [weight, setWeight] = useState("72");
  const [height, setHeight] = useState("180");
  const [gender, setGender] = useState("female");
  const [experience, setExperience] = useState("advanced");

  // ✅ MULTI-SELECT goals
  const [goals, setGoals] = useState(["general"]);

  const [daysPerWeek, setDaysPerWeek] = useState(7);
  const [notes, setNotes] = useState("");

  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [errorMsg, setErrorMsg] = useState("");
  const isLoading = status === "loading";

  const restDays = Math.max(0, 7 - Number(daysPerWeek || 0));

  const weeklyLoadRight = useMemo(() => {
    return (
      <div className="rightMini">
        <div className="rightBig">{String(daysPerWeek).padStart(2, "0")}</div>
        <div className="rightSmall">days</div>
      </div>
    );
  }, [daysPerWeek]);

  function toggleGoal(value) {
    setGoals((prev) => {
      if (prev.includes(value)) {
        // Prevent empty selection — keep at least 1 goal
        const next = prev.filter((g) => g !== value);
        return next.length ? next : prev;
      }
      return [...prev, value];
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (isLoading) return;

    setStatus("loading");
    setErrorMsg("");

    const apiKey = import.meta.env.VITE_OPENROUTER_KEY;
    const model =
      import.meta.env.VITE_OPENROUTER_MODEL || "openai/gpt-oss-20b:free";

    const goalLabels = GOAL_OPTIONS
      .filter((g) => goals.includes(g.value))
      .map((g) => g.label);

    const userPrompt = `
User info:
- Age: ${age}
- Weight (kg): ${weight}
- Height (cm): ${height}
- Gender: ${gender}
- Experience: ${experience}
- Primary objectives (multiple): ${goalLabels.join(", ")}
- Weekly load: ${daysPerWeek} active days, ${restDays} rest days
- Notes/limitations: ${notes || "none"}

Requirements:
- Create exactly 7 days (Monday..Sunday).
- Include exactly ${daysPerWeek} active workout days.
- Include exactly ${restDays} Rest days.
- Keep it concise: 4-6 exercises per active day max.
`;

    try {
      const raw = await callOpenRouter({
        systemPrompt: SYSTEM_PROMPT,
        userPrompt,
        apiKey,
        model,
      });

      const obj = extractJsonObject(raw);
      if (!obj) throw new Error("Model returned malformed JSON. Please retry.");

      const v = validatePlan(obj);
      if (!v.ok) throw new Error("Validation failed: " + v.error);

      // ✅ FORCE summary based on weekly load (your requirement)
      obj.weekly_summary = {
        total_days: 7,
        rest_days: restDays,
        focus:
          obj.weekly_summary?.focus ||
          `Focus: ${goalLabels.join(", ")} with ${daysPerWeek} active days`,
      };

      // ✅ Cache for refresh/demo
      try {
        localStorage.setItem("lastPlan", JSON.stringify(obj));
      } catch {
        // ignore
      }

      setStatus("idle");
      onGenerated?.(obj);
    } catch (err) {
      setStatus("error");
      setErrorMsg(friendlyErrorMessage(err?.message));
      /*setErrorMsg(friendlyErrorMessage('API failed: 429 {"error":{"message":"Provider returned error"}}'));
      setStatus("error");*/
    }
  }

  return (
    <AppShell>
      <div className="hero">
        <div className="heroIcon">⚡</div>
        <h1 className="heroTitle">
          BUILD YOUR <span>PLAN</span>
        </h1>
        <p className="heroSub">
          Share a few details and we’ll build your perfect weekly fitness routine.
        </p>
      </div>

      <form className="stack" onSubmit={onSubmit}>
        <fieldset className="formFieldset" disabled={isLoading}>
          <Card title="Body Stats">
            <div className="grid2">
              <Input label="Age" value={age} onChange={setAge} type="number" />
              <Input
                label="Weight (kg)"
                value={weight}
                onChange={setWeight}
                type="number"
              />
              <Input
                label="Height (cm)"
                value={height}
                onChange={setHeight}
                type="number"
              />

              <div className="genderWrap">
                <div className="fieldLabelLike">Gender</div>
                <Segmented
                  columns={2}
                  value={gender}
                  onChange={setGender}
                  options={[
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                  ]}
                />
              </div>
            </div>
          </Card>

          <Card title="Experience Tier">
            <Segmented
              columns={3}
              value={experience}
              onChange={setExperience}
              options={[
                { label: "Beginner", sub: "Just starting", value: "beginner" },
                {
                  label: "Intermediate",
                  sub: "Some experience",
                  value: "intermediate",
                },
                { label: "Advanced", sub: "Trained 1+ yrs", value: "advanced" },
              ]}
            />
          </Card>

          {/* ✅ MULTI-SELECT PRIMARY OBJECTIVE */}
          <Card
            title="Primary Objective"
            right={<div className="hintRight">Select multiple</div>}
          >
            <div className="multiGrid">
              {GOAL_OPTIONS.map((opt) => {
                const active = goals.includes(opt.value);
                return (
                  <button
                   key={opt.value}
                   type="button"
                   className={"multiBtn " + (active ? "multiBtnActive" : "")}
                   onClick={() => toggleGoal(opt.value)}
                 >
                   <div className="multiIcon">{opt.icon}</div>
                   <div className="multiLabel">{opt.label}</div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card
            title="Weekly Load"
            right={
              <div className="rightMini">
                <div className="rightBig">{String(daysPerWeek).padStart(2, "0")}</div>
                <div className="rightSmall">active</div>
              </div>
            }
          >
            <div className="pills">
              {[3, 4, 5, 6, 7].map((n) => (
                <NumberPill
                  key={n}
                  value={n}
                  active={daysPerWeek === n}
                  onClick={() => setDaysPerWeek(n)}
                />
              ))}
            </div>

            {/* ✅ Show rest day count */}
            <div className="loadNote">
              This will generate <b>{daysPerWeek}</b> active days and{" "}
              <b>{restDays}</b> rest days.
            </div>
          </Card>

          <Card title="Anything Else?">
            <div className="textareaWrap">
              <textarea
                className="textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="I have bad knees, only have dumbbells, prefer home workouts..."
                rows={4}
              />
            </div>
          </Card>
        </fieldset>

        <div className="cta">
          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? "GENERATING..." : "GENERATE MY PLAN ✨"}
          </Button>

          {isLoading && (
            <div className="loadingBox" aria-live="polite">
              <div className="spinner" />
              <div className="loadingText">
                <div className="loadingTitle">Generating your plan...</div>
                <div className="loadingSub">
                  Free models can take 10–30 seconds. Please don’t close the tab.
                </div>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="errorBox" role="alert">
              <div className="errorTop">⚠ {errorMsg}</div>
              <div className="errorHint">
                Tip: If you see 429 rate-limit, wait a moment and press Generate again.
              </div>
            </div>
          )}
        </div>
      </form>
    </AppShell>
  );
}