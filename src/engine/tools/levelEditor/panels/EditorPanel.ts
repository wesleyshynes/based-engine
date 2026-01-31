// Editor Panel Base - Abstract base class for editor panels

import { BasedObject } from "../../../BasedObject"
import { BasedGame } from "../../../BasedEngine"
import { drawBox, drawText } from "../../../libs/drawHelpers"
import { PANEL_BG_SOLID, PANEL_BORDER } from "../EditorConstants"

export interface EditorPanelOptions {
    width?: number
    height?: number
    title?: string
}

export abstract class EditorPanel extends BasedObject {
    width: number = 200
    height: number = 300
    title: string = ''
    visible: boolean = false

    constructor(settings: { key: string, gameRef: BasedGame, options?: EditorPanelOptions }) {
        super(settings)
        if (settings.options?.width) this.width = settings.options.width
        if (settings.options?.height) this.height = settings.options.height
        if (settings.options?.title) this.title = settings.options.title
    }

    show(): void {
        this.visible = true
        this.onShow()
    }

    hide(): void {
        this.visible = false
        this.onHide()
    }

    toggle(): void {
        if (this.visible) {
            this.hide()
        } else {
            this.show()
        }
    }

    /**
     * Override in subclass for custom show behavior
     */
    protected onShow(): void {}

    /**
     * Override in subclass for custom hide behavior
     */
    protected onHide(): void {}

    /**
     * Check if a point is inside this panel
     */
    isPointInside(x: number, y: number): boolean {
        return x >= this.x && 
               x <= this.x + this.width &&
               y >= this.y && 
               y <= this.y + this.height
    }

    /**
     * Draw the panel background and title
     */
    protected drawPanelBase(bgColor: string = PANEL_BG_SOLID): void {
        const ctx = this.gameRef.ctx

        // Panel background
        drawBox({
            c: ctx,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            fillColor: bgColor,
            strokeColor: PANEL_BORDER,
            strokeWidth: 1
        })

        // Title
        if (this.title) {
            drawText({
                c: ctx,
                x: this.x + 10,
                y: this.y + 25,
                align: 'left',
                fillColor: '#fff',
                fontSize: 14,
                fontFamily: 'sans-serif',
                weight: 'bold',
                style: '',
                text: this.title
            })
        }
    }

    /**
     * Draw a labeled input field box (visual only, not interactive)
     */
    protected drawInputField(
        label: string,
        value: string,
        x: number,
        y: number,
        width: number,
        isEditing: boolean = false
    ): { fieldY: number, fieldHeight: number } {
        const ctx = this.gameRef.ctx
        const fieldHeight = 25

        // Label
        drawText({
            c: ctx,
            x: x,
            y: y,
            align: 'left',
            fillColor: '#888',
            fontSize: 11,
            fontFamily: 'sans-serif',
            weight: 'normal',
            style: '',
            text: label
        })

        // Value box
        drawBox({
            c: ctx,
            x: x,
            y: y + 5,
            width: width,
            height: fieldHeight,
            fillColor: isEditing ? '#444' : '#222',
            strokeColor: isEditing ? '#81B622' : '#444',
            strokeWidth: 1
        })

        // Value text
        drawText({
            c: ctx,
            x: x + 5,
            y: y + 22,
            align: 'left',
            fillColor: '#fff',
            fontSize: 12,
            fontFamily: 'sans-serif',
            weight: 'normal',
            style: '',
            text: value
        })

        return { fieldY: y + 5, fieldHeight }
    }

    /**
     * Draw a button inside the panel
     */
    protected drawButton(
        text: string,
        x: number,
        y: number,
        width: number,
        height: number,
        isHovered: boolean,
        normalColor: string = '#222',
        hoverColor: string = '#444'
    ): void {
        const ctx = this.gameRef.ctx

        drawBox({
            c: ctx,
            x: x,
            y: y,
            width: width,
            height: height,
            fillColor: isHovered ? hoverColor : normalColor
        })

        drawText({
            c: ctx,
            x: x + width / 2,
            y: y + height / 2 + 5,
            align: 'center',
            fillColor: '#fff',
            fontSize: 12,
            fontFamily: 'sans-serif',
            weight: 'bold',
            style: '',
            text: text
        })
    }

    /**
     * Check if mouse is hovering over a region
     */
    protected isMouseInRegion(
        mouseX: number, 
        mouseY: number, 
        x: number, 
        y: number, 
        width: number, 
        height: number
    ): boolean {
        return mouseX > x && mouseX < x + width && mouseY > y && mouseY < y + height
    }

    /**
     * Called when the game window resizes - override in subclass
     */
    onResize(): void {}
}
