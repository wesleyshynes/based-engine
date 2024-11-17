import { drawBox, drawLine, drawText, rotateDraw } from "../../../engine/libs/drawHelpers";
import PhysBox from "../../../engine/physicsObjects/PhysBox";

export class Building extends PhysBox {
    strokeWidth: number = 2;
    tileSize: number = 64;
    bodyOptions = { label: `building`, isStatic: true }
    col: number = 0
    row: number = 0

    doorColor: string = 'red'
    doorX: number = 0
    doorY: number = 0
    doorWidth: number = 0
    doorHeight: number = 0

    windows: { x: number, y: number, width: number, height: number, color: string, strokeColor: string; row: number, col: number }[] = []
    defaultWindowColor: string = 'white'
    darkWindowColor: string = 'black'
    litWindowColor: string = 'yellow'
    windowStrokeColor: string = 'gray'
    windowStrokeWidth: number = 2

    initialize() {
        this.initializeBody()
        this.setCenter()

        const usedGrid: any = {}

        // setup the door
        this.doorWidth = this.tileSize
        this.doorHeight = this.tileSize + 4

        console.log('initializing building  ====>', this.row, this.col, this.objectKey)
        const doorSpot = Math.floor(Math.random() * (this.col - 2)) + 1
        console.log('doorSpot', doorSpot)
        this.doorY = this.bodyCenter.y + this.height / 2 - this.doorHeight
        this.doorX = this.bodyCenter.x - (this.width / 2) + (doorSpot * this.tileSize)

        console.log('door row and col', this.row, doorSpot)
        usedGrid[this.row - 1] = usedGrid[this.row] || {}
        usedGrid[this.row - 1][doorSpot] = 'door'
        // for (let i = -1 ; i < 2; i++) {
        //     usedGrid[this.row - 1][doorSpot + i] = 'door'
        // }

        // usedGrid[this.row - 2] = usedGrid[this.row - 2] || {}
        // usedGrid[this.row - 2][doorSpot] = 'door'
        // for (let i = -1 ; i < 2; i++) {
        //     usedGrid[this.row - 2][doorSpot + i] = 'door'
        // }


        // setup the windows
        const windowCount = Math.floor(Math.random() * (this.row * this.col - 2)) * 2
        for (let i = 0; i < windowCount; i++) {
            const windowX = Math.floor(Math.random() * (this.col))
            const windowY = Math.floor(Math.random() * (this.row))

            if (usedGrid[windowY] && usedGrid[windowY][windowX]) {
                continue
            }

            usedGrid[windowY] = usedGrid[windowY] || {}
            usedGrid[windowY][windowX] = 'window'

            
            let windowWidth = this.tileSize - 16
            let windowHeight = this.tileSize - 16
            
            let windowXPos = this.bodyCenter.x - this.width / 2 + windowX * this.tileSize
            let windowYPos = this.bodyCenter.y - this.height / 2 + windowY * this.tileSize

            if(windowY === 0) {
                windowHeight -= 8
                windowYPos += 4
            }

            if(
                (usedGrid[windowY + 1] && usedGrid[windowY + 1][windowX] === 'door') || 
                // (usedGrid[windowY + 1] && usedGrid[windowY + 1][windowX - 1] === 'door') ||
                // (usedGrid[windowY + 1] && usedGrid[windowY + 1][windowX + 1] === 'door') || 
                windowY === this.row - 1
            ) {
                windowHeight -= 8
                windowYPos -= 4
            }

            if(
                (usedGrid[windowY] && usedGrid[windowY][windowX - 1] === 'door') ||
                // (usedGrid[windowY+1] && usedGrid[windowY+1][windowX - 1] === 'door') ||
                windowX === 0
            ) {
                windowWidth -= 8
                windowXPos += 4
            }

            if(
                (usedGrid[windowY] && usedGrid[windowY][windowX + 1] === 'door') || 
                // (usedGrid[windowY+1] && usedGrid[windowY+1][windowX + 1] === 'door') ||
                windowX === this.col - 1
            ) {
                windowWidth -= 8
                windowXPos -= 4
            }

            // const windowColors = [this.defaultWindowColor, this.litWindowColor]
            const windowColors = [this.defaultWindowColor, this.darkWindowColor, this.litWindowColor]
            const chosenColor = windowColors[Math.floor(Math.random() * windowColors.length)]

            const possibleStrokeColors = windowColors.filter(windowColor => {
                return windowColor !== chosenColor && windowColor !== this.color
            })

            this.windows.push({ 
                x: windowXPos + (this.tileSize - windowWidth) / 2,
                y: windowYPos + (this.tileSize - windowHeight) / 2,
                width: windowWidth, 
                height: windowHeight,
                color: chosenColor,
                strokeColor: possibleStrokeColors[Math.floor(Math.random() * possibleStrokeColors.length)],
                // color: this.defaultWindowColor,
                row: windowY,
                col: windowX
            })
        }

    }

    draw() {
        this.drawPhysicsBody()
        // draw a door
        this.cameraDraw(() => {
            drawBox({
                c: this.gameRef.ctx,
                x: this.doorX,
                // x: this.bodyCenter.x - this.doorWidth / 2,
                y: this.doorY,
                // y: this.bodyCenter.y - this.doorHeight + this.height / 2,
                width: this.doorWidth,
                height: this.doorHeight,
                fillColor: this.doorColor,
                zoom: this.gameRef.cameraZoom
            })

            this.windows.forEach(window => {
                drawBox({
                    c: this.gameRef.ctx,
                    x: window.x,
                    y: window.y,
                    width: window.width,
                    height: window.height,
                    fillColor: window.color,
                    strokeColor: window.strokeColor,
                    // strokeColor: this.windowStrokeColor,
                    strokeWidth: this.windowStrokeWidth,
                    zoom: this.gameRef.cameraZoom
                })

                drawLine({
                    c: this.gameRef.ctx,
                    x: window.x + window.width / 2,
                    y: window.y,
                    toX: window.x + window.width / 2,
                    toY: window.y + window.height,
                    strokeColor: window.strokeColor,
                    strokeWidth: this.windowStrokeWidth,
                })

                drawLine({
                    c: this.gameRef.ctx,
                    x: window.x,
                    y: window.y + window.height / 2,
                    toX: window.x + window.width,
                    toY: window.y + window.height / 2,
                    strokeColor: window.strokeColor,
                    strokeWidth: this.windowStrokeWidth,
                })

                // draw the col and row
                // drawText({
                //     c: this.gameRef.ctx,
                //     x: window.x,
                //     y: window.y,
                //     text: `${window.row},${window.col}`,
                //     fontSize: 24,
                //     fillColor: 'red',
                //     fontFamily: 'Arial',
                //     align: 'center',
                //     zoom: this.gameRef.cameraZoom
                // })
            })

            // drawText({
            //     c: this.gameRef.ctx,
            //     x: this.bodyCenter.x,
            //     y: this.bodyCenter.y,
            //     text: this.objectKey,
            //     fontSize: 32,
            //     fillColor: 'red',
            //     fontFamily: 'Arial',
            //     align: 'center',
            //     zoom: this.gameRef.cameraZoom
            // })
        })
    }
}