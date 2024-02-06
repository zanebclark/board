<script lang="ts">
  import type { Frame, Snake } from "$lib/playback/types";
  import type { SvgCalcParams } from "$lib/svg";

  import SvgSnakeTail from "./SvgSnakeTail.svelte";
  import SvgSnakeHead from "./SvgSnakeHead.svelte";
  import SvgSnakeBody from "./SvgSnakeBody.svelte";

  export let snake_id: string;
  export let frame: Frame;
  export let isHighlighted: boolean = false;

  function get_snakes(a_frame: Frame, an_opacity: number): Map<Snake, number> {
    let snake: Snake | undefined = a_frame.snakes.get(snake_id);
    if (snake === undefined) {
      return new Map();
    }
    let snakes: Map<Snake, number> = new Map([[snake, an_opacity]]);
    if (!isHighlighted || a_frame.descendents === undefined || a_frame.turn >= frame.turn + 4) {
      return snakes;
    }

    a_frame.descendents.map((d_frame) => {
      snakes = new Map([...snakes.entries(), ...get_snakes(d_frame, an_opacity - .2).entries()]);
    });


    return snakes;
  }

  export let opacity = 1.0;

  let snakes: Map<Snake, number> = get_snakes(frame, opacity);

  export let svgCalcParams: SvgCalcParams;


</script>
{#each [...snakes].reverse() as [snake, opacity]}
  <g id={`snake-${snake_id}`} class="snake" style:opacity>
    <SvgSnakeTail {svgCalcParams} {snake} />
    <SvgSnakeBody {svgCalcParams} {snake} />
    <SvgSnakeHead {svgCalcParams} {snake} />
  </g>
{/each}