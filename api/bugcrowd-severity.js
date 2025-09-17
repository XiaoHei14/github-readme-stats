import fetch from "node-fetch";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const response = await fetch("https://bugcrowd.com/h/DaoHui");
    const html = await response.text();
    const $ = cheerio.load(html);

    // 假設 Bugcrowd 頁面上有顯示最新 submission 的 severity
    // 需要找到正確 selector，這裡示範用 class 選擇器
    const latestSeverity = $(".bc-profile-activity .bc-severity-label")
      .first()
      .text()
      .trim();

    // 如果找不到就 fallback
    const severity = latestSeverity || "Unknown";

    // 動態產生 Shields.io 樣式的 badge
    const colorMap = {
      P1: "red",
      P2: "orange",
      P3: "yellow",
      P4: "blue",
      P5: "lightgrey",
    };

    const color = colorMap[severity] || "lightgrey";

    const badgeSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="150" height="20">
  <rect width="80" height="20" fill="#555"/>
  <rect x="80" width="70" height="20" fill="${color}"/>
  <text x="40" y="14" fill="#fff" font-family="Verdana" font-size="11" text-anchor="middle">Latest Severity</text>
  <text x="115" y="14" fill="#fff" font-family="Verdana" font-size="11" text-anchor="middle">${severity}</text>
</svg>
`;

    res.setHeader("Content-Type", "image/svg+xml");
    res.status(200).send(badgeSvg);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Bugcrowd profile" });
  }
}
