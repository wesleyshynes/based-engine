import { drawBox, rotateDraw } from "../../../engine/libs/drawHelpers";
import { radToDeg } from "../../../engine/libs/mathHelpers";
import PhysBox from "../../../engine/physicsObjects/PhysBox";

const FILL_COLOR = '#81B622'
const BORDER_COLOR = '#59981A'

export class LevelWall extends PhysBox {

    strokeColor: string = BORDER_COLOR
    color: string = FILL_COLOR

    draw() {
        rotateDraw({
            c: this.gameRef.ctx,
            x: this.body.position.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
            y: this.body.position.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
            a: radToDeg(this.body.angle)
        }, () => {

            drawBox({
                c: this.gameRef.ctx,
                x: (-(this.width / 2)) * this.gameRef.cameraZoom,
                y: (-(this.height / 2)) * this.gameRef.cameraZoom,
                width: this.width * this.gameRef.cameraZoom,
                height: this.height * this.gameRef.cameraZoom,
                fillColor: this.color,
                strokeColor: this.strokeColor,
                strokeWidth: 2 * this.gameRef.cameraZoom
            })



        })
    }
}