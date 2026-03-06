const DAY_NAMES = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const TYPES = ["Strength","Cardio","HIIT","Yoga","Rest","Active Recovery","Flexibility"];
const INTENSITY = ["Low","Medium","High","Max"];

export function validatePlan(obj) {
  if (!obj || typeof obj !== "object") return { ok: false, error: "Not an object" };

  if (typeof obj.plan_name !== "string") return { ok: false, error: "Missing plan_name" };
  if (!obj.weekly_summary || typeof obj.weekly_summary !== "object") return { ok: false, error: "Missing weekly_summary" };
  if (!Array.isArray(obj.days) || obj.days.length !== 7) return { ok: false, error: "days must be length 7" };

  const daySet = new Set(obj.days.map(d => d.day));
  for (const dn of DAY_NAMES) {
    if (!daySet.has(dn)) return { ok: false, error: `Missing day ${dn}` };
  }

  for (const d of obj.days) {
    if (!DAY_NAMES.includes(d.day)) return { ok: false, error: `Invalid day name: ${d.day}` };
    if (!TYPES.includes(d.type)) return { ok: false, error: `Invalid type: ${d.type}` };
    if (typeof d.title !== "string") return { ok: false, error: "Missing title" };
    if (typeof d.duration_min !== "number") return { ok: false, error: "duration_min must be number" };
    if (!INTENSITY.includes(d.intensity)) return { ok: false, error: `Invalid intensity: ${d.intensity}` };
    if (typeof d.calories_est !== "number") return { ok: false, error: "calories_est must be number" };
    if (!Array.isArray(d.exercises)) return { ok: false, error: "exercises must be array" };

    for (const ex of d.exercises) {
      if (typeof ex.name !== "string") return { ok: false, error: "exercise.name missing" };
      if (!(typeof ex.sets === "number" || ex.sets === null)) return { ok: false, error: "exercise.sets invalid" };
      if (!(typeof ex.reps === "string" || ex.reps === null)) return { ok: false, error: "exercise.reps invalid" };
    }

    if (typeof d.tip !== "string") return { ok: false, error: "tip missing" };
  }

  if (typeof obj.nutrition_tip !== "string") return { ok: false, error: "nutrition_tip missing" };
  if (typeof obj.recovery_tip !== "string") return { ok: false, error: "recovery_tip missing" };

  // weekly_summary fields
  const ws = obj.weekly_summary;
  if (typeof ws.total_days !== "number") return { ok: false, error: "weekly_summary.total_days missing" };
  if (typeof ws.rest_days !== "number") return { ok: false, error: "weekly_summary.rest_days missing" };
  if (typeof ws.focus !== "string") return { ok: false, error: "weekly_summary.focus missing" };

  return { ok: true, error: null };
}