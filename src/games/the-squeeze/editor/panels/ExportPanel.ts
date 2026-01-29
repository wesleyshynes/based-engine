// Export Panel - For exporting level code

import { BasedGame } from "../../../../engine/BasedEngine"
import { drawText } from "../../../../engine/libs/drawHelpers"
import { EditorPanel } from "./EditorPanel"
import { EditorInputManager } from "../EditorInputManager"
import { EditorLevelData } from "../LevelEditorTypes"
import { LevelEditorStorage } from "../LevelEditorStorage"

const CONSTANTS_TEXTAREA_ID = 'export-constants'
const CLASS_TEXTAREA_ID = 'export-class'

export interface ExportPanelCallbacks {
    getCurrentLevel: () => EditorLevelData | null
}

export class ExportPanel extends EditorPanel {
    private callbacks: ExportPanelCallbacks

    constructor(gameRef: BasedGame, callbacks: ExportPanelCallbacks) {
        super({
            key: 'export-panel',
            gameRef,
            options: {
                width: gameRef.gameWidth - 100,
                height: gameRef.gameHeight - 100,
                title: 'Export Level - Copy the code below'
            }
        })
        this.x = 50
        this.y = 50
        this.callbacks = callbacks
    }

    protected onHide(): void {
        EditorInputManager.removeInputs([CONSTANTS_TEXTAREA_ID, CLASS_TEXTAREA_ID])
    }

    onResize(): void {
        this.width = this.gameRef.gameWidth - 100
        this.height = this.gameRef.gameHeight - 100
        // Need to recreate textareas on resize
        if (this.visible) {
            EditorInputManager.removeInputs([CONSTANTS_TEXTAREA_ID, CLASS_TEXTAREA_ID])
        }
    }

    draw(): void {
        if (!this.visible) return

        const currentLevel = this.callbacks.getCurrentLevel()
        if (!currentLevel) return

        const ctx = this.gameRef.ctx

        // Draw panel background
        this.drawPanelBase()

        // Constants section label
        drawText({
            c: ctx,
            x: this.x + 20,
            y: this.y + 60,
            align: 'left',
            fillColor: '#81B622',
            fontSize: 12,
            fontFamily: 'sans-serif',
            weight: 'bold',
            style: '',
            text: 'Constants File (save as constants/yourLevelConstants.ts):'
        })

        // Create constants textarea
        const constantsCode = LevelEditorStorage.exportLevelAsCode(currentLevel)
        const textareaHeight = (this.height - 200) / 2

        EditorInputManager.createTextarea({
            id: CONSTANTS_TEXTAREA_ID,
            x: this.x + 20,
            y: this.y + 70,
            width: this.width - 40,
            height: textareaHeight,
            value: constantsCode
        })

        // Level class section label
        drawText({
            c: ctx,
            x: this.x + 20,
            y: this.y + (this.height / 2) + 20,
            align: 'left',
            fillColor: '#81B622',
            fontSize: 12,
            fontFamily: 'sans-serif',
            weight: 'bold',
            style: '',
            text: 'Level Class File (save as levels/yourLevel.ts):'
        })

        // Create class textarea
        const classCode = LevelEditorStorage.exportLevelClassCode(currentLevel)

        EditorInputManager.createTextarea({
            id: CLASS_TEXTAREA_ID,
            x: this.x + 20,
            y: this.y + (this.height / 2) + 30,
            width: this.width - 40,
            height: textareaHeight,
            value: classCode
        })

        // Close instruction
        drawText({
            c: ctx,
            x: this.x + this.width - 20,
            y: this.y + 30,
            align: 'right',
            fillColor: '#888',
            fontSize: 12,
            fontFamily: 'sans-serif',
            weight: 'normal',
            style: '',
            text: 'Press ESC or click Export again to close'
        })
    }

    tearDown(): void {
        EditorInputManager.removeInputs([CONSTANTS_TEXTAREA_ID, CLASS_TEXTAREA_ID])
    }
}
