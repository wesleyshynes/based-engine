import { SqueezeLevelData } from "../editor/SqueezeEditorTypes"
import { generateLevelBoundaries } from "../helpers"

const WIDTH = 1200
const HEIGHT = 400

export const JAIL_ESCAPE: SqueezeLevelData = {
    name: 'Jail Escape',
    levelWidth: WIDTH,
    levelHeight: HEIGHT,
    nextLevel: 'start-screen',
    playerStart: { x: 75, y: 200 },
    boundaries: generateLevelBoundaries({ width: WIDTH, height: HEIGHT, offset: 200 }).map(x => ({ ...x, color: '#111' })),
    walls: [
        { x: 1075, y: 75, width: 250, height: 150, color: '#000' },
        { x: 687.5, y: 75, width: 225, height: 150, color: '#000' },
        { x: 250, y: 325, width: 50, height: 50, color: '#000' },
        { x: 250, y: 225, width: 50, height: 50, color: '#000' },
        { x: 250, y: 125, width: 50, height: 50, color: '#000' },
        { x: 250, y: 25, width: 50, height: 50, color: '#000' },
    ],
    polygons: [
    ],
    pushBoxes: [
        { x: 875, y: 275, width: 230, height: 197.5, color: '#d4c9b2', sizeToMove: 80 },
        { x: 325, y: 350, width: 90, height: 90, color: '#d4c9b2', sizeToMove: 40 },
        { x: 400, y: 250, width: 90, height: 90, color: '#d4c9b2', sizeToMove: 40 },
        { x: 325, y: 150, width: 90, height: 90, color: '#d4c9b2', sizeToMove: 40 },
        { x: 425, y: 50, width: 90, height: 90, color: '#d4c9b2', sizeToMove: 40 },
    ],
    bounceBalls: [
    ],
    movingPlatforms: [
    ],
    exitDoors: [
        { x: 875, y: 75, width: 100, height: 100, color: 'black', doorPath: 'start-screen' },
    ],
    hazardBlocks: [
    ],
    hazardPolys: [
    ],
    hazardBalls: [
    ],
    levelTexts: [
        { x: 1075, y: 275, text: '= = = = >', fontSize: 24, color: 'rgba(255,255,255,0.5)', angle: 0 },
    ],
    levelSensors: [
    ],
    conditionalWalls: [
    ],
    collectibles: [
    ],
}
