// Editor Types - Generic type definitions for the level editor framework

import { XYCoordinateType } from "../../libs/mathHelpers"

// Re-export XYCoordinateType as VertexPoint for backwards compatibility
export type VertexPoint = XYCoordinateType

// ============================================================================
// Primitive Types - shared between EditorTypes and EditorPrimitives
// ============================================================================

export type PrimitiveType = 'box' | 'ball' | 'polygon' | 'text' | 'point'

export interface DrawContext {
    ctx: CanvasRenderingContext2D
    cameraPos: { x: number, y: number }
    cameraZoom: number
    handleSize: number
    worldToScreen: (worldX: number, worldY: number) => { x: number, y: number }
    screenToWorld: (screenX: number, screenY: number) => { x: number, y: number }
}

export interface CoordinateHandleConfig {
    xKey: string
    yKey: string
    label?: string
    color?: string
}

// ============================================================================
// Built-in Tools (not placeable objects)
// ============================================================================

export type BuiltInTool = 'select' | 'pan'

// ============================================================================
// Base types for level data
// ============================================================================

export interface BaseLevelObject {
    x: number
    y: number
}

export interface BaseRectangleObject extends BaseLevelObject {
    width: number
    height: number
    color: string
    angle?: number
}

export interface BaseCircleObject extends BaseLevelObject {
    radius: number
    color: string
}

export interface BasePolygonObject extends BaseLevelObject {
    vertices: VertexPoint[]
    angle: number
    color: string
}

export interface BaseTextObject extends BaseLevelObject {
    text: string
    fontSize: number
    color: string
    angle: number
    fontFamily?: string
    fontWeight?: string
}

export interface BasePlayerStart extends BaseLevelObject {}

// ============================================================================
// Editor-specific types (extend base types with id, type, and optional zIndex)
// ============================================================================

export interface EditorBaseObject {
    id: string
    type: string
    x: number
    y: number
    zIndex?: number
}

export interface EditorRectangle extends EditorBaseObject {
    type: 'rectangle'
    width: number
    height: number
    color: string
    angle?: number
}

export interface EditorCircle extends EditorBaseObject {
    type: 'circle'
    radius: number
    color: string
}

export interface EditorPolygon extends EditorBaseObject {
    type: 'polygon'
    vertices: VertexPoint[]
    angle: number
    color: string
}

export interface EditorText extends EditorBaseObject {
    type: 'text'
    text: string
    fontSize: number
    color: string
    angle: number
}

export interface EditorPlayerStart extends EditorBaseObject {
    type: 'playerStart'
}

// Union of all base editor object types
export type BaseEditorObject = EditorRectangle | EditorCircle | EditorPolygon | EditorText | EditorPlayerStart

// All placeable object type keys (base types)
export type BasePlaceableObjectType = BaseEditorObject['type']

// Combined tool type (built-in tools + placeable object types)
export type EditorTool = BuiltInTool | string

// ============================================================================
// Base Editor Level Data - minimal structure for the editor
// ============================================================================

export interface BaseEditorLevelData {
    id: string
    name: string
    levelWidth: number
    levelHeight: number
    nextLevel: string
    playerStart: { x: number, y: number }
    // Timestamps
    createdAt: number
    updatedAt: number
    // Allow any additional arrays for game-specific objects
    [key: string]: any
}

// ============================================================================
// Property Field Types
// ============================================================================

export interface PropertyField {
    key: string
    label: string
    type: 'number' | 'string' | 'color' | 'coordinate' | 'boolean' | 'array'
    min?: number
    max?: number
    step?: number
    // For coordinate type - the paired keys
    coordinateKeys?: { x: string, y: string }
    // For array type - expected item type (for validation/parsing hints)
    arrayItemType?: 'string' | 'number'
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
    // The key in EditorLevelData where instances are stored (e.g., 'rectangles', 'circles')
    // For playerStart this is special - stored directly on level.playerStart
    arrayKey: string
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
// Editor Configuration Interface
// ============================================================================

export interface EditorConfig {
    // Storage key prefix for localStorage
    storageKey: string
    // Current level key for localStorage
    currentLevelKey: string
    // Object registry - defines all placeable object types
    objectRegistry: Record<string, ObjectDefinition>
    // Order of object types in toolbar
    objectRegistryOrder: string[]
    // Level navigation keys
    levelKeys: {
        editor: string
        test: string
        menu: string
    }
    // Default level settings
    defaultLevelSettings?: {
        levelWidth?: number
        levelHeight?: number
        nextLevel?: string
    }
    // Export callbacks (optional - defaults provided)
    exportLevelAsCode?: (level: BaseEditorLevelData) => string
    exportLevelClassCode?: (level: BaseEditorLevelData) => string
    // Function to create a new empty level (optional - default provided)
    createNewLevel?: (name?: string) => BaseEditorLevelData
    // Function to sanitize/migrate level data (optional - default provided)
    sanitizeLevel?: (level: BaseEditorLevelData) => BaseEditorLevelData
}
