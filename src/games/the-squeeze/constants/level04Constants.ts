import { LevelData } from "../editor/LevelEditorTypes"
import { generateLevelBoundaries } from "../helpers"

const WIDTH = 1200
const HEIGHT = 900

export const LEVEL_04: LevelData = {
    name: 'Level 04',
    levelWidth: WIDTH,
    levelHeight: HEIGHT,
    nextLevel: 'level-05',
    playerStart: { x: 100, y: 740 },
    boundaries: generateLevelBoundaries({ width: WIDTH, height: HEIGHT, offset: 200 }).map(x => ({ ...x, color: '#111' })),
    walls: [
        // top blocks
        { x: 272, y: 67, width: 544, height: 134, color: '#000' },
        { x: 928, y: 67, width: 544, height: 134, color: '#000' },
        { x: 285, y: 174, width: 570, height: 50, color: '#000' },
        { x: 915, y: 174, width: 570, height: 50, color: '#000' },
        // bottom blocks
        { x: 272, y: 450, width: 544, height: 300, color: '#000' },
        { x: 928, y: 450, width: 544, height: 300, color: '#000' },
        // bottom right block
        { x: 1046, y: 755, width: 310, height: 290, color: '#000' },
    ],
    pushBoxes: [
        { x: 600, y: 250, width: 95, height: 95, color: 'red', sizeToMove: 40 },
        { x: 600, y: 350, width: 95, height: 95, color: 'red', sizeToMove: 40 },
        { x: 600, y: 450, width: 95, height: 95, color: 'red', sizeToMove: 40 },
        { x: 600, y: 750, width: 280, height: 280, color: 'red', sizeToMove: 70 },
    ],
    movingPlatforms: [
        {
            x: 831,
            y: 249,
            width: 350,
            height: 64,
            xDirection: 1,
            yDirection: 0,
            xSpeed: 3,
            ySpeed: 0,
            minX: 475,
            maxX: 900,
            minY: 249,
            maxY: 249,
            color: 'purple'
        }
    ],
    exitDoors: [
        { x: 600, y: 67, width: 100, height: 100, color: 'yellow', doorPath: 'level-05' },
    ],
}
