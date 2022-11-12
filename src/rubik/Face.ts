import type { Cube } from "./Cube"
import {
  createVector,
  createVector3D,
  innerProduct,
  innerProduct3D,
  unitVector,
} from "./functions"
import type { AxisAndDirection, Point, Vector } from "./types"
import type { Vertex } from "./Vertex"

/**
 * 面
 */
export class Face {
  visible = false
  color = 6
  colored = false

  constructor(
    public belongingCube: Cube,
    public index: number,
    private v1: Vertex,
    private v2: Vertex,
    private v3: Vertex,
    private v4: Vertex,
    private v5: Vertex
  ) {}

  /**
   * 色を設定
   */
  setColor(color: number): void {
    this.color = color
    this.colored = true
  }

  /**
   * 面が見えるかどうかを計算する
   */
  calcVisible(): void {
    const v = createVector3D(this.v1.translatedPoint, this.v5.translatedPoint)
    this.visible = innerProduct3D(v, this.v1.translatedPoint) > 0
  }

  /**
   * 2次元座標の配列を取得
   */
  getPoints(): Point[] {
    return [
      this.v1.screenPoint,
      this.v2.screenPoint,
      this.v3.screenPoint,
      this.v4.screenPoint,
    ]
  }

  /**
   * ベクトルをもとに回転軸と回転方向を決定
   */
  detectAxis(v: Vector): AxisAndDirection {
    const v1 = unitVector(
      this.index === 1
        ? createVector(this.v2.screenPoint, this.v1.screenPoint)
        : createVector(this.v1.screenPoint, this.v2.screenPoint)
    )
    const v2 = unitVector(
      this.index === 0 || this.index === 2
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
