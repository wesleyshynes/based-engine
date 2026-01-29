// Level List Panel - For loading saved levels

import { BasedGame } from "../../../../engine/BasedEngine"
import { drawBox, drawText } from "../../../../engine/libs/drawHelpers"
import { EditorPanel } from "./EditorPanel"
import { EditorLevelData } from "../LevelEditorTypes"

export interface LevelListPanelCallbacks {
    getSavedLevels: () => EditorLevelData[]
    getCurrentLevelId: () => string | null
    onLoadLevel: (level: EditorLevelData) => void
}

export class LevelListPanel extends EditorPanel {
    private callbacks: LevelListPanelCallbacks

    constructor(gameRef: BasedGame, callbacks: LevelListPanelCallbacks) {
        super({
            key: 'level-list-panel',
            gameRef,
            options: {
                width: 300,
                height: 350,
                title: 'Load Level'
            }
        })
        this.x = gameRef.gameWidth - 310
        this.y = 50
        this.callbacks = callbacks
    }

    onResize(): void {
        this.x = this.gameRef.gameWidth - 310
    }

    draw(): void {
        if (!this.visible) return

        const ctx = this.gameRef.ctx
        const mouse = this.gameRef.mouseInfo
        const savedLevels = this.callbacks.getSavedLevels()
        const currentLevelId = this.callbacks.getCurrentLevelId()

        // Draw panel background
        this.drawPanelBase()

        // Draw level list
        let y = this.y + 50

        savedLevels.forEach((level) => {
            const itemHeight = 30
            const isHovered = this.isMouseInRegion(
                mouse.x, mouse.y,
                this.x + 10, y,
                this.width - 20, itemHeight
            )
            const isCurrent = level.id === currentLevelId

            // Level item background
            drawBox({
                c: ctx,
                x: this.x + 10,
                y: y,
                width: this.width - 20,
                height: itemHeight,
                fillColor: isHovered ? '#444' : (isCurrent ? '#333' : '#222')
            })

            // Level name
            drawText({
                c: ctx,
                x: this.x + 15,
                y: y + 20,
                align: 'left',
                fillColor: isCurrent ? '#81B622' : '#fff',
                fontSize: 12,
                fontFamily: 'sans-serif',
                weight: isCurrent ? 'bold' : 'normal',
                style: '',
                text: level.name
            })

            // Handle click to load level
            if (isHovered && mouse.mouseDown) {
                this.callbacks.onLoadLevel(level)
                this.hide()
            }

            y += 35
        })
    }
}
