<script lang="ts">
  import { onMount } from "svelte"
  import { CubeManager } from "./rubik"
  import { cubeManager } from "./stores"

  let canvas: HTMLCanvasElement
  let wrapper: HTMLDivElement
  let hidden = true
  let canvasWidth = 700
  let dragging = false
  let resizeTimer: NodeJS.Timeout | undefined
  let dpr = window.devicePixelRatio

  const onMouseDown = (e: MouseEvent) => {
    dragging = true
    $cubeManager.dragStart({ x: e.offsetX, y: e.offsetY })
  }

  const onMouseMove = (e: MouseEvent) => {
    if (dragging) {
      $cubeManager.drag({ x: e.offsetX, y: e.offsetY })
    }
  }

  const onTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0]
    const rect = canvas.getBoundingClientRect()
    dragging = true
    $cubeManager.dragStart({
      x: (touch.clientX - rect.x) * dpr,
      y: (touch.clientY - rect.y) * dpr,
    })
  }

  const onTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0]
    const rect = canvas.getBoundingClientRect()
    if (dragging) {
      $cubeManager.drag({
        x: (touch.clientX - rect.x) * dpr,
        y: (touch.clientY - rect.y) * dpr,
      })
    }
  }

  onMount(() => {
    window.addEventListener("resize", () => {
      if (resizeTimer != null) {
        clearTimeout(resizeTimer)
      }
      resizeTimer = setTimeout(() => {
        dpr = window.devicePixelRatio
        const newWidth = wrapper.clientWidth * dpr
        if (newWidth !== canvasWidth) {
          canvasWidth = newWidth
          $cubeManager.setScreenSize(canvasWidth)
          $cubeManager.drawAsync()
        }
      }, 200)
    })

    document.addEventListener("mouseup", () => {
      dragging = false
    })

    document.addEventListener("touchend", (e) => {
      if (dragging) {
        e.preventDefault()
        dragging = false
      }
    })

    const ctx = canvas.getContext("2d")

    if (ctx != null) {
      canvasWidth = wrapper.clientWidth * dpr
      $cubeManager = new CubeManager(3, canvasWidth, ctx)
      hidden = false
      $cubeManager.drawAsync()
    }
  })
</script>

<div class="canvas-wrapper" bind:this={wrapper}>
  <canvas
    class="canvas"
    class:hidden
    width={canvasWidth}
    height={canvasWidth}
    style="transform: scale({1 / dpr})"
    bind:this={canvas}
    on:mousedown|preventDefault={onMouseDown}
    on:mousemove|preventDefault={onMouseMove}
    on:touchstart|preventDefault={onTouchStart}
    on:touchmove|preventDefault={onTouchMove}
  >
    お使いのブラウザは canvas に対応していません。
  </canvas>
</div>

<style lang="scss">
  .canvas-wrapper {
    --canvas-width: min(702px, 95vw, 75vh);
    width: var(--canvas-width);
    height: var(--canvas-width);
    position: relative;
    margin-left: auto;
    margin-right: auto;
    border: 1px solid #ccc;
    overflow: hidden;
  }
  .canvas {
    position: absolute;
    transform-origin: 0 0;
    &.hidden {
      display: none;
    }
  }
</style>
