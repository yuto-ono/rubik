import { UNIT_VECTOR_BITS } from "./constants"
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

/**
 * 乱数
 */
export const rand = (max: number): number => Math.floor(Math.random() * max)

/**
 * 点p が、直線ab の左側にあるか
 */
export const isLeftHand = (a: Point, b: Point, p: Point): boolean => {
  return (b.y - a.y) * (p.x - a.x) <= (b.x - a.x) * (p.y - a.y)
}

/**
 * ベクトルの長さを揃える
 */
export const unitVector = (v: Vector): Vector => {
  const length = Math.sqrt(v.x * v.x + v.y * v.y)
  return {
    x: Math.round((v.x << UNIT_VECTOR_BITS) / length),
    y: Math.round((v.y << UNIT_VECTOR_BITS) / length),
  }
}
