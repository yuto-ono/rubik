import type { Point, Vector, Point3D, Vector3D } from "./types"

/**
 * 2点間のベクトルを生成
 */
export const createVector = (a: Point, b: Point): Vector => ({
  x: b.x - a.x,
  y: b.y - a.y,
})

/**
 * 2点間のベクトルを生成
 */
export const createVector3D = (a: Point3D, b: Point3D): Vector3D => ({
  x: b.x - a.x,
  y: b.y - a.y,
  z: b.z - a.z,
})

/**
 * 2Dベクトルの内積を計算
 */
export const innerProduct = (a: Vector, b: Vector): number => {
  return a.x * b.x + a.y * b.y
}

/**
 * 3Dベクトルの内積を計算
 */
export const innerProduct3D = (a: Vector3D, b: Vector3D): number => {
  return a.x * b.x + a.y * b.y + a.z * b.z
}
