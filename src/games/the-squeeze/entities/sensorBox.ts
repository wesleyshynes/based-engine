import { drawBox, rotateDraw } from "../../../engine/libs/drawHelpers";
import { radToDeg } from "../../../engine/libs/mathHelpers";
import PhysBox from "../../../engine/physicsObjects/PhysBox";

export class SensorBox extends PhysBox {
    strokeColor: string = '#00FF00'
    color: string = 'rgba(0, 255, 0, 0.3)'
    triggered: boolean = false
    triggeredStrokeColor: string = '#FF0000'
    triggeredColor: string = 'rgba(255, 0, 0, 0.3)'

    options = {
        tags: {
            sensor: true,
        }
    }

    bodyOptions = { label: `sensor`, isStatic: true, isSensor: true }

    collisionStartFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            if (otherBody.options.tags.pushBox) {
                this.triggered = true
            }
        }
    }

    collisionEndFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            if (otherBody.options.tags.pushBox) {
                this.triggered = false
            }
        }
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
            drawBox({
                c: this.gameRef.ctx,
                x: (-(this.width / 2)),
                y: (-(this.height / 2)),
                width: this.width,
                height: this.height,
                fillColor: this.triggered ? this.triggeredColor : this.color,
                strokeColor: this.triggered ? this.triggeredStrokeColor : this.strokeColor,
                strokeWidth: 2,
                zoom: this.gameRef.cameraZoom
            })
        })
    }
}