// Property Panel - For editing selected object properties

import { BasedGame } from "../../../BasedEngine"
import { EditorPanel } from "./EditorPanel"
import { EditorInputManager } from "../EditorInputManager"
import { ObjectDefinition, PropertyField } from "../EditorTypes"
import { PANEL_BG } from "../EditorConstants"

const PROPERTY_INPUT_ID = 'editor-property-input'

export interface PropertyPanelCallbacks {
    onPropertyChange: (key: string, value: any) => void
    getSelectedObject: () => any | null
    getObjectDefinition: (type: string) => ObjectDefinition | undefined
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

        const definition = this.callbacks.getObjectDefinition(selectedObject.type)
        if (!definition) return

        const props = definition.properties || []

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

            // Handle boolean fields differently
            if (prop.type === 'boolean') {
                this.drawBooleanField(prop.label, value, this.x + 10, y, this.width - 20, () => {
                    this.callbacks.onPropertyChange(prop.key, !value)
                })
            } else {
                const isEditing = this.editingProperty === prop.key
                const displayValue = isEditing ? this.propertyInputValue : this.formatDisplayValue(value, prop.type)

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
                        this.startEditing(prop.key, this.formatDisplayValue(value, prop.type), fieldY, fieldHeight)
                    }
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

        const definition = this.callbacks.getObjectDefinition(selectedObject.type)
        if (!definition) return

        const propDef = definition.properties?.find((p: PropertyField) => p.key === key)

        let parsedValue: any = value
        if (propDef?.type === 'number') {
            parsedValue = parseFloat(value) || 0
            if (propDef.min !== undefined) parsedValue = Math.max(propDef.min, parsedValue)
            if (propDef.max !== undefined) parsedValue = Math.min(propDef.max, parsedValue)
        } else if (propDef?.type === 'boolean') {
            parsedValue = value === 'true' || value === '1'
        } else if (propDef?.type === 'array') {
            // Parse comma-separated values
            const items = value.split(',').map(item => item.trim()).filter(item => item.length > 0)

            // Convert to appropriate type based on arrayItemType hint
            if (propDef.arrayItemType === 'number') {
                parsedValue = items.map(item => parseFloat(item) || 0)
            } else {
                // Default to strings
                parsedValue = items
            }
        }

        this.callbacks.onPropertyChange(key, parsedValue)
    }

    private formatDisplayValue(value: any, type: string): string {
        if (value === undefined || value === null) return ''
        if (type === 'array') {
            // Format arrays as comma-separated values
            if (Array.isArray(value)) {
                return value.join(', ')
            }
            return ''
        }
        return String(value)
    }

    private drawBooleanField(label: string, checked: boolean, x: number, y: number, width: number, onClick: () => void): void {
        const ctx = this.gameRef.ctx
        const mouse = this.gameRef.mouseInfo

        // Draw label
        ctx.fillStyle = '#fff'
        ctx.font = '12px monospace'
        ctx.fillText(label, x, y + 10)

        // Draw checkbox
        const checkboxSize = 20
        const checkboxX = x + width - checkboxSize
        const checkboxY = y

        // Check if mouse is over checkbox
        const isHover = this.isMouseInRegion(
            mouse.x, mouse.y,
            checkboxX, checkboxY,
            checkboxSize, checkboxSize
        )

        // Draw checkbox background
        ctx.fillStyle = isHover ? '#444' : '#333'
        ctx.fillRect(checkboxX, checkboxY, checkboxSize, checkboxSize)

        // Draw checkbox border
        ctx.strokeStyle = '#666'
        ctx.lineWidth = 1
        ctx.strokeRect(checkboxX, checkboxY, checkboxSize, checkboxSize)

        // Draw checkmark if checked
        if (checked) {
            ctx.strokeStyle = '#0f0'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(checkboxX + 4, checkboxY + 10)
            ctx.lineTo(checkboxX + 8, checkboxY + 14)
            ctx.lineTo(checkboxX + 16, checkboxY + 6)
            ctx.stroke()
        }

        // Handle click
        if (mouse.mouseDown && isHover) {
            onClick()
        }
    }

    tearDown(): void {
        EditorInputManager.removeInput(PROPERTY_INPUT_ID)
    }
}
