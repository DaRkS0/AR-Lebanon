<script lang="ts">
  import { goto } from "$app/navigation";
  import * as lib from "$lib";
  import screenfull from "screenfull";
  let showMenu = false;
  let lang = -1;
  $: locations = [
    `AR`,
    ["https://on4august.com/", "https://on4august.com/ar/"],
    [
      "https://publicworksstudio.com/en/homelessness-in-the-wake-of-the-disaster/",
      "https://publicworksstudio.com/homelessness-in-the-wake-of-the-disaster/",
    ],
  ];

  const menuEN = [
    "History of the Grain Silos (an AR experience)",
    "Victims of the Blast",
    "Homelessness in the Wake of the Disaster",
  ];
  const menuAR = [
    'تاريخ الاهراءات (تجربة  الواقع المعزز "AR")',
    "ضحايا الانفجار",
    "التشرّد بعد الفاجعة",
  ];
  const menu = [menuEN, menuAR];
  $: lano = "AR";
  async function Add(val: string) {
    lano = val;
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
  <div class="flex h-fit gap-20 max-w-[90%]">
    {#if !showMenu}
      <div class="h-full flex flex-col items-center">
        <button
          class="transition-all active:scale-95"
          on:click={() => Add("AR")}
        >
          <!-- <img class=" h-10" src="/leb.png" alt="" /> -->
          <p dir={lano === "AR" ? "rtl" : "ltr"}>العربيه</p>
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
      <div class="flex flex-col gap-6 text-center sm:!flex-row">
        {#each menu[lang] as t, idx}
          {#if idx === 0}
            <a href={`${locations[idx]}/${lano}`}>{t}</a>
          {:else}
            <a
              href={locations[idx][lano === "AR" ? 1 : 0]}
              target={idx > 0 ? "_blank" : "_self"}>{t}</a
            >
          {/if}
        {/each}
      </div>
    {/if}
  </div>
</div>
