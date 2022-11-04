<script lang="ts">
</script>

<div class="canvas-wrapper">
  <canvas class="canvas" width="500" height="500">
    お使いのブラウザは canvas に対応していません。
  </canvas>
</div>

<style lang="scss">
  .canvas-wrapper {
    text-align: center;
  }
  .canvas {
    border: 1px solid #ccc;
    @media (max-width: 520px) {
      width: 95vw;
      height: 95vw;
    }
  }
</style>
