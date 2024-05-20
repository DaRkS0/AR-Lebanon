<script>
  import { onMount, createEventDispatcher, onDestroy } from "svelte";
  const dispatch = createEventDispatcher();
  //export let facingMode = "user";
  // export let PlayerID = "1";
  //export let deviceId =
  ("f27aae3efdc5e47f83007f7200fcf1703dc24ec424ac16d27efced1512195392");

  //export let audioDeviceId = "";

  //export let scale = 0.7;
  let imgurl = "";
  let VidHeight = 0;
  let VidWidth = 0;
  let FrameRate = 0;
  /**
   * @type HTMLCanvasElement
   */
  let camplayer;

  /**
   * @type HTMLCanvasElement
   */
  let canvas;

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

  /**
   * @type MediaStream
   */
  let audioStream;

  onDestroy(() => {
    // biome-ignore lint/complexity/noForEach: <explanation>
    stream?.getVideoTracks().forEach((t) => t.stop());
    // biome-ignore lint/complexity/noForEach: <explanation>
    audioStream?.getTracks().forEach((t) => t.stop());
  });

  onMount(async () => {
    BGImage = new Image();
    BGImage.crossOrigin = "anonymous";
    BGImage.src = "1.png";

    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: { ideal: "environment" },
        // focusDistance: { exact: 50.0 },
        // focusMode: { exact: ["manual"] },
        //   deviceId: { exact: deviceId },
        // deviceId:
        //   "e83df7deec167d1da8bacaa73c67901c6b68e9177cb3eb3429ab2dc5e80c0e28",
        //    width: {
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
        // width: { exact: 4032 }, //720
        // height: { min: 1280 }, //1280
        // frameRate: { ideal: 60, min: 24 },
        aspectRatio: { exact: 4 / 3 },
        //  aspectRatio: { exact: 16 / 9 },
        // advanced: [{ aspectRatio: { exact: 9 / 16 } }],
      },
    });
    console.log(stream);

    const track = stream.getVideoTracks()[0];
    const capabilities = track.getCapabilities();
    const Settings = track.getSettings();
    console.log({ capabilities, settings: Settings, track });
    VidHeight = Settings.height ?? 1920;
    VidWidth = Settings.width ?? 1080;
    canvas.width = VidWidth;
    canvas.height = VidHeight;
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
    StartCanvasProjection();
    // counter = `${Settings.height}/${Settings.width}`;
    // GrabFrame();
  });

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
        //DrawBottom(context);
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

        //DrawBottom(context);
      } catch (error) {}
    }
    setTimeout(GrabFrame, Math.floor(1000 / FrameRate));
  }

  /**
   *
   * @param {CanvasRenderingContext2D | null} context
   */
  function DrawBottom(context) {
    try {
      //const scale = 0.7;
      context?.drawImage(BGImage, 0, 0, canvas.width, canvas.height);
    } catch (error) {
      // console.log(error);
    }

    // context?.drawImage(
    //   vidCapture,
    //   0,
    //   camplayer.height / 2 - hRatio / 2,
    //   camplayer.width,
    //   hRatio
    // );

    //scaleToFit(BGImage, context);
    // context?.drawImage(
    //   BGImage,
    //   VidWidth - BGImage.width - 50,
    //   VidHeight - BGImage.height
    // );
    // context?.drawImage(BGImage2, 100, VidHeight - BGImage2.height - 50);
  }

  export let counting = false;

  function StartCanvasProjection() {
    const track = stream.getVideoTracks()[0];
    const Settings = track.getSettings();
    //console.log(Settings);
    const degrees = -90;
    canvas.width = Settings.height ?? 720;
    canvas.height = Settings.width ?? 1280;
    const context = canvas.getContext("2d");

    context?.save();
    // context?.translate(canvas.width / 2, canvas.height / 2);
    //context?.rotate((degrees * Math.PI) / 180);

    //context?.scale(-1, 1); //flip horizental

    context?.drawImage(vidCapture, 0, 0, canvas.width, canvas.height);
    context?.restore();
    context.globalAlpha = 0.4;
    DrawBottom(context);
    context?.restore();
    // imgurl = canva.toDataURL("image/png");

    // dispatch("frame", { url: imgurl });
    requestAnimationFrame(StartCanvasProjection);
  }

  // function StartCanvasProjection() {
  //   const track = stream.getVideoTracks()[0];
  //   const Settings = track.getSettings();
  //   const degrees = -90;
  //   canvas.width = Settings.height ?? 720;
  //   canvas.height = Settings.width ?? 1280;
  //   const context = canvas.getContext("2d");

  //   context?.save();
  //   context?.translate(canvas.width / 2, canvas.height / 2);
  //   context?.rotate((degrees * Math.PI) / 180);

  //   context?.scale(-1, 1); //flip horizental

  //   context?.drawImage(
  //     vidCapture,
  //     -vidCapture.width / 2,
  //     -vidCapture.height / 2
  //   );
  //   context?.restore();
  //   //DrawBottom(context);

  //   // imgurl = canva.toDataURL("image/png");

  //   // dispatch("frame", { url: imgurl });
  //   requestAnimationFrame(StartCanvasProjection);
  // }

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

        const track = stream.getVideoTracks()[0];
        const Settings = track.getSettings();
        const degrees = -90;
        camplayer.width = Settings.height ?? 720;
        camplayer.height = Settings.width ?? 1280;
        let context = camplayer.getContext("2d");

        context?.save();
        context?.translate(camplayer.width / 2, camplayer.height / 2);
        context?.rotate((degrees * Math.PI) / 180);

        // context?.translate(camplayer.width, 0);
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
        context?.drawImage(
          vidCapture,
          -vidCapture.width / 2,
          -vidCapture.height / 2
        );
        //  context?.drawImage(vidCapture, 0, 0, camplayer.width, camplayer.height);
        context?.restore();
        //DrawBottom(context);

        imgurl = camplayer.toDataURL("image/png");
        counting = false;
        counter = 6;
        //dispatch("success", { url: imgurl });
        camplayer.toBlob((b) => {
          if (Blob !== null) dispatch("success", { url: b, imgurl });
          else {
            dispatch("success", { imgurl });
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
  let overlay = false;
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video
  class="w-1 opacity-0 hidden"
  bind:this={vidCapture}
  on:play={() => (overlay = true)}
  autoplay
  playsinline
/>
<canvas
  class="mx-auto max-h-screen w-[100vw] aspect-[4/3]"
  bind:this={canvas}
/>
