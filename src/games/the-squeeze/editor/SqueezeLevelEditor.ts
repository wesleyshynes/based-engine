// Squeeze Level Editor - Extends BaseLevelEditor with Squeeze-specific configuration

import { BaseLevelEditor } from "../../../engine/tools/levelEditor/BaseLevelEditor"
import { EditorConfig, BaseEditorLevelData } from "../../../engine/tools/levelEditor/EditorTypes"
import type { RegisteredLevel } from "../../../engine/tools/levelEditor/panels/ImportPanel"
import { SQUEEZE_OBJECT_REGISTRY, SQUEEZE_OBJECT_REGISTRY_ORDER } from "./SqueezeObjectRegistry"
import { SqueezeEditorStorage } from "./SqueezeEditorStorage"
import { SqueezeEditorLevelData, SqueezeLevelData } from "./SqueezeEditorTypes"
import { LEVEL_01 } from "../constants/level01Constants"
import { LEVEL_02 } from "../constants/level02Constants"
import { LEVEL_03 } from "../constants/level03Constants"
import { LEVEL_04 } from "../constants/level04Constants"
import { LEVEL_05 } from "../constants/level05Constants"

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
        this.gameRef.cameraPos = { x: 0, y: 0 }

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

    /**
     * Return the pre-registered game levels available for import
     */
    protected getRegisteredLevels(): RegisteredLevel[] {
        return [
            { name: 'Level 01', data: LEVEL_01 },
            { name: 'Level 02', data: LEVEL_02 },
            { name: 'Level 03', data: LEVEL_03 },
            { name: 'Level 04', data: LEVEL_04 },
            { name: 'Level 05', data: LEVEL_05 },
        ]
    }

    /**
     * Convert imported data (SqueezeLevelData or SqueezeEditorLevelData) into editor format
     */
    protected convertImportData(data: any): BaseEditorLevelData | null {
        if (!data || typeof data !== 'object') return null

        // Detect format: SqueezeLevelData has `boundaries` and no `id`
        // SqueezeEditorLevelData has `id` and `createdAt`
        const isEditorData = !!data.id && data.createdAt !== undefined

        if (isEditorData) {
            return this.convertFromEditorData(data as SqueezeEditorLevelData)
        } else {
            return this.convertFromSqueezeLevelData(data as SqueezeLevelData)
        }
    }

    private convertFromSqueezeLevelData(data: SqueezeLevelData): SqueezeEditorLevelData {
        const now = Date.now()

        const stamp = <T extends Record<string, any>>(items: T[] | undefined, type: string): T[] =>
            (items || []).map(item => ({
                ...item,
                id: item.id || this.storage.generateId(),
                type,
            }))

        return {
            id: this.storage.generateId(),
            name: data.name || 'Imported Level',
            levelWidth: data.levelWidth,
            levelHeight: data.levelHeight,
            nextLevel: data.nextLevel || 'start-screen',
            playerStart: data.playerStart || { x: 100, y: 100 },
            createdAt: now,
            updatedAt: now,
            // Map arrays, skipping `boundaries` (auto-generated on export)
            walls: stamp(data.walls, 'wall'),
            polygons: stamp(data.polygons, 'polygon'),
            pushBoxes: stamp(data.pushBoxes, 'pushBox'),
            bounceBalls: stamp(data.bounceBalls, 'bounceBall'),
            movingPlatforms: stamp(data.movingPlatforms, 'movingPlatform'),
            exitDoors: stamp(data.exitDoors, 'exitDoor'),
            hazardBlocks: stamp(data.hazardBlocks, 'hazardBlock'),
            hazardPolys: stamp(data.hazardPolys, 'hazardPoly'),
            hazardBalls: stamp(data.hazardBalls, 'hazardBall'),
            levelTexts: stamp(data.levelTexts, 'levelText'),
            levelSensors: stamp(data.levelSensors, 'sensorBox').map(s => ({
                ...s,
                flagName: s.flagName || '',
            })),
            conditionalWalls: stamp(data.conditionalWalls, 'conditionalWall').map(w => ({
                ...w,
                color: w.color || '#6666FF',
                flagName: w.flagName || '',
            })),
            collectibles: stamp(data.collectibles, 'collectible'),
        }
    }

    private convertFromEditorData(data: SqueezeEditorLevelData): SqueezeEditorLevelData {
        const now = Date.now()
        return (this.storage as SqueezeEditorStorage).sanitizeLevel({
            ...data,
            id: this.storage.generateId(),
            createdAt: now,
            updatedAt: now,
        })
    }
}
