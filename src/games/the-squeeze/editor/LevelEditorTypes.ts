// Level Editor Types and Interfaces

import { PrimitiveType, DrawContext, CoordinateHandleConfig } from "./LevelEditorPrimitives"

// Re-export DrawContext for convenience
export { DrawContext } from "./LevelEditorPrimitives"

// Vertex type for polygon shapes
export interface VertexPoint {
    x: number
    y: number
}

// ============================================================================
// Built-in Tools (not placeable objects)
// ============================================================================

export type BuiltInTool = 'select' | 'pan'

// ============================================================================
// Base types for level data (used by both editor and game levels)
// ============================================================================

export interface LevelWall {
    x: number
    y: number
    width: number
    height: number
    color: string
    angle?: number
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
    angle?: number
}

export interface LevelBounceBall {
    x: number
    y: number
    radius: number
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
    angle?: number
}

export interface LevelExitDoor {
    x: number
    y: number
    width: number
    height: number
    color: string
    doorPath: string
    angle?: number
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
    angle?: number
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
    bounceBalls?: LevelBounceBall[]
    movingPlatforms?: LevelMovingPlatform[]
    exitDoors?: LevelExitDoor[]
    hazardBlocks?: LevelHazardBlock[]
    levelTexts?: LevelText[]
}

// Editor-specific types (extend base types with id, type, and optional zIndex for editor)
export interface EditorWall extends LevelWall {
    id: string
    type: 'wall'
    zIndex?: number
}

export interface EditorPolygon extends LevelPolygon {
    id: string
    type: 'polygon'
    zIndex?: number
}

export interface EditorPushBox extends LevelPushBox {
    id: string
    type: 'pushBox'
    zIndex?: number
}

export interface EditorBounceBall extends LevelBounceBall {
    id: string
    type: 'bounceBall'
    zIndex?: number
}

export interface EditorMovingPlatform extends LevelMovingPlatform {
    id: string
    type: 'movingPlatform'
    zIndex?: number
}

export interface EditorExitDoor extends LevelExitDoor {
    id: string
    type: 'exitDoor'
    zIndex?: number
}

export interface EditorHazardBlock extends LevelHazardBlock {
    id: string
    type: 'hazardBlock'
    zIndex?: number
}

export interface EditorText extends LevelText {
    id: string
    type: 'levelText'
    zIndex?: number
}

export interface EditorPlayerStart {
    id: string
    type: 'playerStart'
    x: number
    y: number
    zIndex?: number
}

export type EditorObject = EditorWall | EditorPolygon | EditorPushBox | EditorBounceBall | EditorMovingPlatform | EditorExitDoor | EditorPlayerStart | EditorHazardBlock | EditorText

// All placeable object type keys
export type PlaceableObjectType = EditorObject['type']

// Combined tool type (built-in tools + placeable object types)
export type EditorTool = BuiltInTool | PlaceableObjectType

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
    bounceBalls: EditorBounceBall[]
    movingPlatforms: EditorMovingPlatform[]
    exitDoors: EditorExitDoor[]
    hazardBlocks: EditorHazardBlock[]
    levelTexts: EditorText[]
    createdAt: number
    updatedAt: number
}

// ============================================================================
// Property Field Types
// ============================================================================

export interface PropertyField {
    key: string
    label: string
    type: 'number' | 'string' | 'color' | 'coordinate'
    min?: number
    max?: number
    step?: number
    // For coordinate type - the paired keys
    coordinateKeys?: { x: string, y: string }
}

// ============================================================================
// Object Definition - used by the registry to define placeable objects
// ============================================================================

export interface ObjectDefinition {
    // The primitive type this object uses for basic rendering
    primitive: PrimitiveType
    // Label shown on the toolbar button
    toolLabel: string
    // How the object is created: single-click or multi-click (like polygon)
    creationMode: 'single-click' | 'multi-click'
    // The key in EditorLevelData where instances are stored (e.g., 'walls', 'pushBoxes')
    // For playerStart this is special - stored directly on level.playerStart
    arrayKey: keyof EditorLevelData | 'playerStart'
    // Default zIndex for rendering order (0 if not specified)
    zIndex: number
    // Default values for new instances (merged with primitive defaults)
    defaults: Record<string, any>
    // Property fields shown in the property panel
    properties: PropertyField[]
    // Coordinate handle configurations (for things like movingPlatform min/max points)
    coordinateHandles?: CoordinateHandleConfig[]
    // Optional custom draw function (called after primitive draw)
    customDraw?: (obj: any, ctx: DrawContext, selected: boolean) => void
    // Color used for the object (can be a property key or a fixed color)
    colorKey?: string
    // Fixed color override (used if object doesn't have a color property)
    fixedColor?: string
}

// ============================================================================
// Legacy exports for backwards compatibility during migration
// These will be removed once migration is complete
// ============================================================================

// OBJECT_PROPERTIES and DEFAULT_OBJECTS have been moved to LevelEditorObjectRegistry.ts
// Import from there instead:
// import { OBJECT_REGISTRY, getObjectProperties, getObjectDefaults } from './LevelEditorObjectRegistry'

