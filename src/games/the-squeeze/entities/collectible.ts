import { drawCircle, rotateDraw } from "../../../engine/libs/drawHelpers";
import PhysBall from "../../../engine/physicsObjects/PhysBall";

export class Collectible extends PhysBall {
    x: number = 0
    y: number = 0

    radius: number = 15

    color: string = '#FFD700'

    collected: boolean = false

    options = {
        tags: {
            collectible: true,
        }
    }

    body: any;

    bodyOptions = {
        label: 'collectible',
        isStatic: true,
        isSensor: true,
    }

    collisionStartFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags.player) {
            this.collected = true
            this.gameRef.removeFromWorld(this.body)
            this.gameRef.soundPlayer.playNote(587, 0.08, 'sine')
        }
    }

    collisionEndFn = (o: any) => { }

    async preload() { }
    update() { }

    draw() {
        if (this.collected) return

        const pulse = Math.sin(this.gameRef.lastUpdate / 300) * 0.15 + 1
        const drawRadius = this.radius * pulse

        rotateDraw({
            c: this.gameRef.ctx,
            x: this.body.position.x,
            y: this.body.position.y,
            a: 0,
            zoom: this.gameRef.cameraZoom,
            cameraPos: this.gameRef.cameraPos
        }, () => {
            // Outer glow
            drawCircle({
                c: this.gameRef.ctx,
                x: 0,
                y: 0,
                radius: drawRadius * 1.3,
                fillColor: 'rgba(255, 215, 0, 0.2)',
                zoom: this.gameRef.cameraZoom,
            })

            // Main circle
            drawCircle({
                c: this.gameRef.ctx,
                x: 0,
                y: 0,
                radius: drawRadius,
                fillColor: this.color,
                strokeColor: '#B8860B',
                strokeWidth: 2,
                zoom: this.gameRef.cameraZoom,
            })

            // Inner highlight
            drawCircle({
                c: this.gameRef.ctx,
                x: -drawRadius * 0.25,
                y: -drawRadius * 0.25,
                radius: drawRadius * 0.3,
                fillColor: 'rgba(255, 255, 255, 0.4)',
                zoom: this.gameRef.cameraZoom,
            })
        })
    }

    tearDown() { }
}
