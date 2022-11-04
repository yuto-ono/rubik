<script lang="ts">
  import Button from "./Button.svelte"
</script>

<div class="btn-list">
  <div class="btn-item">
    <Button>シャッフル</Button>
  </div>
  <div class="btn-item">
    <Button>リセット</Button>
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
