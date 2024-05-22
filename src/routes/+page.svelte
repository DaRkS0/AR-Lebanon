<script lang="ts">
  import { goto } from "$app/navigation";
  import * as lib from "$lib";
  import screenfull from "screenfull";
  async function Add(val: string) {
    lib.addCookie("Lang", val, 30);

    if (screenfull.isEnabled) {
      await screenfull.request();
    } else {
      //alert(`FullScreen Not Allowed!`);
    }
    goto("AR");
  }
</script>

<div class="flex flex-col items-center justify-center h-full w-full">
  <div class="flex h-fit gap-20">
    <div class="h-full flex flex-col items-center">
      <button class="transition-all active:scale-95" on:click={() => Add("AR")}>
        <img class=" h-10" src="/leb.png" alt="" />
      </button>
      <p>العربيه</p>
    </div>

    <div class="h-full flex flex-col items-center">
      <button class="transition-all active:scale-95" on:click={() => Add("EN")}>
        <img class="h-10" src="/us.png" alt="" />
      </button>
      <p>English</p>
    </div>
  </div>
</div>
