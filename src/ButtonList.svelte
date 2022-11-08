<script lang="ts">
  import Button from "./Button.svelte"
  import { cubeManager, playing } from "./stores"

  const shuffle = () => {
    $cubeManager.shuffle()
    $cubeManager.draw()
    $playing = true
  }

  const reset = () => {
    $cubeManager.reset()
    $cubeManager.draw()
    $playing = false
  }
</script>

<div class="btn-list">
  <div class="btn-item">
    <Button on:click={shuffle}>シャッフル</Button>
  </div>
  <div class="btn-item">
    <Button on:click={reset}>リセット</Button>
  </div>
</div>

<style lang="scss">
  .btn-list {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  .btn-item {
    margin-left: 10px;
    margin-right: 10px;
  }
</style>
