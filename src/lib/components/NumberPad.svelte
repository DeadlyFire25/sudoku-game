<script lang="ts">
    import { isPaused } from '../stores/game';
    
    export let onNumberSelect: (number: number) => void;
    export let onClear: () => void;
  
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
    function handleNumberClick(number: number) {
      if (!$isPaused) {
        onNumberSelect(number);
      }
    }
  </script>
  
  <div class="grid grid-cols-5 gap-2 w-full max-w-md mx-auto mt-4">
    {#each numbers as number}
      <button
        class="p-3 text-xl font-bold bg-white rounded-lg shadow hover:bg-blue-50 
               transition-colors {$isPaused ? 'cursor-not-allowed opacity-50' : ''}"
        on:click={() => handleNumberClick(number)}
        disabled={$isPaused}>
        {number}
      </button>
    {/each}
    <button
      class="p-3 text-xl font-bold bg-red-100 text-red-700 rounded-lg shadow 
             hover:bg-red-200 transition-colors {$isPaused ? 'cursor-not-allowed opacity-50' : ''}"
      on:click={onClear}
      disabled={$isPaused}>
      ⌫
    </button>
  </div>