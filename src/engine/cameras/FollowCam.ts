import { BasedObject } from "../BasedObject";
import { normalizeVector, XYCoordinateType } from "../libs/mathHelpers";

export class FollowCam extends BasedObject {
    x: number = 0
    y: number = 0

    levelWidth: number = 1000
    levelHeight: number = 1000

    activeTarget: XYCoordinateType = {
        x: 0,
        y: 0,
    }

    fullScreen: boolean = false
    zoomSetting: number = 1
    defaultBound: boolean = true
    fullScreenBound: boolean = true

    async preload() {}
    initialize() {
        this.activeTarget = {
            x: 0,
            y: 0,
        }
        this.x = 0
        this.y = 0
    }

    setTarget(target: XYCoordinateType) {
        this.activeTarget = {
            x: target.x,
            y: target.y,
        }
    }

    setFullScreen(fullScreen: boolean) {
        this.fullScreen = fullScreen
    }

    setZoomLevel(amount: number) {
        this.zoomSetting = Math.abs(amount)
    }

    update() {
        let targetZoom = this.zoomSetting
        const cameraSpeed: number = 10
        const cameraZoomSpeed: number = .01
        let currentCamZoom: number = this.gameRef.cameraZoom
        if (this.fullScreen) {
            this.activeTarget = {
                x: this.levelWidth / 2,
                y: this.levelHeight / 2
            }
            if (this.gameRef.gameWidth > this.gameRef.gameHeight) {
                targetZoom = this.gameRef.gameHeight / this.levelHeight
                if(targetZoom * this.levelWidth > this.gameRef.gameWidth) {
                    targetZoom = this.gameRef.gameWidth / this.levelWidth
                }
            } else {
                targetZoom = this.gameRef.gameWidth / this.levelWidth
                if(targetZoom * this.levelHeight > this.gameRef.gameHeight) {
                    targetZoom = this.gameRef.gameHeight / this.levelHeight
                }
            }
        }

        if(this.x !== this.activeTarget.x || this.y !== this.activeTarget.y) {
            const moveCam = normalizeVector({
              x: this.activeTarget.x - this.x,
              y: this.activeTarget.y - this.y
            }, cameraSpeed * this.gameRef.diffMulti) 
            this.x += moveCam.x
            this.y += moveCam.y
          }
          if(Math.abs(this.x - this.activeTarget.x) <= cameraSpeed * this.gameRef.diffMulti) {
            this.x = Math.floor(this.activeTarget.x)
          }
      
          if(Math.abs(this.y - this.activeTarget.y) <= cameraSpeed * this.gameRef.diffMulti) {
            this.y = Math.floor(this.activeTarget.y)
          }

        if (currentCamZoom !== targetZoom) {
            currentCamZoom += ((targetZoom - currentCamZoom >= 0 ? 1 : -1) * cameraZoomSpeed)*this.gameRef.diffMulti
            if(Math.abs(currentCamZoom - targetZoom) <= cameraZoomSpeed) {
              currentCamZoom = targetZoom
            }
        }

        // update actual camera
        this.gameRef.cameraZoom = Math.abs(currentCamZoom)
        this.gameRef.updateCamera(this, this.fullScreen ? this.fullScreenBound : this.defaultBound)
    }
    draw() {}
    tearDown() {}
}