<script lang="ts">
  import { onMount } from "svelte";
  const counts = [9, 6, 2, 17, 1, 1, 1];
  const timeTable = [450, 650, 650, 450, 450, 450, 450];
  export let Lang = "AR";
  export let Group = 1;
  export let GroupIdx = 1;
  export let animating = false;

  const url = "https://fra1.digitaloceanspaces.com/ekaterra-test/Lebanon";

  let vidCapture: HTMLVideoElement;
  let BGImage: HTMLImageElement;
  let stream: MediaStream;
  let canvas: HTMLCanvasElement;
  let overlay = false;
  const aspect = 4 / 3;
  let overlaycanvas: HTMLCanvasElement;
  let loadedAny = false;
  let src = "";
  async function StartWebcam() {
    overlaycanvas = document.createElement("canvas");
    BGImage = new Image();
    BGImage.crossOrigin = "anonymous";
    BGImage.src = `${url}/${Lang}/0.png`;
    src = `${url}/${Lang}/0.png`;
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: { ideal: "environment" },
        aspectRatio: { exact: innerWidth / innerHeight },
        frameRate: { min: 24 },
      },
    });
    if (stream) {
      vidCapture.srcObject = stream;

      const track = stream.getVideoTracks()[0];
      const Settings = track.getSettings();
      //console.log({ track, Settings });
      const { height, width } = Settings;
      if (height && width) {
        canvas.width = height;
        canvas.height = width;
        overlaycanvas.width = width;
        overlaycanvas.height = height;
        overlaycanvas.getContext("2d")?.drawImage(BGImage, 0, 0, width, height);
      }
      //requestAnimationFrame(StartCanvasProjection);
    }
  }

  function StartCanvasProjection() {
    try {
      const context = canvas.getContext("2d");
      if (context) {
        context?.clearRect(0, 0, canvas.width, canvas.height);
        context?.drawImage(overlaycanvas, 0, 0, canvas.width, canvas.height);
        // context.globalAlpha = 0.5;
        // context.fillStyle = "red"; // Using a named color
        // //console.log("filling");
        // context?.fillRect(0, 0, canvas.width, canvas.height);
        // // context?.drawImage(vidCapture, 0, 0, canvas.width, canvas.height);
      }
    } catch (error) {}
    requestAnimationFrame(StartCanvasProjection);
  }

  onMount(StartWebcam);

  function DrawImg(NImage: HTMLImageElement, autoplay: boolean) {
    loadedAny = true;
    if (autoplay) {
      if (GroupIdx < counts[Group - 1]) {
        setTimeout(AnimateNextImage, timeTable[Group - 1]);
        GroupIdx = GroupIdx + 1;
      } else animating = false;
    }
  }

  export function AnimateNextImage(autoplay = true) {
    const NImage = new Image();
    NImage.crossOrigin = "anonymous";
    NImage.src = `${url}/${Lang}/${Group}/${GroupIdx}.png`;
    src = `${url}/${Lang}/${Group}/${GroupIdx}.png`;
    NImage.onload = () => DrawImg(NImage, autoplay);
  }
  export function StartAnimations() {
    if (GroupIdx >= counts[Group - 1]) {
      GroupIdx = 1;
      animating = false;
    }
    if (animating) return;
    animating = true;
    AnimateNextImage();
  }
</script>

<div class="h-full w-full relative">
  <!-- svelte-ignore a11y-media-has-caption -->
  <video
    class="h-full w-full object-fill"
    bind:this={vidCapture}
    on:play={() => (overlay = true)}
    autoplay
    playsinline
  />
  <div class="absolute top-0 inset-0 h-full w-full bg-transparent z-10">
    <!-- <canvas class="h-full w-full" bind:this={canvas} /> -->
    <img class="object-cover max-h-full mx-auto" {src} alt="" />
  </div>
</div>
