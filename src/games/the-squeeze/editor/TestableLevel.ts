// Squeeze Testable Level - Uses EditorDataLoader composition for loading test data

import { SqueezeBaseLevel } from "../levels/SqueezeBaseLevel"
import { EditorDataLoader } from "../../../engine/tools/levelEditor"
import { SqueezeEditorLevelData } from "./SqueezeEditorTypes"
import { generateLevelBoundaries } from "../helpers"

/**
 * Maps editor level data to runtime level format.
 * Exit doors are redirected to editor for testing purposes.
 */
function mapSqueezeEditorData(data: SqueezeEditorLevelData) {
    return {
        levelWidth: data.levelWidth,
        levelHeight: data.levelHeight,
        playerStart: data.playerStart,
        
        boundaries: generateLevelBoundaries({
            width: data.levelWidth,
            height: data.levelHeight,
            offset: 200,
        }).map(x => ({ ...x, color: '#111' })),

        walls: data.walls.map(wall => ({
            x: wall.x,
            y: wall.y,
            width: wall.width,
            height: wall.height,
            color: wall.color,
            angle: wall.angle || 0,
        })),

        polygons: (data.polygons || []).map(poly => ({
            x: poly.x,
            y: poly.y,
            vertices: poly.vertices,
            angle: poly.angle,
            color: poly.color,
        })),

        pushBoxes: data.pushBoxes.map(box => ({
            x: box.x,
            y: box.y,
            width: box.width,
            height: box.height,
            color: box.color,
            sizeToMove: box.sizeToMove,
            angle: box.angle || 0,
        })),

        movingPlatforms: data.movingPlatforms.map(plat => ({
            x: plat.x,
            y: plat.y,
            width: plat.width,
            height: plat.height,
            color: plat.color,
            xDirection: plat.xDirection,
            yDirection: plat.yDirection,
            xSpeed: plat.xSpeed,
            ySpeed: plat.ySpeed,
            minX: plat.minX,
            maxX: plat.maxX,
            minY: plat.minY,
            maxY: plat.maxY,
            angle: plat.angle || 0,
        })),

        // Redirect exit doors to editor when testing
        exitDoors: data.exitDoors.map(door => ({
            x: door.x,
            y: door.y,
            width: door.width,
            height: door.height,
            color: door.color,
            doorPath: 'level-editor', // Always go back to editor when testing
            angle: door.angle || 0,
        })),

        hazardBlocks: data.hazardBlocks.map(hazard => ({
            x: hazard.x,
            y: hazard.y,
            width: hazard.width,
            height: hazard.height,
            angle: hazard.angle || 0,
        })),

        bounceBalls: (data.bounceBalls || []).map(ball => ({
            x: ball.x,
            y: ball.y,
            radius: ball.radius,
            color: ball.color,
            sizeToMove: ball.sizeToMove,
        })),

        levelTexts: (data.levelTexts || []).map(text => ({
            x: text.x,
            y: text.y,
            text: text.text,
            fontSize: text.fontSize,
            color: text.color,
            angle: text.angle,
        })),

        levelSensors: (data.levelSensors || []).map(sensor => ({
            x: sensor.x,
            y: sensor.y,
            width: sensor.width,
            height: sensor.height,
            type: 'box' as const,
            angle: sensor.angle || 0,
            triggerTags: sensor.triggerTags || ['pushBox'],
            flagName: sensor.flagName,
            invertFlag: sensor.invertFlag || false,
        })),

        conditionalWalls: (data.conditionalWalls || []).map(wall => ({
            x: wall.x,
            y: wall.y,
            width: wall.width,
            height: wall.height,
            color: wall.color,
            angle: wall.angle || 0,
            flagName: wall.flagName,
            showWhenTrue: wall.showWhenTrue !== undefined ? wall.showWhenTrue : true,
            hiddenOpacity: wall.hiddenOpacity !== undefined ? wall.hiddenOpacity : 0.2,
        })),
    }
}

export class TestableLevel extends SqueezeBaseLevel {

    levelWidth: number = 800
    levelHeight: number = 600

    nextLevel: string = 'level-editor'
    
    playerStartPosition: any = { x: 100, y: 100 }
    levelWalls: any[] = []
    _levelBoundaries: any[] = []
    _levelWalls: any[] = []
    levelPolygons: any[] = []
    _levelPolygons: any[] = []
    pushBoxes: any[] = []
    _pushBoxes: any[] = []
    movingPlatforms: any[] = []
    _movingPlatforms: any[] = []
    exitDoors: any[] = []
    _exitDoors: any[] = []

    hazardBlocks: any[] = []
    _hazardBlocks: any[] = []

    bounceBalls: any[] = []
    _bounceBalls: any[] = []

    levelTexts: any[] = []
    _levelTexts: any[] = []

    levelSensors: any[] = []
    _levelSensors: any[] = []

    conditionalWalls: any[] = []
    _conditionalWalls: any[] = []

    textLines: string[] = [
        'Move: ←↑↓→ or W A S D',
        'Shrink: Z',
        'Grow: X',
        'Back to Editor: ESC',
    ]

    async preload() {
        // Use EditorDataLoader to get test level data
        const levelData = EditorDataLoader.getTestLevelData(this.gameRef) as SqueezeEditorLevelData | null

        if (levelData) {
            // Map editor data to runtime format
            const mapped = mapSqueezeEditorData(levelData)

            this.levelWidth = mapped.levelWidth
            this.levelHeight = mapped.levelHeight
            this.playerStartPosition = mapped.playerStart
            this._levelBoundaries = mapped.boundaries
            this._levelWalls = mapped.walls
            this._levelPolygons = mapped.polygons
            this._pushBoxes = mapped.pushBoxes
            this._movingPlatforms = mapped.movingPlatforms
            this._exitDoors = mapped.exitDoors
            this._hazardBlocks = mapped.hazardBlocks
            this._bounceBalls = mapped.bounceBalls
            this._levelTexts = mapped.levelTexts
            this._levelSensors = mapped.levelSensors
            this._conditionalWalls = mapped.conditionalWalls
        }

        // Call parent preload to load sounds
        await super.preload()
    }

    handleInput() {
        super.handleInput()
        
        const pressedKeys = this.gameRef.pressedKeys
        
        // ESC to go back to editor
        if (pressedKeys['Escape']) {
            this.gameRef.loadLevel('level-editor')
        }
    }

    checkGameCondition() {
        // Override to prevent normal game flow
        // Just let player test the level
    }
}
