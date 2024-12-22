<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { timer, isGameComplete, isPaused, finalTime } from '../stores/game';
  
  let interval: number;
  
  onMount(() => {
    startTimer();
  });
  
  onDestroy(() => {
    clearInterval(interval);
  });

  function startTimer() {
    interval = setInterval(() => {
      if (!$isPaused && !$isGameComplete) {
        timer.update(n => n + 1);
      }
    }, 1000);
  }
  
  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function togglePause() {
    isPaused.update(p => !p);
  }

  $: buttonText = $isPaused ? 'Reanudar' : 'Pausar';
</script>

<div class="flex items-center gap-4">
  <div class="text-3xl font-bold font-mono bg-white px-6 py-3 rounded-lg shadow">
    {formatTime($timer)}
  </div>
  {#if !$isGameComplete}
    <button
      on:click={togglePause}
      class="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 font-semibold shadow-md transition-colors">
      {buttonText}
    </button>
  {/if}
</div>