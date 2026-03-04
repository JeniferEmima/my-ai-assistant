const API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function sendToGemini(messages, systemPrompt) {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error("API key not set. Add it to your .env file.");
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map(({ role, content }) => ({ role, content })),
      ],
      max_tokens: 2048,
      temperature: 0.9,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No response.";
}