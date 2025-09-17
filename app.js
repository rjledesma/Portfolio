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

  const count = Math.floor(Math.random() * 10);
  const dateLabel = getDateOffset(dayIndex);

  const hasContributions = Math.random() > 0.7; 

  if (hasContributions) {
    const count = Math.floor(Math.random() * 10) + 1;
    div.classList.add("active");
    div.dataset.tooltip = `${count} contributions on ${dateLabel}`;
  } else {
    div.dataset.tooltip = `No contributions on ${dateLabel}`;
  }

  if (Math.random() > 0.7) div.classList.add("active");

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