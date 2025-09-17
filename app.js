document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll('.timeline-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, { threshold: 0.2 });

  items.forEach(item => observer.observe(item));

  const dots = document.querySelectorAll('.timeline-dot');
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      dots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });
});

const heatmapGrid = document.getElementById('heatmap-grid');

const fixed = 7;
const squareSize = 15; 
const gapSize = 3;

function getDateOffset(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short", 
    day: "numeric"
  });
}


function createSquare(dayIndex) {
  const div = document.createElement("div");
  div.classList.add("square");

  const dateLabel = getDateOffset(dayIndex);
  const count = Math.random() > 0.7 ? Math.floor(Math.random() * 12) : 0;

  div.dataset.tooltip =
    count === 0
      ? `No contributions on ${dateLabel}`
      : count === 1
      ? `1 contribution on ${dateLabel}`
      : `${count} contributions on ${dateLabel}`;

  const levels = [
    { max: 0, color: "#ebedf0" },
    { max: 3, color: "#9be9a8" },
    { max: 6, color: "#40c463" },
    { max: 9, color: "#30a14e" },
    { max: Infinity, color: "#216e39" }
  ];

  const level = levels.find(l => count <= l.max);
  div.style.backgroundColor = level.color;

  div.addEventListener("click", () => {
    document.querySelectorAll(".square.show-tooltip")
      .forEach(sq => sq.classList.remove("show-tooltip"));
    div.classList.toggle("show-tooltip");
  });

  return div;
}

function renderGrid() {
  heatmapGrid.innerHTML = "";

  const isMobile = window.innerWidth <= 600;
  const containerWidth = heatmapGrid.parentElement.offsetWidth || window.innerWidth;

  if (!isMobile) {

    const cols = Math.max(1, Math.floor((containerWidth + gapSize) / (squareSize + gapSize)));
    heatmapGrid.style.gridTemplateColumns = `repeat(${cols}, ${squareSize}px)`;
    const total = fixed * cols;
    for (let i = 0; i < total; i++) {
      heatmapGrid.appendChild(createSquare(i));
    }
  } else {
    const cols = fixed;
    heatmapGrid.style.gridTemplateColumns = `repeat(${cols}, ${squareSize}px)`;
    const rows = Math.max(1, Math.floor((containerWidth / (squareSize + gapSize))));
    const total = rows * cols;
    for (let i = 0; i < total; i++) {
      heatmapGrid.appendChild(createSquare(i));
    }
  }
}

renderGrid();
window.addEventListener("resize", renderGrid);

document.addEventListener("DOMContentLoaded", () => {
  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach(card => {
    card.addEventListener("click", () => {
      const link = card.getAttribute("data-link");
      if (link) {
        window.open(link, "_blank");
      }
    });
    card.style.cursor = "pointer";
  });
});