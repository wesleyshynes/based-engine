import { drawPolygon } from "../../../engine/libs/drawHelpers";
import PhysPoly from "../../../engine/physicsObjects/PhysPoly";

export class HazardPoly extends PhysPoly {

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
        const currentColor = this.getColorForCycle()
        drawPolygon({
            c: this.gameRef.ctx,
            vertices: this.body.vertices,
            fillColor: currentColor,
            strokeColor: this.strokeColor,
            strokeWidth: 3,
            cameraPos: this.gameRef.cameraPos,
            zoom: this.gameRef.cameraZoom,
        })
    }
}
