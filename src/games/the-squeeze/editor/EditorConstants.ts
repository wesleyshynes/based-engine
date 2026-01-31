// Editor Constants - Colors, sizes, and configuration values

import { BuiltInTool, PlaceableObjectType } from "./LevelEditorTypes"

// Background and grid
export const BG_COLOR = '#1a1a1a'
export const GRID_COLOR = '#2a2a2a'
export const GRID_SIZE = 25

// Preview colors for built-in tools
export const BUILT_IN_TOOL_COLORS: Record<BuiltInTool, string> = {
    select: '#fff',
    pan: '#888',
}

// Button colors
export const FILL_COLOR = '#81B622'
export const HOVER_COLOR = '#ECF87F'
export const TEXT_COLOR = '#FFFFFF'
export const TEXT_HOVER_COLOR = '#000000'
export const TOOL_BUTTON_FILL = '#333'
export const TOOL_BUTTON_HOVER = '#555'

// Handle colors and sizes
export const HANDLE_COLOR = '#81B622'
export const HANDLE_BORDER = '#fff'
export const HANDLE_SIZE = 10

// Panel styling
export const PANEL_BG = 'rgba(0, 0, 0, 0.9)'
export const PANEL_BG_SOLID = 'rgba(0, 0, 0, 0.95)'
export const PANEL_BORDER = '#444'
export const PANEL_INPUT_BG = '#222'
export const PANEL_INPUT_BG_ACTIVE = '#444'

// Min sizes for resize operations
export const MIN_OBJECT_SIZE = 20

// Polygon creation
export const POLYGON_CLICK_DELAY = 150  // ms minimum between polygon vertex clicks
export const MIN_VERTEX_DISTANCE = 20   // minimum distance between polygon vertices
export const DOUBLE_CLICK_THRESHOLD = 300  // ms

// Note: TOOL_LABELS and TOOL_ORDER have been moved to LevelEditorObjectRegistry.ts
// Tool labels are now defined per-object as 'toolLabel' in OBJECT_REGISTRY
// Tool order is now defined in OBJECT_REGISTRY_ORDER
