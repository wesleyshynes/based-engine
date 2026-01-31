// Level Editor Object Registry - Defines all placeable object types

import { drawText, drawLine, drawCircle } from "../../../engine/libs/drawHelpers"
import { 
    ObjectDefinition, 
    PropertyField, 
    PlaceableObjectType,
    EditorLevelData
} from "./LevelEditorTypes"
import { 
    DrawContext, 
    CoordinateHandleConfig,
    PRIMITIVES,
    drawCoordinateHandle
} from "./LevelEditorPrimitives"

// ============================================================================
// Common Property Fields (reusable across objects)
// ============================================================================

const positionFields: PropertyField[] = [
    { key: 'x', label: 'X', type: 'number' },
    { key: 'y', label: 'Y', type: 'number' },
]

const sizeFields: PropertyField[] = [
    { key: 'width', label: 'Width', type: 'number', min: 10, max: 1000 },
    { key: 'height', label: 'Height', type: 'number', min: 10, max: 1000 },
]

const angleField: PropertyField = { key: 'angle', label: 'Angle (deg)', type: 'number', min: -360, max: 360 }

const colorField: PropertyField = { key: 'color', label: 'Color', type: 'color' }

const zIndexField: PropertyField = { key: 'zIndex', label: 'Z-Index', type: 'number', min: -100, max: 100 }

// ============================================================================
// Object Registry - All placeable object definitions
// ============================================================================

export const OBJECT_REGISTRY: Record<PlaceableObjectType, ObjectDefinition> = {
    // ========================================================================
    // Wall - Basic static obstacle
    // ========================================================================
    wall: {
        primitive: 'box',
        toolLabel: 'Wall',
        creationMode: 'single-click',
        arrayKey: 'walls',
        zIndex: 0,
        defaults: {
            type: 'wall',
            width: 100,
            height: 50,
            color: '#000',
            angle: 0,
            zIndex: 0,
        },
        properties: [
            ...positionFields,
            { key: 'width', label: 'Width', type: 'number', min: 10, max: 1000 },
            { key: 'height', label: 'Height', type: 'number', min: 10, max: 1000 },
            angleField,
            colorField,
            zIndexField,
        ],
        colorKey: 'color',
    },

    // ========================================================================
    // Polygon - Multi-vertex custom shape
    // ========================================================================
    polygon: {
        primitive: 'polygon',
        toolLabel: 'Poly',
        creationMode: 'multi-click',
        arrayKey: 'polygons',
        zIndex: 0,
        defaults: {
            type: 'polygon',
            vertices: [
                { x: -50, y: -25 },
                { x: 50, y: -25 },
                { x: 50, y: 25 },
                { x: -50, y: 25 },
            ],
            angle: 0,
            color: '#000',
            zIndex: 0,
        },
        properties: [
            ...positionFields,
            { key: 'angle', label: 'Angle (deg)', type: 'number', min: 0, max: 360 },
            colorField,
            zIndexField,
        ],
        colorKey: 'color',
    },

    // ========================================================================
    // Push Box - Can be pushed by player
    // ========================================================================
    pushBox: {
        primitive: 'box',
        toolLabel: 'Push',
        creationMode: 'single-click',
        arrayKey: 'pushBoxes',
        zIndex: 1,
        defaults: {
            type: 'pushBox',
            width: 90,
            height: 90,
            color: '#d4c9b2',
            sizeToMove: 40,
            angle: 0,
            zIndex: 1,
        },
        properties: [
            ...positionFields,
            { key: 'width', label: 'Width', type: 'number', min: 30, max: 500 },
            { key: 'height', label: 'Height', type: 'number', min: 30, max: 500 },
            angleField,
            { key: 'sizeToMove', label: 'Size to Move', type: 'number', min: 20, max: 200 },
            zIndexField,
        ],
        fixedColor: '#d4c9b2',
    },

    // ========================================================================
    // Bounce Ball - Circular pushable object
    // ========================================================================
    bounceBall: {
        primitive: 'ball',
        toolLabel: 'Ball',
        creationMode: 'single-click',
        arrayKey: 'bounceBalls',
        zIndex: 1,
        defaults: {
            type: 'bounceBall',
            radius: 45,
            color: '#4488ff',
            sizeToMove: 40,
            zIndex: 1,
        },
        properties: [
            ...positionFields,
            { key: 'radius', label: 'Radius', type: 'number', min: 20, max: 200 },
            { key: 'sizeToMove', label: 'Size to Move', type: 'number', min: 20, max: 200 },
            colorField,
            zIndexField,
        ],
        colorKey: 'color',
    },

    // ========================================================================
    // Moving Platform - Moves back and forth
    // ========================================================================
    movingPlatform: {
        primitive: 'box',
        toolLabel: 'Plat',
        creationMode: 'single-click',
        arrayKey: 'movingPlatforms',
        zIndex: 0,
        defaults: {
            type: 'movingPlatform',
            width: 100,
            height: 50,
            color: 'purple',
            xDirection: 1,
            yDirection: 0,
            xSpeed: 3,
            ySpeed: 0,
            minX: -100, // Will be offset by placement x
            maxX: 100,  // Will be offset by placement x
            minY: 0,
            maxY: 0,
            angle: 0,
            zIndex: 0,
        },
        properties: [
            ...positionFields,
            { key: 'width', label: 'Width', type: 'number', min: 20, max: 800 },
            { key: 'height', label: 'Height', type: 'number', min: 20, max: 800 },
            angleField,
            { key: 'xDirection', label: 'X Direction', type: 'number', min: -1, max: 1, step: 1 },
            { key: 'yDirection', label: 'Y Direction', type: 'number', min: -1, max: 1, step: 1 },
            { key: 'xSpeed', label: 'X Speed', type: 'number', min: 0, max: 20 },
            { key: 'ySpeed', label: 'Y Speed', type: 'number', min: 0, max: 20 },
            { key: 'minX', label: 'Min X', type: 'number' },
            { key: 'maxX', label: 'Max X', type: 'number' },
            { key: 'minY', label: 'Min Y', type: 'number' },
            { key: 'maxY', label: 'Max Y', type: 'number' },
            colorField,
            zIndexField,
        ],
        coordinateHandles: [
            { xKey: 'minX', yKey: 'minY', label: 'MIN', color: '#00ff00' },
            { xKey: 'maxX', yKey: 'maxY', label: 'MAX', color: '#ff4444' },
        ],
        colorKey: 'color',
        customDraw: (obj: any, ctx: DrawContext, selected: boolean) => {
            // Draw the movement range line
            ctx.ctx.globalAlpha = selected ? 1 : 0.3
            ctx.ctx.strokeStyle = selected ? 'rgba(255, 255, 0, 0.7)' : 'rgba(255, 255, 0, 0.5)'
            ctx.ctx.lineWidth = selected ? 2 : 1
            ctx.ctx.setLineDash([5, 5])

            const minPos = ctx.worldToScreen(obj.minX, obj.minY)
            const maxPos = ctx.worldToScreen(obj.maxX, obj.maxY)

            ctx.ctx.beginPath()
            ctx.ctx.moveTo(minPos.x, minPos.y)
            ctx.ctx.lineTo(maxPos.x, maxPos.y)
            ctx.ctx.stroke()

            ctx.ctx.setLineDash([])
            ctx.ctx.globalAlpha = 1
        },
    },

    // ========================================================================
    // Exit Door - Level transition point
    // ========================================================================
    exitDoor: {
        primitive: 'box',
        toolLabel: 'Exit',
        creationMode: 'single-click',
        arrayKey: 'exitDoors',
        zIndex: -1,
        defaults: {
            type: 'exitDoor',
            width: 100,
            height: 100,
            color: 'yellow',
            doorPath: 'start-screen',
            angle: 0,
            zIndex: -1,
        },
        properties: [
            ...positionFields,
            { key: 'width', label: 'Width', type: 'number', min: 50, max: 200 },
            { key: 'height', label: 'Height', type: 'number', min: 50, max: 200 },
            angleField,
            { key: 'doorPath', label: 'Door Path', type: 'string' },
            zIndexField,
        ],
        fixedColor: '#333',
        customDraw: (obj: any, ctx: DrawContext, selected: boolean) => {
            // Draw "EXIT" label
            const pos = ctx.worldToScreen(obj.x, obj.y)
            drawText({
                c: ctx.ctx,
                x: pos.x,
                y: pos.y + 5,
                align: 'center',
                fillColor: '#ff0',
                fontSize: 12 * ctx.cameraZoom,
                fontFamily: 'sans-serif',
                weight: 'bold',
                style: '',
                text: 'EXIT'
            })
        },
    },

    // ========================================================================
    // Hazard Block - Kills/damages player
    // ========================================================================
    hazardBlock: {
        primitive: 'box',
        toolLabel: 'Hazard',
        creationMode: 'single-click',
        arrayKey: 'hazardBlocks',
        zIndex: 0,
        defaults: {
            type: 'hazardBlock',
            width: 100,
            height: 50,
            angle: 0,
            zIndex: 0,
        },
        properties: [
            ...positionFields,
            { key: 'width', label: 'Width', type: 'number', min: 20, max: 500 },
            { key: 'height', label: 'Height', type: 'number', min: 20, max: 500 },
            angleField,
            zIndexField,
        ],
        fixedColor: '#f00',
    },

    // ========================================================================
    // Player Start - Spawn point
    // ========================================================================
    playerStart: {
        primitive: 'point',
        toolLabel: 'Start',
        creationMode: 'single-click',
        arrayKey: 'playerStart', // Special case - stored directly on level
        zIndex: 10, // Always on top
        defaults: {
            type: 'playerStart',
            zIndex: 10,
        },
        properties: [
            ...positionFields,
            zIndexField,
        ],
        fixedColor: '#ff9900',
        customDraw: (obj: any, ctx: DrawContext, selected: boolean) => {
            // Draw "START" label
            const pos = ctx.worldToScreen(obj.x, obj.y)
            drawText({
                c: ctx.ctx,
                x: pos.x,
                y: pos.y + 5,
                align: 'center',
                fillColor: '#fff',
                fontSize: 12 * ctx.cameraZoom,
                fontFamily: 'sans-serif',
                weight: 'bold',
                style: '',
                text: 'START'
            })
        },
    },

    // ========================================================================
    // Level Text - Decorative/instructional text
    // ========================================================================
    levelText: {
        primitive: 'text',
        toolLabel: 'Text',
        creationMode: 'single-click',
        arrayKey: 'levelTexts',
        zIndex: 5,
        defaults: {
            type: 'levelText',
            text: 'Text',
            fontSize: 24,
            color: '#ffffff',
            angle: 0,
            zIndex: 5,
        },
        properties: [
            ...positionFields,
            { key: 'text', label: 'Text', type: 'string' },
            { key: 'fontSize', label: 'Font Size', type: 'number', min: 8, max: 200 },
            angleField,
            colorField,
            zIndexField,
        ],
        colorKey: 'color',
    },
}

// ============================================================================
// Registry order for toolbar generation
// ============================================================================

export const OBJECT_REGISTRY_ORDER: PlaceableObjectType[] = [
    'wall',
    'polygon', 
    'pushBox',
    'bounceBall',
    'movingPlatform',
    'exitDoor',
    'playerStart',
    'hazardBlock',
    'levelText',
]

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get the object definition for a given object type
 */
export function getObjectDefinition(type: PlaceableObjectType): ObjectDefinition {
    return OBJECT_REGISTRY[type]
}

/**
 * Get property fields for a given object type
 */
export function getObjectProperties(type: PlaceableObjectType): PropertyField[] {
    return OBJECT_REGISTRY[type].properties
}

/**
 * Get default values for a given object type (merged with primitive defaults)
 */
export function getObjectDefaults(type: PlaceableObjectType): Record<string, any> {
    const definition = OBJECT_REGISTRY[type]
    const primitive = PRIMITIVES[definition.primitive]
    return {
        ...primitive.defaultProps,
        ...definition.defaults,
    }
}

/**
 * Get the color to use for rendering an object
 */
export function getObjectColor(obj: any, definition: ObjectDefinition): string {
    if (definition.fixedColor) {
        return definition.fixedColor
    }
    if (definition.colorKey && obj[definition.colorKey]) {
        return obj[definition.colorKey]
    }
    return '#666' // Fallback color
}

/**
 * Get all objects from a level sorted by zIndex for rendering
 */
export function getAllObjectsForRendering(level: EditorLevelData): Array<{ obj: any, definition: ObjectDefinition, registryIndex: number }> {
    const objects: Array<{ obj: any, definition: ObjectDefinition, zIndex: number, registryIndex: number }> = []

    OBJECT_REGISTRY_ORDER.forEach((type, registryIndex) => {
        const definition = OBJECT_REGISTRY[type]
        
        if (definition.arrayKey === 'playerStart') {
            // Special case for playerStart
            const playerStartObj = {
                id: 'playerStart',
                type: 'playerStart',
                x: level.playerStart.x,
                y: level.playerStart.y,
            }
            const zIndex = (playerStartObj as any).zIndex ?? definition.zIndex
            objects.push({ obj: playerStartObj, definition, zIndex, registryIndex })
        } else {
            // Standard array-based objects
            const array = level[definition.arrayKey as keyof EditorLevelData] as any[]
            if (array) {
                array.forEach(obj => {
                    const zIndex = obj.zIndex ?? definition.zIndex
                    objects.push({ obj, definition, zIndex, registryIndex })
                })
            }
        }
    })

    // Stable sort by zIndex (preserves registration order for equal zIndex)
    objects.sort((a, b) => {
        if (a.zIndex !== b.zIndex) {
            return a.zIndex - b.zIndex
        }
        return a.registryIndex - b.registryIndex
    })

    return objects
}

/**
 * Check if a tool is a placeable object type (vs built-in tool)
 */
export function isPlaceableObjectType(tool: string): tool is PlaceableObjectType {
    return tool in OBJECT_REGISTRY
}
