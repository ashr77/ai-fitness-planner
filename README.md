# AI Fitness Planner

A responsive web application that generates a personalized **weekly fitness plan using AI**.
Users provide basic personal information, fitness goals, and weekly availability, and the app generates a structured workout routine displayed using a clean card-based UI.

This project was built emphasizing:

- clean CSS and layout implementation
- structured AI responses
- robust error handling
- responsive UI design
- maintainable architecture

---

# Demo

_(Optional – add deployed link if available)_

```
https://your-deployment-link.vercel.app
```

---

# Features

### 1. Fitness Plan Generator

Users enter:

- Age
- Weight
- Height
- Gender
- Experience level
- Primary fitness goals
- Weekly workout load
- Optional notes / limitations

The AI generates a **structured 7-day fitness plan**.

---

### 2. Structured AI Output

The AI is instructed using a **system prompt** to always return JSON in the following format:

```json
{
  "plan_name": "string",
  "weekly_summary": {
    "total_days": number,
    "rest_days": number,
    "focus": "string"
  },
  "days": [
    {
      "day": "Monday",
      "type": "Strength | Cardio | HIIT | Yoga | Rest | Active Recovery | Flexibility",
      "title": "string",
      "duration_min": number,
      "intensity": "Low | Medium | High | Max",
      "calories_est": number,
      "exercises": [
        {
          "name": "string",
          "sets": number | null,
          "reps": "string | null"
        }
      ],
      "tip": "string"
    }
  ],
  "nutrition_tip": "string",
  "recovery_tip": "string"
}
```

This structure allows the UI to **render dynamic workout cards reliably**.

---

### 3. Clean Card-Based UI

The generated plan displays:

- Weekly summary metrics
- Daily workout cards
- Exercise lists
- Tips and recovery guidance

Each workout card includes:

- session duration
- estimated calorie burn
- number of movements
- workout intensity

---

### 4. Responsive Design

The application is fully responsive and optimized for:

- desktop
- tablets
- mobile devices

Key responsive behaviors:

- Experience tier becomes **stacked on mobile**
- Objective grid adjusts dynamically
- Workout stats collapse into fewer columns
- Exercise rows stack vertically on small screens

---

### 5. Robust Error Handling

- App **does not crash** if:
  - API returns non-200
  - response is rate limited (429)
  - response contains extra text / code fences
  - JSON is malformed
  - JSON schema is missing fields
- Includes:
  - retry with backoff (for 429 / transient failures)
  - timeout (prevents hanging)
  - JSON extraction + validation before render
  - friendly error messages

Example user-friendly error:

```
⚠ The AI model is currently busy.
Please wait a few seconds and try again.
```

# Notes on Robustness Implementation

-Retries: Automatically retries up to 3 times on 429
-Timeout: aborts long requests to avoid infinite loading
-Parsing:
removes markdown fences
extracts first { ... } block
JSON.parse with try/catch
-Validation:
checks required keys and enums
verifies 7 days (Monday–Sunday)
ensures numeric fields are numbers
-Safe UI:
doesn’t render plan if validation fails
shows friendly error box

---

### 6. Defensive JSON Parsing

The AI response is parsed and validated before use.

Steps:

1. Extract JSON from model output
2. Validate schema
3. Normalize values
4. Render safely

This prevents UI crashes caused by malformed AI responses.

---

# Project Architecture

```
src/
  pages/
    BuildPlanPage/
      BuildPlanPage.jsx
      BuildPlanPage.css
  components/
    common/
      AppShell/
        AppShell.jsx
        AppShell.css
      Button/
        Button.jsx
        Button.css
      Card/
        Card.jsx
        Card.css
      Segmented/
        Segmented.jsx
        Segmented.css
      Input/
        Input.jsx
        Input.css
      NumberPill/
        NumberPill.jsx
        NumberPill.css
  styles/
    globals.css
    variables.css
```

### Page Responsibilities

| Page          | Responsibility                       |
| ------------- | ------------------------------------ |
| BuildPlanPage | Collect user input and generate plan |
| PlanPage      | Render AI-generated workout plan     |

---

# Tech Stack

| Technology     | Purpose                        |
| -------------- | ------------------------------ |
| React          | UI framework                   |
| Vite           | Development + build tool       |
| Vanilla CSS    | Styling (no UI libraries used) |
| OpenRouter API | AI model access                |
| JavaScript     | Plain JS schema validation to  |
|                | make it lightweight            |

No UI frameworks were used (Tailwind / MUI / Shadcn etc) to emphasize **CSS layout skills**.

---

# AI Model Integration

The application uses **OpenRouter** to access free LLM endpoints.

API endpoint:

```
https://openrouter.ai/api/v1/chat/completions
```

Format:

- OpenAI-compatible chat completions
- Messages include:
  - `system` (strict JSON schema prompt)
  - `user` (fitness details)

```
---

# AI Prompt Design

The system prompt strictly enforces structured JSON output.

Example responsibilities:

* produce exactly **7 days**
* include **rest days if weekly load < 7**
* generate **realistic exercises**
* ensure fields match schema

This ensures predictable rendering in the UI.

---

Model:
- Configurable via `.env`
- Suggested free models (examples):
  - `openai/gpt-oss-120b:free`
  - `openai/gpt-oss-20b:free` (faster / less rate limited)

---

# Installation

### 1. Clone repository

```

git clone https://github.com/ashr77/ai-fitness-planner.git
cd ai-fitness-planner

```

### 2. Install dependencies

```

npm install

```

### 2, Create .env in project root (same folder as package.json).

```
VITE_OPENROUTER_KEY=YOUR_OPENROUTER_KEY
VITE_OPENROUTER_MODEL=openai/gpt-oss-20b:free
```

### 4. Start development server

```

npm run dev

```

App will run at:

```

http://localhost:5173

```

---

# Build

To create a production build:

```

npm run build

```

Preview build:

```

npm run preview

```

---

# Testing Scenarios

The application was tested across multiple scenarios.

### Input Validation

Test cases:

* valid inputs
* extreme values
* empty notes
* multiple objectives
* different weekly loads

---

### API Behavior

| Scenario            | Expected behavior |
| ------------------- | ----------------- |
| successful response | renders plan      |
| malformed JSON      | handled safely    |
| rate limit          | retry UI          |
| slow network        | loading spinner   |

---

### Responsive Testing

Tested using browser dev tools at:

```

360px
375px
390px
768px
1024px
1440px

```
No horizontal scroll:

Open console and check:
document.documentElement.scrollWidth > window.innerWidth
should be false

Tested on a Real Phone

---

# Mobile UX Improvements

Special adjustments include:

* stacked segmented controls
* dynamic objective grid
* compact stat cards
* collapsible exercise rows

---

# Key Design Decisions

### No UI Frameworks

The assignment specifically encouraged writing **custom CSS**.
All components were built from scratch to demonstrate layout skills.

---

### Defensive AI Integration

AI responses are inherently unpredictable.

The app includes:

* JSON extraction
* schema validation
* error fallbacks

to ensure UI stability.

---

### Modular Architecture

The codebase separates responsibilities clearly:

```

UI
AI logic
data validation
styling

```

This improves maintainability and testability.

---

# Known Limitations

* Free OpenRouter models may occasionally return **429 rate limits**
* AI responses may vary between runs
* Exercise recommendations are **general fitness suggestions**

---

## Screenshots

### Build Plan
![Build Plan 1](./screenshots/build-page_1.png)
![Build Plan 2](./screenshots/build-page_2.png)

### Weekly Plan
![Weekly Plan 1](./screenshots/plan-page_1.png)
![Weekly Plan 2](./screenshots/plan-page_2.png)

### Mobile View
<img src="./screenshots/mobile-build-planpg_1.png" width="320" />
<img src="./screenshots/mobile-build-planpg_2.png" width="320" />
<img src="./screenshots/mobile-build-planpg_3.png" width="320" />
<img src="./screenshots/mobile-planpg_1.png" width="320" />
<img src="./screenshots/mobile-planpg_2.png" width="320" />
<img src="./screenshots/mobile-planpg_3.png" width="320" />


# License

This project is provided for **educational and evaluation purposes**.

---

# Acknowledgements

* OpenRouter for LLM API access
* Figma design provided in the assignment
* React ecosystem for development tools

```

# ChatGPT Conversation Link:

https://chatgpt.com/share/69aa981e-6a94-8006-b743-c4968566dcbe
