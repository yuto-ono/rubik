<script lang="ts">
  let selectedSize = 3
  const sizeOptions = [2, 3, 4, 5, 6, 7]

  $: console.log(selectedSize)
</script>

<div class="size">
  <label class="label" for="cube_select">キューブのサイズ</label>
  <select class="select" id="cube_select" bind:value={selectedSize}>
    {#each sizeOptions as size}
      <option value={size}>{size}x{size}x{size}</option>
    {/each}
  </select>
</div>

<style lang="scss">
  .size {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
  }
  .label {
    margin-right: 10px;
  }
  .select {
    width: 100px;
    font-family: inherit;
    font-size: 16px;
  }
</style>
