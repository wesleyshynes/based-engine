// Editor Input Manager - Handles HTML input creation for property editing

export interface EditorInputConfig {
    id: string
    x: number
    y: number
    width: number
    height: number
    value: string
    onApply: (value: string) => void
    onCancel?: () => void
}

export class EditorInputManager {
    private static activeInputId: string | null = null

    /**
     * Creates and displays an HTML input element for editing a value
     */
    static createInput(config: EditorInputConfig): HTMLInputElement {
        // Remove any existing input with this id
        this.removeInput(config.id)

        const input = document.createElement('input')
        input.id = config.id
        input.type = 'text'
        input.value = config.value
        
        // Styling
        input.style.position = 'absolute'
        input.style.left = `${config.x}px`
        input.style.top = `${config.y}px`
        input.style.width = `${config.width}px`
        input.style.height = `${config.height}px`
        input.style.background = '#333'
        input.style.color = '#fff'
        input.style.border = '2px solid #81B622'
        input.style.fontSize = '12px'
        input.style.padding = '2px 5px'
        input.style.zIndex = '1000'
        input.style.boxSizing = 'border-box'

        // Event handlers
        input.onblur = () => {
            config.onApply(input.value)
            this.removeInput(config.id)
        }

        input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                config.onApply(input.value)
                this.removeInput(config.id)
            } else if (e.key === 'Escape') {
                if (config.onCancel) config.onCancel()
                this.removeInput(config.id)
            }
        }

        document.body.appendChild(input)
        input.focus()
        input.select()

        this.activeInputId = config.id

        return input
    }

    /**
     * Creates a read-only textarea for displaying code
     */
    static createTextarea(config: {
        id: string
        x: number
        y: number
        width: number
        height: number
        value: string
        readOnly?: boolean
    }): HTMLTextAreaElement {
        let textarea = document.getElementById(config.id) as HTMLTextAreaElement

        const isReadOnly = config.readOnly !== false

        if (!textarea) {
            textarea = document.createElement('textarea')
            textarea.id = config.id
            textarea.style.position = 'absolute'
            textarea.style.left = `${config.x}px`
            textarea.style.top = `${config.y}px`
            textarea.style.width = `${config.width}px`
            textarea.style.height = `${config.height}px`
            textarea.style.background = isReadOnly ? '#111' : '#222'
            textarea.style.color = isReadOnly ? '#0f0' : '#fff'
            textarea.style.border = isReadOnly ? '1px solid #444' : '1px solid #81B622'
            textarea.style.fontSize = '10px'
            textarea.style.fontFamily = 'monospace'
            textarea.style.padding = '10px'
            textarea.style.resize = 'none'
            textarea.style.boxSizing = 'border-box'
            textarea.readOnly = isReadOnly
            document.body.appendChild(textarea)
        }

        textarea.value = config.value
        return textarea
    }

    /**
     * Removes an input/textarea by id
     */
    static removeInput(id: string): void {
        const element = document.getElementById(id)
        if (element) {
            element.remove()
        }
        if (this.activeInputId === id) {
            this.activeInputId = null
        }
    }

    /**
     * Removes multiple inputs/textareas by ids
     */
    static removeInputs(ids: string[]): void {
        ids.forEach(id => this.removeInput(id))
    }

    /**
     * Check if any editor input is currently focused
     */
    static isInputFocused(): boolean {
        const activeElement = document.activeElement
        return activeElement instanceof HTMLInputElement ||
            activeElement instanceof HTMLTextAreaElement ||
            activeElement instanceof HTMLSelectElement
    }

    /**
     * Get the currently active input id
     */
    static getActiveInputId(): string | null {
        return this.activeInputId
    }
}
