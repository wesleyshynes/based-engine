import { drawBox, drawEllipse, rotateDraw } from "../../../engine/libs/drawHelpers";
import { radToDeg } from "../../../engine/libs/mathHelpers";
import PhysBox from "../../../engine/physicsObjects/PhysBox";

export class ExitDoor extends PhysBox {
    x: number = 0
    y: number = 0

    width: number = 100
    height: number = 100

    color: string = '#1e1e1e'
    strokeColor: string = '#3c3c3c'

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
            if(this.stairsNoise) {
                this.gameRef.soundPlayer.playSound(this.stairsNoise)
            }
            if(this.onExit) {
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

    initialize() {
        this.color = '#000'
        this.strokeColor = '#3c3c3c'
        this.initializeBody()
        this.setCenter()
    }
    update() { }
    draw() {
        // this.drawPhysicsBody()

        rotateDraw({
            c: this.gameRef.ctx,
            x: this.body.position.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
            y: this.body.position.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
            a: radToDeg(this.body.angle)
        }, () => {

            drawEllipse({
                c: this.gameRef.ctx,
                x: 0,
                y: (- this.height / 2 + this.height / 3) * this.gameRef.cameraZoom,
                radiusX: this.width / 2 * this.gameRef.cameraZoom,
                radiusY: this.height / 3 * this.gameRef.cameraZoom,
                fillColor: this.color,
                strokeColor: this.strokeColor,
                strokeWidth: 5 * this.gameRef.cameraZoom
            })

            drawBox({
                c: this.gameRef.ctx,
                x: -this.width / 2 * this.gameRef.cameraZoom,
                y: (-this.height / 2 + this.height/3) * this.gameRef.cameraZoom,
                width: this.width * this.gameRef.cameraZoom,
                height: this.height * 2/3 * this.gameRef.cameraZoom,
                fillColor: this.color,
                strokeColor: this.strokeColor,
                strokeWidth: 5 * this.gameRef.cameraZoom
            })

            drawEllipse({
                c: this.gameRef.ctx,
                x: 0,
                y: (- this.height / 2 + this.height / 3) * this.gameRef.cameraZoom,
                radiusX: this.width / 2 * this.gameRef.cameraZoom,
                radiusY: this.height / 3 * this.gameRef.cameraZoom,
                fillColor: this.color,
            })

            drawBox({
                c: this.gameRef.ctx,
                x: -this.width / 2 * this.gameRef.cameraZoom,
                y: (-this.height / 2 + this.height/3) * this.gameRef.cameraZoom,
                width: this.width * this.gameRef.cameraZoom,
                height: this.height * 2/3 * this.gameRef.cameraZoom,
                fillColor: this.color,
            })

            // steps
            drawBox({
                c: this.gameRef.ctx,
                x: (-this.width / 2 + 2) * this.gameRef.cameraZoom,
                y: (this.height / 2 - 10) * this.gameRef.cameraZoom,
                width: (this.width - 4) * this.gameRef.cameraZoom,
                height: 10 * this.gameRef.cameraZoom,
                fillColor: '#333',
                strokeColor: '#000',
                strokeWidth: 2 * this.gameRef.cameraZoom
            })

            drawBox({
                c: this.gameRef.ctx,
                x: (-this.width / 2 + 4) * this.gameRef.cameraZoom,
                y: (this.height / 2 - 18) * this.gameRef.cameraZoom,
                width: (this.width - 8) * this.gameRef.cameraZoom,
                height: 8 * this.gameRef.cameraZoom,
                fillColor: '#333',
                strokeColor: '#000',
                strokeWidth: 2 * this.gameRef.cameraZoom
            })

            drawBox({
                c: this.gameRef.ctx,
                x: (-this.width / 2 + 6) * this.gameRef.cameraZoom,
                y: (this.height / 2 - 24) * this.gameRef.cameraZoom,
                width: (this.width - 12) * this.gameRef.cameraZoom,
                height: 6 * this.gameRef.cameraZoom,
                fillColor: '#333',
                strokeColor: '#000',
                strokeWidth: 2 * this.gameRef.cameraZoom
            })

            drawBox({
                c: this.gameRef.ctx,
                x: (-this.width / 2 + 8) * this.gameRef.cameraZoom,
                y: (this.height / 2 - 28) * this.gameRef.cameraZoom,
                width: (this.width - 16) * this.gameRef.cameraZoom,
                height: 4 * this.gameRef.cameraZoom,
                fillColor: '#333',
                strokeColor: '#000',
                strokeWidth: 2 * this.gameRef.cameraZoom
            })


        })


    }
    tearDown() { }

}