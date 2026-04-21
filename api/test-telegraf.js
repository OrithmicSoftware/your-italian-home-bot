console.log("[test-telegraf] Starting...");
try {
  const { Telegraf } = require('telegraf');
  console.log("[test-telegraf] Telegraf loaded:", !!Telegraf);
  module.exports = (req, res) => {
    res.status(200).json({ ok: true, telegraf: !!Telegraf });
  };
} catch (e) {
  console.error("[test-telegraf] Error loading telegraf:", e);
  module.exports = (req, res) => {
    res.status(500).json({ ok: false, error: e.message });
  };
}
