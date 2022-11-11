import { CUBE_SIZE, DRAG_LIMIT } from "./constants"
import { Cube } from "./Cube"
import type { Face } from "./Face"
import { Matrix } from "./Matrix"
import { Sticker } from "./Sticker"
import type { Axis, Point, TouchDetail, TransferParams, Vector } from "./types"

type IndexGetter = (col: number, x: number, y: number, z: number) => number
type RowGetter = (col: number, i: number) => number

const indexGetterList: Record<Axis, IndexGetter> = {
  x: (col, x, y, z) => x + y * col + z * col * col,
  y: (col, x, y, z) => z + x * col + y * col * col,
  z: (col, x, y, z) => y + z * col + x * col * col,
}

const rowGetterList: Record<Axis, RowGetter> = {
  x: (col, i) => i % col,
  y: (col, i) => Math.floor(i / col) % col,
  z: (col, i) => Math.floor(i / (col * col)),
}

/**
 * キューブ全体
 */
export class WholeCube {
  col: number
  private cubes: Cube[] = []
  private sortedCubes: Cube[] = []
  private axis: Axis = "z"
  private matrix: Matrix
  private touchDetail: TouchDetail | undefined
  private stiker: Sticker

  constructor(col: number) {
    const sideLength = (CUBE_SIZE / col) >> 1
    this.col = col
    this.matrix = new Matrix()
    this.cubes = []
    this.stiker = new Sticker(col)

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

    this.coloring()
  }

  /**
   * 見える面のリストを作成
   */
  getVisibleFaces(tParams: TransferParams): Face[] {
    this.transfer(tParams)
    this.sort()
    return this.sortedCubes.flatMap((cube) => cube.getVisibleFaces())
  }

  /**
   * キューブ全体を回転（視点を動かす）
   */
  moveAngle(v: Vector, { turnRate }: TransferParams): void {
    this.matrix.rotX(v.x * turnRate)
    this.matrix.rotY(v.y * turnRate)
  }

  /**
   * タッチを試みる
   * タッチできたら、タッチした面を保存して true を返す
   */
  touch(p: Point): boolean {
    for (const cube of [...this.sortedCubes].reverse()) {
      const touchInfo = cube.touch(p)
      if (touchInfo != null) {
        this.touchDetail = {
          ...touchInfo,
          cubeIndex: this.cubes.indexOf(cube),
          row: 0,
          direction: false,
        }
        return true
      }
    }
    return false
  }

  /**
   * キューブを回転する
   */
  rotate(rad: number): void {
    if (this.touchDetail != null) {
      const { direction, row } = this.touchDetail
      const _rad = direction ? rad : -rad
      for (let i = 0; i < this.col; i++) {
        for (let j = 0; j < this.col; j++) {
          this.cubes[this.getIndex(row, i, j)].rotate(_rad, this.axis)
        }
      }
    }
  }

  /**
   * 回転をもとに戻し、色を並べかえる
   */
  revertAndColoring(): void {
    this.cubes.forEach((cube) => cube.revert())
    if (this.touchDetail != null) {
      const { row, direction } = this.touchDetail
      this.stiker.rotate(this.axis, row, direction)
      this.coloring()
    }
  }

  /**
   * リセット
   */
  reset(): void {
    this.stiker.reset()
    this.coloring()
    this.matrix = new Matrix()
  }

  /**
   * シャッフル
   */
  shuffle(): void {
    this.stiker.shuffle()
    this.coloring()
  }

  /**
   * 6面完成したかどうかを判定
   */
  judge(): boolean {
    return this.stiker.judge()
  }

  /**
   * ベクトルをもとに回転軸を決定
   */
  detectAxis(v: Vector): boolean {
    if (this.touchDetail == null) {
      return false
    }
    if (v.x * v.x + v.y * v.y < DRAG_LIMIT) {
      return false
    }

    const { face, faceIndex } = this.touchDetail
    const { axis, direction } = face.detectAxis(v, faceIndex)
    this.axis = axis
    this.touchDetail.direction = direction
    this.touchDetail.row = this.getRow(this.touchDetail.cubeIndex)
    return true
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
   * キューブIDをもとに行番号を取得
   */
  private getRow(cubeIndex: number): number {
    return rowGetterList[this.axis](this.col, cubeIndex)
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

  /**
   * 面に色をつける
   */
  private coloring(): void {
    const max = this.col - 1
    this.coloringFace("x", 1, max)
    this.coloringFace("x", 3, 0)
    this.coloringFace("y", 0, max)
    this.coloringFace("y", 5, 0)
    this.coloringFace("z", 4, max)
    this.coloringFace("z", 2, 0)
  }

  private coloringFace(axis: Axis, faceIndex: number, row: number): void {
    const colors = this.stiker.data[faceIndex]
    this.axis = axis
    for (let i = 0; i < this.col; i++) {
      for (let j = 0; j < this.col; j++) {
        this.cubes[this.getIndex(row, i, j)].setColor(
          faceIndex,
          colors[i + j * this.col]
        )
      }
    }
  }
}
