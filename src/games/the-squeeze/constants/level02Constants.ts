import { LevelData } from "../editor/LevelEditorTypes"
import { generateLevelBoundaries } from "../helpers"

const WIDTH = 800
const HEIGHT = 600

export const LEVEL_02: LevelData = {
    name: 'Level 02',
    levelWidth: WIDTH,
    levelHeight: HEIGHT,
    nextLevel: 'level-03',
    playerStart: { x: 64, y: 535 },
    boundaries: generateLevelBoundaries({ width: WIDTH, height: HEIGHT, offset: 200 }).map(x => ({ ...x, color: '#111' })),
    walls: [
        // middle wall
        { x: 300, y: 300, width: 50, height: 502, color: '#000' },
        // exit boundaries
        { x: 700, y: 113, width: 200, height: 226, color: '#000' },
        { x: 700, y: 489, width: 200, height: 226, color: '#000' },
    ],
    pushBoxes: [
        { x: 463, y: 315, width: 262, height: 220, color: 'red', sizeToMove: 60 },
    ],
    movingPlatforms: [],
    exitDoors: [
        { x: 730, y: 315, width: 100, height: 100, color: 'yellow', doorPath: 'level-03' },
    ],
}
