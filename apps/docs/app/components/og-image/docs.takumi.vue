<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <div
    style="
      width:1200px;
      height:630px;
      background:#0f0e0d;
      position:relative;
      overflow:hidden;
      display:flex;
      flex-direction:column;
      font-family:'Geist',sans-serif;
    "
  >

    <!-- grid -->
    <div
      style="
        position:absolute;
        inset:0;
        background-image:repeating-linear-gradient(0deg,transparent,transparent 62px,rgba(168,233,196,0.04) 62px,rgba(168,233,196,0.04) 63px),repeating-linear-gradient(90deg,transparent,transparent 85px,rgba(168,233,196,0.04) 85px,rgba(168,233,196,0.04) 86px);
      "
    />

    <!-- atmospheric glow -->
    <div
      class="absolute inset-0"
      :style="`
        background:
          radial-gradient(ellipse 75% 55% at 50% -5%, #1a9e5e, transparent 70%),
          radial-gradient(ellipse 50% 35% at 80% 110%, #137e4a, transparent 65%);
        opacity: 0.13;
      `"
    />

    <!-- corner accents -->
    <div
      style="
        position:absolute;
        top:40px;
        left:40px;
        width:20px;
        height:20px;
        border-top:1px solid rgba(52,190,122,0.4);
        border-left:1px solid rgba(52,190,122,0.4);
      "
    />
    <div
      style="
        position:absolute;
        top:40px;
        right:40px;
        width:20px;
        height:20px;
        border-top:1px solid rgba(52,190,122,0.4);
        border-right:1px solid rgba(52,190,122,0.4);
      "
    />
    <div
      style="
        position:absolute;
        bottom:40px;
        left:40px;
        width:20px;
        height:20px;
        border-bottom:1px solid rgba(52,190,122,0.4);
        border-left:1px solid rgba(52,190,122,0.4);
      "
    />
    <div
      style="
        position:absolute;
        bottom:40px;
        right:40px;
        width:20px;
        height:20px;
        border-bottom:1px solid rgba(52,190,122,0.4);
        border-right:1px solid rgba(52,190,122,0.4);
      "
    />

    <!-- logo bottom-right -->
    <div
      class="absolute -right-[20px] -bottom-[40px] opacity-25"
    >
      <AppLogoFade />
    </div>

    <!-- content -->
    <div
      style="
        position:relative;
        display:flex;
        flex-direction:column;
        padding:72px 80px 64px 80px;
        height:100%;
        max-width:660px;
      "
      class="gap-12"
    >

      <p
        style="font-family:'Geist Mono',monospace;"
        class="
          relative mt-4 max-w-4xl overflow-hidden text-lg/tight tracking-tight
          text-forest-500
        "
      >
        DOCS
      </p>

      <div
        class="
          relative flex max-w-4xl flex-col gap-4 overflow-hidden tracking-tight
        "
      >
        <span
          class="inline-block text-[2.5rem]/tight text-forest-500"
        >
          {{ title }}
        </span>

        <span
          class="inline-block text-lg/tight text-neutral-200"
        >
          {{ description }}
        </span>
      </div>

    </div>

  </div>
</template>

