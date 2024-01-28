<script lang="ts">
  import type { Frame } from "$lib/playback/types";
  import type { SvgCalcParams } from "$lib/svg";

  import SvgHazard from "./SvgHazard.svelte";
  import SvgSnake from "./SvgSnake.svelte";
  import SvgFood from "./SvgFood.svelte";
  import SvgGrid from "./SvgGrid.svelte";

  // Grid constants
  const CELL_SIZE = 20;
  const CELL_SIZE_HALF = CELL_SIZE / 2;
  const CELL_SPACING = 4;
  const GRID_BORDER = 10;
  export let frame: Frame;
  export let showCoordinates: boolean;
  export let highlightedSnakeID: string | null = null;
  $: svgWidth = 2 * GRID_BORDER +
    frame.width * CELL_SIZE +
    Math.max(frame.width - 1, 0) * CELL_SPACING;
  $: svgHeight = 2 * GRID_BORDER +
    frame.height * CELL_SIZE +
    Math.max(frame.height - 1, 0) * CELL_SPACING;

  $: svgCalcParams = {
    cellSize: CELL_SIZE,
    cellSizeHalf: CELL_SIZE_HALF,
    cellSpacing: CELL_SPACING,
    gridBorder: GRID_BORDER,
    height: svgHeight,
    width: svgWidth
  } as SvgCalcParams;
</script>

<svg class="gameboard flex-shrink" viewBox="0 0 {svgWidth} {svgHeight}">
  <!-- Grid -->
  <SvgGrid
    gridWidth={frame.width}
    gridHeight={frame.height}
    showLabels={showCoordinates}
    {svgCalcParams}
  />

  <!-- Snakes -->
  {#if highlightedSnakeID}
    <!-- Draw non-highlighted snakes under the highlighted one -->
    {#each frame.snakes as snake}
      {#if snake.id !== highlightedSnakeID}
        <SvgSnake {snake} {svgCalcParams} opacity={0.1} />
      {:else}
        <SvgSnake {snake} {svgCalcParams} />
      {/if}
    {/each}
  {:else}
    <!-- Draw eliminated snakes under the alive ones -->
    {#each frame.snakes as snake}
      <SvgSnake {snake} {svgCalcParams} />
    {/each}
  {/if}

  <!-- Hazards -->
  {#each frame.hazards as hazard, i}
    <SvgHazard point={hazard} key={`${i}`} {svgCalcParams} />
  {/each}

  <!-- Food -->
  {#each frame.food as food, i}
    <SvgFood point={food} key={`${i}`} {svgCalcParams} />
  {/each}
</svg>

<style lang="postcss">
    /* Add a minimal drop shadow to food and snakes */
    :global(svg.gameboard .food, svg.gameboard .snake) {
        filter: drop-shadow(0.1em 0.1em 0.05em rgba(0, 0, 0, 0.3));
    }
</style>
