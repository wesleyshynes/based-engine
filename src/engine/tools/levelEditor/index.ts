// Level Editor Module - Extensible level editor for game development

// Main editor class
export { BaseLevelEditor } from './BaseLevelEditor'

// Core types
export * from './EditorTypes'

// Constants
export * from './EditorConstants'

// Utilities
export { EditorInputManager } from './EditorInputManager'
export { BaseEditorStorage } from './BaseEditorStorage'
export { EditorDataLoader } from './EditorDataLoader'

// Object Registry
export {
    BASE_OBJECT_REGISTRY,
    BASE_OBJECT_REGISTRY_ORDER,
    getObjectDefinition,
    getObjectProperties,
    getObjectDefaults,
    getObjectColor,
    getAllObjectsForRendering,
    isPlaceableObjectType,
} from './BaseObjectRegistry'

// Primitives
export {
    PRIMITIVES,
    getPrimitive,
    BoxPrimitive,
    BallPrimitive,
    PolygonPrimitive,
    TextPrimitive,
    PointPrimitive,
    drawCoordinateHandle,
    getCoordinateHandleAtPosition,
    handleCoordinateDrag,
} from './EditorPrimitives'
export type { PrimitiveDefinition } from './EditorPrimitives'

// Panels
export {
    EditorPanel,
    PropertyPanel,
    LevelSettingsPanel,
    LevelListPanel,
    ExportPanel,
} from './panels'
