<script lang="ts">
  import ButtonList from "./ButtonList.svelte"
  import Screen from "./Screen.svelte"
  import SelectSize from "./SelectSize.svelte"
</script>

<main class="main">
  <h1 class="title">ルービックキューブ</h1>
  <Screen />
  <SelectSize />
  <ButtonList />
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
