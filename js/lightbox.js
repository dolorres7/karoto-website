// Screenshots that open large on a tap: the phones and widgets in the feature
// cards, marked `data-zoom`. Esc, a tap outside or × closes; the arrows step
// through the others.

const shots = [...document.querySelectorAll("[data-zoom]")];

const box = document.createElement("div");
box.className = "lightbox";
box.hidden = true;
box.setAttribute("role", "dialog");
box.setAttribute("aria-modal", "true");
box.setAttribute("aria-label", "Screenshot");
box.innerHTML = `
  <button class="lightbox-button lightbox-close" type="button" aria-label="Close"><i class="ph ph-x"></i></button>
  <button class="lightbox-button lightbox-prev" type="button" aria-label="Previous screenshot"><i class="ph ph-caret-left"></i></button>
  <figure class="lightbox-figure">
    <div class="phone lightbox-phone">
      <img class="screen" alt="">
      <img class="bezel" src="assets/iphone-bezel.png" alt="">
    </div>
    <figcaption class="lightbox-caption"></figcaption>
  </figure>
  <button class="lightbox-button lightbox-next" type="button" aria-label="Next screenshot"><i class="ph ph-caret-right"></i></button>
`;
document.body.append(box);

const screen = box.querySelector(".screen");
const caption = box.querySelector(".lightbox-caption");
let current = -1;
let opener = null;

function show(index) {
  current = (index + shots.length) % shots.length;
  const shot = shots[current];
  const image = shot.querySelector("img");
  screen.src = image.getAttribute("src");
  screen.alt = image.alt;
  // The card's own title says what's on screen.
  caption.textContent = shot.closest(".feature")?.querySelector("h3")?.textContent ?? "";
}

function open(index) {
  opener = document.activeElement;
  show(index);
  box.hidden = false;
  document.documentElement.classList.add("lightbox-open");
  requestAnimationFrame(() => box.classList.add("is-visible"));
  box.querySelector(".lightbox-close").focus({ preventScroll: true });
}

function close() {
  box.classList.remove("is-visible");
  document.documentElement.classList.remove("lightbox-open");
  box.hidden = true;
  opener?.focus({ preventScroll: true });
}

shots.forEach((shot, index) => {
  const image = shot.querySelector("img");
  shot.tabIndex = 0;
  shot.setAttribute("role", "button");
  shot.setAttribute("aria-label", `Open screenshot: ${image.alt || "Karoto"}`);
  shot.addEventListener("click", () => open(index));
  shot.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open(index);
    }
  });
});

box.querySelector(".lightbox-close").addEventListener("click", close);
box.querySelector(".lightbox-prev").addEventListener("click", () => show(current - 1));
box.querySelector(".lightbox-next").addEventListener("click", () => show(current + 1));

// A tap on the dimmed page, not on the phone or a button, closes it.
box.addEventListener("click", (event) => {
  if (event.target === box || event.target.classList.contains("lightbox-figure")) close();
});

document.addEventListener("keydown", (event) => {
  if (box.hidden) return;
  if (event.key === "Escape") close();
  else if (event.key === "ArrowLeft") show(current - 1);
  else if (event.key === "ArrowRight") show(current + 1);
  else if (event.key === "Tab") {
    // Keep focus on the lightbox's own buttons while it's open.
    const buttons = [...box.querySelectorAll("button")];
    const at = buttons.indexOf(document.activeElement);
    event.preventDefault();
    buttons[(at + (event.shiftKey ? -1 : 1) + buttons.length) % buttons.length].focus();
  }
});
