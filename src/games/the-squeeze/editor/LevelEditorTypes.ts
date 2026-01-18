// Level Editor Types and Interfaces

export interface EditorWall {
    id: string
    type: 'wall'
    x: number
    y: number
    width: number
    height: number
    color: string
}

export interface EditorPushBox {
    id: string
    type: 'pushBox'
    x: number
    y: number
    width: number
    height: number
    color: string
    sizeToMove: number
}

export interface EditorMovingPlatform {
    id: string
    type: 'movingPlatform'
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

export interface EditorExitDoor {
    id: string
    type: 'exitDoor'
    x: number
    y: number
    width: number
    height: number
    color: string
    doorPath: string
}

export interface EditorPlayerStart {
    id: string
    type: 'playerStart'
    x: number
    y: number
}

export type EditorObject = EditorWall | EditorPushBox | EditorMovingPlatform | EditorExitDoor | EditorPlayerStart

export interface EditorLevelData {
    id: string
    name: string
    levelWidth: number
    levelHeight: number
    playerStart: { x: number, y: number }
    walls: EditorWall[]
    pushBoxes: EditorPushBox[]
    movingPlatforms: EditorMovingPlatform[]
    exitDoors: EditorExitDoor[]
    createdAt: number
    updatedAt: number
}

export type EditorTool = 'select' | 'wall' | 'pushBox' | 'movingPlatform' | 'exitDoor' | 'playerStart' | 'pan'

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
    playerStart: [
        { key: 'x', label: 'X', type: 'number' },
        { key: 'y', label: 'Y', type: 'number' },
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
    playerStart: {
        type: 'playerStart',
    },
}
