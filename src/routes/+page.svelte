<script lang="ts">
  import SudokuGrid from '../lib/components/SudokuGrid.svelte';
  import Timer from '../lib/components/Timer.svelte';
  import { isGameComplete, timer } from '../lib/stores/game';

  let showContent = false;
</script>

<main class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

  {#if !showContent}
  <div class="container mx-auto px-4 min-h-screen flex flex-col items-center justify-center">
    <div class="flex flex-col items-center">
      <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">Sudoku</h1>
      <img src="img/Sudoku.png" alt="Sudoku" class="w-52 h-52 mb-4 border border-gray-300 rounded-lg shadow-md" />
    </div>
    <button class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md" on:click={() => showContent = true}>
      Comenzar juego
    </button>  
  </div>
  {/if}
  {#if showContent}
  <div class="container mx-auto px-4 md:py-4 py-8">
    <h1 class="text-4xl font-bold text-center mb-2 text-gray-800">Sudoku</h1>
    
    <div class="flex flex-col items-center py-8 gap-4">
      <SudokuGrid />
      
      {#if $isGameComplete}
        <div class="bg-green-100 border border-green-500 text-green-700 px-6 py-4 rounded-lg shadow-md text-lg font-semibold">
          ¡Felicitaciones! Has completado el Sudoku en {Math.floor($timer / 60)}:{($timer % 60).toString().padStart(2, '0')}
        </div>
      {/if}
    </div>
  </div>
  {/if}
</main>