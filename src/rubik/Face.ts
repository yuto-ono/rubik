import { createVector3D, innerProduct3D } from "./functions"
import type { Renderer } from "./Renderer"
import type { Vertex } from "./Vertex"

/**
 * 面
 */
export class Face {
  visible = false

  constructor(
    private v1: Vertex,
    private v2: Vertex,
    private v3: Vertex,
    private v4: Vertex,
    private v5: Vertex
  ) {}

  /**
   * 面が見えるかどうかを計算する
   */
  calcVisible(): void {
    const v = createVector3D(this.v1.translatedPoint, this.v5.translatedPoint)
    this.visible = innerProduct3D(v, this.v1.translatedPoint) > 0
  }

  /**
   * 面を描画
   */
  draw(renderer: Renderer, color: number): void {
    renderer.fillQuadrangle(
      this.v1.screenPoint,
      this.v2.screenPoint,
      this.v3.screenPoint,
      this.v4.screenPoint,
      color
    )
  }
}
