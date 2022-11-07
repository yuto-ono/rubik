<script lang="ts">
  import { onMount } from "svelte"
  import { createVector, CubeManager, type Point } from "./rubik"
  import { cubeManager } from "./stores"

  let canvas: HTMLCanvasElement
  let wrapper: HTMLDivElement
  let hidden = true
  let canvasWidth = 700
  let dragging = false
  let faceTouched = false
  let animating = false
  let touchPoint: Point
  let timerId: NodeJS.Timeout | undefined
  let dpr = window.devicePixelRatio

  const onMouseDown = (e: MouseEvent) => {
    dragStart({ x: e.offsetX, y: e.offsetY })
  }

  const onMouseMove = (e: MouseEvent) => {
    if (dragging) {
      drag({ x: e.offsetX, y: e.offsetY })
    }
  }

  const onTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0]
    const rect = canvas.getBoundingClientRect()
    dragStart({
      x: (touch.clientX - rect.x) * dpr,
      y: (touch.clientY - rect.y) * dpr,
    })
  }

  const onTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0]
    const rect = canvas.getBoundingClientRect()
    if (dragging) {
      drag({
        x: (touch.clientX - rect.x) * dpr,
        y: (touch.clientY - rect.y) * dpr,
      })
    }
  }

  const dragStart = (p: Point) => {
    dragging = true
    touchPoint = p
    faceTouched = $cubeManager.touch(p)
  }

  const drag = (p: Point) => {
    if (faceTouched) {
      if (!animating) {
        const v = createVector(touchPoint, p)
        if ($cubeManager.detectAxis(v)) {
          animating = true
          dragging = false
          const startTime = performance.now()
          const animate = () => {
            const t = performance.now() - startTime
            const rad = t / 200
            if (rad < 1.57) {
              $cubeManager.rotate(rad)
              $cubeManager.draw()
              requestAnimationFrame(animate)
            } else {
              $cubeManager.revert()
              $cubeManager.draw()
              animating = false
            }
          }
          requestAnimationFrame(animate)
        }
      }
    } else {
      $cubeManager.moveAngle(createVector(touchPoint, p))
      $cubeManager.draw()
      touchPoint = p
    }
  }

  onMount(() => {
    window.addEventListener("resize", () => {
      if (timerId != null) {
        clearTimeout(timerId)
      }
      timerId = setTimeout(() => {
        dpr = window.devicePixelRatio
        const newWidth = wrapper.clientWidth * dpr
        if (newWidth !== canvasWidth) {
          canvasWidth = newWidth
          $cubeManager.setScreenSize(canvasWidth)
          requestAnimationFrame(() => $cubeManager.draw())
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
      requestAnimationFrame(() => $cubeManager.draw())
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
