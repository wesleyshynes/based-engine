// Squeeze Level Editor Module - Re-exports all Squeeze editor components

// Main editor class
export { SqueezeLevelEditor } from './SqueezeLevelEditor'

// Storage
export { SqueezeEditorStorage } from './SqueezeEditorStorage'

// Types
export * from './SqueezeEditorTypes'

// Object Registry
export { 
    SQUEEZE_OBJECT_REGISTRY, 
    SQUEEZE_OBJECT_REGISTRY_ORDER 
} from './SqueezeObjectRegistry'
export type { SqueezeObjectType } from './SqueezeObjectRegistry'

// Test Level
export { TestableLevel } from './TestableLevel'

// Re-export base editor utilities for convenience
export {
    BaseLevelEditor,
    EditorDataLoader,
    BaseEditorStorage,
    EditorInputManager,
    // Types
    type EditorConfig,
    type ObjectDefinition,
    type PropertyField,
    type BaseEditorLevelData,
} from '../../../engine/tools/levelEditor'
