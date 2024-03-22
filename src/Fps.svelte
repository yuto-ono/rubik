<script lang="ts">
  import { cubeManager } from "./stores"

  let fps = 0

  $: $cubeManager?.subscribeFps((_fps) => {
    fps = _fps
  })
</script>

<p class="fps">{fps.toFixed(2)}fps</p>

<style lang="scss">
  .fps {
    margin-top: 10px;
    text-align: center;
  }
</style>
