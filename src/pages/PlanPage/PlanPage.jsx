import AppShell from "../../components/common/AppShell/AppShell";
import Card from "../../components/common/Card/Card";
import Button from "../../components/common/Button/Button";
import "./PlanPage.css";
import { useMemo, useState } from "react";

/* ===================== Icons (inline SVG, no library) ===================== */
function IconChart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 19h16v2H2V3h2v16Zm3-2V9h2v8H7Zm4 0V5h2v12h-2Zm4 0v-6h2v6h-2Zm4 0v-9h2v9h-2Z"
      />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 2h2v2h6V2h2v2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4V2Zm14 8H3v10h18V10ZM3 8h18V6H3v2Z"
      />
    </svg>
  );
}
function IconRest() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 6h10a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3Zm0 2a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H7Z"
      />
    </svg>
  );
}
function IconFlame() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2c.8 2.3-.2 4.1-1.3 5.6C9.4 9.5 8 10.8 8 13a4 4 0 0 0 8 0c0-1.7-1-3-2-4.2-.7-.9-1.4-1.8-1.6-2.8C12.1 4.8 12 3.6 12 2Zm0 20a6 6 0 0 1-6-6c0-2.9 1.7-4.7 3.1-6.1C10.4 8.6 11.2 7.7 11.6 6c.8 1.7 2 3 3 4.2 1.1 1.4 2.4 2.9 2.4 5.8a6 6 0 0 1-6 6Z"
      />
    </svg>
  );
}
function IconBolt() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M13 2L3 14h7l-1 8 12-14h-7l-1-6Z"
      />
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 1 0 20a10 10 0 0 1 0-20Zm0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16Zm1 3v5.3l3.2 1.9-1 1.7L11 13V7h2Z"
      />
    </svg>
  );
}
function IconList() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z" />
    </svg>
  );
}
function IconIntensity() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2l7 8h-4v12H9V10H5l7-8Zm0 3.1L9.2 8H11v12h2V8h1.8L12 5.1Z"
      />
    </svg>
  );
}
function IconDumbbell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M3 10h2V8a2 2 0 0 1 2-2h2v2H7v8h4v2H7a2 2 0 0 1-2-2v-2H3v-4Zm18 0h-2V8a2 2 0 0 0-2-2h-2v2h2v8h-4v2h4a2 2 0 0 0 2-2v-2h2v-4ZM9 11h6v2H9v-2Z"
      />
    </svg>
  );
}

/* ===================== Small UI pieces ===================== */
function TopStatCard({ icon, value, label }) {
  return (
    <div className="topStatCard">
      <div className="topStatIcon">{icon}</div>
      <div className="topStatValue">{value}</div>
      <div className="topStatLabel">{label}</div>
    </div>
  );
}

function MetricCard({ icon, value, label }) {
  return (
    <div className="metricCard">
      <div className="metricIcon">{icon}</div>
      <div className="metricValue">{value}</div>
      <div className="metricLabel">{label}</div>
    </div>
  );
}

function formatSetsReps(sets, reps) {
  const hasSets = typeof sets === "number" && !Number.isNaN(sets);
  const hasReps = typeof reps === "string" && reps.trim().length > 0;

  if (hasSets && hasReps) return `${sets} SETS × ${reps}`;
  if (hasSets && !hasReps) return `${sets} SETS`;
  if (!hasSets && hasReps) return `${reps}`;
  return "—"; // only if both missing
}

export default function PlanPage({ plan, onBack }) {
  // Safety: avoid crash
  if (!plan) {
    return (
      <AppShell>
        <div className="emptyPlanWrap">
          <div className="emptyPlanCard">
            <div className="emptyTitle">No plan found</div>
            <div className="emptySub">Please generate a plan first.</div>
            <div className="emptyActions">
              <Button variant="ghost" onClick={onBack}>Back</Button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  const summary = plan.weekly_summary;
  const days = plan.days || [];

  const [openDay, setOpenDay] = useState(days?.[0]?.day || "Monday");

  const topStats = useMemo(() => {
    const rest = Number(summary?.rest_days ?? 1);
    const active = Math.max(0, 7 - rest);
    const weeklyCalories = days.reduce((s, d) => s + (Number(d.calories_est) || 0), 0);
    return { active, rest, weeklyCalories };
  }, [days, summary]);

  return (
    <AppShell>
      {/* ======= TOP SUMMARY (like Figma) ======= */}
      <div className="planHeroCard">
        <div className="planHeroIcon">
          <IconChart />
        </div>

        <div className="planHeroTitle">{(plan.plan_name || "WEEKLY PLAN").toUpperCase()}</div>

        <div className="topStatsRow">
          <TopStatCard icon={<IconCalendar />} value={topStats.active} label="ACTIVE DAYS" />
          <TopStatCard icon={<IconRest />} value={topStats.rest} label="REST CYCLE" />
          <TopStatCard icon={<IconFlame />} value={topStats.weeklyCalories} label="KCAL / WK" />
        </div>

        <div className="heroInfoRow">
          <div className="heroInfoPill">💡 {summary?.focus || "Balanced weekly routine"}</div>
          <div className="heroInfoPill">🥗 {plan.nutrition_tip || "Eat enough protein."}</div>
        </div>

        <div className="heroBackRow">
          <Button variant="ghost" onClick={onBack}>Back</Button>
        </div>
      </div>

      {/* ======= DAYS LIST ======= */}
      <div className="daysWrap">
        {days.map((d, idx) => {
          const isOpen = openDay === d.day;
          const dayNo = String(idx + 1).padStart(2, "0");
          const movements = Array.isArray(d.exercises) ? d.exercises.length : 0;

          return (
            <Card
              key={d.day}
              title=""
              right={
                <button
                  type="button"
                  className={"chevCircle " + (isOpen ? "chevOpen" : "")}
                  onClick={() => setOpenDay(isOpen ? "" : d.day)}
                  aria-label={isOpen ? "Collapse day" : "Expand day"}
                >
                  {isOpen ? "˄" : "˅"}
                </button>
              }
            >
              <div className="dayTop">
                <div className="dayBolt">
                  <IconBolt />
                </div>

                <div className="dayHeadText">
                  <div className="dayMiniLine">
                    <span className="dayMini">DAY {dayNo}</span>
                    <span className="dayTypePill">{String(d.type || "").toUpperCase()}</span>
                  </div>
                  <div className="dayTitle">{String(d.title || "").toUpperCase()}</div>
                </div>
              </div>

              {/* metrics row (like Figma) */}
              <div className="metricsRow">
                <MetricCard icon={<IconClock />} value={d.duration_min} label="MIN SESSION" />
                <MetricCard icon={<IconFlame />} value={d.calories_est} label="EST BURN" />
                <MetricCard icon={<IconList />} value={movements} label="MOVEMENTS" />
                <MetricCard icon={<IconIntensity />} value={d.intensity} label="INTENSITY" />
              </div>

              {isOpen && (
                <>
                  <div className="exercisePanel">
                    {Array.isArray(d.exercises) && d.exercises.length ? (
                      d.exercises.map((ex, exIdx) => (
                        <div key={exIdx} className="exerciseRow">
                          <div className="exerciseLeft">
                            <span className="exIcon">
                              <IconDumbbell />
                            </span>
                            <span className="exerciseName">{ex.name}</span>
                          </div>

                          <span className="exercisePill">
  {formatSetsReps(ex.sets, ex.reps)}
</span>
                        </div>
                      ))
                    ) : (
                      <div className="exerciseEmpty">Rest / Recovery day — no movements.</div>
                    )}
                  </div>

                  <div className="protocolBox">
                    <span className="protoDot">💡</span>
                    <span className="protocolText">{d.tip}</span>
                  </div>
                </>
              )}
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}