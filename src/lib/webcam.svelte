<script lang="ts">
  import { onMount } from "svelte";

  const files = [
    "/AR/1a - history_AR.png",
    "/AR/1b - history_AR.png",
    "/AR/1c - history_AR.png",
    "/AR/1d - history_AR.png",
    "/AR/1e - history_AR.png",
    "/AR/1f - history_AR.png",
    "/AR/1g - history_AR.png",
    "/AR/1h - history_AR.png",
    "/AR/1i - history_AR.png",
  ];
  let vidCapture: HTMLVideoElement;
  let BGImage: HTMLImageElement;
  let stream: MediaStream;
  let canvas: HTMLCanvasElement;
  let overlay = false;
  const aspect = 4 / 3;
  let overlaycanvas: HTMLCanvasElement;
  let loadedAny = false;
  async function StartWebcam() {
    overlaycanvas = document.createElement("canvas");
    BGImage = new Image();
    BGImage.crossOrigin = "anonymous";
    BGImage.src = "1.png";

    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: { ideal: "environment" },
        aspectRatio: { exact: aspect },
        frameRate: { min: 24 },
      },
    });
    if (stream) {
      vidCapture.srcObject = stream;

      const track = stream.getVideoTracks()[0];
      const Settings = track.getSettings();
      console.log({ track, Settings });
      const { height, width } = Settings;
      if (height && width) {
        canvas.width = height;
        canvas.height = width;
        overlaycanvas.width = width;
        overlaycanvas.height = height;
      }
      requestAnimationFrame(StartCanvasProjection);
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

  let fidx = 0;

  let animating = false;
  function AnimateNextImage() {
    const NImage = new Image();
    NImage.crossOrigin = "anonymous";
    NImage.src = files[fidx];
    NImage.onload = (e) => {
      overlaycanvas
        .getContext("2d")
        ?.clearRect(0, 0, overlaycanvas.width, overlaycanvas.height);

      overlaycanvas
        .getContext("2d")
        ?.drawImage(NImage, 0, 0, overlaycanvas.width, overlaycanvas.height);
      loadedAny = true;
      fidx++;
      if (fidx < files.length - 1) {
        setTimeout(AnimateNextImage, 450);
      }
    };
  }
  export function StartAnimations() {
    if (fidx === files.length - 1) {
      fidx = 0;
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
    <canvas class=" h-full w-full" bind:this={canvas} />
  </div>
</div>
