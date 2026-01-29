// Level Settings Panel - For editing level metadata

import { BasedGame } from "../../../../engine/BasedEngine"
import { EditorPanel } from "./EditorPanel"
import { EditorInputManager } from "../EditorInputManager"
import { EditorLevelData } from "../LevelEditorTypes"

const SETTING_INPUT_ID = 'editor-setting-input'

interface LevelSetting {
    key: string
    label: string
    getValue: (level: EditorLevelData) => string | number
}

const LEVEL_SETTINGS: LevelSetting[] = [
    { key: 'name', label: 'Level Name', getValue: (l) => l.name },
    { key: 'levelWidth', label: 'Width', getValue: (l) => l.levelWidth },
    { key: 'levelHeight', label: 'Height', getValue: (l) => l.levelHeight },
    { key: 'nextLevel', label: 'Next Level', getValue: (l) => l.nextLevel || 'start-screen' },
]

export interface LevelSettingsPanelCallbacks {
    getCurrentLevel: () => EditorLevelData | null
    onSettingChange: (key: string, value: string) => void
    onDeleteLevel: () => void
    canDeleteLevel: () => boolean
    showMessage: (msg: string) => void
}

export class LevelSettingsPanel extends EditorPanel {
    private callbacks: LevelSettingsPanelCallbacks
    private editingLevelSetting: string | null = null
    private levelSettingInputValue: string = ''

    constructor(gameRef: BasedGame, callbacks: LevelSettingsPanelCallbacks) {
        super({
            key: 'level-settings-panel',
            gameRef,
            options: {
                width: 300,
                height: 295,
                title: 'Level Settings'
            }
        })
        this.x = gameRef.gameWidth - 310
        this.y = 50
        this.callbacks = callbacks
    }

    get isEditing(): boolean {
        return this.editingLevelSetting !== null
    }

    cancelEditing(): void {
        this.editingLevelSetting = null
        EditorInputManager.removeInput(SETTING_INPUT_ID)
    }

    protected onHide(): void {
        this.cancelEditing()
    }

    onResize(): void {
        this.x = this.gameRef.gameWidth - 310
    }

    draw(): void {
        if (!this.visible) return

        const currentLevel = this.callbacks.getCurrentLevel()
        if (!currentLevel) return

        const mouse = this.gameRef.mouseInfo

        // Draw panel background
        this.drawPanelBase()

        // Draw settings
        let y = this.y + 50

        LEVEL_SETTINGS.forEach((setting) => {
            const value = setting.getValue(currentLevel)
            const isEditing = this.editingLevelSetting === setting.key
            const displayValue = isEditing ? this.levelSettingInputValue : String(value)

            const { fieldY, fieldHeight } = this.drawInputField(
                setting.label,
                displayValue,
                this.x + 10,
                y,
                this.width - 20,
                isEditing
            )

            // Handle clicks on setting fields
            if (mouse.mouseDown) {
                const inField = this.isMouseInRegion(
                    mouse.x, mouse.y,
                    this.x + 10, fieldY,
                    this.width - 20, fieldHeight
                )

                if (inField && this.editingLevelSetting !== setting.key) {
                    this.startEditing(setting.key, String(value), fieldY, fieldHeight)
                }
            }

            y += 45
        })

        // Delete level button
        const deleteY = this.y + this.height - 45
        const deleteWidth = this.width - 20
        const deleteHeight = 35
        const isDeleteHovered = this.isMouseInRegion(
            mouse.x, mouse.y,
            this.x + 10, deleteY,
            deleteWidth, deleteHeight
        )

        this.drawButton(
            'Delete Level',
            this.x + 10,
            deleteY,
            deleteWidth,
            deleteHeight,
            isDeleteHovered,
            '#633',
            '#a33'
        )

        // Handle delete click
        if (isDeleteHovered && mouse.mouseDown) {
            if (this.callbacks.canDeleteLevel()) {
                this.callbacks.onDeleteLevel()
            } else {
                this.callbacks.showMessage('Cannot delete the only level')
            }
        }
    }

    private startEditing(key: string, value: string, fieldY: number, fieldHeight: number): void {
        this.editingLevelSetting = key
        this.levelSettingInputValue = value

        EditorInputManager.createInput({
            id: SETTING_INPUT_ID,
            x: this.x + 10,
            y: fieldY,
            width: this.width - 20,
            height: fieldHeight,
            value: value,
            onApply: (newValue) => {
                this.callbacks.onSettingChange(key, newValue)
                this.editingLevelSetting = null
            },
            onCancel: () => {
                this.editingLevelSetting = null
            }
        })
    }

    tearDown(): void {
        EditorInputManager.removeInput(SETTING_INPUT_ID)
    }
}
