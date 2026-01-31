import { SqueezeLevelData } from "../editor"
import { generateLevelBoundaries } from "../helpers"

const WIDTH = 800
const HEIGHT = 600

export const LEVEL_03: SqueezeLevelData = {
    name: 'Level 03',
    levelWidth: WIDTH,
    levelHeight: HEIGHT,
    nextLevel: 'level-04',
    playerStart: { x: 70, y: 520 },
    boundaries: generateLevelBoundaries({ width: WIDTH, height: HEIGHT, offset: 200 }).map(x => ({ ...x, color: '#111' })),
    walls: [
        // top block
        { x: 322, y: 73, width: 645, height: 146, color: '#000' },
        // big square
        { x: 589, y: 199, width: 110, height: 92, color: '#000' },
        // 2 left strips
        { x: 200, y: 276, width: 290, height: 50, color: '#000' },
        { x: 200, y: 419, width: 290, height: 50, color: '#000' },
        // 2 right strips
        { x: 569, y: 276, width: 306, height: 50, color: '#000' },
        { x: 608, y: 419, width: 385, height: 50, color: '#000' },
        // stopper
        { x: 600, y: 539, width: 400, height: 126, color: '#000' },
    ],
    pushBoxes: [
        { x: 381, y: 345, width: 66, height: 174, color: 'red', sizeToMove: 25 },
        // red herring push box
        { x: 379, y: 199, width: 90, height: 90, color: 'red', sizeToMove: 45 },
    ],
    movingPlatforms: [],
    exitDoors: [
        { x: 722, y: 82, width: 100, height: 100, color: 'yellow', doorPath: 'level-04' },
    ],
}

