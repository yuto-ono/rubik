import { Face } from "./Face"
import type { Matrix } from "./Matrix"
import type { Axis, Point3D } from "./types"
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
      new Face(this, 0, v[0], v[3], v[2], v[1], v[4]),
      new Face(this, 1, v[5], v[4], v[0], v[1], v[6]),
      new Face(this, 2, v[1], v[2], v[6], v[5], v[0]),
      new Face(this, 3, v[2], v[3], v[7], v[6], v[1]),
      new Face(this, 4, v[3], v[0], v[4], v[7], v[2]),
      new Face(this, 5, v[7], v[4], v[5], v[6], v[3]),
    ]
  }

  /**
   * 座標変換
   */
  transfer(matrix: Matrix): void {
    this.vertexes.forEach((vertex) => vertex.transfer(matrix))
    this.faces.forEach((face) => {
      face.calcVisible()
    })
  }

  /**
   * 見える面のリスト
   */
  getVisibleFaces(): Face[] {
    return this.faces.filter((face) => face.visible)
  }

  /**
   * 特定の面が見えるかどうか
   */
  isFaceVisible(i: number): boolean {
    return this.faces[i].visible
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
