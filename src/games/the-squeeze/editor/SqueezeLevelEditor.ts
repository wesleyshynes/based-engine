// Squeeze Level Editor - Extends BaseLevelEditor with Squeeze-specific configuration

import { BaseLevelEditor, EditorConfig, BaseEditorLevelData } from "../../../engine/tools/levelEditor"
import { SQUEEZE_OBJECT_REGISTRY, SQUEEZE_OBJECT_REGISTRY_ORDER } from "./SqueezeObjectRegistry"
import { SqueezeEditorStorage } from "./SqueezeEditorStorage"
import { SqueezeEditorLevelData } from "./SqueezeEditorTypes"

/**
 * Squeeze-specific level editor with custom object registry and export templates
 */
export class SqueezeLevelEditor extends BaseLevelEditor {

    /**
     * Get current level cast to Squeeze type
     */
    get squeezeLevel(): SqueezeEditorLevelData | null {
        return this.currentLevel as SqueezeEditorLevelData | null
    }

    /**
     * Override to provide Squeeze-specific editor configuration
     */
    protected getEditorConfig(): EditorConfig {
        return {
            storageKey: 'the-squeeze-editor-levels',
            currentLevelKey: 'the-squeeze-editor-current-level',
            objectRegistry: SQUEEZE_OBJECT_REGISTRY,
            objectRegistryOrder: SQUEEZE_OBJECT_REGISTRY_ORDER,
            levelKeys: {
                editor: 'level-editor',
                test: 'testable-level',
                menu: 'start-screen',
            },
            defaultLevelSettings: {
                levelWidth: 800,
                levelHeight: 600,
                nextLevel: 'start-screen',
            },
        }
    }

    /**
     * Override initialize to use SqueezeEditorStorage
     */
    initialize() {
        // Create Squeeze-specific storage
        this.storage = new SqueezeEditorStorage(this.editorConfig)
        
        this.gameRef.cameraZoom = 1
        this.cameraX = 0
        this.cameraY = 0

        // Load current level or create new
        const currentId = this.storage.getCurrentLevelId()
        if (currentId) {
            this.currentLevel = this.storage.getLevel(currentId)
        }
        if (!this.currentLevel) {
            this.currentLevel = this.storage.createNewLevel() as BaseEditorLevelData
            this.storage.saveLevel(this.currentLevel)
            this.storage.setCurrentLevelId(this.currentLevel.id)
        }

        this.savedLevels = this.storage.getAllLevels()

        this.setupPanels()
        this.setupUI()
        this.onResize()

        // Center camera on player start position
        if (this.currentLevel) {
            this.centerOnPlayerStart()
        }
    }
}
