import { MAX_RADIAN, ROTATION_SPEED } from "./constants"
import type { Face } from "./Face"
import { createVector } from "./functions"
import type { Point } from "./types"
import { WholeCube } from "./WholeCube"

/**
 * キューブ全体の管理やアニメーションなど
 */
export class CubeManager {
  private wholeCube: WholeCube
  private dragEnabled = true
  private playing = false
  private previousPoint: Point = { x: 0, y: 0 }
  private animationId?: number
  private moveAngleId?: number
  private facesSubscriber?: (faces: Face[]) => void
  private fpsSubscriber?: (fps: number) => void

  constructor(col: number) {
    this.wholeCube = new WholeCube(col)
  }

  /**
   * 列の数を変更
   */
  setCol(col: number): void {
    if (col !== this.wholeCube.col) {
      this.wholeCube = new WholeCube(col)
      this.draw()
      this.playing = false
    }
  }

  /**
   * リセット
   */
  reset(): void {
    this.playing = false
    this.wholeCube.reset()
    this.draw()
  }

  /**
   * シャッフル
   */
  shuffle(): void {
    this.playing = true
    this.wholeCube.shuffle()
    this.draw()
  }

  /**
   * ドラッグ開始時の処理
   */
  dragStart(p: Point): void {
    this.abortAnimation()
    this.dragEnabled = true
    this.previousPoint = p
    this.wholeCube.clearTouchInfo()
  }

  /**
   * 面にタッチ
   */
  touch(p: Point, face: Face): void {
    this.abortAnimation()
    this.wholeCube.touch(face)
    this.dragEnabled = true
    this.previousPoint = p
  }

  /**
   * ドラッグ処理
   */
  drag(p: Point): void {
    if (this.dragEnabled) {
      if (this.wholeCube.faceTouched()) {
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
   * キューブを描画
   */
  draw(): void {
    if (this.facesSubscriber != null) {
      this.facesSubscriber(this.wholeCube.getVisibleFaces())
    }
  }

  /**
   * Faces を購読するコールバック関数を設定
   */
  subscribeFaces(subscriber: (faces: Face[]) => void): void {
    this.facesSubscriber = subscriber
  }

  /**
   * FPSを購読するコールバック関数を設定
   */
  subscribeFps(subscriber: (fps: number) => void) {
    this.fpsSubscriber = subscriber
  }

  /**
   * アニメーション
   */
  private animate(): void {
    this.dragEnabled = false
    const startTime = performance.now()
    let frameCount = 0
    const animate = () => {
      const t = performance.now() - startTime
      const rad = t * ROTATION_SPEED
      if (rad < MAX_RADIAN) {
        this.wholeCube.rotate(rad)
        this.draw()
        this.animationId = requestAnimationFrame(animate)
        frameCount++
      } else {
        this.wholeCube.revertAndColoring()
        this.draw()
        this.animationId = void 0
        frameCount++
        if (this.fpsSubscriber != null) {
          this.fpsSubscriber((frameCount / t) * 1000)
        }
        if (this.playing && this.wholeCube.judge()) {
          this.playing = false
          requestAnimationFrame(() => alert("6面完成おめでとう！"))
        }
      }
    }

    this.animationId = requestAnimationFrame(animate)
  }

  /**
   * アニメーション中止
   */
  private abortAnimation(): void {
    if (this.animationId != null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = void 0
      this.wholeCube.revertAndColoring()
      this.draw()
    }
  }

  /**
   * キューブ全体を回転（視点を動かす）
   */
  private moveAngle(p: Point) {
    if (this.moveAngleId != null) {
      cancelAnimationFrame(this.moveAngleId)
    }
    this.moveAngleId = requestAnimationFrame(() => {
      this.wholeCube.moveAngle(createVector(this.previousPoint, p))
      this.draw()
      this.previousPoint = p
      this.moveAngleId = void 0
    })
  }
}
