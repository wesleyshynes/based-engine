import { drawCircle, rotateDraw } from "../../../engine/libs/drawHelpers";
import { radToDeg } from "../../../engine/libs/mathHelpers";
import PhysBall from "../../../engine/physicsObjects/PhysBall";

export class HazardBall extends PhysBall {

    radius: number = 30
    strokeColor: string = '#8B0000'
    color: string = '#FF0000'
    colorCycleSpeed: number = 0.05
    colorPhase: number = 0

    options = {
        tags: {
            wall: true,
            terrain: true,
            hazard: true,
        }
    }

    bodyOptions = { label: `hazard`, isStatic: true }

    update() {
        this.colorPhase += this.colorCycleSpeed
        if (this.colorPhase > Math.PI * 2) {
            this.colorPhase = 0
        }
    }

    getColorForCycle() {
        const t = (Math.sin(this.colorPhase) + 1) / 2
        const r = 255
        const g = Math.floor(136 * t)
        const b = 0
        return `rgb(${r}, ${g}, ${b})`
    }

    draw() {
        rotateDraw({
            c: this.gameRef.ctx,
            x: this.body.position.x,
            y: this.body.position.y,
            a: radToDeg(this.body.angle),
            zoom: this.gameRef.cameraZoom,
            cameraPos: this.gameRef.cameraPos
        }, () => {
            const currentColor = this.getColorForCycle()

            // Main ball
            drawCircle({
                c: this.gameRef.ctx,
                x: 0,
                y: 0,
                radius: this.radius,
                fillColor: currentColor,
                strokeColor: this.strokeColor,
                strokeWidth: 3,
                zoom: this.gameRef.cameraZoom,
            })

            // Warning ring
            drawCircle({
                c: this.gameRef.ctx,
                x: 0,
                y: 0,
                radius: this.radius * 0.6,
                strokeColor: 'rgba(0, 0, 0, 0.3)',
                strokeWidth: 2,
                zoom: this.gameRef.cameraZoom,
            })

            // Inner dark spot
            drawCircle({
                c: this.gameRef.ctx,
                x: 0,
                y: 0,
                radius: this.radius * 0.25,
                fillColor: 'rgba(0, 0, 0, 0.3)',
                zoom: this.gameRef.cameraZoom,
            })
        })
    }
}
