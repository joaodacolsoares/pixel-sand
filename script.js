const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 200;
const CELL_SIZE = 5;
const CELL_WIDTH = CANVAS_WIDTH / CELL_SIZE;
const CELL_HEIGHT = CANVAS_HEIGHT / CELL_SIZE;

const app = document.getElementById("app");
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
app.appendChild(canvas);

const createGrid = () => {
  return Array.from({ length: CELL_WIDTH }, () =>
    Array.from({ length: CELL_HEIGHT }, () => null)
  );
};

const grid = createGrid();

const drawCell = (i, j) => {
  const x = i * CELL_SIZE;
  const y = CANVAS_HEIGHT - (j + 1) * CELL_SIZE;

  ctx.fillStyle = grid[i][j] ? `hsl(${grid[i][j]}, 100%, 50%)` : "#fff";
  ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

  ctx.strokeStyle = "#cacaca";
  ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
};

const start = () => {
  for (let i = 0; i < CELL_WIDTH; i++) {
    for (let j = 0; j < CELL_HEIGHT; j++) {
      drawCell(i, j);
    }
  }
};

let isDrawing = false;
canvas.addEventListener("mouseup", () => (isDrawing = false));
canvas.addEventListener("mouseleave", () => (isDrawing = false));
canvas.addEventListener("mousedown", () => (isDrawing = true));

let hueValue = 200;
canvas.addEventListener("mousemove", (event) => {
  if (!isDrawing) return;

  const x = Math.floor(event.offsetX / CELL_SIZE);
  const y = Math.floor((CANVAS_HEIGHT - event.offsetY) / CELL_SIZE);

  const matrix = 5;
  const extent = Math.floor(matrix / 2);
  for (let i = -extent; i <= extent; i++) {
    for (let j = -extent; j <= extent; j++) {
      if (Math.random() < 0.75) {
        let col = x + i;
        let row = y + j;

        if (grid[col][row] !== null) {
          continue;
        }

        grid[col][row] = hueValue;
        drawCell(col, row);
      }
    }
  }

  hueValue += 1;
  if (hueValue > 360) {
    hueValue = 1;
  }
});

const withinBounds = (x, y) => {
  return x >= 0 && x < CELL_WIDTH && y >= 0 && y < CELL_HEIGHT;
};

const updateSand = () => {
  const nextGrid = createGrid();

  for (let x = 0; x < CELL_WIDTH; x++) {
    for (let y = 0; y < CELL_HEIGHT; y++) {
      let state = grid[x][y];

      if (state !== null) {
        let below = withinBounds(x, y - 1) ? grid[x][y - 1] : -1;

        let direction = Math.random() < 0.5 ? -1 : 1;

        let belowA = withinBounds(x + direction, y - 1)
          ? grid[x + direction][y - 1]
          : -1;
        let belowB = withinBounds(x - direction, y - 1)
          ? grid[x - direction][y - 1]
          : -1;

        if (below === null) {
          nextGrid[x][y - 1] = state;
        } else if (belowA === null) {
          nextGrid[x + direction][y - 1] = state;
        } else if (belowB === null) {
          nextGrid[x - direction][y - 1] = state;
        } else {
          nextGrid[x][y] = state;
        }
      }
    }
  }

  for (let x = 0; x < CELL_WIDTH; x++) {
    for (let y = 0; y < CELL_HEIGHT; y++) {
      if (grid[x][y] !== nextGrid[x][y]) {
        grid[x][y] = nextGrid[x][y];
        drawCell(x, y);
      }
    }
  }

  requestAnimationFrame(updateSand);
};

start();
updateSand();
