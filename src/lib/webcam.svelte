<script>
  import { onMount, createEventDispatcher, onDestroy } from "svelte";
  const dispatch = createEventDispatcher();
  export let facingMode = "environment";
  let imgurl = "";
  let VidHeight = 0;
  let VidWidth = 0;
  let FrameRate = 0;
  /**
   * @type HTMLCanvasElement
   */
  let camplayer;

  /**
   * @type ImageCapture
   */
  let imageCapture;

  /**
   * @type HTMLVideoElement
   */
  let vidCapture;

  export let counter = 6;

  /**
   * @type HTMLImageElement
   */
  let BGImage;

  /**
   * @type MediaStream
   */
  let stream;

  onDestroy(() => {
    stream?.getVideoTracks().forEach((t) => t.stop());
  });
  onMount(async () => {
    BGImage = new Image();
    BGImage.crossOrigin = "anonymous";
    //BGImage.src = "/img/photoframe-2.png";

    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode,
        // width: {
        //   // min: BGImage.width / 2,
        //   // exact: BGImage.width,
        //   ideal: BGImage.width,
        // },
        // height: {
        //   // min: BGImage.height / 2,
        //   // exact: BGImage.height,
        //   ideal: BGImage.height,
        // },
        // width: { min: 720, ideal: BGImage.width }, //720
        // height: { min: 1280, ideal: BGImage.height }, //1280
        frameRate: { ideal: 60, min: 24 },
        aspectRatio: { exact: 16 / 9 },
        // advanced: [{ aspectRatio: { exact: 9 / 16 } }],
      },
    });

    const track = stream.getVideoTracks()[0];
    const Settings = track.getSettings();
    VidHeight = Settings.height ?? 1920;
    VidWidth = Settings.width ?? 1080;
    // VidHeight = 1920;
    // VidWidth = 1080;
    FrameRate = Settings.frameRate ?? 30;
    // stream.getVideoTracks().forEach((t) => {
    //   if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    //     t.applyConstraints({
    //       focusMode: "continuous",
    //       // width: 1080,
    //       // height: 1920,
    //       // aspectRatio: 9 / 16,
    //       width: 1920,
    //       height: 1080,
    //       //  aspectRatio: 9 / 16,
    //       // aspectRatio: { exact: 9 / 16 },
    //     }).catch(console.log);
    //   } else {
    //     t.applyConstraints({
    //       focusMode: "continuous",
    //       width: 1080,
    //       height: 1920,
    //       // aspectRatio: 9 / 16,
    //       // width: 1920,
    //       // height: 1080,
    //       //  aspectRatio: 9 / 16,
    //       // aspectRatio: { exact: 9 / 16 },
    //     }).catch(console.log);
    //   }
    // });
    // await track
    //   .applyConstraints({
    //     focusMode: "continuous",
    //     width: 720,
    //     height: 1280,
    //     // aspectRatio: { exact: 9 / 16 },
    //   })
    //   .catch(console.log);

    vidCapture.width = VidWidth;
    vidCapture.height = VidHeight;
    vidCapture.srcObject = stream;
    // counter = `${Settings.height}/${Settings.width}`;
    // GrabFrame();
  });

  /**
   *
   * @param {HTMLImageElement} img
   * @param {CanvasRenderingContext2D} ctx
   */
  function drawImageScaled(img, ctx) {
    let canvas = ctx.canvas;
    let hRatio = canvas.width / img.width;
    let vRatio = canvas.height / img.height;
    let ratio = Math.min(hRatio, vRatio);
    let centerShift_x = (canvas.width - img.width * ratio) / 2;
    let centerShift_y = (canvas.height - img.height * ratio) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShift_x,
      centerShift_y,
      img.width * ratio,
      img.height * ratio
    );
  }
  /**
   *
   * @param {HTMLImageElement} img
   * @param {CanvasRenderingContext2D | null} ctx
   */
  function scaleToFit(img, ctx) {
    let canvas = ctx?.canvas;
    if (canvas) {
      // get the scale
      let scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
      );
      // get the top left position of the image
      let x = canvas.width / 2 - (img.width / 2) * scale;
      let y = canvas.height / 2 - (img.height / 2) * scale;
      ctx?.drawImage(img, x, y, img.width * scale, img.height * scale);
    }
  }
  /**
   *
   * @param {CanvasImageSource} img
   * @param {number} width
   * @param {number} height
   * @param {CanvasRenderingContext2D | null} ctx
   */
  function scaleToFitFlipped(img, width, height, ctx) {
    let canvas = ctx?.canvas;
    if (canvas) {
      // get the scale
      let scale = Math.min(canvas.width / width, canvas.height / height);
      // get the top left position of the image
      let x = canvas.width / 2 - (width / 2) * scale;
      let y = canvas.height / 2 - (height / 2) * scale;
      ctx?.drawImage(img, x * -1, y, width * scale * -1, height * scale);
    }
  }
  async function GrabFrameApi() {
    try {
      const photo = await imageCapture.grabFrame();
      if (photo !== null && photo.width !== null) {
        camplayer.width = BGImage.width;
        camplayer.height = BGImage.height;
        let context = camplayer.getContext("2d");
        //   context?.clearRect(0, 0, VidWidth, VidHeight);
        context?.save();
        context?.scale(-1, 1); //flip horizental
        context?.drawImage(
          photo,
          photo.width * -1,
          0,
          camplayer.width,
          camplayer.height
        );

        // scaleToFitFlipped(photo, photo.width, photo.height, context);
        //context?.drawImage(photo, 0, 0);
        context?.restore();
        DrawBottom(context);
      }
    } catch (error) {}
  }
  async function GrabFrame() {
    if (imageCapture !== undefined) {
      GrabFrameApi();
    } else {
      try {
        camplayer.width = VidHeight;
        camplayer.height = VidWidth;
        let context = camplayer.getContext("2d");

        context?.save();
        context?.scale(-1, 1); //flip horizental
        scaleToFitFlipped(
          vidCapture,
          vidCapture.width,
          vidCapture.height,
          context
        );
        // context?.drawImage(
        //   vidCapture,
        //   vidCapture.width * -1,
        //   0,
        //   camplayer.width,
        //   camplayer.height
        // );
        context?.restore();

        // context?.drawImage(vidCapture, 0, 0, camplayer.width, camplayer.height);

        DrawBottom(context);
      } catch (error) {}
    }
    setTimeout(GrabFrame, Math.floor(1000 / FrameRate));
  }

  /**
   *
   * @param {CanvasRenderingContext2D | null} context
   */
  function DrawBottom(context) {
    //scaleToFit(BGImage, context);
    // context?.drawImage(
    //   BGImage,
    //   VidWidth - BGImage.width - 50,
    //   VidHeight - BGImage.height
    // );
    // context?.drawImage(BGImage2, 100, VidHeight - BGImage2.height - 50);
  }

  export let counting = false;
  export async function startCounter() {
    if (counter - 1 !== 0) {
      if (!counting) {
        counting = true;
        imgurl = "";
      }
      counter--;
      setTimeout(startCounter, 1000);
    } else {
      try {
        camplayer = document.createElement("canvas");
        camplayer.width = 1080;
        camplayer.height = 1920;
        let context = camplayer.getContext("2d");

        context?.save();
        context?.translate(camplayer.width, 0);
        context?.scale(-1, 1); //flip horizental
        // scaleToFitFlipped(
        //   vidCapture,
        //   vidCapture.width,
        //   vidCapture.height,
        //   context
        // );
        // context?.drawImage(
        //   vidCapture,
        //   vidCapture.width * -1,
        //   0,
        //   camplayer.width,
        //   camplayer.height
        // );

        // context?.drawImage(vidCapture, 0, 0, camplayer.width, camplayer.height);

        //scaleToFit(vidCapture, context);

        // context?.drawImage(vidCapture, 0, 0, camplayer.width, camplayer.height);

        //https://stackoverflow.com/questions/31778559/how-do-i-proportionally-resize-a-video-in-canvas

        //https://stackoverflow.com/questions/16317971/draw-images-on-in-the-middle-of-a-canvas

        const hRatio =
          (camplayer.width / vidCapture.videoWidth) * vidCapture.videoHeight;
        //context?.drawImage(vidCapture, 0, 0, camplayer.width, hRatio);
        // context?.drawImage(
        //   vidCapture,
        //   0,
        //   camplayer.height / 2 - hRatio / 2,
        //   camplayer.width,
        //   hRatio
        // );

        context?.drawImage(vidCapture, 0, 0, camplayer.width, camplayer.height);
        context?.restore();
        DrawBottom(context);

        imgurl = camplayer.toDataURL("image/png");
        counting = false;
        counter = 6;
        dispatch("success", { url: imgurl });
      } catch (error) {
        console.log(error);
      }
    }
  }
  let overlay = false;
</script>

<div class="w-full h-full flex relative">
  <!-- svelte-ignore a11y-media-has-caption -->
  <video
    class:hidden={imgurl.length > 0}
    class="w-full object-contain px-4 -scale-x-100"
    bind:this={vidCapture}
    on:play={() => (overlay = true)}
    autoplay
    playsinline
  />
  <div
    class:hidden={!overlay || imgurl.length > 0}
    class="absolute inset-0 z-10"
  >
    <!-- <img class="h-full w-full" src="/img/photoframe-2.png" alt="" /> -->
  </div>
  <!-- <img
    class:hidden={imgurl.length <= 0}
    class="w-full aspect-video object-contain px-4"
    src={imgurl}
    alt="hap"
  /> -->
</div>
