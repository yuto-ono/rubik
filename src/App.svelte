<script lang="ts">
  import ButtonList from "./ButtonList.svelte"
  import Canvas from "./Canvas.svelte"
  import Fps from "./Fps.svelte"
  import SelectSize from "./SelectSize.svelte"
</script>

<main class="main">
  <h1 class="title">ルービックキューブ</h1>
  <Canvas />
  <SelectSize />
  <ButtonList />
  <Fps />
</main>

<style lang="scss">
  .main {
    padding: 20px 0;
  }
  .title {
    margin-bottom: 10px;
    font-size: 24px;
    text-align: center;
  }
</style>
