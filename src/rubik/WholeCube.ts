import { CUBE_SIZE } from "./constants"
import { Cube } from "./Cube"
import { Matrix } from "./Matrix"
import type { Renderer } from "./Renderer"
import type { TransferParams, Vector } from "./types"

type Axis = "x" | "y" | "z"
type IndexGetter = (col: number, x: number, y: number, z: number) => number

const indexGetterList: Record<Axis, IndexGetter> = {
  x: (col, x, y, z) => x + y * col + z * col * col,
  y: (col, x, y, z) => z + x * col + y * col * col,
  z: (col, x, y, z) => y + z * col + x * col * col,
}

/**
 * キューブ全体
 */
export class WholeCube {
  // matrix: Matrix
  col: number
  private cubes: Cube[] = []
  private sortedCubes: Cube[] = []
  private reversedCubes: Cube[] = []
  private axis: Axis = "x"
  private matrix: Matrix

  constructor(col: number) {
    const sideLength = (CUBE_SIZE / col) >> 1
    // this.matrix = new Matrix()
    this.col = col
    this.matrix = new Matrix()
    this.cubes = []

    for (let i = 0; i < col; i++) {
      for (let j = 0; j < col; j++) {
        for (let k = 0; k < col; k++) {
          this.cubes.push(
            new Cube(
              {
                x: (k + k - col + 1) * sideLength,
                y: (j + j - col + 1) * sideLength,
                z: (i + i - col + 1) * sideLength,
              },
              sideLength
            )
          )
        }
      }
    }
  }

  /**
   * キューブ全体を描画
   */
  draw(renderer: Renderer, tParams: TransferParams): void {
    this.transfer(tParams)
    this.sort()
    renderer.clear(tParams)
    this.sortedCubes.forEach((cube) => cube.draw(renderer))
  }

  /**
   * キューブ全体を回転（視点を動かす）
   */
  moveAngle(v: Vector, { turnRate }: TransferParams): void {
    this.matrix.rotX(v.x * turnRate)
    this.matrix.rotY(v.y * turnRate)
  }

  /**
   * 座標変換
   */
  private transfer(tParams: TransferParams): void {
    this.cubes.forEach((cube) => cube.transfer(this.matrix, tParams))
  }

  /**
   * 特定の面が見えるかどうかを取得（重なりは考慮しない）
   */
  private isFaceVisible(
    x: number,
    y: number,
    z: number,
    faceIndex: number
  ): boolean {
    return this.cubes[this.getIndex(x, y, z)].isFaceVisible(faceIndex)
  }

  /**
   * レイヤーのつなぎ目の判定
   */
  private layerContact(x: number): boolean {
    return this.isFaceVisible(x, 0, 0, { x: 1, y: 0, z: 4 }[this.axis])
  }

  /**
   * ラインのつなぎ目の判定
   */
  private lineContact(x: number, y: number): boolean {
    return this.isFaceVisible(x, y, 0, { x: 0, y: 4, z: 1 }[this.axis])
  }

  /**
   * キューブのつなぎ目の判定
   */
  private cubeContact(x: number, y: number, z: number): boolean {
    return this.isFaceVisible(x, y, z, { x: 4, y: 1, z: 0 }[this.axis])
  }

  /**
   * x, y, z をもとにキューブのインデックスを取得
   */
  private getIndex(x: number, y: number, z: number): number {
    return indexGetterList[this.axis](this.col, x, y, z)
  }

  /**
   * キューブを並べ替え（描画のため）
   */
  private sort(): void {
    this.sortedCubes = []

    for (let x = 0; x < this.col; x++) {
      if (this.layerContact(x)) {
        this.sortLayer(x)
      } else {
        for (let t = this.col - 1; t >= x; t--) {
          this.sortLayer(t)
        }
        break
      }
    }

    this.reversedCubes = [...this.sortedCubes].reverse()
  }

  /**
   * 特定のレイヤー上のキューブを並べ替え
   */
  private sortLayer(x: number): void {
    for (let y = 0; y < this.col; y++) {
      if (this.lineContact(x, y)) {
        this.sortLine(x, y)
      } else {
        for (let t = this.col - 1; t >= y; t--) {
          this.sortLine(x, t)
        }
        break
      }
    }
  }

  /**
   * 特定のライン上のキューブを並べ替え
   */
  private sortLine(x: number, y: number): void {
    const col = this.col
    const max = col - 1

    if (x === 0 || x === max || y === 0 || y === max) {
      for (let z = 0; z < col; z++) {
        if (this.cubeContact(x, y, z)) {
          this.addSortedCube(x, y, z)
        } else {
          for (let t = max; t >= z; t--) {
            this.addSortedCube(x, y, t)
          }
          break
        }
      }
    } else if (this.cubeContact(x, y, 0)) {
      this.addSortedCube(x, y, 0)
      this.addSortedCube(x, y, max)
    } else {
      this.addSortedCube(x, y, max)
      this.addSortedCube(x, y, 0)
    }
  }

  private addSortedCube(x: number, y: number, z: number): void {
    this.sortedCubes.push(this.cubes[this.getIndex(x, y, z)])
  }
}
