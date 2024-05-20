<script lang="ts">
  import Webcam from "$lib/webcam.svelte";
  import screenfull from "screenfull";

  import { onMount } from "svelte";
  import { dev } from "$app/environment";
  let showbtn = true;
  let webcamer: Webcam;
  let loaded = false;
  onMount(() => {
    if ("serviceWorker" in navigator) {
      // navigator.serviceWorker.register("/service-worker.js", {
      //   type: dev ? "module" : "classic",
      // });
      // Wait until the service worker is ready
      navigator.serviceWorker.ready.then(() => {
        loaded = true;
        console.log("Loaded All Data");
      });
    }
  });
</script>

<div class="h-full w-full flex">
  {#if loaded}
    <div class="absolute top-[5vh] right-[2vw] flex flex-col gap-1">
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
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <button
        class="bg-red-600 text-white p-4 font-bold text-xl"
        on:click={() => {
          showbtn = false;
          if (screenfull.isEnabled) {
            screenfull.request(undefined, { navigationUI: "hide" });
          }
        }}>FullScreen</button
      >
    </div>
    <Webcam bind:this={webcamer} />
  {:else}
    <p class="mx-auto my-auto text-3xl">Loading....</p>
  {/if}
</div>
