<script lang="ts">
  import { showCoords, theme } from "$lib/settings/stores";

  function navigateBack(e: MouseEvent) {
    e.preventDefault();

    history.back();
  }
</script>

<div class="p-4 max-w-2xl mx-auto">
  <h1 class="text-2xl font-bold">Settings</h1>
  <hr class="mb-4" />

  <div class="mb-4">
    <label class="block">
      <p class="font-bold">Theme</p>
      <select class="w-full" bind:value={$theme}>
        <option value={"system"}>Use System Preference</option>
        <option value={"light"}>Light</option>
        <option value={"dark"}>Dark</option>
      </select>
    </label>
  </div>

  <div class="mb-4">
    <label class="inline-flex items-center">
      <input type="checkbox" bind:checked={$showCoords} />
      <span class="font-bold mx-2">Board Coordinates</span>
    </label>
    <p class="text-sm">Show coordinate labels on the game board.</p>
  </div>

  <p><a on:click={navigateBack} href="/">Back</a></p>
</div>
