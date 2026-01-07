// Web Narrator AI - DOM Extraction

console.log("Web Narrator AI: DOM extraction started");

// Utility: check if element is visible
function isVisible(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    window.getComputedStyle(element).visibility !== "hidden" &&
    window.getComputedStyle(element).display !== "none"
  );
}

// Elements we care about
const SELECTORS = "h1, h2, h3, p, a, button, input, label";

// Extract elements
let elements = [];
let idCounter = 0;

document.querySelectorAll(SELECTORS).forEach(el => {
  if (!isVisible(el)) return;

  const text = el.innerText || el.value || "";
  if (text.trim().length === 0) return;

  const rect = el.getBoundingClientRect();

  elements.push({
    element_id: `EL_${idCounter++}`,
    tag: el.tagName.toLowerCase(),
    text: text.trim(),
    bounding_box: {
      x: Math.round(rect.x),
      y: Math.round(rect.y),
      width: Math.round(rect.width),
      height: Math.round(rect.height)
    }
  });
});

// Store extracted data globally (for later steps)
window.__WEB_NARRATOR_DATA__ = elements;

console.log("Web Narrator AI: Extracted elements →", elements);
console.log("Total elements captured:", elements.length);
