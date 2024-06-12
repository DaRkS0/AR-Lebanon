<script lang="ts">
  import { goto } from "$app/navigation";
  import * as lib from "$lib";
  import screenfull from "screenfull";
  let showMenu = false;
  let lang = -1;
  let locations = [
    "AR",
    "https://publicworksstudio.com/en/how-to-protect-residents-of-the-neighborhoods-affected-by-the-beirut-port-explosion/",
    "",
  ];
  const menuEN = ["AR experience", "legal agenda", "publicworks"];
  const menuAR = ["تجربة الواقع الافتراضى", "legal agenda", "publicworks"];
  const menu = [menuEN, menuAR];
  async function Add(val: string) {
    lib.addCookie("Lang", val, 30);
    lang = val === "AR" ? 1 : 0;
    if (screenfull.isEnabled) {
      await screenfull.request();
    } else {
      //alert(`FullScreen Not Allowed!`);
    }
    showMenu = true;
    //goto("AR");
  }
</script>

<div class="flex flex-col items-center justify-center h-full w-full">
  <div class="flex h-fit gap-20">
    {#if !showMenu}
      <div class="h-full flex flex-col items-center">
        <button
          class="transition-all active:scale-95"
          on:click={() => Add("AR")}
        >
          <!-- <img class=" h-10" src="/leb.png" alt="" /> -->
          <p>العربيه</p>
        </button>
        <!-- <p>العربيه</p> -->
      </div>

      <div class="h-full flex flex-col items-center">
        <button
          class="transition-all active:scale-95"
          on:click={() => Add("EN")}
        >
          <!-- <img class="h-10" src="/us.png" alt="" /> -->
          <p>English</p>
        </button>
        <!-- <p>English</p> -->
      </div>
    {:else}
      {#each menu[lang] as t, idx}
        <a href={locations[idx]} target={idx > 0 ? "_blank" : "_self"}>{t}</a>
      {/each}
    {/if}
  </div>
</div>
