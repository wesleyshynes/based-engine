import { drawPolygon, rotateDraw } from "../../../engine/libs/drawHelpers";
import { radToDeg } from "../../../engine/libs/mathHelpers";
import PhysPoly from "../../../engine/physicsObjects/PhysPoly";
import Physics from 'matter-js';

const FILL_COLOR = '#222222'
const BORDER_COLOR = '#111111'

export class LevelPolygon extends PhysPoly {

    strokeColor: string = BORDER_COLOR
    color: string = FILL_COLOR

    options = {
        tags: {
            wall: true,
            terrain: true,
        }
    }

    bodyOptions = {
        label: `polygon`,
        isStatic: true
    }

    initialize() {
        this.color = FILL_COLOR
        this.strokeColor = BORDER_COLOR
        this.initializeBody()
        // Don't call setCenter() - vertices are already relative to center point
        // and Bodies.fromVertices() positions the body correctly at (x, y)

        // Apply initial rotation if set
        if (this.angle && this.body) {
            Physics.Body.setAngle(this.body, this.angle)
        }

        console.log(this.body)
    }

    draw() {
        drawPolygon({
            c: this.gameRef.ctx,
            // vertices: this.vertices,
            vertices: this.body.vertices,
            fillColor: this.color,
            strokeColor: this.strokeColor,
            strokeWidth: 2 * this.gameRef.cameraZoom,
            cameraPos: this.gameRef.cameraPos,
            zoom: this.gameRef.cameraZoom,
        })
        // this.cameraDraw(() => {
        //     drawPolygon({
        //         c: this.gameRef.ctx,
        //         vertices: this.vertices,
        //         fillColor: 'rgba(255,0,0,0.5)',
        //         strokeColor: `rgba(255,0,0,0.25)`,
        //         strokeWidth: 2 * this.gameRef.cameraZoom,
        //         // cameraPos: this.gameRef.cameraPos,
        //         zoom: this.gameRef.cameraZoom,
        //     })
        // })
    }
}
