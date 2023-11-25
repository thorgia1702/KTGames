export function calculateWinner_tictactoe(cells) {
  const lines = [];

  // Check rows (horizontal)
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col <= 5; col++) {
      lines.push(Array.from({ length: 5 }, (_, i) => row * 10 + col + i));
    }
  }

  // Check columns (vertical)
  for (let col = 0; col < 10; col++) {
    for (let row = 0; row <= 5; row++) {
      lines.push(Array.from({ length: 5 }, (_, i) => (row + i) * 10 + col));
    }
  }

  // Check diagonals (top-left to bottom-right)
  for (let startRow = 0; startRow <= 5; startRow++) {
    for (let startCol = 0; startCol <= 5; startCol++) {
      const diagonal = Array.from(
        { length: 5 },
        (_, i) => (startRow + i) * 10 + startCol + i
      );
      lines.push(diagonal);
    }
  }

  // Check diagonals (top-right to bottom-left)
  for (let startRow = 0; startRow <= 5; startRow++) {
    for (let startCol = 9; startCol >= 4; startCol--) {
      const diagonal = Array.from(
        { length: 5 },
        (_, i) => (startRow + i) * 10 + startCol - i
      );
      lines.push(diagonal);
    }
  }

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const [a, b, c, d, e] = line;
    if (
      cells[a] &&
      cells[a] === cells[b] &&
      cells[a] === cells[c] &&
      cells[a] === cells[d] &&
      cells[a] === cells[e]
    ) {
      return cells[a];
    }
  }

  return null;
}


export function calculateWinner_bingo(cells) {
  const lines = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20],
  ];

  let completeLines = 0;

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d, e] = lines[i];
    // Check if all cells in a line are marked with "X"
    if (cells[a] === "X" && cells[b] === "X" && cells[c] === "X" && cells[d] === "X" && cells[e] === "X") {
      completeLines += 1;
    }
  }

  return completeLines;
}



