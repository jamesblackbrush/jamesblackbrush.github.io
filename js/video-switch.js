const lite = document.getElementById("video-lite");
const full = document.getElementById("video-full");
const enter = document.getElementById("enterPrompt");

// How long after the full video starts before showing ENTER (ms)
const ENTER_DELAY = 1000; // tweak this

// Start downloading the full video early
full.load();

// When the first video finishes…
lite.addEventListener("ended", () => {
  // Fade in + start the second video
  full.classList.add("visible");
  full.play().catch(() => {});
  lite.pause();

  // Show ENTER after a controlled delay
  setTimeout(() => {
    enter.classList.add("show");
  }, ENTER_DELAY);
});
