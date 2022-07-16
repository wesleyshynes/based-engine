import { BasedButton } from "../../../engine/BasedButton";
import { BasedLevel } from "../../../engine/BasedLevel";
import { FollowCam } from "../../../engine/cameras/FollowCam";
import { boxCollision } from "../../../engine/libs/collisionHelpers";
import { createSprite, drawBox, drawCircle, drawImage, drawText } from "../../../engine/libs/drawHelpers";
import { getRandomInt } from "../../../engine/libs/mathHelpers";
import { DicePlayer } from "../entities/DicePlayer";

// sprites
import BgTilemap from '../../../assets/dice-grid/tilemap_big.png'
// import BgTilemap from '../../../assets/dice-grid/tilemap.png'
import SkeletonTileSheet from '../../../assets/dice-grid/skeleton spritesheet calciumtrice_big.png'
import { sampleLayout } from "../layouts/sampleLayouts";
import { SpriteTiler } from "../utils/SpriteTiler";

export class StandardLevel extends BasedLevel {

    levelWidth: number = 1000
    levelHeight: number = 1000

    players: any[] = []

    levelGrid: { [p: string]: any } = {}
    levelGridX: number = 14
    levelGridY: number = 10
    levelGridSize: number = 128

    selectedPlayer: any;
    selectedGrid: string = ''

    winSpot = `3-2`

    // Camera related stuff
    miniMapActive: boolean = true
    followCam: any;

    // Interface stuff
    cameraZoomButton: any

    // Tools
    spriteTiler: any

    // Dice stuff
    diceValue: number = 0
    rollDiceBtn: any;

    // Sprites stuff
    bgTilemap: any;
    skeletonTileSheet: any

    async preload() {
        this.gameRef.drawLoading('Tile map', .1)
        this.bgTilemap = await createSprite({
            c: this.gameRef.ctx,
            sprite: BgTilemap,
            sx: 0,
            sy: 0,
            sWidth: 128,
            sHeight: 128,
            dx: 0,
            dy: 0,
            dWidth: 1028,
            dHeight: 1028,
            frame: 0,
            lastUpdate: 0,
            updateDiff: 1000 / 60 * 10
        })

        this.gameRef.drawLoading('Skellies', .3)
        this.skeletonTileSheet = await createSprite({
            c: this.gameRef.ctx,
            sprite: SkeletonTileSheet,
            sx: 0,
            sy: 0,
            sWidth: 64,
            sHeight: 64,
            dx: 0,
            dy: 0,
            dWidth: 64,
            dHeight: 64,
            frame: 0,
            lastUpdate: 0,
            updateDiff: 1000 / 60 * 10
        })
    }

    initialize(): void {

        // reset variables
        this.gameRef.cameraZoom = 1
        this.levelWidth = this.levelGridX * this.levelGridSize
        this.levelHeight = this.levelGridY * this.levelGridSize

        this.followCam = new FollowCam({ key: 'followCam', gameRef: this.gameRef })
        this.followCam.levelWidth = this.levelWidth
        this.followCam.levelHeight = this.levelHeight

        // create the player

        // create the grid
        this.levelGrid = {}
        for (let x = 0; x < this.levelGridX; x++) {
            for (let y = 0; y < this.levelGridY; y++) {
                this.levelGrid[`${x}-${y}`] = {
                    color: (x + y) % 2 === 0 ? '#fff' : '#000',
                    occupants: {},
                }
                if (sampleLayout[`${x}-${y}`]) {
                    this.levelGrid[`${x}-${y}`].tile = sampleLayout[`${x}-${y}`]
                }
            }
        }

        // create the players
        for (let i = 0; i < 3; i++) {
            const p = new DicePlayer({
                key: `player${i}`,
                gameRef: this.gameRef,
            })
            p.color = 'blue'
            p.playerName = `Player ${i}`
            p.x = (i * this.levelGridSize) + this.levelGridSize / 2
            p.y = (i * this.levelGridSize) + this.levelGridSize / 2
            p.gridRef = this.levelGrid
            p.spriteSheet = {...this.skeletonTileSheet}
            p.initialize()
            this.players.push(p)
        }
        this.selectPlayer(this.players[0])

        // setup interface
        this.cameraZoomButton = new BasedButton({ gameRef: this.gameRef, key: 'cameraZoomButton' })
        this.cameraZoomButton.x = 10
        this.cameraZoomButton.y = 10
        this.cameraZoomButton.width = 60
        this.cameraZoomButton.height = 40
        this.cameraZoomButton.clickFunction = () => {
            this.miniMapActive = !this.miniMapActive
            this.cameraZoomButton.buttonText = this.miniMapActive ? 'Full' : 'Zoom'
        }
        this.cameraZoomButton.buttonText = this.miniMapActive ? 'Full' : 'Zoom'

        this.rollDiceBtn = new BasedButton({ gameRef: this.gameRef, key: 'rollDiceBtn' })
        this.rollDiceBtn.x = 10
        this.rollDiceBtn.y = 60
        this.rollDiceBtn.width = 60
        this.rollDiceBtn.height = 40
        this.rollDiceBtn.clickFunction = () => {
            if (this.selectedPlayer.onTarget) {
                this.diceValue = getRandomInt(6) + 1
            }
        }
        this.rollDiceBtn.buttonText = 'Roll'

        // Sprite tool
        this.spriteTiler = new SpriteTiler({ gameRef: this.gameRef, key: 'spriteTiler' })
        this.spriteTiler.bgTilemap = this.bgTilemap
        this.spriteTiler.x = 10
        this.spriteTiler.y = 100
        this.spriteTiler.saveFunction = () => {
            console.log('save sprite sheet')
            const sampleSpriter: any = {}
            for (let x = 0; x < this.levelGridX; x++) {
                for (let y = 0; y < this.levelGridY; y++) {
                    const spriteEntry = this.levelGrid[`${x}-${y}`]
                    if (spriteEntry && spriteEntry.tile) {
                        sampleSpriter[`${x}-${y}`] = spriteEntry.tile
                    }
                }
            }
            console.log(JSON.stringify(sampleSpriter))
        }
        this.spriteTiler.initialize()
    }

    checkGameCondition() {
        // const playerGrid = this.selectedPlayer.getGridKey()
        // if (playerGrid === this.winSpot) {
        //     // this.gameRef.loadLevel('start-screen')
        //     this.selectedPlayer.color = 'green'
        // } else {
        //     this.selectedPlayer.color = 'red'
        // }
    }

    selectPlayer(player: DicePlayer) {
        if (this.selectedPlayer) {
            this.selectedPlayer.selected = false
        }
        this.selectedPlayer = player
        this.selectedPlayer.selected = true
    }

    handleInput() {
        const xMousePos = Math.floor(((this.gameRef.mouseInfo.x - this.gameRef.cameraPos.x) / this.gameRef.cameraZoom) / this.levelGridSize)
        const yMousePos = Math.floor(((this.gameRef.mouseInfo.y - this.gameRef.cameraPos.y) / this.gameRef.cameraZoom) / this.levelGridSize)
        if (this.levelGrid[this.selectedGrid]) {
            this.levelGrid[this.selectedGrid].selected = false
        }
        this.selectedGrid = `${xMousePos}-${yMousePos}`
        if (this.levelGrid[this.selectedGrid]) {
            const activeGrid = this.levelGrid[this.selectedGrid]
            activeGrid.selected = true

            if (this.diceValue === 0 && this.selectedPlayer.onTarget) {
                if (this.gameRef.mouseInfo.mouseDown && activeGrid.occupants && Object.keys(activeGrid.occupants).length > 0) {
                    this.selectPlayer(activeGrid.occupants[Object.keys(activeGrid.occupants)[0]])
                }
            } else {
                let validTarget = false
                const playerPos = this.selectedPlayer.gridCoordinates
                if (
                    (playerPos.y === yMousePos && Math.abs(playerPos.x - xMousePos) <= this.diceValue) ||
                    (playerPos.x === xMousePos && Math.abs(playerPos.y - yMousePos) <= this.diceValue)
                ) {
                    validTarget = true
                }
                if (this.gameRef.mouseInfo.mouseDown && validTarget && this.selectedPlayer.onTarget) {
                    this.selectedPlayer.setTarget({
                        x: xMousePos * this.levelGridSize + this.levelGridSize / 2,
                        y: yMousePos * this.levelGridSize + this.levelGridSize / 2,
                    })
                    this.diceValue = 0
                }
            }


            // handle sprite tiler controls
            if (this.spriteTiler.active && this.gameRef.mouseInfo.mouseDown && this.diceValue === 0) {
                this.levelGrid[this.selectedGrid].tile = this.spriteTiler.getCurrentSprite()
            }
        }
    }

    removePlayerFromGridEntry(player: DicePlayer) {
        const gridKey = player.getGridKey()
        if (this.levelGrid[gridKey]) {
            delete this.levelGrid[gridKey].occupants[player.objectKey]
        }
    }

    addPlayerToGridEntry(player: DicePlayer) {
        const gridKey = player.getGridKey()
        if (this.levelGrid[gridKey]) {
            this.levelGrid[gridKey].occupants[player.objectKey] = player
        }
    }

    playerUpdater(player: DicePlayer) {
        this.removePlayerFromGridEntry(player)
        player.update()
        this.addPlayerToGridEntry(player)
        if (player.objectKey !== this.selectedPlayer.objectKey) {
            return
        }
        if (player.otherOccupantsInGrid()) { 
            Object.keys(this.levelGrid[player.getGridKey()].occupants).forEach((playerKey) => {
                if(playerKey === player.objectKey) {
                    return
                }
                const otherPlayer = this.levelGrid[player.getGridKey()].occupants[playerKey]
                this.removePlayerFromGridEntry(otherPlayer)
                otherPlayer.active = false
            })
        }
    }


    update(): void {
        // did we win?
        this.checkGameCondition()

        this.cameraZoomButton.update()
        this.rollDiceBtn.update()

        this.spriteTiler.update()

        if (!this.cameraZoomButton.hovered && !this.rollDiceBtn.hovered) {
            this.handleInput()
        }

        // update players
        this.players.forEach(p => {
            if(!p.active) { return }
            this.playerUpdater(p)
        })

        this.updateCamera()
    }

    updateCamera() {
        this.followCam.setTarget(
            { x: this.selectedPlayer.x, y: this.selectedPlayer.y },
        )
        this.followCam.setFullScreen(this.miniMapActive)
        this.followCam.update()
    }

    draw(): void {
        this.gameRef.ctx.beginPath()
        this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
        this.gameRef.ctx.fillStyle = '#222'
        this.gameRef.ctx.fill()

        // draw the level
        const gridMulti = this.levelGridSize * this.gameRef.cameraZoom

        for (let x = 0; x < this.levelGridX; x++) {
            for (let y = 0; y < this.levelGridY; y++) {
                const gridKey = `${x}-${y}`
                const grid = this.levelGrid[gridKey]
                if (grid) {
                    const drawX = x * gridMulti + this.gameRef.cameraPos.x
                    const drawY = y * gridMulti + this.gameRef.cameraPos.y
                    if (boxCollision(
                        { x: 0, y: 0, w: this.gameRef.gameWidth, h: this.gameRef.gameHeight },
                        { x: drawX, y: drawY, w: gridMulti, h: gridMulti },
                    )) {
                        // draw the box
                        drawBox({
                            c: this.gameRef.ctx,
                            x: drawX,
                            y: drawY,
                            width: gridMulti,
                            height: gridMulti,
                            fillColor: grid.color,
                        })

                        if (grid.tile) {
                            drawImage({
                                ...this.bgTilemap,
                                sx: grid.tile.x * this.bgTilemap.sWidth,
                                sy: grid.tile.y * this.bgTilemap.sHeight,
                                dx: Math.floor(drawX),
                                dy: Math.floor(drawY),
                                dWidth: Math.ceil(gridMulti),
                                dHeight: Math.ceil(gridMulti)
                            })
                        }
                        if (grid.selected) {
                            drawBox({
                                c: this.gameRef.ctx,
                                x: drawX,
                                y: drawY,
                                width: gridMulti,
                                height: gridMulti,
                                fillColor: 'rgba(255,255,0,0.5)',
                            })
                        }

                        // draw valid spot marker
                        let validSpot = false
                        if (this.diceValue > 0) {
                            const playerXPos = Math.floor(this.selectedPlayer.x / this.levelGridSize)
                            const playerYPos = Math.floor(this.selectedPlayer.y / this.levelGridSize)
                            if (playerYPos === y && Math.abs(playerXPos - x) <= this.diceValue) {
                                validSpot = true
                            }
                            if (playerXPos === x && Math.abs(playerYPos - y) <= this.diceValue) {
                                validSpot = true
                            }
                        }
                        if (validSpot) {
                            drawCircle({
                                c: this.gameRef.ctx,
                                radius: 8 * this.gameRef.cameraZoom,
                                fillColor: 'orange',
                                x: drawX + gridMulti / 2,
                                y: drawY + gridMulti / 2,
                            })
                        }

                        // draw the win spot
                        if (gridKey === this.winSpot) {
                            drawCircle({
                                c: this.gameRef.ctx,
                                radius: 5 * this.gameRef.cameraZoom,
                                fillColor: 'green',
                                x: drawX + gridMulti / 2,
                                y: drawY + gridMulti / 2,
                            })
                        }
                    }
                }
            }
        }

        // draw entities
        this.players.forEach(p => {
            if(!p.active) { return }
            p.draw()
        })

        // draw interface

        this.cameraZoomButton.draw()
        this.rollDiceBtn.draw()

        this.spriteTiler.draw()
        // this.spriteXSlider.draw()
        // this.spriteYSlider.draw()
        // this.saveSpriteSheetBtn.draw()
        //
        // drawImage({
        //     ...this.bgTilemap,
        //     sWidth: 1028,
        //     sHeight: 1028,
        //     dx: 80,
        //     dy: 180,
        //     dWidth: 128,
        //     dHeight: 128,
        // })

        // drawBox({
        //     c: this.gameRef.ctx,
        //     x: 80 + 16 * this.spriteXSlider.value,
        //     y: 180 + 16 * Math.abs(7 - this.spriteYSlider.value),
        //     width: 16,
        //     height: 16,
        //     fillColor: 'rgba(0,0,0,0.2)',
        //     strokeWidth: 1,
        //     strokeColor: '#000',
        // })

        // text stuff
        drawText({
            c: this.gameRef.ctx,
            text: `Dice: ${this.diceValue}`,
            x: 10,
            y: this.gameRef.gameHeight - 50,
            fontSize: 20,
            fillColor: 'green',
            fontFamily: 'sans-serif',
            align: 'left'
        })
    }

    tearDown(): void { }
} 