<script lang="ts">
  import { createNewGame, difficulty, isGameComplete, timer, isPaused, finalTime, difficulties } from '../stores/game';
  import type { Difficulty } from '../stores/game';
  import SudokuCell from './SudokuCell.svelte';
  import NumberPad from './NumberPad.svelte';
  import CompletionModal from './CompletionModal.svelte';
  
  let currentGame = createNewGame($difficulty);
  let userGrid = currentGame.puzzle.map(row => [...row]);
  let errors: boolean[][] = Array(9).fill(null).map(() => Array(9).fill(false));
  let conflicts: boolean[][] = Array(9).fill(null).map(() => Array(9).fill(false));
  let totalErrors = 0;
  let selectedCell: { row: number; col: number } | null = null;
  
  function handleCellClick(row: number, col: number) {
    if (!currentGame.puzzle[row][col]) {
      selectedCell = { row, col };
      clearConflicts();
    }
  }

  function handleNumberInput(number: number) {
    if (selectedCell) {
      const { row, col } = selectedCell;
      if (number !== userGrid[row][col]) {
        if (number !== 0 && number !== currentGame.solution[row][col]) {
          totalErrors++;
        }
        userGrid[row][col] = number;
        checkErrors();
        if (number !== 0) {
          highlightConflicts(row, col, number);
        } else {
          clearConflicts();
        }
        checkCompletion();
      }
    }
  }

  function handleClear() {
    handleNumberInput(0);
  }
  
  function checkErrors() {
    errors = Array(9).fill(null).map(() => Array(9).fill(false));
    
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (userGrid[i][j] !== 0 && userGrid[i][j] !== currentGame.solution[i][j]) {
          errors[i][j] = true;
        }
      }
    }
  }

  function clearConflicts() {
    conflicts = Array(9).fill(null).map(() => Array(9).fill(false));
  }

  function highlightConflicts(row: number, col: number, value: number) {
    clearConflicts();
    
    // Check row
    for (let j = 0; j < 9; j++) {
      if (j !== col && userGrid[row][j] === value) {
        conflicts[row][j] = true;
        conflicts[row][col] = true;
      }
    }

    // Check column
    for (let i = 0; i < 9; i++) {
      if (i !== row && userGrid[i][col] === value) {
        conflicts[i][col] = true;
        conflicts[row][col] = true;
      }
    }

    // Check box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if ((i !== row || j !== col) && userGrid[i][j] === value) {
          conflicts[i][j] = true;
          conflicts[row][col] = true;
        }
      }
    }
  }
  
  function checkCompletion() {
    const isComplete = userGrid.every((row, i) =>
      row.every((cell, j) => cell === currentGame.solution[i][j])
    );
    if (isComplete) {
      isGameComplete.set(true);
      finalTime.set($timer);
    }
  }
  
  function startNewGame(diff: Difficulty = $difficulty) {
    difficulty.set(diff);
    currentGame = createNewGame(diff);
    userGrid = currentGame.puzzle.map(row => [...row]);
    errors = Array(9).fill(null).map(() => Array(9).fill(false));
    conflicts = Array(9).fill(null).map(() => Array(9).fill(false));
    totalErrors = 0;
    selectedCell = null;
    isGameComplete.set(false);
    isPaused.set(false);
    timer.set(0);
    finalTime.set(0);
  }

  function handleDifficultyChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    startNewGame(select.value as Difficulty);
  }
</script>

<div class="flex flex-col items-center gap-6 relative z-10">
  <div class="w-48 relative z-20">
    <select
      class="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      on:change={handleDifficultyChange}
      value={$difficulty}>
      {#each Object.entries(difficulties) as [diff]}
        <option value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
      {/each}
    </select>
  </div>
  
  <div class="relative">
    <div class="grid grid-cols-9 gap-0.5 bg-gray-300 p-1 rounded-lg shadow-lg">
      {#each userGrid as row, i}
        {#each row as cell, j}
          <div class="relative w-14 {(Math.floor(i/3) + Math.floor(j/3)) % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      {i % 3 === 2 && i !== 8 ? 'border-b-2 border-gray-400' : ''}
                      {j % 3 === 2 && j !== 8 ? 'border-r-2 border-gray-400' : ''}">
            <SudokuCell
              value={cell}
              isInitial={currentGame.puzzle[i][j] !== 0}
              isError={errors[i][j]}
              isConflict={conflicts[i][j]}
              isSelected={selectedCell?.row === i && selectedCell?.col === j}
              onClick={() => handleCellClick(i, j)}
              onInput={handleNumberInput}
            />
          </div>
        {/each}
      {/each}
    </div>
    {#if $isPaused}
      <div class="absolute inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm rounded-lg flex items-center justify-center">
        <div class="bg-white px-6 py-3 rounded-lg shadow-lg text-xl font-bold text-gray-700">
          Juego en Pausa
        </div>
      </div>
    {/if}
  </div>

  <NumberPad onNumberSelect={handleNumberInput} onClear={handleClear} />

  {#if $isGameComplete}
    <CompletionModal
      time={$finalTime}
      errors={totalErrors}
      onNewGame={() => startNewGame()}
    />
  {/if}
</div>