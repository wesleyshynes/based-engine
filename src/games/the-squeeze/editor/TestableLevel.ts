import { SqueezeBaseLevel } from "../levels/SqueezeBaseLevel"
import { EditorLevelData } from "./LevelEditorTypes"
import { generateLevelBoundaries } from "../helpers"

export class TestableLevel extends SqueezeBaseLevel {

    levelWidth: number = 800
    levelHeight: number = 600

    nextLevel: string = 'level-editor'
    
    playerStartPosition: any = { x: 100, y: 100 }
    levelWalls: any[] = []
    _levelBoundaries: any[] = []
    _levelWalls: any[] = []
    pushBoxes: any[] = []
    _pushBoxes: any[] = []
    movingPlatforms: any[] = []
    _movingPlatforms: any[] = []
    exitDoors: any[] = []
    _exitDoors: any[] = []

    hazardBlocks: any[] = []
    _hazardBlocks: any[] = []

    textLines: string[] = [
        'Move: ←↑↓→ or W A S D',
        'Shrink: Z',
        'Grow: X',
        'Back to Editor: ESC',
    ]

    async preload() {
        // Load the level data from game refs
        const levelData: EditorLevelData = this.gameRef.basedObjectRefs.testLevelData

        if (levelData) {
            this.levelWidth = levelData.levelWidth
            this.levelHeight = levelData.levelHeight
            this.playerStartPosition = levelData.playerStart

            // Generate boundaries
            this._levelBoundaries = generateLevelBoundaries({
                width: levelData.levelWidth,
                height: levelData.levelHeight,
                offset: 200,
            }).map(x => ({
                ...x,
                color: '#111'
            }))

            // Map walls
            this._levelWalls = levelData.walls.map(wall => ({
                x: wall.x,
                y: wall.y,
                width: wall.width,
                height: wall.height,
                color: wall.color,
            }))

            // Map push boxes
            this._pushBoxes = levelData.pushBoxes.map(box => ({
                x: box.x,
                y: box.y,
                width: box.width,
                height: box.height,
                color: box.color,
                sizeToMove: box.sizeToMove,
            }))

            // Map moving platforms
            this._movingPlatforms = levelData.movingPlatforms.map(plat => ({
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
            }))

            // Map exit doors - redirect to editor instead of original door path
            this._exitDoors = levelData.exitDoors.map(door => ({
                x: door.x,
                y: door.y,
                width: door.width,
                height: door.height,
                color: door.color,
                doorPath: 'level-editor', // Always go back to editor when testing
            }))

            // Map hazard blocks
            this._hazardBlocks = levelData.hazardBlocks.map(hazard => ({
                x: hazard.x,
                y: hazard.y,
                width: hazard.width,
                height: hazard.height,
            }))
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
