<script lang="ts">
  import { isPaused } from '../stores/game';
  
  export let value: number = 0;
  export let isInitial: boolean = false;
  export let isError: boolean = false;
  export let isConflict: boolean = false;
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

  $: cellClasses = [
    'w-full h-14 flex items-center justify-center text-xl transition-all duration-200 focus:border-none active:border-none', 
    isInitial ? 'bg-gray-100 font-bold text-gray-700' : 'bg-white hover:bg-blue-100',
    isError ? 'text-red-600 bg-red-400' : '',
    isConflict ? 'bg-red-500/50 hover:bg-red-500/501' : '',
    isSelected ? 'bg-blue-400 ring-2 ring-blue-400' : 'border border-gray-200',
    value && !isInitial ? 'text-blue-700 font-medium focus:border-none active:border-none' : '',
    $isPaused ? 'opacity-50' : '',
  ].filter(Boolean).join(' ');
</script>

<div 
  class="relative w-full h-full"
  class:cursor-pointer={!$isPaused && !isInitial}
  class:cursor-not-allowed={$isPaused || isInitial}
  on:click={handleClick}
  on:keydown={handleKeydown}
  tabindex={isInitial ? -1 : 0}
  role="button"
>
  <div class={cellClasses}>
    {value || ''}
  </div>
</div>