<script lang="ts">
  import Gameboard from "$lib/components/Gameboard.svelte";
  import Scoreboard from "$lib/components/Scoreboard.svelte";
  import type { Frame } from "$lib/playback/types";

  export let showScoreboard: boolean;
  export let showCoordinates: boolean;
  export let frame: Frame;
  let highlightedSnakeID: string | null = null;
  export let visible = false;
</script>

<div class="items-center justify-center">
  <label>
    <input type="checkbox" bind:checked={visible} />
    Render
  </label>
  {#if visible}
  <div class="frame-div items-center justify-center" style="flex-direction: column;">
    {#if showScoreboard}
      <div class="basis-[45%] order-second p-2" style="width: 300px">
        <Scoreboard bind:frame bind:highlightedSnakeID />
      </div>
    {/if}
    <div class="flex flex-col grow" style="width: 300px">
      <Gameboard bind:showCoordinates bind:frame bind:highlightedSnakeID />
    </div>
    {#if frame.descendents && frame.descendents?.length !== 0}
      <div class="flex flex-row grow" style="background:#f1f1f1">
        {#each frame.descendents || [] as descendent}
          <svelte:self showScoreboard
                       showCoordinates
                       frame={descendent} />
        {/each}
      </div>
    {/if}
  </div>
  {/if}
</div>

<style>
    .frame-div {
        display: flex;
        width: fit-content;
        height: fit-content;
        border: 4px solid gray;
        margin: 2px;
        padding: 2px;
        background: #f1f1f1;
        justify-content: center;
    }
</style>