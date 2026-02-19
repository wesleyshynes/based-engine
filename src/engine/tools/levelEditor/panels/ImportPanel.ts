// Import Panel - For importing level data into the editor

import { BasedGame } from "../../../BasedEngine"
import { drawBox, drawText } from "../../../libs/drawHelpers"
import { EditorPanel } from "./EditorPanel"
import { EditorInputManager } from "../EditorInputManager"
import { BaseEditorLevelData } from "../EditorTypes"

const IMPORT_TEXTAREA_ID = 'import-json-textarea'

export interface RegisteredLevel {
    name: string
    data: any
}

export interface ImportPanelCallbacks {
    getRegisteredLevels: () => RegisteredLevel[]
    importLevelData: (data: any) => BaseEditorLevelData | null
    onLevelImported: (level: BaseEditorLevelData) => void
    showMessage: (msg: string) => void
}

export class ImportPanel extends EditorPanel {
    private callbacks: ImportPanelCallbacks
    private activeTab: 'levels' | 'json' = 'levels'

    constructor(gameRef: BasedGame, callbacks: ImportPanelCallbacks) {
        super({
            key: 'import-panel',
            gameRef,
            options: {
                width: gameRef.gameWidth - 100,
                height: gameRef.gameHeight - 100,
                title: 'Import Level'
            }
        })
        this.x = 50
        this.y = 50
        this.callbacks = callbacks
    }

    protected onShow(): void {
        this.activeTab = 'levels'
    }

    protected onHide(): void {
        EditorInputManager.removeInputs([IMPORT_TEXTAREA_ID])
    }

    onResize(): void {
        this.width = this.gameRef.gameWidth - 100
        this.height = this.gameRef.gameHeight - 100
        if (this.visible) {
            EditorInputManager.removeInputs([IMPORT_TEXTAREA_ID])
        }
    }

    private switchTab(tab: 'levels' | 'json'): void {
        if (this.activeTab === tab) return
        this.activeTab = tab
        // Clean up textarea when switching away from JSON tab
        if (tab !== 'json') {
            EditorInputManager.removeInputs([IMPORT_TEXTAREA_ID])
        }
    }

    draw(): void {
        if (!this.visible) return

        const ctx = this.gameRef.ctx
        const mouse = this.gameRef.mouseInfo

        // Draw panel background
        this.drawPanelBase()

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
            text: 'Press ESC or click Import again to close'
        })

        // Tab buttons
        const tabY = this.y + 45
        const tabWidth = 80
        const tabHeight = 28

        const levelsTabHovered = this.isMouseInRegion(mouse.x, mouse.y, this.x + 20, tabY, tabWidth, tabHeight)
        const jsonTabHovered = this.isMouseInRegion(mouse.x, mouse.y, this.x + 105, tabY, tabWidth, tabHeight)

        // Levels tab
        drawBox({
            c: ctx,
            x: this.x + 20,
            y: tabY,
            width: tabWidth,
            height: tabHeight,
            fillColor: this.activeTab === 'levels' ? '#81B622' : (levelsTabHovered ? '#444' : '#222'),
            strokeColor: '#555',
            strokeWidth: 1,
        })
        drawText({
            c: ctx,
            x: this.x + 20 + tabWidth / 2,
            y: tabY + 19,
            align: 'center',
            fillColor: this.activeTab === 'levels' ? '#000' : '#fff',
            fontSize: 12,
            fontFamily: 'sans-serif',
            weight: 'bold',
            style: '',
            text: 'Levels'
        })

        // JSON tab
        drawBox({
            c: ctx,
            x: this.x + 105,
            y: tabY,
            width: tabWidth,
            height: tabHeight,
            fillColor: this.activeTab === 'json' ? '#81B622' : (jsonTabHovered ? '#444' : '#222'),
            strokeColor: '#555',
            strokeWidth: 1,
        })
        drawText({
            c: ctx,
            x: this.x + 105 + tabWidth / 2,
            y: tabY + 19,
            align: 'center',
            fillColor: this.activeTab === 'json' ? '#000' : '#fff',
            fontSize: 12,
            fontFamily: 'sans-serif',
            weight: 'bold',
            style: '',
            text: 'JSON'
        })

        // Handle tab clicks
        if (mouse.mouseDown) {
            if (levelsTabHovered) {
                this.switchTab('levels')
            } else if (jsonTabHovered) {
                this.switchTab('json')
            }
        }

        // Content area starts below tabs
        const contentY = tabY + tabHeight + 15

        if (this.activeTab === 'levels') {
            // Clean up textarea if it exists from JSON tab
            EditorInputManager.removeInputs([IMPORT_TEXTAREA_ID])
            this.drawLevelsTab(contentY)
        } else {
            this.drawJsonTab(contentY)
        }
    }

    private drawLevelsTab(startY: number): void {
        const ctx = this.gameRef.ctx
        const mouse = this.gameRef.mouseInfo
        const registeredLevels = this.callbacks.getRegisteredLevels()

        if (registeredLevels.length === 0) {
            drawText({
                c: ctx,
                x: this.x + 20,
                y: startY + 20,
                align: 'left',
                fillColor: '#888',
                fontSize: 12,
                fontFamily: 'sans-serif',
                weight: 'normal',
                style: '',
                text: 'No registered levels available for import.'
            })
            return
        }

        drawText({
            c: ctx,
            x: this.x + 20,
            y: startY + 5,
            align: 'left',
            fillColor: '#888',
            fontSize: 11,
            fontFamily: 'sans-serif',
            weight: 'normal',
            style: '',
            text: 'Click a level to import it into the editor:'
        })

        let y = startY + 20
        const itemHeight = 35
        const itemWidth = this.width - 40

        registeredLevels.forEach((entry) => {
            const isHovered = this.isMouseInRegion(
                mouse.x, mouse.y,
                this.x + 20, y,
                itemWidth, itemHeight
            )

            // Item background
            drawBox({
                c: ctx,
                x: this.x + 20,
                y: y,
                width: itemWidth,
                height: itemHeight,
                fillColor: isHovered ? '#444' : '#222',
                strokeColor: isHovered ? '#81B622' : '#333',
                strokeWidth: 1,
            })

            // Level name
            drawText({
                c: ctx,
                x: this.x + 35,
                y: y + 22,
                align: 'left',
                fillColor: isHovered ? '#81B622' : '#fff',
                fontSize: 13,
                fontFamily: 'sans-serif',
                weight: isHovered ? 'bold' : 'normal',
                style: '',
                text: entry.name
            })

            // Handle click
            if (isHovered && mouse.mouseDown) {
                const imported = this.callbacks.importLevelData(entry.data)
                if (imported) {
                    this.callbacks.onLevelImported(imported)
                    this.callbacks.showMessage(`Imported: ${entry.name}`)
                } else {
                    this.callbacks.showMessage('Import failed - invalid level data')
                }
            }

            y += itemHeight + 5
        })
    }

    private drawJsonTab(startY: number): void {
        const ctx = this.gameRef.ctx
        const mouse = this.gameRef.mouseInfo

        drawText({
            c: ctx,
            x: this.x + 20,
            y: startY + 5,
            align: 'left',
            fillColor: '#888',
            fontSize: 11,
            fontFamily: 'sans-serif',
            weight: 'normal',
            style: '',
            text: 'Paste level data as JSON below, then click Import:'
        })

        // Create editable textarea
        const textareaY = startY + 15
        const textareaHeight = this.height - (textareaY - this.y) - 60

        EditorInputManager.createTextarea({
            id: IMPORT_TEXTAREA_ID,
            x: this.x + 20,
            y: textareaY,
            width: this.width - 40,
            height: textareaHeight,
            value: '',
            readOnly: false,
        })

        // Import button
        const btnWidth = 120
        const btnHeight = 35
        const btnX = this.x + this.width / 2 - btnWidth / 2
        const btnY = this.y + this.height - 50

        const btnHovered = this.isMouseInRegion(mouse.x, mouse.y, btnX, btnY, btnWidth, btnHeight)

        drawBox({
            c: ctx,
            x: btnX,
            y: btnY,
            width: btnWidth,
            height: btnHeight,
            fillColor: btnHovered ? '#81B622' : '#555',
            strokeColor: '#81B622',
            strokeWidth: 1,
        })
        drawText({
            c: ctx,
            x: btnX + btnWidth / 2,
            y: btnY + 23,
            align: 'center',
            fillColor: btnHovered ? '#000' : '#fff',
            fontSize: 14,
            fontFamily: 'sans-serif',
            weight: 'bold',
            style: '',
            text: 'Import JSON'
        })

        // Handle import button click
        if (btnHovered && mouse.mouseDown) {
            const textarea = document.getElementById(IMPORT_TEXTAREA_ID) as HTMLTextAreaElement
            if (textarea && textarea.value.trim()) {
                try {
                    const parsed = JSON.parse(textarea.value.trim())
                    const imported = this.callbacks.importLevelData(parsed)
                    if (imported) {
                        this.callbacks.onLevelImported(imported)
                        this.callbacks.showMessage(`Imported: ${imported.name}`)
                    } else {
                        this.callbacks.showMessage('Import failed - could not convert level data')
                    }
                } catch (e) {
                    this.callbacks.showMessage('Invalid JSON - check your input')
                }
            } else {
                this.callbacks.showMessage('Paste level JSON data first')
            }
        }
    }

    tearDown(): void {
        EditorInputManager.removeInputs([IMPORT_TEXTAREA_ID])
    }
}
