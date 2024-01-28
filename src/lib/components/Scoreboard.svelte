<script lang="ts">
  import type { Frame } from "$lib/playback/types";

  export let frame: Frame;
  export let highlightedSnakeID: string | null;

  // We sort snakes by elimination state, then lowercase name alphabetical
  $: sortedSnakes = [...frame.snakes].sort((a, b) => {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });

  function highlightSnake(id: string) {
    if (highlightedSnakeID == id) {
      highlightedSnakeID = null;
    } else {
      highlightedSnakeID = id;
    }
  }
</script>

<div class="flex flex-row font-bold text-lg">
  <div class="basis-1/2 text-right">TURN</div>
  <div class="basis-1/2 pl-2">{frame.turn}</div>
</div>

{#each sortedSnakes as snake}
  <div
    class="p-2 cursor-pointer rounded-sm border-solid border-2 border-transparent hover:border-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800"
    class:highlighted={snake.id === highlightedSnakeID}
    on:click={() => highlightSnake(snake.id)}
    role="presentation"
  >
    <div class="flex flex-row font-bold">
      <p class="grow truncate">{snake.name}</p>
      <p class="ps-4 text-right">{snake.length}</p>
    </div>

    <div class="h-4 text-xs mt-1">
      <div class="text-outline w-full h-full rounded-full bg-neutral-200 dark:bg-neutral-800">
        <div
          class="transition-all h-full rounded-full text-white ps-2"
          style="background: {snake.color}; width: {snake.health}%"
        >
          {snake.health}
        </div>
      </div>
    </div>
  </div>
{/each}

<style lang="postcss">
    .text-outline {
        text-shadow: 0 0 2px black, 0 0 2px black, 0 0 2px black, 0 0 2px black;
    }

    .highlighted {
        @apply border-pink-500 bg-neutral-200;
    }

    :global(html.dark .highlighted) {
        @apply bg-neutral-800;
    }
</style>
