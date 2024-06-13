<script lang="ts">
  import Main from "$lib/main.svelte";
  import { onMount } from "svelte";
  import screenfull from "screenfull";

  let wakeLock: WakeLockSentinel;
  // Function to request a wake lock
  const requestWakeLock = async () => {
    try {
      wakeLock = await navigator.wakeLock.request("screen");
      console.log("Wake lock is active");

      if (screenfull.isEnabled && !screenfull.isFullscreen) {
        await screenfull.request();
      }
    } catch (err) {
      console.log(err);
    }
  };
  onMount(() => {
    // Check if the Wake Lock API is supported
    if ("wakeLock" in navigator) {
      // Request a wake lock on page load
      requestWakeLock();

      // Re-request a wake lock if it is released (e.g., if the user switches tabs)
      document.addEventListener("visibilitychange", async () => {
        if (wakeLock !== null && document.visibilityState === "visible") {
          requestWakeLock();
        }
      });
    } else {
      console.log("Wake Lock API not supported");
    }
  });
</script>

<Main />
