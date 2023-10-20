// export function calculateWinner(cells){
//     const lines = [
//         [0,1,2],
//         [3,4,5],

//         [6,7,8],
//         [0,3,6],

//         [1,4,7],
//         [2,5,8],

//         [0,4,8],
//         [2,4,6],
//     ];
//     for (let index = 0; index < lines.length; index++){
//         const [a, b, c] = lines[index];
//         if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
//             return cells[a];
//         }
//     }
//     return null;
// }

export function calculateWinnerOffline(cells) {
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
            const diagonal = Array.from({ length: 5 }, (_, i) => (startRow + i) * 10 + startCol + i);
            lines.push(diagonal);
        }
    }

    // Check diagonals (top-right to bottom-left)
    for (let startRow = 0; startRow <= 5; startRow++) {
        for (let startCol = 9; startCol >= 4; startCol--) {
            const diagonal = Array.from({ length: 5 }, (_, i) => (startRow + i) * 10 + startCol - i);
            lines.push(diagonal);
        }
    }

    for (let index = 0; index < lines.length; index++) {
        const line = lines[index];
        const [a, b, c, d, e] = line;
        if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c] && cells[a] === cells[d] && cells[a] === cells[e]) {
            return cells[a];
        }
    }

    return null;
}
