<script lang="ts">
  import WebcamSlider from "$lib/slides.svelte";
  import { onMount } from "svelte";

  let isPortrait = true;
  onMount(() => {
    isPortrait = window.screen.orientation.type.includes("portrait");
    window.screen.orientation.onchange = (e) => {
      isPortrait = window.screen.orientation.type.includes("portrait");
      // console.log({ data: window.screen.orientation, isPortrait });
    };
  });
</script>

<div class="h-full w-full flex">
  <div
    class:hidden={!isPortrait}
    class="h-full w-full flex items-center justify-center"
  >
    <img class="w-[50vw]" src="/rotatescreen.gif" alt="" />
  </div>

  <div class:hidden={isPortrait} class="h-full w-full">
    <WebcamSlider />
  </div>
</div>
