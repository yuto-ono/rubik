import { Renderer } from "./Renderer"
import type { TransferParams, Vector } from "./types"
import { WholeCube } from "./WholeCube"

const calcTransferParams = (screenSize: number): TransferParams => ({
  transferRate: Math.round(screenSize * 0.75),
  screenSize,
  center: screenSize >> 1,
  turnRate: 4 / screenSize,
})

export class CubeManager {
  private wholeCube: WholeCube
  private renderer: Renderer
  private tParams: TransferParams

  constructor(col: number, screenSize: number, ctx: CanvasRenderingContext2D) {
    this.wholeCube = new WholeCube(col)
    this.renderer = new Renderer(ctx)
    this.tParams = calcTransferParams(screenSize)
  }

  /**
   * 列の数を変更
   */
  setCol(col: number): void {
    if (col !== this.wholeCube.col) {
      this.wholeCube = new WholeCube(col)
      console.log("setCol", col)
    }
  }

  /**
   * スクリーンサイズを変更
   */
  setScreenSize(screenSize: number): void {
    this.tParams = calcTransferParams(screenSize)
  }

  /**
   * キューブを描画
   */
  draw(): void {
    this.wholeCube.draw(this.renderer, this.tParams)
  }

  /**
   * キューブ全体を回転（視点を動かす）
   */
  moveAngle(v: Vector): void {
    this.wholeCube.moveAngle(v, this.tParams)
  }
}
