<script lang="ts">
</script>

<div class="size">
  <label class="label" for="cube_select">キューブのサイズ</label>
  <select class="select" id="cube_select">
    <option>2x2x2</option>
    <option>3x3x3</option>
    <option>4x4x4</option>
    <option>5x5x5</option>
    <option>6x6x6</option>
    <option>7x7x7</option>
  </select>
</div>

<style lang="scss">
  .size {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
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
