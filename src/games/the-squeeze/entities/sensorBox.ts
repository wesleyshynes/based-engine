import { drawBox, rotateDraw } from "../../../engine/libs/drawHelpers";
import { radToDeg } from "../../../engine/libs/mathHelpers";
import PhysBox from "../../../engine/physicsObjects/PhysBox";

export class SensorBox extends PhysBox {
    strokeColor: string = '#00FF00'
    color: string = 'rgba(0, 255, 0, 0.3)'
    triggered: boolean = false
    triggeredStrokeColor: string = '#FF0000'
    triggeredColor: string = 'rgba(255, 0, 0, 0.3)'

    // Configurable properties
    triggerTags: string[] = ['pushBox']  // Tags that trigger this sensor
    flagName: string = ''  // Name of flag to set in levelData
    invertFlag: boolean = false  // If true, flag is true when NOT triggered

    // Track colliding objects
    collidingObjects: Set<string> = new Set()

    options = {
        tags: {
            sensor: true,
        }
    }

    bodyOptions = { label: `sensor`, isStatic: true, isSensor: true }

    collisionStartFn = (o: any) => {
        const ref = o.plugin.basedRef()
        if (ref && ref.options && ref.options.tags) {
            // Check if any trigger tag matches
            const hasMatchingTag = this.triggerTags.some(tag => ref.options.tags[tag])
            if (hasMatchingTag) {
                this.collidingObjects.add(ref.objectKey)
                this.updateTriggerState()
            }
        }
    }

    collisionEndFn = (o: any) => {
        const ref = o.plugin.basedRef()
        if (ref) {
            this.collidingObjects.delete(ref.objectKey)
            this.updateTriggerState()
        }
    }

    updateTriggerState() {
        const isTriggered = this.collidingObjects.size > 0
        this.triggered = isTriggered

        if (this.flagName) {
            const flagValue = this.invertFlag ? !isTriggered : isTriggered
            this.gameRef.levelData[this.flagName] = flagValue
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