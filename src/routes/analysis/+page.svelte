<script lang="ts">
  import { onMount } from "svelte";

  import { beforeNavigate, goto } from "$app/navigation";

  import { keybind } from "$lib/actions/keybind";
  import { resize } from "$lib/actions/resize";
  import { initWindowMessages, sendResizeMessage } from "$lib/playback/messages";
  import { playbackError, playbackState } from "$lib/playback/stores";

  import TooltipTemplateHotkeys from "$lib/components/TooltipTemplateHotkeys.svelte";
  import TooltipTemplateSettings from "$lib/components/TooltipTemplateSettings.svelte";
  import Frame from "$lib/components/Frame.svelte";

  import { getDefaultSettings, loadSettingsWithURLOverrides } from "$lib/settings/stores";
  import { setTheme } from "$lib/theme";

  const helpTooltipOptions = {
    templateId: "hotkeysTooltip",
    tippyProps: {
      arrow: false,
      placement: "top-start"
    }
  };

  const settingsTooltipOptions = {
    templateId: "settingsTooltip",
    tippyProps: {
      arrow: false,
      placement: "top-end"
    }
  };

  beforeNavigate(async () => {
    playbackState.reset();
  });

  function navigateToSettings() {
    goto("/settings");
  }

  function onResize(width: number, height: number) {
    sendResizeMessage(width, height);
  }

  let settings = getDefaultSettings();
  let settingError = true;

  onMount(() => {
    const url = new URL(window.location.href);
    settings = loadSettingsWithURLOverrides(url);

    setTheme(settings.theme);

    if (settings.game.length > 0 && settings.engine.length > 0) {
      settingError = false;
      playbackState.load();
      initWindowMessages();
    }
  });
</script>

<svelte:window
  use:keybind={{ keys: [","], f: navigateToSettings }}
/>
<div use:resize={{ f: onResize }} class="h-full w-full flex flex-row items-center justify-center">
  {#if settingError}
    <p class="p-4 font-bold text-lg text-center">
      To display a game you need to specify the ID in the URL.
    </p>
    <p class="italic">
      {`https://board.battlesnake.com?game=<GAME_ID>`}
    </p>
  {:else if $playbackError}
    <p class="p-4 font-bold text-lg text-center text-red-500">
      {$playbackError}
    </p>
  {:else if $playbackState}
    <TooltipTemplateHotkeys id={helpTooltipOptions.templateId} />
    <TooltipTemplateSettings id={settingsTooltipOptions.templateId} {settings} />
    <Frame showScoreboard={settings.showScoreboard}
           showCoordinates={settings.showCoords}
           frame={$playbackState.frame}
           visible={true}/>
  {:else}
    <p class="p-4 text-lg text-center">Loading game...</p>
  {/if}
</div>
