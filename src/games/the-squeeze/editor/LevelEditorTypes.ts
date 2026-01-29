// Level Editor Types and Interfaces

// Vertex type for polygon shapes
export interface VertexPoint {
    x: number
    y: number
}

// Base types for level data (used by both editor and game levels)
export interface LevelWall {
    x: number
    y: number
    width: number
    height: number
    color: string
}

export interface LevelPolygon {
    x: number
    y: number
    vertices: VertexPoint[]
    angle: number
    color: string
}

export interface LevelPushBox {
    x: number
    y: number
    width: number
    height: number
    color: string
    sizeToMove: number
}

export interface LevelMovingPlatform {
    x: number
    y: number
    width: number
    height: number
    color: string
    xDirection: number
    yDirection: number
    xSpeed: number
    ySpeed: number
    minX: number
    maxX: number
    minY: number
    maxY: number
}

export interface LevelExitDoor {
    x: number
    y: number
    width: number
    height: number
    color: string
    doorPath: string
}

export interface LevelBoundary {
    x: number
    y: number
    width: number
    height: number
    color: string
}

export interface LevelHazardBlock {
    x: number
    y: number
    width: number
    height: number
}

export interface LevelText {
    x: number
    y: number
    text: string
    fontSize: number
    color: string
    angle: number
    fontFamily?: string
    fontWeight?: string
}

// LevelData interface - used for game level constants
export interface LevelData {
    name: string
    levelWidth: number
    levelHeight: number
    nextLevel: string
    playerStart: { x: number, y: number }
    boundaries: LevelBoundary[]
    walls?: LevelWall[]
    polygons?: LevelPolygon[]
    pushBoxes?: LevelPushBox[]
    movingPlatforms?: LevelMovingPlatform[]
    exitDoors?: LevelExitDoor[]
    hazardBlocks?: LevelHazardBlock[]
    levelTexts?: LevelText[]
}

// Editor-specific types (extend base types with id and type)
export interface EditorWall extends LevelWall {
    id: string
    type: 'wall'
}

export interface EditorPolygon extends LevelPolygon {
    id: string
    type: 'polygon'
}

export interface EditorPushBox extends LevelPushBox {
    id: string
    type: 'pushBox'
}

export interface EditorMovingPlatform extends LevelMovingPlatform {
    id: string
    type: 'movingPlatform'
}

export interface EditorExitDoor extends LevelExitDoor {
    id: string
    type: 'exitDoor'
}

export interface EditorHazardBlock extends LevelHazardBlock {
    id: string
    type: 'hazardBlock'
}

export interface EditorText extends LevelText {
    id: string
    type: 'levelText'
}

export interface EditorPlayerStart {
    id: string
    type: 'playerStart'
    x: number
    y: number
}

export type EditorObject = EditorWall | EditorPolygon | EditorPushBox | EditorMovingPlatform | EditorExitDoor | EditorPlayerStart | EditorHazardBlock | EditorText

export interface EditorLevelData {
    id: string
    name: string
    levelWidth: number
    levelHeight: number
    nextLevel: string
    playerStart: { x: number, y: number }
    walls: EditorWall[]
    polygons: EditorPolygon[]
    pushBoxes: EditorPushBox[]
    movingPlatforms: EditorMovingPlatform[]
    exitDoors: EditorExitDoor[]
    hazardBlocks: EditorHazardBlock[]
    levelTexts: EditorText[]
    createdAt: number
    updatedAt: number
}

export type EditorTool = 'select' | 'wall' | 'polygon' | 'pushBox' | 'movingPlatform' | 'exitDoor' | 'playerStart' | 'pan' | 'hazardBlock' | 'levelText'

export interface PropertyField {
    key: string
    label: string
    type: 'number' | 'string' | 'color'
    min?: number
    max?: number
    step?: number
}

export const OBJECT_PROPERTIES: Record<string, PropertyField[]> = {
    wall: [
        { key: 'x', label: 'X', type: 'number' },
        { key: 'y', label: 'Y', type: 'number' },
        { key: 'width', label: 'Width', type: 'number', min: 10, max: 1000 },
        { key: 'height', label: 'Height', type: 'number', min: 10, max: 1000 },
        { key: 'color', label: 'Color', type: 'color' },
    ],
    pushBox: [
        { key: 'x', label: 'X', type: 'number' },
        { key: 'y', label: 'Y', type: 'number' },
        { key: 'width', label: 'Width', type: 'number', min: 30, max: 500 },
        { key: 'height', label: 'Height', type: 'number', min: 30, max: 500 },
        { key: 'sizeToMove', label: 'Size to Move', type: 'number', min: 20, max: 200 },
    ],
    movingPlatform: [
        { key: 'x', label: 'X', type: 'number' },
        { key: 'y', label: 'Y', type: 'number' },
        { key: 'width', label: 'Width', type: 'number', min: 20, max: 800 },
        { key: 'height', label: 'Height', type: 'number', min: 20, max: 800 },
        { key: 'xDirection', label: 'X Direction', type: 'number', min: -1, max: 1, step: 1 },
        { key: 'yDirection', label: 'Y Direction', type: 'number', min: -1, max: 1, step: 1 },
        { key: 'xSpeed', label: 'X Speed', type: 'number', min: 0, max: 20 },
        { key: 'ySpeed', label: 'Y Speed', type: 'number', min: 0, max: 20 },
        { key: 'minX', label: 'Min X', type: 'number' },
        { key: 'maxX', label: 'Max X', type: 'number' },
        { key: 'minY', label: 'Min Y', type: 'number' },
        { key: 'maxY', label: 'Max Y', type: 'number' },
        { key: 'color', label: 'Color', type: 'color' },
    ],
    exitDoor: [
        { key: 'x', label: 'X', type: 'number' },
        { key: 'y', label: 'Y', type: 'number' },
        { key: 'width', label: 'Width', type: 'number', min: 50, max: 200 },
        { key: 'height', label: 'Height', type: 'number', min: 50, max: 200 },
        { key: 'doorPath', label: 'Door Path', type: 'string' },
    ],
    hazardBlock: [
        { key: 'x', label: 'X', type: 'number' },
        { key: 'y', label: 'Y', type: 'number' },
        { key: 'width', label: 'Width', type: 'number', min: 20, max: 500 },
        { key: 'height', label: 'Height', type: 'number', min: 20, max: 500 },
    ],
    polygon: [
        { key: 'x', label: 'X', type: 'number' },
        { key: 'y', label: 'Y', type: 'number' },
        { key: 'angle', label: 'Angle (deg)', type: 'number', min: 0, max: 360 },
        { key: 'color', label: 'Color', type: 'color' },
    ],
    playerStart: [
        { key: 'x', label: 'X', type: 'number' },
        { key: 'y', label: 'Y', type: 'number' },
    ],
    levelText: [
        { key: 'x', label: 'X', type: 'number' },
        { key: 'y', label: 'Y', type: 'number' },
        { key: 'text', label: 'Text', type: 'string' },
        { key: 'fontSize', label: 'Font Size', type: 'number', min: 8, max: 200 },
        { key: 'angle', label: 'Angle (deg)', type: 'number', min: -360, max: 360 },
        { key: 'color', label: 'Color', type: 'color' },
    ],
}

export const DEFAULT_OBJECTS: Record<string, Partial<EditorObject>> = {
    wall: {
        type: 'wall',
        width: 100,
        height: 50,
        color: '#000',
    },
    pushBox: {
        type: 'pushBox',
        width: 90,
        height: 90,
        color: 'red',
        sizeToMove: 40,
    },
    movingPlatform: {
        type: 'movingPlatform',
        width: 100,
        height: 50,
        color: 'purple',
        xDirection: 1,
        yDirection: 0,
        xSpeed: 3,
        ySpeed: 0,
        minX: 0,
        maxX: 300,
        minY: 0,
        maxY: 0,
    },
    exitDoor: {
        type: 'exitDoor',
        width: 100,
        height: 100,
        color: 'yellow',
        doorPath: 'credits-screen',
    },
    hazardBlock: {
        type: 'hazardBlock',
        width: 100,
        height: 50,
    },
    polygon: {
        type: 'polygon',
        vertices: [
            { x: -50, y: -25 },
            { x: 50, y: -25 },
            { x: 50, y: 25 },
            { x: -50, y: 25 },
        ],
        angle: 0,
        color: '#000',
    },
    playerStart: {
        type: 'playerStart',
    },
    levelText: {
        type: 'levelText',
        text: 'Text',
        fontSize: 24,
        color: '#ffffff',
        angle: 0,
    },
}
