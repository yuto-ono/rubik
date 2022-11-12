import { CENTER, SCREEN_DISTANCE, TRANSFER_RATE } from "./constants"
import type { Matrix } from "./Matrix"
import type { Point3D, Point, Axis } from "./types"

/**
 * 頂点
 */
export class Vertex {
  originalPoint: Point3D
  private oldPoint: Point3D
  translatedPoint: Point3D
  screenPoint: Point = { x: 0, y: 0 }

  constructor(point: Point3D) {
    this.originalPoint = point
    this.translatedPoint = { ...point }
    this.oldPoint = { ...point }
  }

  /**
   * 3D座標を2D座標に変換
   */
  transfer(matrix: Matrix): void {
    const p = matrix.product(this.originalPoint)
    p.z += SCREEN_DISTANCE
    this.translatedPoint = p
    this.screenPoint.x = (p.x * TRANSFER_RATE) / p.z + CENTER
    this.screenPoint.y = (p.y * TRANSFER_RATE) / p.z + CENTER
  }

  /**
   * 回転
   */
  rotate(rad: number, axis: Axis): void {
    const s = Math.sin(rad)
    const c = Math.cos(rad)
    const p = this.oldPoint
    switch (axis) {
      case "x":
        this.originalPoint.y = p.y * c - p.z * s
        this.originalPoint.z = p.z * c + p.y * s
        break
      case "y":
        this.originalPoint.x = p.x * c + p.z * s
        this.originalPoint.z = p.z * c - p.x * s
        break
      case "z":
        this.originalPoint.x = p.x * c - p.y * s
        this.originalPoint.y = p.y * c + p.x * s
        break
    }
  }

  /**
   * 回転をもとに戻す
   */
  revert(): void {
    this.originalPoint.x = this.oldPoint.x
    this.originalPoint.y = this.oldPoint.y
    this.originalPoint.z = this.oldPoint.z
  }
}
