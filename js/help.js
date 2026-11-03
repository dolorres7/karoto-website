// Help Center: filter the questions by topic and by what's typed.

const search = document.querySelector("[data-help-search]");
const chips = [...document.querySelectorAll(".chip")];
const sections = [...document.querySelectorAll(".help-section")];
const empty = document.querySelector("[data-help-empty]");

let topic = "all";

function apply() {
  const words = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  let shown = 0;

  sections.forEach((section) => {
    const inTopic = topic === "all" || section.dataset.section === topic;
    let matches = 0;

    section.querySelectorAll(".faq-item").forEach((item) => {
      const text = item.textContent.toLowerCase();
      const match = inTopic && words.every((word) => text.includes(word));
      item.hidden = !match;
      if (match) matches += 1;
    });

    section.hidden = matches === 0;
    shown += matches;
  });

  empty.hidden = shown > 0;
}

function choose(next) {
  topic = next;
  chips.forEach((chip) => {
    const active = chip.dataset.filter === next;
    chip.classList.toggle("is-active", active);
    chip.setAttribute("aria-pressed", String(active));
  });
  apply();
}

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    choose(chip.dataset.filter);
    const hash = chip.dataset.filter === "all" ? "" : `#${chip.dataset.filter}`;
    history.replaceState(null, "", location.pathname + hash);
  });
});

search.addEventListener("input", apply);

// help.html#household opens on that topic.
const fromLink = location.hash.slice(1);
if (chips.some((chip) => chip.dataset.filter === fromLink)) choose(fromLink);
