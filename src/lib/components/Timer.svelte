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

  $: buttonText = $isPaused ? '▶️' : '⏸️';
</script>

<div class="flex items-center gap-4">
  <div class="flex flex-row text-3xl font-bold font-mono bg-white pr-8 py-3 rounded-2xl shadow items-center">
    
    {#if !$isGameComplete}
    <button
      on:click={togglePause}
      class="rounded-full border-solid border-gray-500 text-5xl">
      {buttonText}
    </button>
  {/if}

    {formatTime($timer)}
    
  </div>
  
</div>