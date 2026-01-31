// Property Panel - For editing selected object properties

import { BasedGame } from "../../../../engine/BasedEngine"
import { EditorPanel } from "./EditorPanel"
import { EditorInputManager } from "../EditorInputManager"
import { EditorObject, PlaceableObjectType, PropertyField } from "../LevelEditorTypes"
import { getObjectProperties } from "../LevelEditorObjectRegistry"
import { PANEL_BG } from "../EditorConstants"

const PROPERTY_INPUT_ID = 'editor-property-input'

export interface PropertyPanelCallbacks {
    onPropertyChange: (key: string, value: any) => void
    getSelectedObject: () => EditorObject | null
}

export class PropertyPanel extends EditorPanel {
    private callbacks: PropertyPanelCallbacks
    private editingProperty: string | null = null
    private propertyInputValue: string = ''

    constructor(gameRef: BasedGame, callbacks: PropertyPanelCallbacks) {
        super({
            key: 'property-panel',
            gameRef,
            options: {
                width: 200,
                height: 300,
                title: 'Edit Object'
            }
        })
        this.x = gameRef.gameWidth - 210
        this.y = 110
        this.callbacks = callbacks
    }

    get isEditing(): boolean {
        return this.editingProperty !== null
    }

    get editingKey(): string | null {
        return this.editingProperty
    }

    cancelEditing(): void {
        this.editingProperty = null
        EditorInputManager.removeInput(PROPERTY_INPUT_ID)
    }

    protected onHide(): void {
        this.cancelEditing()
    }

    onResize(): void {
        this.x = this.gameRef.gameWidth - 210
    }

    draw(): void {
        if (!this.visible) return

        const selectedObject = this.callbacks.getSelectedObject()
        if (!selectedObject) return

        const props = getObjectProperties(selectedObject.type as PlaceableObjectType) || []

        // Dynamically calculate panel height based on number of properties
        this.height = props.length * 40 + 60
        this.title = `Edit ${selectedObject.type}`

        // Draw panel background
        this.drawPanelBase(PANEL_BG)

        // Draw properties
        let y = this.y + 50
        const mouse = this.gameRef.mouseInfo

        props.forEach((prop) => {
            const value = (selectedObject as any)[prop.key]
            const isEditing = this.editingProperty === prop.key
            const displayValue = isEditing ? this.propertyInputValue : String(value ?? '')

            const { fieldY, fieldHeight } = this.drawInputField(
                prop.label,
                displayValue,
                this.x + 10,
                y,
                this.width - 20,
                isEditing
            )

            // Handle clicks on property fields
            if (mouse.mouseDown) {
                const inField = this.isMouseInRegion(
                    mouse.x, mouse.y,
                    this.x + 10, fieldY,
                    this.width - 20, fieldHeight
                )

                if (inField && this.editingProperty !== prop.key) {
                    this.startEditing(prop.key, String(value ?? ''), fieldY, fieldHeight)
                }
            }

            y += 40
        })
    }

    private startEditing(key: string, value: string, fieldY: number, fieldHeight: number): void {
        this.editingProperty = key
        this.propertyInputValue = value

        EditorInputManager.createInput({
            id: PROPERTY_INPUT_ID,
            x: this.x + 10,
            y: fieldY,
            width: this.width - 20,
            height: fieldHeight,
            value: value,
            onApply: (newValue) => {
                this.applyPropertyValue(key, newValue)
                this.editingProperty = null
            },
            onCancel: () => {
                this.editingProperty = null
            }
        })
    }

    private applyPropertyValue(key: string, value: string): void {
        const selectedObject = this.callbacks.getSelectedObject()
        if (!selectedObject) return

        const props = getObjectProperties(selectedObject.type as PlaceableObjectType)
        const propDef = props?.find((p: PropertyField) => p.key === key)

        let parsedValue: any = value
        if (propDef?.type === 'number') {
            parsedValue = parseFloat(value) || 0
            if (propDef.min !== undefined) parsedValue = Math.max(propDef.min, parsedValue)
            if (propDef.max !== undefined) parsedValue = Math.min(propDef.max, parsedValue)
        }

        this.callbacks.onPropertyChange(key, parsedValue)
    }

    tearDown(): void {
        EditorInputManager.removeInput(PROPERTY_INPUT_ID)
    }
}
