<script lang="ts">
  import * as lib from "$lib";
  import Webcam from "$lib/webcam.svelte";
  import screenfull from "screenfull";
  import { onMount } from "svelte";
  let loaded = false;
  let webcamer: Webcam;
  let showbtn = true;
  const counts = [9, 6, 2, 17, 3];
  let Lang = "AR";
  let Group = 1;
  let GroupIdx = 1;
  let animating = false;
  let progress = "";
  onMount(() => {
    Lang = lib.getCookie("Lang");

    if ("serviceWorker" in navigator) {
      // navigator.serviceWorker.register("/service-worker.js", {
      //   type: "module",
      // });
      navigator.serviceWorker.addEventListener("message", (event) => {
        //console.log(event);

        if (event.data.type === "progress") {
          progress = event.data.progress + "%";
          // Update progress bar or display progress in UI
          // console.log("Client Progress:", event.data.progress + "%");
        }
      });

      navigator.serviceWorker.ready.then(async () => {
        loaded = true;
      });
    }
  });
  $: CheckSlide(GroupIdx);
  let next = false;
  function CheckSlide(idx: number) {
    next = GroupIdx >= counts[Group - 1];
  }
  function NextSlide() {
    if (animating) return;
    if (GroupIdx < counts[Group - 1]) {
      GroupIdx = GroupIdx + 1;
      webcamer.AnimateNextImage(false);
    }
  }
  function PrevSlide() {
    if (animating) return;
    if (GroupIdx > 1) {
      GroupIdx = GroupIdx - 1;
      webcamer.AnimateNextImage(false);
    }
  }
</script>

{#if loaded}
  <div class="absolute top-[5vh] right-[2vw] flex flex-col gap-4 z-20">
    <div class="flex gap-4">
      <button on:click={PrevSlide}
        ><img class="max-w-2" src="/left.png" alt="" /></button
      >
      <button on:click={NextSlide}
        ><img class="max-w-2" src="/right.png" alt="" /></button
      >
    </div>
    <button on:click={webcamer.StartAnimations}
      ><img class="max-w-4" src="/reset.png" alt="" /></button
    >
  </div>
  <div
    class:hidden={!showbtn || screenfull.isFullscreen}
    class="absolute right-4 bottom-4 z-20"
  >
    <button
      class="bg-red-600 text-white p-2 font-bold text-lg rounded-xl"
      on:click={async () => {
        if (screenfull.isEnabled) {
          await screenfull.request();
          showbtn = false;
        } else {
          alert(`ScreenFUll not working ${screenfull}`);
          showbtn = false;
        }
      }}>FullScreen</button
    >
  </div>

  <div class:hidden={!next || Group >= 5} class="absolute left-4 bottom-4 z-20">
    <button
      class="bg-red-600 text-white p-2 font-bold text-lg rounded-xl"
      on:click={async () => {
        next = false;
        Group++;
        GroupIdx = 0;
        webcamer.StartAnimations();
      }}>{Lang === "AR" ? "التالي" : "Next"}</button
    >
  </div>
  <Webcam
    bind:this={webcamer}
    bind:Lang
    bind:Group
    bind:GroupIdx
    bind:animating
  />
{:else}
  <div class="h-full w-full flex flex-col gap-4 items-center justify-center">
    <p class="mx-auto my-auto text-3xl">Loading....</p>
    <p class="mx-auto my-auto text-lg">{progress}</p>
  </div>
{/if}
