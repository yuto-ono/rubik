import type { Point, TransferParams } from "./types"

const colors = [
  "#fe0", // yellow
  "#c00", // red
  "#090", // green
  "#e70", // orane
  "#00c", // blue
  "#fff", // white
  "#000", // black
] as const

/**
 * 描画するクラス
 */
export class Renderer {
  constructor(private ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 1
  }

  /**
   * 四角形を描画して塗りつぶし
   */
  fillQuadrangle(a: Point, b: Point, c: Point, d: Point, color: number) {
    const { ctx } = this
    ctx.fillStyle = colors[color]
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.lineTo(c.x, c.y)
    ctx.lineTo(d.x, d.y)
    ctx.lineTo(a.x, a.y)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }

  /**
   * 画面をクリアにする
   */
  clear(tParams: TransferParams): void {
    const { ctx } = this
    ctx.beginPath()
    ctx.clearRect(0, 0, tParams.screenSize, tParams.screenSize)
  }
}
