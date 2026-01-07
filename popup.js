async function callAI(question, context) {
  const response = await fetch("http://127.0.0.1:8000/explain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: question,
      context: context
    })
  });

  const data = await response.json();
  return data.answer;
}

document.getElementById("askBtn").addEventListener("click", async () => {
  const question = document.getElementById("question").value.toLowerCase();
  const output = document.getElementById("output");

  output.textContent = "Thinking...";

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: () => window.__WEB_NARRATOR_DATA__
    },
    async (results) => {
      const pageData = results[0].result;

      const keywords = question.split(/\s+/).filter(w => w.length > 2);

      const scored = pageData.map(el => {
        let score = 0;
        const text = el.text.toLowerCase();
        keywords.forEach(word => {
          if (text.includes(word)) score++;
        });
        return { ...el, score };
      });

      const relevant = scored
        .filter(e => e.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 1);

      if (relevant.length === 0) {
        output.textContent = "I cannot find this information on the current page.";
        return;
      }

      const context = relevant[0].text;

      const answer = await callAI(question, context);

      output.textContent = answer;

      // Highlight the source element
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (id) => {
          const el = window.__WEB_NARRATOR_DATA__.find(e => e.element_id === id);
          if (el) {
            document.querySelectorAll(".web-narrator-highlight")
              .forEach(e => e.classList.remove("web-narrator-highlight"));
            el.dom_ref.classList.add("web-narrator-highlight");
            el.dom_ref.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        },
        args: [relevant[0].element_id]
      });
    }
  );
});
