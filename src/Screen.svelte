<script lang="ts">
  import { CubeManager, type Face, type Point } from "./rubik"
  import { cubeManager } from "./stores"

  let faces: Face[] = []
  let svgElement: SVGSVGElement
  let dragging = false

  $cubeManager = new CubeManager(3)
  $cubeManager.subscribeFaces((_faces) => {
    faces = _faces
  })
  $cubeManager.draw()

  const pointsToString = (points: Point[]): string => {
    return points
      .map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`)
      .join(" ")
  }

  const translatePoint = (point: Point): Point => {
    const ratio = 700 / svgElement.clientWidth
    return { x: point.x * ratio, y: point.y * ratio }
  }

  const getTouchPoint = (e: TouchEvent): Point => {
    const touch = e.touches[0]
    const rect = svgElement.getBoundingClientRect()
    return translatePoint({
      x: touch.clientX - rect.x,
      y: touch.clientY - rect.y,
    })
  }

  const onMouseDown = (e: MouseEvent) => {
    dragging = true
    $cubeManager.dragStart(translatePoint({ x: e.offsetX, y: e.offsetY }))
  }

  const onMouseMove = (e: MouseEvent) => {
    if (dragging) {
      $cubeManager.drag(translatePoint({ x: e.offsetX, y: e.offsetY }))
    }
  }

  const onTouchStart = (e: TouchEvent) => {
    dragging = true
    $cubeManager.dragStart(getTouchPoint(e))
  }

  const onTouchMove = (e: TouchEvent) => {
    if (dragging) {
      $cubeManager.drag(getTouchPoint(e))
    }
  }

  const faceMouseDown = (e: MouseEvent, face: Face) => {
    dragging = true
    $cubeManager.touch(translatePoint({ x: e.offsetX, y: e.offsetY }), face)
  }

  const faceTouchStart = (e: TouchEvent, face: Face) => {
    dragging = true
    $cubeManager.touch(getTouchPoint(e), face)
  }

  document.addEventListener("mouseup", () => {
    dragging = false
  })

  document.addEventListener("touchend", (e) => {
    if (dragging) {
      e.preventDefault()
      dragging = false
    }
  })
</script>

<div class="screen-wrapper">
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <svg
    class="svg"
    viewBox="0 0 700 700"
    bind:this={svgElement}
    on:mousedown|preventDefault={onMouseDown}
    on:mousemove|preventDefault={onMouseMove}
    on:touchstart|preventDefault={onTouchStart}
    on:touchmove|preventDefault={onTouchMove}
  >
    {#each faces as face (face)}
      {#if face.colored}
        <polygon
          class="polygon color-{face.color}"
          points={pointsToString(face.getPoints())}
          on:mousedown|stopPropagation={(e) => faceMouseDown(e, face)}
          on:touchstart|stopPropagation={(e) => faceTouchStart(e, face)}
        />
      {:else}
        <polygon
          class="polygon color-{face.color}"
          points={pointsToString(face.getPoints())}
        />
      {/if}
    {/each}
  </svg>
</div>

<style lang="scss">
  .screen-wrapper {
    --screen-width: min(702px, 95vw, 75vh);
    width: var(--screen-width);
    height: var(--screen-width);
    position: relative;
    margin-left: auto;
    margin-right: auto;
    border: 1px solid #ccc;
    overflow: hidden;
  }
  .svg {
    width: 100%;
    height: 100%;
  }
  .polygon {
    stroke: #000;
    &.color-0 {
      fill: #fe0;
    }
    &.color-1 {
      fill: #c00;
    }
    &.color-2 {
      fill: #090;
    }
    &.color-3 {
      fill: #e70;
    }
    &.color-4 {
      fill: #00c;
    }
    &.color-5 {
      fill: #fff;
    }
    &.color-6 {
      fill: #000;
    }
  }
</style>
