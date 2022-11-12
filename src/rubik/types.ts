import type { Face } from "./Face"

/**
 * 2D座標
 */
export type Point = {
  x: number
  y: number
}

/**
 * 2Dベクトル（Point と同じ）
 */
export type Vector = Point

/**
 * 3D座標・ベクトル
 */
export type Point3D = {
  x: number
  y: number
  z: number
}

/**
 * 3Dベクトル（Point3D と同じ）
 */
export type Vector3D = Point3D

/**
 * 座標変換になどに使うパラメータ
 */
export type TransferParams = {
  transferRate: number
  screenSize: number
  center: number
  turnRate: number
}

/**
 * 回転軸
 */
export type Axis = "x" | "y" | "z"

/**
 * タッチした面の情報
 */
export type TouchDetail = {
  face: Face
  cubeIndex: number
  row: number
  direction: boolean
}

/**
 * 回転軸と回転方向
 */
export type AxisAndDirection = {
  axis: Axis
  direction: boolean
}
