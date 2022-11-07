import { Face } from "./Face"
import type { Matrix } from "./Matrix"
import type { Renderer } from "./Renderer"
import type { Axis, Point, Point3D, TouchInfo, TransferParams } from "./types"
import { Vertex } from "./Vertex"

/**
 * 各キューブ
 */
export class Cube {
  private vertexes: Vertex[]
  private faces: Face[]

  constructor(center: Point3D, sideLength: number) {
    const [c, l] = [center, sideLength]
    const v: Vertex[] = [
      new Vertex({ x: c.x + l, y: c.y + l, z: c.z + l }),
      new Vertex({ x: c.x + l, y: c.y + l, z: c.z - l }),
      new Vertex({ x: c.x - l, y: c.y + l, z: c.z - l }),
      new Vertex({ x: c.x - l, y: c.y + l, z: c.z + l }),
      new Vertex({ x: c.x + l, y: c.y - l, z: c.z + l }),
      new Vertex({ x: c.x + l, y: c.y - l, z: c.z - l }),
      new Vertex({ x: c.x - l, y: c.y - l, z: c.z - l }),
      new Vertex({ x: c.x - l, y: c.y - l, z: c.z + l }),
    ]

    this.vertexes = v
    this.faces = [
      new Face(v[0], v[3], v[2], v[1], v[4]),
      new Face(v[5], v[4], v[0], v[1], v[6]),
      new Face(v[1], v[2], v[6], v[5], v[0]),
      new Face(v[2], v[3], v[7], v[6], v[1]),
      new Face(v[3], v[0], v[4], v[7], v[2]),
      new Face(v[7], v[4], v[5], v[6], v[3]),
    ]
  }

  /**
   * 座標変換
   */
  transfer(matrix: Matrix, tParams: TransferParams): void {
    this.vertexes.forEach((vertex) => vertex.transfer(matrix, tParams))
    this.faces.forEach((face) => {
      face.calcVisible()
    })
  }

  /**
   * キューブを描画
   */
  draw(renderer: Renderer): void {
    this.faces.forEach((face) => {
      if (face.visible) {
        face.draw(renderer)
      }
    })
  }

  /**
   * 特定の面が見えるかどうか
   */
  isFaceVisible(i: number): boolean {
    return this.faces[i].visible
  }

  /**
   * 面へのタッチを試みる タッチできたら面の情報を返す
   */
  touch(p: Point): TouchInfo | undefined {
    for (let i = 0; i < this.faces.length; i++) {
      const face = this.faces[i]
      if (face.isInside(p)) {
        return { face, faceIndex: i }
      }
    }
  }

  /**
   * キューブを回転する
   */
  rotate(rad: number, axis: Axis): void {
    this.vertexes.forEach((vertex) => vertex.rotate(rad, axis))
  }

  /**
   * 回転をもとに戻す
   */
  revert(): void {
    this.vertexes.forEach((vertex) => vertex.revert())
  }

  /**
   * 面の色を設定
   */
  setColor(faceIndex: number, color: number): void {
    this.faces[faceIndex].setColor(color)
  }
}
