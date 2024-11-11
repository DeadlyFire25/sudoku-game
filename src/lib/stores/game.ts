import { writable } from 'svelte/store';

export type Difficulty = 'easy' | 'medium' | 'hard';

export const difficulty = writable<Difficulty>('easy');
export const timer = writable(0);
export const isGameComplete = writable(false);
export const isPaused = writable(false);
export const finalTime = writable(0);

export const difficulties = {
  easy: 30,
  medium: 40,
  hard: 50,
} as const;

function generateSudoku() {
  const grid = Array(9).fill(null).map(() => Array(9).fill(0));
  fillDiagonal(grid);
  solveSudoku(grid);
  return grid;
}

function fillDiagonal(grid: number[][]) {
  for (let i = 0; i < 9; i += 3) {
    fillBox(grid, i, i);
  }
}

function fillBox(grid: number[][], row: number, col: number) {
  let num;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      do {
        num = Math.floor(Math.random() * 9) + 1;
      } while (!isSafeInBox(grid, row, col, num));
      grid[row + i][col + j] = num;
    }
  }
}

function isSafeInBox(grid: number[][], row: number, col: number, num: number) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[row + i][col + j] === num) return false;
    }
  }
  return true;
}

function solveSudoku(grid: number[][]): boolean {
  let row = 0;
  let col = 0;
  let isEmpty = false;
  
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (grid[i][j] === 0) {
        row = i;
        col = j;
        isEmpty = true;
        break;
      }
    }
    if (isEmpty) break;
  }
  
  if (!isEmpty) return true;
  
  for (let num = 1; num <= 9; num++) {
    if (isSafe(grid, row, col, num)) {
      grid[row][col] = num;
      if (solveSudoku(grid)) return true;
      grid[row][col] = 0;
    }
  }
  return false;
}

function isSafe(grid: number[][], row: number, col: number, num: number): boolean {
  return !usedInRow(grid, row, num) && 
         !usedInCol(grid, col, num) && 
         !usedInBox(grid, row - row % 3, col - col % 3, num);
}

function usedInRow(grid: number[][], row: number, num: number): boolean {
  return grid[row].includes(num);
}

function usedInCol(grid: number[][], col: number, num: number): boolean {
  return grid.some(row => row[col] === num);
}

function usedInBox(grid: number[][], boxStartRow: number, boxStartCol: number, num: number): boolean {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + boxStartRow][j + boxStartCol] === num) return true;
    }
  }
  return false;
}

export function createNewGame(difficulty: Difficulty) {
  const solution = generateSudoku();
  const puzzle = solution.map(row => [...row]);
  const cellsToRemove = difficulties[difficulty];
  
  let removed = 0;
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      removed++;
    }
  }
  
  return {
    puzzle,
    solution
  };
}