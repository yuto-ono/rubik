import {
  createVector,
  createVector3D,
  innerProduct,
  innerProduct3D,
  isLeftHand,
  unitVector,
} from "./functions"
import type { Renderer } from "./Renderer"
import type { Axis, AxisAndDirection, Point, Vector } from "./types"
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

  /**
   * 点が面の内側にあるか
   */
  isInside(p: Point): boolean {
    return (
      this.visible &&
      isLeftHand(this.v1.screenPoint, this.v2.screenPoint, p) &&
      isLeftHand(this.v2.screenPoint, this.v3.screenPoint, p) &&
      isLeftHand(this.v3.screenPoint, this.v4.screenPoint, p) &&
      isLeftHand(this.v4.screenPoint, this.v1.screenPoint, p)
    )
  }

  /**
   * ベクトルをもとに回転軸と回転方向を決定
   */
  detectAxis(v: Vector, faceIndex: number): AxisAndDirection {
    const v1 = unitVector(
      faceIndex === 1
        ? createVector(this.v2.screenPoint, this.v1.screenPoint)
        : createVector(this.v1.screenPoint, this.v2.screenPoint)
    )
    const v2 = unitVector(
      faceIndex === 0 || faceIndex === 2
        ? createVector(this.v4.screenPoint, this.v1.screenPoint)
        : createVector(this.v1.screenPoint, this.v4.screenPoint)
    )
    const a = innerProduct(v1, v)
    const b = innerProduct(v2, v)
    const isVertical = Math.abs(a) < Math.abs(b)
    const p1 = this.v1.originalPoint
    const p2 = (isVertical ? this.v2 : this.v4).originalPoint
    const product = isVertical ? b : a
    return {
      axis: p1.x !== p2.x ? "x" : p1.y !== p2.y ? "y" : "z",
      direction: product > 0,
    }
  }
}
