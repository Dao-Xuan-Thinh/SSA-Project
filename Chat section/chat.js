function typeText(element, text, speed = 20) {
  element.textContent = "";
  let i = 0;

  function typing() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      element.scrollIntoView({ behavior: "smooth", block: "end" });
      setTimeout(typing, speed);
    }
  }

  typing();
}
// ===== DARK MODE =====
const themeToggle = document.getElementById("themeToggle");

// Load trạng thái đã lưu
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

themeToggle.onclick = () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    themeToggle.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "light");
    themeToggle.textContent = "🌙";
  }
};
// ===== CHATBOT =====

async function askCareerAI() {
  const input = document.getElementById("career-question");
  const chat = document.getElementById("chatBody");

  const question = input.value.trim();
  if (!question) return;

  // USER MESSAGE
  addMessage(question, "user");
  input.value = "";

  // AI MESSAGE BOX
  const aiBox = addMessage("AI đang trả lời...", "ai");

  const prompt = `
Bạn là cố vấn hướng nghiệp CNTT.
Câu hỏi của sinh viên:
"${question}"

Hãy trả lời ngắn gọn, dễ hiểu, thực tế. Tất cả câu trả lời đều bằng tiếng Việt.
`;

  try {
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3:8b",
        prompt,
        stream: false
      })
    });

    const data = await res.json();

    // ✨ GÕ CHỮ DẦN
    typeText(aiBox, data.response, 18);

  } catch {
    aiBox.textContent = "❌ Không kết nối được AI.";
  }
}
function addMessage(text, type) {
  const chat = document.getElementById("chatBody");

  const msg = document.createElement("div");
  msg.className = `msg ${type}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  msg.appendChild(bubble);
  chat.appendChild(msg);

  chat.scrollTop = chat.scrollHeight;

  return bubble; // 👉 để typing effect dùng
}
