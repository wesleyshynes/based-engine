// Base Object Registry - Default object types for the level editor

import { drawText } from "../../libs/drawHelpers"
import { 
    ObjectDefinition, 
    PropertyField, 
    BaseEditorLevelData
} from "./EditorTypes"
import { 
    DrawContext, 
    PRIMITIVES,
    getPrimitive,
} from "./EditorPrimitives"

// ============================================================================
// Common Property Fields (reusable across objects)
// ============================================================================

const positionFields: PropertyField[] = [
    { key: 'x', label: 'X', type: 'number' },
    { key: 'y', label: 'Y', type: 'number' },
]

const angleField: PropertyField = { key: 'angle', label: 'Angle (deg)', type: 'number', min: -360, max: 360 }

const colorField: PropertyField = { key: 'color', label: 'Color', type: 'color' }

const zIndexField: PropertyField = { key: 'zIndex', label: 'Z-Index', type: 'number', min: -100, max: 100 }

// ============================================================================
// Base Object Registry - Simple primitives for generic level editing
// ============================================================================

export const BASE_OBJECT_REGISTRY: Record<string, ObjectDefinition> = {
    // ========================================================================
    // Rectangle - Basic rectangular shape
    // ========================================================================
    rectangle: {
        primitive: 'box',
        toolLabel: 'Rect',
        creationMode: 'single-click',
        arrayKey: 'rectangles',
        zIndex: 0,
        defaults: {
            type: 'rectangle',
            width: 100,
            height: 50,
            color: '#666666',
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
    // Circle - Basic circular shape
    // ========================================================================
    circle: {
        primitive: 'ball',
        toolLabel: 'Circle',
        creationMode: 'single-click',
        arrayKey: 'circles',
        zIndex: 0,
        defaults: {
            type: 'circle',
            radius: 45,
            color: '#4488ff',
            zIndex: 0,
        },
        properties: [
            ...positionFields,
            { key: 'radius', label: 'Radius', type: 'number', min: 10, max: 500 },
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
            color: '#333333',
            zIndex: 0,
        },
        properties: [
            ...positionFields,
            angleField,
            colorField,
            zIndexField,
        ],
        colorKey: 'color',
    },

    // ========================================================================
    // Text - Decorative/instructional text
    // ========================================================================
    text: {
        primitive: 'text',
        toolLabel: 'Text',
        creationMode: 'single-click',
        arrayKey: 'texts',
        zIndex: 5,
        defaults: {
            type: 'text',
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
}

// ============================================================================
// Registry order for toolbar generation
// ============================================================================

export const BASE_OBJECT_REGISTRY_ORDER: string[] = [
    'rectangle',
    'circle',
    'polygon', 
    'text',
    'playerStart',
]

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get the object definition for a given object type
 */
export function getObjectDefinition(type: string, registry: Record<string, ObjectDefinition>): ObjectDefinition | undefined {
    return registry[type]
}

/**
 * Get property fields for a given object type
 */
export function getObjectProperties(type: string, registry: Record<string, ObjectDefinition>): PropertyField[] {
    return registry[type]?.properties || []
}

/**
 * Get default values for a given object type (merged with primitive defaults)
 */
export function getObjectDefaults(type: string, registry: Record<string, ObjectDefinition>): Record<string, any> {
    const definition = registry[type]
    if (!definition) return {}
    const primitive = getPrimitive(definition.primitive)
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
export function getAllObjectsForRendering(
    level: BaseEditorLevelData, 
    registry: Record<string, ObjectDefinition>,
    registryOrder: string[]
): Array<{ obj: any, definition: ObjectDefinition, registryIndex: number }> {
    const objects: Array<{ obj: any, definition: ObjectDefinition, zIndex: number, registryIndex: number }> = []

    registryOrder.forEach((type, registryIndex) => {
        const definition = registry[type]
        if (!definition) return
        
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
            const array = level[definition.arrayKey] as any[]
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
export function isPlaceableObjectType(tool: string, registry: Record<string, ObjectDefinition>): boolean {
    return tool in registry
}
