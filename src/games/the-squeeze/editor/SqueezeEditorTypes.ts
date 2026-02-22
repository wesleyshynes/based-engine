// Squeeze Editor Types - Game-specific type extensions

import { BaseEditorLevelData } from "../../../engine/tools/levelEditor"

// ============================================================================
// Squeeze-specific object types
// ============================================================================

export interface SqueezeWall {
    id?: string
    x: number
    y: number
    width: number
    height: number
    color: string
    angle?: number
    zIndex?: number
}

export interface SqueezePolygon {
    id?: string
    x: number
    y: number
    vertices: { x: number; y: number }[]
    angle: number
    color: string
    zIndex?: number
}

export interface SqueezePushBox {
    id?: string
    x: number
    y: number
    width: number
    height: number
    color: string
    sizeToMove: number
    angle?: number
    zIndex?: number
}

export interface SqueezeBounceBall {
    id?: string
    x: number
    y: number
    radius: number
    color: string
    sizeToMove: number
    zIndex?: number
}

export interface SqueezeMovingPlatform {
    id?: string
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
    angle?: number
    zIndex?: number
}

export interface SqueezeExitDoor {
    id?: string
    x: number
    y: number
    width: number
    height: number
    color: string
    doorPath: string
    angle?: number
    zIndex?: number
}

export interface SqueezeHazardBlock {
    id?: string
    x: number
    y: number
    width: number
    height: number
    angle?: number
    zIndex?: number
}

export interface SqueezeLevelText {
    id?: string
    x: number
    y: number
    text: string
    fontFamily?: string
    fontWeight?: string
    fontSize: number
    color: string
    angle?: number
    zIndex?: number
}

export interface SqueezeConditionalWall {
    id?: string
    x: number
    y: number
    width: number
    height: number
    color: string
    angle?: number
    flagName: string
    showWhenTrue?: boolean
    hiddenOpacity?: number
    zIndex?: number
}

export interface SqueezeLevelSensor {
    id?: string
    x: number
    y: number
    width: number
    height: number
    angle?: number
    triggerTags?: string[]
    flagName: string
    invertFlag?: boolean
    zIndex?: number
}

export interface SqueezeCollectible {
    id?: string
    x: number
    y: number
    radius: number
    color: string
    zIndex?: number
}

// ============================================================================
// Squeeze Level Data - Game-specific editor level data structure
// ============================================================================

export interface SqueezeEditorLevelData {
    // Base properties (matching BaseEditorLevelData)
    id: string
    name: string
    levelWidth: number
    levelHeight: number
    nextLevel: string
    playerStart: { x: number, y: number }
    createdAt: number
    updatedAt: number
    
    // Squeeze-specific object arrays
    walls: SqueezeWall[]
    polygons: SqueezePolygon[]
    pushBoxes: SqueezePushBox[]
    bounceBalls: SqueezeBounceBall[]
    movingPlatforms: SqueezeMovingPlatform[]
    exitDoors: SqueezeExitDoor[]
    hazardBlocks: SqueezeHazardBlock[]
    levelTexts: SqueezeLevelText[]
    levelSensors: SqueezeLevelSensor[]
    conditionalWalls: SqueezeConditionalWall[]
    collectibles: SqueezeCollectible[]
}

// ============================================================================
// Runtime level data format (used by actual game levels)
// ============================================================================

export interface SqueezeLevelData {
    name: string
    levelWidth: number
    levelHeight: number
    nextLevel: string
    playerStart: { x: number; y: number }
    boundaries: SqueezeWall[]
    walls: SqueezeWall[]
    polygons?: SqueezePolygon[]
    pushBoxes: SqueezePushBox[]
    bounceBalls?: SqueezeBounceBall[]
    movingPlatforms?: SqueezeMovingPlatform[]
    exitDoors: SqueezeExitDoor[]
    hazardBlocks?: SqueezeHazardBlock[]
    levelTexts?: SqueezeLevelText[]
    levelSensors?: {
        x: number;
        y: number;
        width: number;
        height: number;
        angle?: number;
        type: 'box' | 'ball' | 'polygon';
        triggerTags?: string[];
        flagName?: string;
        invertFlag?: boolean;
    }[]
    conditionalWalls?: {
        x: number;
        y: number;
        width: number;
        height: number;
        color?: string;
        angle?: number;
        flagName?: string;
        showWhenTrue?: boolean;
        hiddenOpacity?: number;
    }[]
    collectibles?: {
        x: number;
        y: number;
        radius: number;
        color: string;
    }[]
}
