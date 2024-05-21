<script lang="ts">
  import Webcam from "$lib/webcam.svelte";
  import screenfull from "screenfull";
  import { onMount } from "svelte";
  let loaded = true;
  let webcamer: Webcam;
  let showbtn = true;

  onMount(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(() => {
        loaded = true;
      });
    }
  });

  function requestFullscreen(element: HTMLElement) {
    if (element.requestFullscreen) {
      element.requestFullscreen({ navigationUI: "hide" }).catch((err) => {
        alert(
          `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
        );
      });
    } else if (element.mozRequestFullScreen) {
      // Firefox
      element.mozRequestFullScreen({ navigationUI: "hide" }).catch((err) => {
        alert(
          `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
        );
      });
    } else if (element.webkitRequestFullscreen) {
      // Chrome, Safari, Opera
      element.webkitRequestFullscreen({ navigationUI: "hide" }).catch((err) => {
        alert(
          `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
        );
      });
    } else if (element.msRequestFullscreen) {
      // IE/Edge
      element.msRequestFullscreen({ navigationUI: "hide" }).catch((err) => {
        alert(
          `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
        );
      });
    }
  }
</script>

{#if loaded}
  <div class="absolute top-[5vh] right-[2vw] flex flex-col gap-1 z-20">
    <div class="flex gap-4">
      <button><img class="max-w-2" src="/left.png" alt="" /></button>
      <button><img class="max-w-2" src="/right.png" alt="" /></button>
    </div>
    <button on:click={webcamer.StartAnimations}
      ><img class="max-w-4" src="/reset.png" alt="" /></button
    >
  </div>
  <div
    class:hidden={!showbtn}
    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
  >
    <button
      class="bg-red-600 text-white p-4 font-bold text-xl"
      on:click={() => {
        requestFullscreen(document.body);
        showbtn = false;
      }}>FullScreen</button
    >
  </div>
  <Webcam bind:this={webcamer} />
{:else}
  <p class="mx-auto my-auto text-3xl">Loading....</p>
{/if}
