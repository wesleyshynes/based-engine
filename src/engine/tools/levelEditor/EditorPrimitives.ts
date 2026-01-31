// Editor Primitives - Base drawing primitives and their handle configurations

import { drawBox, drawCircle, drawText, rotateDraw, drawPolygon, drawLine } from "../../libs/drawHelpers"
import { VertexPoint, PrimitiveType, DrawContext, CoordinateHandleConfig } from "./EditorTypes"
import { HANDLE_COLOR, HANDLE_BORDER } from "./EditorConstants"

// Re-export types for external use
export { DrawContext, CoordinateHandleConfig } from "./EditorTypes"
export type { PrimitiveType } from "./EditorTypes"

// ============================================================================
// Handle Definitions
// ============================================================================

export type HandleType = 
    | 'resize-n' | 'resize-s' | 'resize-e' | 'resize-w' 
    | 'resize-ne' | 'resize-nw' | 'resize-se' | 'resize-sw'
    | 'rotate'
    | 'radius'
    | 'vertex'
    | 'coordinate'

export interface HandleDefinition {
    type: HandleType
    // For vertex handles, which index
    vertexIndex?: number
    // For coordinate handles, which field keys (e.g., ['minX', 'minY'])
    coordinateKeys?: { x: string, y: string }
    // Label to display near the handle
    label?: string
    // Color override
    color?: string
}

// ============================================================================
// Coordinate Handle Configuration
// ============================================================================

// Note: CoordinateHandleConfig is now defined in EditorTypes and re-exported

// ============================================================================
// Primitive Definitions
// ============================================================================

export interface PrimitiveDefinition {
    type: PrimitiveType
    // Default properties for this primitive
    defaultProps: Record<string, any>
    // Which handles are available for this primitive
    handles: HandleType[]
    // Draw the primitive
    draw: (obj: any, ctx: DrawContext, selected: boolean, color: string) => void
    // Draw handles when selected
    drawHandles: (obj: any, ctx: DrawContext) => void
    // Get handle at position (returns handle id or null)
    getHandleAtPosition: (obj: any, worldX: number, worldY: number, ctx: DrawContext) => string | null
    // Handle drag for this primitive's handles
    handleDrag: (obj: any, handle: string, worldX: number, worldY: number, snappedX: number, snappedY: number) => void
    // Check if point is inside the primitive
    isPointInside: (obj: any, x: number, y: number) => boolean
}

// ============================================================================
// Box Primitive - rectangles with position, size, rotation, color
// ============================================================================

export const BoxPrimitive: PrimitiveDefinition = {
    type: 'box',
    defaultProps: {
        x: 0,
        y: 0,
        width: 100,
        height: 50,
        angle: 0,
        color: '#000'
    },
    handles: ['resize-n', 'resize-s', 'resize-e', 'resize-w', 'resize-ne', 'resize-nw', 'resize-se', 'resize-sw', 'rotate'],

    draw(obj: any, ctx: DrawContext, selected: boolean, color: string) {
        const pos = ctx.worldToScreen(obj.x, obj.y)
        const w = obj.width * ctx.cameraZoom
        const h = obj.height * ctx.cameraZoom
        const angle = obj.angle || 0

        rotateDraw({ c: ctx.ctx, x: pos.x, y: pos.y, a: angle }, () => {
            drawBox({
                c: ctx.ctx,
                x: -w / 2,
                y: -h / 2,
                width: w,
                height: h,
                fillColor: color,
                strokeColor: selected ? '#fff' : '#666',
                strokeWidth: selected ? 3 : 1
            })
        })
    },

    drawHandles(obj: any, ctx: DrawContext) {
        const pos = ctx.worldToScreen(obj.x, obj.y)
        const halfW = (obj.width / 2) * ctx.cameraZoom
        const halfH = (obj.height / 2) * ctx.cameraZoom
        const size = ctx.handleSize

        // Resize handles (corners and edges)
        const corners = [
            { x: pos.x - halfW, y: pos.y - halfH },
            { x: pos.x + halfW, y: pos.y - halfH },
            { x: pos.x - halfW, y: pos.y + halfH },
            { x: pos.x + halfW, y: pos.y + halfH },
        ]
        const edges = [
            { x: pos.x, y: pos.y - halfH },
            { x: pos.x, y: pos.y + halfH },
            { x: pos.x - halfW, y: pos.y },
            { x: pos.x + halfW, y: pos.y },
        ]

        ;[...corners, ...edges].forEach(p => {
            drawBox({
                c: ctx.ctx,
                x: p.x - size / 2,
                y: p.y - size / 2,
                width: size,
                height: size,
                fillColor: HANDLE_COLOR,
                strokeColor: HANDLE_BORDER,
                strokeWidth: 1
            })
        })

        // Rotation handle
        const angleRad = (obj.angle || 0) * Math.PI / 180
        const rotHandleDistance = (obj.height / 2 + 30) * ctx.cameraZoom
        const rotHandleX = pos.x + Math.sin(angleRad) * rotHandleDistance
        const rotHandleY = pos.y - Math.cos(angleRad) * rotHandleDistance

        drawLine({ c: ctx.ctx, x: pos.x, y: pos.y, toX: rotHandleX, toY: rotHandleY, strokeColor: '#88f', strokeWidth: 2 })
        drawCircle({ c: ctx.ctx, x: rotHandleX, y: rotHandleY, radius: size, fillColor: '#88f', strokeColor: HANDLE_BORDER, strokeWidth: 1 })
        drawText({ c: ctx.ctx, x: rotHandleX + 15, y: rotHandleY + 4, align: 'left', fillColor: '#88f', fontSize: 10, fontFamily: 'sans-serif', weight: 'bold', style: '', text: 'ROT' })
    },

    getHandleAtPosition(obj: any, worldX: number, worldY: number, ctx: DrawContext): string | null {
        const handleRadius = ctx.handleSize / ctx.cameraZoom
        const halfW = obj.width / 2
        const halfH = obj.height / 2

        // Rotation handle
        const angleRad = (obj.angle || 0) * Math.PI / 180
        const rotHandleDistance = obj.height / 2 + 30
        const rotHandleX = obj.x + Math.sin(angleRad) * rotHandleDistance
        const rotHandleY = obj.y - Math.cos(angleRad) * rotHandleDistance
        if (Math.abs(worldX - rotHandleX) < handleRadius && Math.abs(worldY - rotHandleY) < handleRadius) {
            return 'rotate'
        }

        // Resize handles
        if (Math.abs(worldX - (obj.x + halfW)) < handleRadius && Math.abs(worldY - (obj.y + halfH)) < handleRadius) return 'resize-se'
        if (Math.abs(worldX - (obj.x - halfW)) < handleRadius && Math.abs(worldY - (obj.y + halfH)) < handleRadius) return 'resize-sw'
        if (Math.abs(worldX - (obj.x + halfW)) < handleRadius && Math.abs(worldY - (obj.y - halfH)) < handleRadius) return 'resize-ne'
        if (Math.abs(worldX - (obj.x - halfW)) < handleRadius && Math.abs(worldY - (obj.y - halfH)) < handleRadius) return 'resize-nw'
        if (Math.abs(worldX - (obj.x + halfW)) < handleRadius && Math.abs(worldY - obj.y) < handleRadius) return 'resize-e'
        if (Math.abs(worldX - (obj.x - halfW)) < handleRadius && Math.abs(worldY - obj.y) < handleRadius) return 'resize-w'
        if (Math.abs(worldX - obj.x) < handleRadius && Math.abs(worldY - (obj.y - halfH)) < handleRadius) return 'resize-n'
        if (Math.abs(worldX - obj.x) < handleRadius && Math.abs(worldY - (obj.y + halfH)) < handleRadius) return 'resize-s'

        return null
    },

    handleDrag(obj: any, handle: string, worldX: number, worldY: number, snappedX: number, snappedY: number) {
        const minSize = 20

        if (handle === 'rotate') {
            const dx = worldX - obj.x
            const dy = worldY - obj.y
            const angle = Math.atan2(dx, -dy) * 180 / Math.PI
            obj.angle = Math.round(angle / 5) * 5
            return
        }

        const currentLeft = obj.x - obj.width / 2
        const currentRight = obj.x + obj.width / 2
        const currentTop = obj.y - obj.height / 2
        const currentBottom = obj.y + obj.height / 2

        switch (handle) {
            case 'resize-e': {
                const newRight = snappedX
                const newWidth = Math.max(minSize, newRight - currentLeft)
                obj.width = newWidth
                obj.x = currentLeft + newWidth / 2
                break
            }
            case 'resize-w': {
                const newLeft = snappedX
                const newWidth = Math.max(minSize, currentRight - newLeft)
                obj.width = newWidth
                obj.x = currentRight - newWidth / 2
                break
            }
            case 'resize-n': {
                const newTop = snappedY
                const newHeight = Math.max(minSize, currentBottom - newTop)
                obj.height = newHeight
                obj.y = currentBottom - newHeight / 2
                break
            }
            case 'resize-s': {
                const newBottom = snappedY
                const newHeight = Math.max(minSize, newBottom - currentTop)
                obj.height = newHeight
                obj.y = currentTop + newHeight / 2
                break
            }
            case 'resize-ne': {
                const newRight = snappedX
                const newTop = snappedY
                const newWidth = Math.max(minSize, newRight - currentLeft)
                const newHeight = Math.max(minSize, currentBottom - newTop)
                obj.width = newWidth
                obj.height = newHeight
                obj.x = currentLeft + newWidth / 2
                obj.y = currentBottom - newHeight / 2
                break
            }
            case 'resize-nw': {
                const newLeft = snappedX
                const newTop = snappedY
                const newWidth = Math.max(minSize, currentRight - newLeft)
                const newHeight = Math.max(minSize, currentBottom - newTop)
                obj.width = newWidth
                obj.height = newHeight
                obj.x = currentRight - newWidth / 2
                obj.y = currentBottom - newHeight / 2
                break
            }
            case 'resize-se': {
                const newRight = snappedX
                const newBottom = snappedY
                const newWidth = Math.max(minSize, newRight - currentLeft)
                const newHeight = Math.max(minSize, newBottom - currentTop)
                obj.width = newWidth
                obj.height = newHeight
                obj.x = currentLeft + newWidth / 2
                obj.y = currentTop + newHeight / 2
                break
            }
            case 'resize-sw': {
                const newLeft = snappedX
                const newBottom = snappedY
                const newWidth = Math.max(minSize, currentRight - newLeft)
                const newHeight = Math.max(minSize, newBottom - currentTop)
                obj.width = newWidth
                obj.height = newHeight
                obj.x = currentRight - newWidth / 2
                obj.y = currentTop + newHeight / 2
                break
            }
        }
    },

    isPointInside(obj: any, x: number, y: number): boolean {
        const halfW = obj.width / 2
        const halfH = obj.height / 2
        const angle = obj.angle || 0

        if (angle === 0) {
            return x >= obj.x - halfW && x <= obj.x + halfW && y >= obj.y - halfH && y <= obj.y + halfH
        }

        // Transform point to local (unrotated) space
        const angleRad = -angle * Math.PI / 180
        const cosA = Math.cos(angleRad)
        const sinA = Math.sin(angleRad)
        const dx = x - obj.x
        const dy = y - obj.y
        const localX = dx * cosA - dy * sinA
        const localY = dx * sinA + dy * cosA

        return localX >= -halfW && localX <= halfW && localY >= -halfH && localY <= halfH
    }
}

// ============================================================================
// Ball Primitive - circles with position, radius, color
// ============================================================================

export const BallPrimitive: PrimitiveDefinition = {
    type: 'ball',
    defaultProps: {
        x: 0,
        y: 0,
        radius: 45,
        color: '#4488ff'
    },
    handles: ['radius'],

    draw(obj: any, ctx: DrawContext, selected: boolean, color: string) {
        const pos = ctx.worldToScreen(obj.x, obj.y)
        const r = obj.radius * ctx.cameraZoom

        drawCircle({
            c: ctx.ctx,
            x: pos.x,
            y: pos.y,
            radius: r,
            fillColor: color,
            strokeColor: selected ? '#fff' : '#666',
            strokeWidth: selected ? 3 : 1
        })
    },

    drawHandles(obj: any, ctx: DrawContext) {
        const pos = ctx.worldToScreen(obj.x, obj.y)
        const size = ctx.handleSize

        // Radius handle on the right side
        const radiusHandleX = pos.x + obj.radius * ctx.cameraZoom
        drawLine({ c: ctx.ctx, x: pos.x, y: pos.y, toX: radiusHandleX, toY: pos.y, strokeColor: '#88f', strokeWidth: 2 })
        drawBox({ c: ctx.ctx, x: radiusHandleX - size / 2, y: pos.y - size / 2, width: size, height: size, fillColor: HANDLE_COLOR, strokeColor: HANDLE_BORDER, strokeWidth: 1 })
    },

    getHandleAtPosition(obj: any, worldX: number, worldY: number, ctx: DrawContext): string | null {
        const handleRadius = ctx.handleSize / ctx.cameraZoom

        // Radius handle on the right side
        if (Math.abs(worldX - (obj.x + obj.radius)) < handleRadius && Math.abs(worldY - obj.y) < handleRadius) {
            return 'radius'
        }

        return null
    },

    handleDrag(obj: any, handle: string, worldX: number, worldY: number, snappedX: number, snappedY: number) {
        if (handle === 'radius') {
            const dx = worldX - obj.x
            const dy = worldY - obj.y
            const gridSize = 25 // TODO: pass this in
            const newRadius = Math.max(20, Math.round(Math.sqrt(dx * dx + dy * dy) / gridSize) * gridSize)
            obj.radius = newRadius
        }
    },

    isPointInside(obj: any, x: number, y: number): boolean {
        const dx = x - obj.x
        const dy = y - obj.y
        return dx * dx + dy * dy <= obj.radius * obj.radius
    }
}

// ============================================================================
// Polygon Primitive - multi-vertex shape with position, vertices, rotation, color
// ============================================================================

export const PolygonPrimitive: PrimitiveDefinition = {
    type: 'polygon',
    defaultProps: {
        x: 0,
        y: 0,
        vertices: [
            { x: -50, y: -25 },
            { x: 50, y: -25 },
            { x: 50, y: 25 },
            { x: -50, y: 25 },
        ] as VertexPoint[],
        angle: 0,
        color: '#000'
    },
    handles: ['rotate', 'vertex'],

    draw(obj: any, ctx: DrawContext, selected: boolean, color: string) {
        const pos = ctx.worldToScreen(obj.x, obj.y)
        const scaledVertices = obj.vertices.map((v: VertexPoint) => ({
            x: v.x * ctx.cameraZoom,
            y: v.y * ctx.cameraZoom
        }))

        rotateDraw({ c: ctx.ctx, x: pos.x, y: pos.y, a: obj.angle || 0 }, () => {
            drawPolygon({
                c: ctx.ctx,
                vertices: scaledVertices,
                fillColor: color,
                strokeColor: selected ? '#fff' : '#666',
                strokeWidth: selected ? 3 : 1
            })
        })
    },

    drawHandles(obj: any, ctx: DrawContext) {
        const pos = ctx.worldToScreen(obj.x, obj.y)
        const angleRad = (obj.angle || 0) * Math.PI / 180
        const cosA = Math.cos(angleRad)
        const sinA = Math.sin(angleRad)
        const size = ctx.handleSize

        // Vertex handles
        obj.vertices.forEach((v: VertexPoint) => {
            const rotX = v.x * cosA - v.y * sinA
            const rotY = v.x * sinA + v.y * cosA
            const screenPos = ctx.worldToScreen(obj.x + rotX, obj.y + rotY)
            drawBox({
                c: ctx.ctx,
                x: screenPos.x - size / 2,
                y: screenPos.y - size / 2,
                width: size,
                height: size,
                fillColor: HANDLE_COLOR,
                strokeColor: HANDLE_BORDER,
                strokeWidth: 1
            })
        })

        // Rotation handle
        const rotHandleY = pos.y - 60 * ctx.cameraZoom
        drawLine({ c: ctx.ctx, x: pos.x, y: pos.y, toX: pos.x, toY: rotHandleY, strokeColor: '#88f', strokeWidth: 2 })
        drawCircle({ c: ctx.ctx, x: pos.x, y: rotHandleY, radius: size, fillColor: '#88f', strokeColor: HANDLE_BORDER, strokeWidth: 1 })
        drawText({ c: ctx.ctx, x: pos.x + 15, y: rotHandleY + 4, align: 'left', fillColor: '#88f', fontSize: 10, fontFamily: 'sans-serif', weight: 'bold', style: '', text: 'ROT' })
    },

    getHandleAtPosition(obj: any, worldX: number, worldY: number, ctx: DrawContext): string | null {
        const handleRadius = ctx.handleSize / ctx.cameraZoom
        const angleRad = (obj.angle || 0) * Math.PI / 180
        const cosA = Math.cos(angleRad)
        const sinA = Math.sin(angleRad)

        // Rotation handle
        const rotHandleX = obj.x
        const rotHandleY = obj.y - 60
        if (Math.abs(worldX - rotHandleX) < handleRadius && Math.abs(worldY - rotHandleY) < handleRadius) {
            return 'rotate'
        }

        // Vertex handles
        for (let i = 0; i < obj.vertices.length; i++) {
            const v = obj.vertices[i]
            const rotX = v.x * cosA - v.y * sinA
            const rotY = v.x * sinA + v.y * cosA
            const worldVX = obj.x + rotX
            const worldVY = obj.y + rotY
            if (Math.abs(worldX - worldVX) < handleRadius && Math.abs(worldY - worldVY) < handleRadius) {
                return `vertex-${i}`
            }
        }

        return null
    },

    handleDrag(obj: any, handle: string, worldX: number, worldY: number, snappedX: number, snappedY: number) {
        if (handle === 'rotate') {
            const dx = worldX - obj.x
            const dy = worldY - obj.y
            const angle = Math.atan2(dy, dx) * 180 / Math.PI + 90
            obj.angle = Math.round(angle / 5) * 5
            return
        }

        if (handle.startsWith('vertex-')) {
            const vertexIndex = parseInt(handle.split('-')[1])
            if (vertexIndex >= 0 && vertexIndex < obj.vertices.length) {
                const angleRad = (obj.angle || 0) * Math.PI / 180
                const cosA = Math.cos(-angleRad)
                const sinA = Math.sin(-angleRad)
                const localX = snappedX - obj.x
                const localY = snappedY - obj.y
                obj.vertices[vertexIndex] = {
                    x: localX * cosA - localY * sinA,
                    y: localX * sinA + localY * cosA
                }
            }
        }
    },

    isPointInside(obj: any, x: number, y: number): boolean {
        const angleRad = (obj.angle || 0) * Math.PI / 180
        const cosA = Math.cos(-angleRad)
        const sinA = Math.sin(-angleRad)
        const localX = (x - obj.x) * cosA - (y - obj.y) * sinA
        const localY = (x - obj.x) * sinA + (y - obj.y) * cosA

        const vertices = obj.vertices
        let inside = false

        for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
            const xi = vertices[i].x, yi = vertices[i].y
            const xj = vertices[j].x, yj = vertices[j].y
            if (((yi > localY) !== (yj > localY)) &&
                (localX < (xj - xi) * (localY - yi) / (yj - yi) + xi)) {
                inside = !inside
            }
        }
        return inside
    }
}

// ============================================================================
// Text Primitive - text with position, content, size, rotation, color
// ============================================================================

export const TextPrimitive: PrimitiveDefinition = {
    type: 'text',
    defaultProps: {
        x: 0,
        y: 0,
        text: 'Text',
        fontSize: 24,
        angle: 0,
        color: '#ffffff'
    },
    handles: ['rotate'],

    draw(obj: any, ctx: DrawContext, selected: boolean, color: string) {
        const pos = ctx.worldToScreen(obj.x, obj.y)
        const fontSize = obj.fontSize * ctx.cameraZoom

        rotateDraw({ c: ctx.ctx, x: pos.x, y: pos.y, a: obj.angle || 0 }, () => {
            drawText({
                c: ctx.ctx,
                x: 0,
                y: 0,
                align: 'center',
                fillColor: color,
                fontSize: fontSize,
                fontFamily: 'sans-serif',
                weight: 'bold',
                style: '',
                text: obj.text || 'Text'
            })
        })

        // Draw selection outline
        if (selected) {
            const estimatedWidth = obj.text.length * obj.fontSize * 0.6 * ctx.cameraZoom
            const estimatedHeight = obj.fontSize * 1.2 * ctx.cameraZoom

            rotateDraw({ c: ctx.ctx, x: pos.x, y: pos.y, a: obj.angle || 0 }, () => {
                ctx.ctx.strokeStyle = '#fff'
                ctx.ctx.lineWidth = 2
                ctx.ctx.setLineDash([5, 5])
                ctx.ctx.strokeRect(-estimatedWidth / 2, -estimatedHeight / 2, estimatedWidth, estimatedHeight)
                ctx.ctx.setLineDash([])
            })
        }
    },

    drawHandles(obj: any, ctx: DrawContext) {
        const pos = ctx.worldToScreen(obj.x, obj.y)
        const size = ctx.handleSize

        // Rotation handle (above the text)
        const angleRad = (obj.angle || 0) * Math.PI / 180
        const rotHandleDistance = 60 * ctx.cameraZoom
        const rotHandleX = pos.x - Math.sin(angleRad) * rotHandleDistance
        const rotHandleY = pos.y - Math.cos(angleRad) * rotHandleDistance

        drawLine({ c: ctx.ctx, x: pos.x, y: pos.y, toX: rotHandleX, toY: rotHandleY, strokeColor: '#88f', strokeWidth: 2 })
        drawCircle({ c: ctx.ctx, x: rotHandleX, y: rotHandleY, radius: size, fillColor: '#88f', strokeColor: HANDLE_BORDER, strokeWidth: 1 })
        drawText({ c: ctx.ctx, x: rotHandleX + 15, y: rotHandleY + 4, align: 'left', fillColor: '#88f', fontSize: 10, fontFamily: 'sans-serif', weight: 'bold', style: '', text: 'ROT' })
    },

    getHandleAtPosition(obj: any, worldX: number, worldY: number, ctx: DrawContext): string | null {
        const handleRadius = ctx.handleSize / ctx.cameraZoom

        // Rotation handle
        const angleRad = (obj.angle || 0) * Math.PI / 180
        const rotHandleDistance = 60
        const rotHandleX = obj.x - Math.sin(angleRad) * rotHandleDistance
        const rotHandleY = obj.y - Math.cos(angleRad) * rotHandleDistance
        if (Math.abs(worldX - rotHandleX) < handleRadius && Math.abs(worldY - rotHandleY) < handleRadius) {
            return 'rotate'
        }

        return null
    },

    handleDrag(obj: any, handle: string, worldX: number, worldY: number, snappedX: number, snappedY: number) {
        if (handle === 'rotate') {
            const dx = worldX - obj.x
            const dy = worldY - obj.y
            const angle = Math.atan2(dx, dy) * 180 / Math.PI
            obj.angle = Math.round(-angle / 5) * 5
        }
    },

    isPointInside(obj: any, x: number, y: number): boolean {
        const estimatedWidth = obj.text.length * obj.fontSize * 0.6
        const estimatedHeight = obj.fontSize * 1.2

        const angleRad = (obj.angle || 0) * Math.PI / 180
        const cosA = Math.cos(-angleRad)
        const sinA = Math.sin(-angleRad)
        const localX = (x - obj.x) * cosA - (y - obj.y) * sinA
        const localY = (x - obj.x) * sinA + (y - obj.y) * cosA

        const halfW = estimatedWidth / 2
        const halfH = estimatedHeight / 2
        return localX >= -halfW && localX <= halfW && localY >= -halfH && localY <= halfH
    }
}

// ============================================================================
// Point Primitive - simple point marker (for player start, etc.)
// ============================================================================

export const PointPrimitive: PrimitiveDefinition = {
    type: 'point',
    defaultProps: {
        x: 0,
        y: 0
    },
    handles: [], // No handles for point

    draw(obj: any, ctx: DrawContext, selected: boolean, color: string) {
        const pos = ctx.worldToScreen(obj.x, obj.y)
        const radius = 25 * ctx.cameraZoom

        drawCircle({
            c: ctx.ctx,
            x: pos.x,
            y: pos.y,
            radius: radius,
            fillColor: color,
            strokeColor: selected ? '#fff' : '#ff0',
            strokeWidth: selected ? 3 : 2
        })
    },

    drawHandles(obj: any, ctx: DrawContext) {
        // No handles for point primitive
    },

    getHandleAtPosition(obj: any, worldX: number, worldY: number, ctx: DrawContext): string | null {
        return null
    },

    handleDrag(obj: any, handle: string, worldX: number, worldY: number, snappedX: number, snappedY: number) {
        // No handle drag for point primitive
    },

    isPointInside(obj: any, x: number, y: number): boolean {
        const dx = x - obj.x
        const dy = y - obj.y
        return dx * dx + dy * dy <= 25 * 25
    }
}

// ============================================================================
// Primitive Registry
// ============================================================================

export const PRIMITIVES = {
    box: BoxPrimitive,
    ball: BallPrimitive,
    polygon: PolygonPrimitive,
    text: TextPrimitive,
    point: PointPrimitive
} as const satisfies Record<PrimitiveType, PrimitiveDefinition>

/**
 * Get a primitive by type with proper typing
 */
export function getPrimitive(type: PrimitiveType): PrimitiveDefinition {
    return PRIMITIVES[type]
}

// ============================================================================
// Coordinate Handle Helpers - for fields like minX/minY, maxX/maxY
// ============================================================================

export function drawCoordinateHandle(
    obj: any,
    config: CoordinateHandleConfig,
    ctx: DrawContext,
    selected: boolean
) {
    const x = obj[config.xKey]
    const y = obj[config.yKey]
    const pos = ctx.worldToScreen(x, y)
    const handleSize = selected ? ctx.handleSize + 4 : 6

    ctx.ctx.globalAlpha = selected ? 1 : 0.3
    drawCircle({
        c: ctx.ctx,
        x: pos.x,
        y: pos.y,
        radius: handleSize / 2,
        fillColor: config.color || '#00ff00',
        strokeColor: selected ? '#fff' : undefined,
        strokeWidth: selected ? 2 : undefined
    })

    if (selected && config.label) {
        ctx.ctx.globalAlpha = 1
        drawText({
            c: ctx.ctx,
            x: pos.x,
            y: pos.y - handleSize,
            align: 'center',
            fillColor: config.color || '#0f0',
            fontSize: 10,
            fontFamily: 'sans-serif',
            weight: 'bold',
            style: '',
            text: config.label
        })
    }

    ctx.ctx.globalAlpha = 1
}

export function getCoordinateHandleAtPosition(
    obj: any,
    config: CoordinateHandleConfig,
    worldX: number,
    worldY: number,
    ctx: DrawContext,
    handleId: string
): string | null {
    const handleRadius = ctx.handleSize / ctx.cameraZoom
    const x = obj[config.xKey]
    const y = obj[config.yKey]

    if (Math.abs(worldX - x) < handleRadius && Math.abs(worldY - y) < handleRadius) {
        return handleId
    }
    return null
}

export function handleCoordinateDrag(
    obj: any,
    config: CoordinateHandleConfig,
    snappedX: number,
    snappedY: number
) {
    obj[config.xKey] = snappedX
    obj[config.yKey] = snappedY
}
