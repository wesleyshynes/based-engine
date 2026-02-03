import { drawBox, rotateDraw } from "../../../engine/libs/drawHelpers";
import { radToDeg } from "../../../engine/libs/mathHelpers";
import PhysBox from "../../../engine/physicsObjects/PhysBox";
import Physics from 'matter-js';

export class HazardBlock extends PhysBox {

    strokeColor: string = '#8B0000'
    color: string = '#FF0000'
    colorCycleSpeed: number = 0.05
    colorPhase: number = 0
    angle: number = 0

    options = {
        tags: {
            wall: true,
            terrain: true,
            hazard: true,
        }
    }

    bodyOptions = { label: `hazard`, isStatic: true }

    update() {
        // Cycle the color phase for animation
        this.colorPhase += this.colorCycleSpeed
        if (this.colorPhase > Math.PI * 2) {
            this.colorPhase = 0
        }
    }

    getColorForCycle() {
        // Oscillate between red and orange
        const t = (Math.sin(this.colorPhase) + 1) / 2 // 0 to 1
        
        // Red: #FF0000 (255, 0, 0)
        // Orange: #FF8800 (255, 136, 0)
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
            cameraPos: this.gameRef.cameraPos,
            zoom: this.gameRef.cameraZoom
        }, () => {

            const currentColor = this.getColorForCycle()

            drawBox({
                c: this.gameRef.ctx,
                x: (-(this.width / 2)),
                y: (-(this.height / 2)),
                width: this.width,
                height: this.height,
                fillColor: currentColor,
                strokeColor: this.strokeColor,
                strokeWidth: 3,
                zoom: this.gameRef.cameraZoom
            })

            // Draw warning stripes
            const stripeCount = 5
            const stripeWidth = this.width / stripeCount
            
            for (let i = 0; i < stripeCount; i++) {
                if (i % 2 === 0) {
                    drawBox({
                        c: this.gameRef.ctx,
                        x: (-(this.width / 2) + i * stripeWidth),
                        y: (-(this.height / 2)),
                        width: stripeWidth,
                        height: this.height,
                        fillColor: 'rgba(0, 0, 0, 0.3)',
                        strokeWidth: 0,
                        zoom: this.gameRef.cameraZoom
                    })
                }
            }
        })
    }
}
