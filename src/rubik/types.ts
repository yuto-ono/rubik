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
