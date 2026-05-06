export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return res.status(500).json({ error: "Telegram environment variables are not configured" });
  }

  const {
    parentName = "",
    childName = "",
    age = "",
    phone = "",
    shift = "",
    address = "",
    comment = "",
  } = req.body || {};

  if (!parentName || !childName || !age || !phone || !shift || !address) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const text = [
    "📋 Новая заявка на лагерь!",
    `Родитель: ${parentName}`,
    `Ребёнок: ${childName}, ${age}`,
    `Телефон: ${phone}`,
    `Смена: ${shift}`,
    `Адрес: ${address}`,
    `Комментарий: ${comment || "нет"}`,
  ].join("\n");

  const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  });

  if (!telegramResponse.ok) {
    return res.status(502).json({ error: "Telegram request failed" });
  }

  return res.status(200).json({ ok: true });
}
