import { drawBox, rotateDraw } from "../../../engine/libs/drawHelpers";
import { radToDeg } from "../../../engine/libs/mathHelpers";
import PhysBox from "../../../engine/physicsObjects/PhysBox";
import Physics from 'matter-js';

export class ConditionalWall extends PhysBox {
    strokeColor: string = '#4444FF'
    color: string = '#6666FF'
    angle: number = 0

    // Configurable properties
    flagName: string = ''  // Name of flag in levelData to check
    showWhenTrue: boolean = true  // If true, wall is solid when flag is true
    hiddenOpacity: number = 0.2  // Opacity when "hidden"

    // Internal state
    currentlyActive: boolean = false

    options = {
        tags: {
            wall: true,
            conditionalWall: true,
        }
    }

    bodyOptions = { label: `conditional-wall`, isStatic: true }

    initialize() {
        super.initialize()
        // Initialize state based on current flag value
        this.updateActiveState()
    }

    update() {
        this.updateActiveState()
    }

    updateActiveState() {
        const flagValue = this.flagName ? this.gameRef.levelData[this.flagName] : false
        const shouldBeActive = this.showWhenTrue ? flagValue : !flagValue

        // Toggle physics body sensor state
        if (shouldBeActive !== this.currentlyActive) {
            this.currentlyActive = shouldBeActive
            Physics.Body.set(this.body, { isSensor: !shouldBeActive })
        }
    }

    applyOpacity(color: string, opacity: number): string {
        // Parse color and apply opacity
        if (color.startsWith('#')) {
            // Convert hex to rgba
            const r = parseInt(color.slice(1, 3), 16)
            const g = parseInt(color.slice(3, 5), 16)
            const b = parseInt(color.slice(5, 7), 16)
            return `rgba(${r}, ${g}, ${b}, ${opacity})`
        } else if (color.startsWith('rgb(')) {
            // Convert rgb to rgba
            return color.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`)
        } else if (color.startsWith('rgba(')) {
            // Parse and replace alpha
            const parts = color.match(/[\d.]+/g)
            if (parts && parts.length >= 3) {
                return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${opacity})`
            }
        }
        return color
    }

    draw() {
        const opacity = this.currentlyActive ? 1.0 : this.hiddenOpacity
        const actualFillColor = this.applyOpacity(this.color, opacity)
        const actualStrokeColor = this.currentlyActive
            ? this.strokeColor
            : 'rgba(255, 255, 0, 0.3)'

        rotateDraw({
            c: this.gameRef.ctx,
            x: this.body.position.x,
            y: this.body.position.y,
            a: radToDeg(this.body.angle),
            zoom: this.gameRef.cameraZoom,
            cameraPos: this.gameRef.cameraPos
        }, () => {
            drawBox({
                c: this.gameRef.ctx,
                x: (-(this.width / 2)),
                y: (-(this.height / 2)),
                width: this.width,
                height: this.height,
                fillColor: actualFillColor,
                strokeColor: actualStrokeColor,
                strokeWidth: this.currentlyActive ? 2 : 1,
                zoom: this.gameRef.cameraZoom
            })
        })
    }
}
