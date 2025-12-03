import { drawLine } from "../../../engine/libs/drawHelpers";
import PhysBall from "../../../engine/physicsObjects/PhysBall";

export class MouseTarget extends PhysBall {
    x: number = 0
    y: number = 0

    radius: number = 10

    color: string = 'rgba(0,0,0,0)'

    bodyOptions = {
        label: 'mouseTarget',
        isStatic: false,
        isSensor: true
    }

    options = {
        tags: {
            mouseTarget: true
        }
    }
    primaryColor: string = 'rgba(0, 255, 0, 0.8)'
    secondaryColor: string = 'rgba(0, 0, 0, 0.8)'


    draw() {
        drawLine({
            c: this.gameRef.ctx,
            x: this.body.position.x - 10,
            y: this.body.position.y - 10,
            toX: this.body.position.x + 10,
            toY: this.body.position.y + 10,
            strokeColor: this.color,
            strokeWidth: 10,
            cameraPos: this.gameRef.cameraPos,
            zoom: this.gameRef.cameraZoom
        })
        drawLine({
            c: this.gameRef.ctx,
            x: this.body.position.x + 10,
            y: this.body.position.y - 10,
            toX: this.body.position.x - 10,
            toY: this.body.position.y + 10,
            strokeColor: this.color,
            strokeWidth: 10,
            cameraPos: this.gameRef.cameraPos,
            zoom: this.gameRef.cameraZoom
        })
        drawLine({
            c: this.gameRef.ctx,
            x: this.body.position.x - 10,
            y: this.body.position.y - 10,
            toX: this.body.position.x + 10,
            toY: this.body.position.y + 10,
            strokeColor: this.strokeColor,
            strokeWidth: 4,
            cameraPos: this.gameRef.cameraPos,
            zoom: this.gameRef.cameraZoom
        })
        drawLine({
            c: this.gameRef.ctx,
            x: this.body.position.x + 10,
            y: this.body.position.y - 10,
            toX: this.body.position.x - 10,
            toY: this.body.position.y + 10,
            strokeColor: this.strokeColor,
            strokeWidth: 4,
            cameraPos: this.gameRef.cameraPos,
            zoom: this.gameRef.cameraZoom
        })
    }
}