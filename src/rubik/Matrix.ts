import type { Vector3D } from "./types"

/**
 * 3x3 の行列
 */
export class Matrix {
  private data: number[] = [1, 0, 0, 0, 1, 0, 0, 0, 1]

  /**
   * ベクトルとの積
   */
  product(v: Vector3D): Vector3D {
    const d = this.data
    return {
      x: Math.round(v.x * d[0] + v.y * d[1] + v.z * d[2]),
      y: Math.round(v.x * d[3] + v.y * d[4] + v.z * d[5]),
      z: Math.round(v.x * d[6] + v.y * d[7] + v.z * d[8]),
    }
  }

  /**
   * X軸を中心に回転
   */
  rotX(angle: number): void {
    const s = Math.sin(angle)
    const c = Math.cos(angle)
    const d = this.data
    this.data = [
      d[0] * c - d[6] * s,
      d[1] * c - d[7] * s,
      d[2] * c - d[8] * s,
      d[3],
      d[4],
      d[5],
      d[0] * s + d[6] * c,
      d[1] * s + d[7] * c,
      d[2] * s + d[8] * c,
    ]
  }

  /**
   * Y軸を中心に回転
   */
  rotY(angle: number): void {
    const s = Math.sin(angle)
    const c = Math.cos(angle)
    const d = this.data
    this.data = [
      d[0],
      d[1],
      d[2],
      d[3] * c - d[6] * s,
      d[4] * c - d[7] * s,
      d[5] * c - d[8] * s,
      d[3] * s + d[6] * c,
      d[4] * s + d[7] * c,
      d[5] * s + d[8] * c,
    ]
  }
}
