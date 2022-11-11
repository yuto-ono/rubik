<script lang="ts">
  import { CubeManager, type Face, type Point } from "./rubik"
  import { cubeManager } from "./stores"

  let faces: Face[] = []
  let svgElement: SVGSVGElement
  let dragging = false

  $cubeManager = new CubeManager(3, 700)
  $cubeManager.subscribeFaces((_faces) => {
    faces = _faces
  })
  $cubeManager.draw()

  const pointsToString = (points: Point[]): string => {
    return points.map((point) => `${point.x},${point.y}`).join(" ")
  }

  const translatePoint = (point: Point): Point => {
    const ratio = 700 / svgElement.clientWidth
    return { x: point.x * ratio, y: point.y * ratio }
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
    const touch = e.touches[0]
    const rect = svgElement.getBoundingClientRect()
    dragging = true
    $cubeManager.dragStart(
      translatePoint({
        x: touch.clientX - rect.x,
        y: touch.clientY - rect.y,
      })
    )
  }

  const onTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0]
    const rect = svgElement.getBoundingClientRect()
    if (dragging) {
      $cubeManager.drag(
        translatePoint({
          x: touch.clientX - rect.x,
          y: touch.clientY - rect.y,
        })
      )
    }
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
      <polygon
        class="polygon color-{face.color}"
        points={pointsToString(face.getPoints())}
      />
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
