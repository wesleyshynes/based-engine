// Editor Constants - Colors, sizes, and configuration values

import { EditorTool } from "./LevelEditorTypes"

// Background and grid
export const BG_COLOR = '#1a1a1a'
export const GRID_COLOR = '#2a2a2a'
export const GRID_SIZE = 25

// Tool colors for preview and selection
export const TOOL_COLORS: Record<EditorTool, string> = {
    select: '#fff',
    wall: '#222',
    polygon: '#222',
    pushBox: '#d4c9b2',
    movingPlatform: '#222',
    exitDoor: '#000',
    playerStart: '#ff0',
    hazardBlock: '#800000',
    pan: '#888',
    levelText: '#ffffff',
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

// Tool labels for buttons
export const TOOL_LABELS: Record<EditorTool, string> = {
    select: 'Sel',
    pan: 'Pan',
    wall: 'Wall',
    polygon: 'Poly',
    hazardBlock: 'Hazd',
    pushBox: 'Box',
    movingPlatform: 'Plat',
    exitDoor: 'Exit',
    playerStart: 'Start',
    levelText: 'Text',
}

// Tool order for toolbar (placement tools only - select/pan are separate)
export const TOOL_ORDER: EditorTool[] = [
    'wall', 'polygon', 'pushBox', 
    'movingPlatform', 'exitDoor', 'playerStart', 'hazardBlock', 'levelText'
]
