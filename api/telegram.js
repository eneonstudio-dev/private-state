export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });
  }

  try {
    const {
      name = "",
      telegram = "",
      state = "",
      duration = "",
      note = ""
    } = req.body || {};

    if (!name || !telegram || !state) {
      return res.status(400).json({
        ok: false,
        error: "Missing required fields"
      });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;

    // Твой личный Telegram ID
    const chatId = "463348871";

    if (!token) {
      return res.status(500).json({
        ok: false,
        error: "Telegram bot token is not configured"
      });
    }

    const text = [
      "🔐 PRIVATE STATE — НОВАЯ ЗАЯВКА",
      "",
      `Имя: ${name}`,
      `Telegram: ${telegram}`,
      `Формат: ${state}`,
      `Продолжительность: ${duration}`,
      "",
      `Комментарий: ${note || "—"}`
    ].join("\n");

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text
        })
      }
    );

    const result = await response.json();

    if (!result.ok) {
      return res.status(500).json({
        ok: false,
        error: result.description || "Telegram API error"
      });
    }

    return res.status(200).json({
      ok: true
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      error: "Internal server error"
    });
  }
}
