<script lang="ts">
  export let id: string;
</script>

<template {id}>
  <div class="grid grid-cols-2 gap-x-2 gap-y-1 p-2">
    <p class="font-bold col-span-2 mb-2">Keyboard Shortcuts</p>
    <p>Settings</p>
    <p class="text-right">
      <span class="hotkey">,</span>
    </p>
  </div>
</template>

<style lang="postcss">
  .hotkey {
    @apply px-2 rounded bg-pink-800/50;
    border: 1px solid #888;
  }
</style>
