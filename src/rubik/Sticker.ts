import type { Axis } from "./types"

export class Sticker {
  private col: number
  data: number[][]

  constructor(col: number) {
    this.col = col
    this.data = [...Array(6)].map((_, i) => Array(col * col).fill(i))
  }

  /**
   * リセット
   */
  reset(): void {
    const { col } = this
    this.data = [...Array(6)].map((_, i) => Array(col * col).fill(i))
  }

  /**
   * 回転
   */
  rotate(axis: Axis, row: number, direction: boolean): void {
    if (!direction) {
      this.rotateRight(axis, row)
      this.rotateRight(axis, row)
    }
    this.rotateRight(axis, row)
  }

  /**
   * 右に回転
   */
  private rotateRight(axis: Axis, row: number): void {
    const max = this.col - 1
    switch (axis) {
      case "x":
        this.rotateSideRight(row, 5, 2, 0, 4)
        if (row === 0) {
          this.rotateFaceRight(3)
        } else if (row === max) {
          this.rotateFaceRight(1)
        }
        break
      case "y":
        this.rotateSideRight(row, 2, 3, 4, 1)
        if (row === 0) {
          this.rotateFaceRight(5)
        } else if (row === max) {
          this.rotateFaceRight(0)
        }
        break
      case "z":
        this.rotateSideRight(row, 3, 5, 1, 0)
        if (row === 0) {
          this.rotateFaceRight(2)
        } else if (row === max) {
          this.rotateFaceRight(4)
        }
        break
    }
  }

  /**
   * 側面を右に回転
   */
  private rotateSideRight(
    row: number,
    a: number,
    b: number,
    c: number,
    d: number
  ): void {
    const { col, data } = this
    const max = col - 1
    for (let i = 0; i < col; i++) {
      const e = i + row * col
      const f = row + (max - i) * col
      const g = max - i + row * col
      const h = row + i * col
      ;[data[d][h], data[c][g], data[b][f], data[a][e]] = [
        data[c][g],
        data[b][f],
        data[a][e],
        data[d][h],
      ]
    }
  }

  /**
   * 表面を右に回転
   */
  private rotateFaceRight(faceIndex: number): void {
    const max = this.col - 1
    this.data[faceIndex] = this.data[faceIndex].map((_, index, colors) => {
      const i = index % this.col
      const j = Math.floor(index / this.col)
      return colors[(max - i) * this.col + j]
    })
  }
}
