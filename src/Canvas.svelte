<script lang="ts">
  import { onDestroy, onMount } from "svelte"

  let canvas: HTMLCanvasElement
  let wrapper: HTMLDivElement
  let hidden = true
  let scale = 0.5
  const canvasWidth = 1400

  const adjustCanvasSize = () => {
    scale = wrapper.clientWidth / canvasWidth
  }

  onMount(() => {
    window.addEventListener("resize", adjustCanvasSize)
    adjustCanvasSize()
    hidden = false

    const ctx = canvas.getContext("2d")

    if (ctx != null) {
      ctx.fillStyle = "#c00"
      ctx.strokeStyle = "#333"
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(10, 10)
      ctx.lineTo(400, 100)
      ctx.lineTo(400, 500)
      ctx.lineTo(10, 400)
      ctx.lineTo(10, 10)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    }
  })

  onDestroy(() => {
    window.removeEventListener("resize", adjustCanvasSize)
  })
</script>

<div class="canvas-wrapper" bind:this={wrapper}>
  <canvas
    class="canvas"
    class:hidden
    width={canvasWidth}
    height={canvasWidth}
    style="transform: scale({scale})"
    bind:this={canvas}
  >
    お使いのブラウザは canvas に対応していません。
  </canvas>
</div>

<style lang="scss">
  .canvas-wrapper {
    --canvas-width: min(702px, 95vw, 85vh);
    width: var(--canvas-width);
    height: var(--canvas-width);
    position: relative;
    margin-left: auto;
    margin-right: auto;
    border: 1px solid #ccc;
  }
  .canvas {
    position: absolute;
    transform-origin: 0 0;
    &.hidden {
      display: none;
    }
  }
</style>
