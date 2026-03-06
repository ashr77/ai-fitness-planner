// src/api/openrouter.js

export async function callOpenRouter({ systemPrompt, userPrompt, apiKey, model }) {
  if (!apiKey) {
    throw new Error(
      "Missing OpenRouter API key. Put VITE_OPENROUTER_KEY in .env and restart npm run dev."
    );
  }
  if (!model) {
    throw new Error(
      "Missing model. Put VITE_OPENROUTER_MODEL in .env (e.g. openai/gpt-oss-20b:free)."
    );
  }

  const url = "https://openrouter.ai/api/v1/chat/completions";

  // Retry configuration (handles temporary free-model rate limits)
  const maxAttempts = 3;
  const delaysMs = [800, 1600, 2500];

  // Timeout configuration (prevents hanging)
  const timeoutMs = 25000; // 25 seconds

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // SUCCESS
      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (!content) throw new Error("No content from model");
        return content;
      }

      // ERROR BODY (important to read it)
      const rawText = await res.text().catch(() => "");

      // Rate limit -> retry
      if (res.status === 429 && attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, delaysMs[attempt - 1] || 2000));
        continue;
      }

      // Give nicer message for final 429
      if (res.status === 429) {
        throw new Error(
          `API is busy (rate-limited). Please try again in a moment, or switch to another free model (e.g. openai/gpt-oss-20b:free). Details: ${rawText}`
        );
      }

      // Other failures
      throw new Error(`API failed: ${res.status} ${res.statusText} ${rawText}`);
    } catch (err) {
      clearTimeout(timeoutId);

      // Timeout / aborted request
      if (err?.name === "AbortError") {
        // If we still have attempts, retry
        if (attempt < maxAttempts) {
          await new Promise((r) => setTimeout(r, delaysMs[attempt - 1] || 2000));
          continue;
        }
        throw new Error(
          `Request timed out after ${Math.round(timeoutMs / 1000)}s. Please retry, or switch to a faster free model (e.g. openai/gpt-oss-20b:free).`
        );
      }

      // Network errors / other unexpected fetch errors
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, delaysMs[attempt - 1] || 2000));
        continue;
      }

      throw err;
    }
  }

  // Should never reach here
  throw new Error("API failed after retries.");
}