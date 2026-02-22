import { SqueezeLevelData } from "../editor/SqueezeEditorTypes"
import { generateLevelBoundaries } from "../helpers"

const WIDTH = 800
const HEIGHT = 600

export const LEVEL_01: SqueezeLevelData = {
    name: 'Level 01',
    levelWidth: WIDTH,
    levelHeight: HEIGHT,
    nextLevel: 'level-02',
    playerStart: { x: 75, y: 75 },
    boundaries: generateLevelBoundaries({ width: WIDTH, height: HEIGHT, offset: 200 }).map(x => ({ ...x, color: '#111' })),
    walls: [
        { x: 200, y: 425, width: 400, height: 50, color: '#000' },
        { x: 375, y: 25, width: 50, height: 50, color: '#000' },
        { x: 375, y: 125, width: 50, height: 50, color: '#000' },
        { x: 375, y: 225, width: 50, height: 50, color: '#000' },
        { x: 375, y: 325, width: 50, height: 50, color: '#000' },
        { x: 700, y: 430, width: 200, height: 50, color: '#000' },
        { x: 625, y: 550, width: 50, height: 90, color: '#000' },
    ],
    polygons: [
    ],
    pushBoxes: [
        { x: 150, y: 350, width: 90, height: 90, color: 'red', sizeToMove: 45 },
    ],
    bounceBalls: [
    ],
    movingPlatforms: [
    ],
    exitDoors: [
        { x: 730, y: 530, width: 100, height: 100, color: 'yellow', doorPath: 'level-02' },
    ],
    hazardBlocks: [
    ],
    levelTexts: [
        { x: 600, y: 75, text: 'The Squeeze - Level 01', fontSize: 24, color: 'rgba(255,255,255,0.5)', angle: -5 },
    ],
    levelSensors: [
        { x: 50, y: 350, width: 100, height: 100, type: 'box', flagName: 'jail_cell_unlocked', triggerTags: ["pushBox"] },
    ],
    conditionalWalls: [
        { x: 375, y: 75, width: 50, height: 50, color: '#333', flagName: 'jail_cell_unlocked', showWhenTrue: false },
        { x: 375, y: 175, width: 50, height: 50, color: '#333', flagName: 'jail_cell_unlocked', showWhenTrue: false },
        { x: 375, y: 275, width: 50, height: 50, color: '#333', flagName: 'jail_cell_unlocked', showWhenTrue: false, hiddenOpacity: 0.2 },
        { x: 375, y: 375, width: 50, height: 50, color: '#333', flagName: 'jail_cell_unlocked', showWhenTrue: false, hiddenOpacity: 0.2 },
    ],
    collectibles: [
        { x: 200, y: 100, radius: 15, color: '#FFD700' },
        { x: 500, y: 200, radius: 15, color: '#FFD700' },
        { x: 700, y: 350, radius: 15, color: '#FFD700' },
    ],
}
