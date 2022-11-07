import { Face } from "./Face"
import type { Matrix } from "./Matrix"
import type { Renderer } from "./Renderer"
import type { Point3D, TransferParams } from "./types"
import { Vertex } from "./Vertex"

/**
 * 各キューブ
 */
export class Cube {
  private center: Point3D
  private sideLength: number
  private vertexes: Vertex[]
  private faces: Face[]

  constructor(center: Point3D, sideLength: number) {
    this.center = center
    this.sideLength = sideLength

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
    this.faces.forEach((face, i) => {
      if (face.visible) {
        face.draw(renderer, i)
      }
    })
  }

  /**
   * 特定の面が見えるかどうか
   */
  isFaceVisible(i: number): boolean {
    return this.faces[i].visible
  }
}
