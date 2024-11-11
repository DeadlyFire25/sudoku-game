<script lang="ts">
  import { isPaused } from '../stores/game';
  
  export let value: number = 0;
  export let isInitial: boolean = false;
  export let isError: boolean = false;
  export let isSelected: boolean = false;
  export let onClick: () => void;
  export let onInput: (value: number) => void;

  function handleClick() {
    if (!$isPaused && !isInitial) {
      onClick();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if ($isPaused || isInitial) return;
    
    if (event.key >= '1' && event.key <= '9') {
      event.preventDefault();
      onInput(parseInt(event.key));
    } else if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      onInput(0);
    }
  }
</script>

<div 
  class="relative w-full h-full cursor-pointer {$isPaused ? 'cursor-not-allowed' : ''}"
  on:click={handleClick}
  on:keydown={handleKeydown}
  tabindex={isInitial ? -1 : 0}
  role="button"
>
  <div
    class="w-full md:h-14 h-10 flex items-center justify-center text-xl font-semibold border
           {isInitial ? 'bg-gray-100 font-bold text-blue-600' : 'bg-white'} 
           {isError ? 'bg-red-300 bg-opacity-40 border-red-500' : 'border-gray-300'}
           {isSelected ? 'bg-blue-100 border-blue-700' : ''}
           {$isPaused ? 'opacity-50' : ''}"
  >
    {value || ''}
  </div>
  {#if $isPaused && !isInitial}
    <div class="absolute inset-0 bg-blue-200 opacity-50"></div>
  {/if}
</div>