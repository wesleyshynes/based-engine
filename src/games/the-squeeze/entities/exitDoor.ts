import { drawBox, drawEllipse, rotateDraw } from "../../../engine/libs/drawHelpers";
import { radToDeg } from "../../../engine/libs/mathHelpers";
import PhysBox from "../../../engine/physicsObjects/PhysBox";

export class ExitDoor extends PhysBox {
    x: number = 0
    y: number = 0

    width: number = 100
    height: number = 100

    color: string = '#000'
    strokeColor: string = '#3c3c3c'
    angle: number = 0

    doorPath: string = 'start-screen'

    options = {
        tags: {}
    }

    body: any;

    bodyOptions = {
        label: 'exitDoor',
        isStatic: true,
        isSensor: true
    }

    stairsNoise: any

    onExit: () => void;

    collisionStartFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags.player) {
            if (this.stairsNoise) {
                this.gameRef.soundPlayer.playSound(this.stairsNoise)
            }
            if (this.onExit) {
                this.onExit()
            }
            this.gameRef.loadLevel(this.doorPath)
        }
    }

    collisionEndFn = (o: any) => { }

    async preload() { }

    setupStairsNoise(noise: any) {
        this.stairsNoise = noise
    }

    update() { }
    draw() {
        // this.drawPhysicsBody()

        rotateDraw({
            c: this.gameRef.ctx,
            x: this.body.position.x,
            y: this.body.position.y,
            a: radToDeg(this.body.angle),
            zoom: this.gameRef.cameraZoom,
            cameraPos: this.gameRef.cameraPos
        }, () => {

            drawEllipse({
                c: this.gameRef.ctx,
                x: 0,
                y: (- this.height / 2 + this.height / 3),
                radiusX: this.width / 2,
                radiusY: this.height / 3,
                fillColor: this.color,
                strokeColor: this.strokeColor,
                strokeWidth: 5,
                zoom: this.gameRef.cameraZoom
            })

            drawBox({
                c: this.gameRef.ctx,
                x: -this.width / 2,
                y: (-this.height / 2 + this.height / 3),
                width: this.width,
                height: this.height * 2 / 3,
                fillColor: this.color,
                strokeColor: this.strokeColor,
                strokeWidth: 5,
                zoom: this.gameRef.cameraZoom
            })

            drawEllipse({
                c: this.gameRef.ctx,
                x: 0,
                y: (- this.height / 2 + this.height / 3),
                radiusX: this.width / 2,
                radiusY: this.height / 3,
                fillColor: this.color,
                zoom: this.gameRef.cameraZoom
            })

            drawBox({
                c: this.gameRef.ctx,
                x: -this.width / 2,
                y: (-this.height / 2 + this.height / 3),
                width: this.width,
                height: this.height * 2 / 3,
                fillColor: this.color,
                zoom: this.gameRef.cameraZoom
            })

            // steps
            drawBox({
                c: this.gameRef.ctx,
                x: -this.width / 2 + 2,
                y: this.height / 2 - 10,
                width: this.width - 4,
                height: 10,
                fillColor: '#333',
                strokeColor: '#000',
                strokeWidth: 2,
                zoom: this.gameRef.cameraZoom
            })

            drawBox({
                c: this.gameRef.ctx,
                x: -this.width / 2 + 4,
                y: this.height / 2 - 18,
                width: this.width - 8,
                height: 8,
                fillColor: '#333',
                strokeColor: '#000',
                strokeWidth: 2,
                zoom: this.gameRef.cameraZoom
            })

            drawBox({
                c: this.gameRef.ctx,
                x: (-this.width / 2 + 6),
                y: (this.height / 2 - 24),
                width: (this.width - 12),
                height: 6,
                fillColor: '#333',
                strokeColor: '#000',
                strokeWidth: 2,
                zoom: this.gameRef.cameraZoom
            })

            drawBox({
                c: this.gameRef.ctx,
                x: (-this.width / 2 + 8),
                y: (this.height / 2 - 28),
                width: (this.width - 16),
                height: 4,
                fillColor: '#333',
                strokeColor: '#000',
                strokeWidth: 2,
                zoom: this.gameRef.cameraZoom
            })


        })


    }
    tearDown() { }

}