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

    draw() {
        drawPolygon({
            c: this.gameRef.ctx,
            // vertices: this.vertices,
            vertices: this.body.vertices,
            fillColor: this.color,
            strokeColor: this.strokeColor,
            strokeWidth: 2,
            cameraPos: this.gameRef.cameraPos,
            zoom: this.gameRef.cameraZoom,
        })
    }
}
