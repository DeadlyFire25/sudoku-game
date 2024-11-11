<script lang="ts">
    export let time: number;
    export let errors: number;
    export let onNewGame: () => void;
  
    function formatTime(seconds: number): string {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  </script>
  
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
      <h2 class="text-3xl font-bold text-center mb-6">¡Felicitaciones!</h2>
      
      <div class="space-y-4 mb-8">
        <div class="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
          <span class="text-lg font-medium">Tiempo</span>
          <span class="text-xl font-bold">{formatTime(time)}</span>
        </div>
        
        <div class="flex justify-between items-center p-4 bg-red-50 rounded-lg">
          <span class="text-lg font-medium">Errores</span>
          <span class="text-xl font-bold">{errors}</span>
        </div>
      </div>
      
      <button
        class="w-full py-3 px-6 bg-blue-500 text-white rounded-lg font-bold
               hover:bg-blue-600 transition-colors"
        on:click={onNewGame}>
        Jugar de nuevo
      </button>
    </div>
  </div>