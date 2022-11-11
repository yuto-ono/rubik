import {
  MAX_RADIAN,
  ROTATION_SPEED,
  TRANSFER_RATE,
  TURN_RATE,
} from "./constants"
import { createVector } from "./functions"
import { Renderer } from "./Renderer"
import type { Point, TransferParams } from "./types"
import { WholeCube } from "./WholeCube"

const calcTransferParams = (screenSize: number): TransferParams => ({
  transferRate: screenSize * TRANSFER_RATE,
  screenSize,
  center: screenSize >> 1,
  turnRate: TURN_RATE / screenSize,
})

/**
 * キューブ全体の管理やアニメーションなど
 */
export class CubeManager {
  private wholeCube: WholeCube
  private renderer: Renderer
  private tParams: TransferParams
  private dragEnabled = true
  private faceTouched = false
  private playing = false
  private previousPoint: Point = { x: 0, y: 0 }
  private animationId?: number
  private moveAngleId?: number

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
      this.wholeCube.draw(this.renderer, this.tParams)
    }
  }

  /**
   * スクリーンサイズを変更
   */
  setScreenSize(screenSize: number): void {
    this.tParams = calcTransferParams(screenSize)
  }

  /**
   * キューブを描画（requestAnimationFrame使用）
   */
  drawAsync(): void {
    requestAnimationFrame(() => {
      this.wholeCube.draw(this.renderer, this.tParams)
    })
  }

  /**
   * リセット
   */
  reset(): void {
    this.playing = false
    this.wholeCube.reset()
    this.wholeCube.draw(this.renderer, this.tParams)
  }

  /**
   * シャッフル
   */
  shuffle(): void {
    this.playing = true
    this.wholeCube.shuffle()
    this.wholeCube.draw(this.renderer, this.tParams)
  }

  /**
   * ドラッグ開始時の処理
   */
  dragStart(p: Point) {
    if (this.animationId != null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = void 0
      this.wholeCube.revertAndColoring()
      this.wholeCube.draw(this.renderer, this.tParams)
    }
    this.dragEnabled = true
    this.previousPoint = p
    this.faceTouched = this.wholeCube.touch(p)
  }

  /**
   * ドラッグ処理
   */
  drag(p: Point) {
    if (this.dragEnabled) {
      if (this.faceTouched) {
        if (this.animationId == null) {
          if (this.wholeCube.detectAxis(createVector(this.previousPoint, p))) {
            this.animate()
          }
        }
      } else {
        this.moveAngle(p)
      }
    }
  }

  /**
   * アニメーション
   */
  private animate(): void {
    this.dragEnabled = false
    const startTime = performance.now()
    const animate = () => {
      const t = performance.now() - startTime
      const rad = t * ROTATION_SPEED
      if (rad < MAX_RADIAN) {
        this.wholeCube.rotate(rad)
        this.wholeCube.draw(this.renderer, this.tParams)
        this.animationId = requestAnimationFrame(animate)
      } else {
        this.wholeCube.revertAndColoring()
        this.wholeCube.draw(this.renderer, this.tParams)
        this.animationId = void 0
        if (this.playing && this.wholeCube.judge()) {
          this.playing = false
          requestAnimationFrame(() => alert("6面完成おめでとう！"))
        }
      }
    }

    this.animationId = requestAnimationFrame(animate)
  }

  /**
   * キューブ全体を回転（視点を動かす）
   */
  private moveAngle(p: Point) {
    if (this.moveAngleId != null) {
      cancelAnimationFrame(this.moveAngleId)
    }
    this.moveAngleId = requestAnimationFrame(() => {
      this.wholeCube.moveAngle(
        createVector(this.previousPoint, p),
        this.tParams
      )
      this.wholeCube.draw(this.renderer, this.tParams)
      this.previousPoint = p
      this.moveAngleId = void 0
    })
  }
}
