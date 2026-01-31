// Base Editor Storage - Handles saving/loading levels from localStorage

import { BaseEditorLevelData, EditorConfig } from './EditorTypes'

/**
 * Base storage class for the level editor.
 * Handles CRUD operations for levels in localStorage.
 * Can be used directly with an EditorConfig or extended for custom behavior.
 */
export class BaseEditorStorage {
    private config: EditorConfig

    constructor(config: EditorConfig) {
        this.config = config
    }

    /**
     * Generate a unique ID for a new level
     */
    generateId(): string {
        return `level-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }

    /**
     * Create a new empty level with default values
     */
    createNewLevel(name: string = 'Untitled Level'): BaseEditorLevelData {
        // Use custom function if provided
        if (this.config.createNewLevel) {
            return this.config.createNewLevel(name)
        }

        const now = Date.now()
        const defaults = this.config.defaultLevelSettings || {}
        
        return {
            id: this.generateId(),
            name,
            levelWidth: defaults.levelWidth || 800,
            levelHeight: defaults.levelHeight || 600,
            nextLevel: defaults.nextLevel || this.config.levelKeys.menu,
            playerStart: { x: 100, y: 100 },
            rectangles: [],
            circles: [],
            polygons: [],
            texts: [],
            createdAt: now,
            updatedAt: now,
        }
    }

    /**
     * Get all levels from localStorage
     */
    getAllLevels(): BaseEditorLevelData[] {
        try {
            const data = localStorage.getItem(this.config.storageKey)
            if (data) {
                const levels = JSON.parse(data) as BaseEditorLevelData[]
                // Ensure all levels have all required fields (migration for old data)
                return levels.map(level => this.sanitizeLevel(level))
            }
        } catch (e) {
            console.error('Error loading levels from localStorage:', e)
        }
        return []
    }

    /**
     * Sanitize/migrate level data to ensure all required fields exist
     */
    sanitizeLevel(level: BaseEditorLevelData): BaseEditorLevelData {
        // Use custom function if provided
        if (this.config.sanitizeLevel) {
            return this.config.sanitizeLevel(level)
        }

        // Default sanitization - ensure base arrays exist
        return {
            ...level,
            rectangles: level.rectangles || [],
            circles: level.circles || [],
            polygons: level.polygons || [],
            texts: level.texts || [],
            playerStart: level.playerStart || { x: 100, y: 100 },
            nextLevel: level.nextLevel || this.config.levelKeys.menu,
        }
    }

    /**
     * Save a level to localStorage
     */
    saveLevel(level: BaseEditorLevelData): void {
        try {
            const levels = this.getAllLevels()
            const existingIndex = levels.findIndex(l => l.id === level.id)

            level.updatedAt = Date.now()

            if (existingIndex >= 0) {
                levels[existingIndex] = level
            } else {
                levels.push(level)
            }

            localStorage.setItem(this.config.storageKey, JSON.stringify(levels))
        } catch (e) {
            console.error('Error saving level to localStorage:', e)
        }
    }

    /**
     * Get a specific level by ID
     */
    getLevel(id: string): BaseEditorLevelData | null {
        const levels = this.getAllLevels()
        const level = levels.find(l => l.id === id)
        return level ? this.sanitizeLevel(level) : null
    }

    /**
     * Delete a level by ID
     */
    deleteLevel(id: string): void {
        try {
            const levels = this.getAllLevels().filter(l => l.id !== id)
            localStorage.setItem(this.config.storageKey, JSON.stringify(levels))
        } catch (e) {
            console.error('Error deleting level from localStorage:', e)
        }
    }

    /**
     * Set the current level ID
     */
    setCurrentLevelId(id: string): void {
        localStorage.setItem(this.config.currentLevelKey, id)
    }

    /**
     * Get the current level ID
     */
    getCurrentLevelId(): string | null {
        return localStorage.getItem(this.config.currentLevelKey)
    }

    /**
     * Clear the current level ID
     */
    clearCurrentLevel(): void {
        localStorage.removeItem(this.config.currentLevelKey)
    }

    /**
     * Export level as TypeScript constant code
     */
    exportLevelAsCode(level: BaseEditorLevelData): string {
        // Use custom function if provided
        if (this.config.exportLevelAsCode) {
            return this.config.exportLevelAsCode(level)
        }

        // Default export implementation
        return this.defaultExportLevelAsCode(level)
    }

    /**
     * Export level as TypeScript class code
     */
    exportLevelClassCode(level: BaseEditorLevelData): string {
        // Use custom function if provided
        if (this.config.exportLevelClassCode) {
            return this.config.exportLevelClassCode(level)
        }

        // Default export implementation
        return this.defaultExportLevelClassCode(level)
    }

    /**
     * Default implementation for exporting level as TypeScript constants
     */
    private defaultExportLevelAsCode(level: BaseEditorLevelData): string {
        const sanitizedName = level.name.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()

        let code = `// Level: ${level.name}\n`
        code += `// Generated by Level Editor\n\n`

        code += `export const ${sanitizedName} = {\n`
        code += `    name: '${level.name}',\n`
        code += `    levelWidth: ${level.levelWidth},\n`
        code += `    levelHeight: ${level.levelHeight},\n`
        code += `    nextLevel: '${level.nextLevel}',\n`
        code += `    playerStart: { x: ${level.playerStart.x}, y: ${level.playerStart.y} },\n`

        // Rectangles
        code += `    rectangles: [\n`
        ;((level.rectangles || []) as any[]).forEach((rect: any) => {
            const angleStr = rect.angle ? `, angle: ${rect.angle}` : ''
            code += `        { x: ${rect.x}, y: ${rect.y}, width: ${rect.width}, height: ${rect.height}, color: '${rect.color}'${angleStr} },\n`
        })
        code += `    ],\n`

        // Circles
        code += `    circles: [\n`
        ;((level.circles || []) as any[]).forEach((circle: any) => {
            code += `        { x: ${circle.x}, y: ${circle.y}, radius: ${circle.radius}, color: '${circle.color}' },\n`
        })
        code += `    ],\n`

        // Polygons
        code += `    polygons: [\n`
        ;((level.polygons || []) as any[]).forEach((poly: any) => {
            const verticesStr = JSON.stringify(poly.vertices)
            code += `        { x: ${poly.x}, y: ${poly.y}, vertices: ${verticesStr}, angle: ${poly.angle}, color: '${poly.color}' },\n`
        })
        code += `    ],\n`

        // Texts
        code += `    texts: [\n`
        ;((level.texts || []) as any[]).forEach((text: any) => {
            code += `        { x: ${text.x}, y: ${text.y}, text: '${text.text.replace(/'/g, "\\'")}', fontSize: ${text.fontSize}, color: '${text.color}', angle: ${text.angle} },\n`
        })
        code += `    ],\n`

        code += `}\n`

        return code
    }

    /**
     * Default implementation for exporting level as TypeScript class
     */
    private defaultExportLevelClassCode(level: BaseEditorLevelData): string {
        const sanitizedName = level.name.replace(/[^a-zA-Z0-9]/g, '_')
        const pascalName = sanitizedName.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join('')
        const constantName = sanitizedName.toUpperCase()

        let code = `// Level class for: ${level.name}\n`
        code += `// Generated by Level Editor\n\n`

        code += `import { ${constantName} } from "./constants/${sanitizedName.toLowerCase()}Constants";\n`
        code += `import { BasedLevel } from "based-engine";\n\n`

        code += `export class ${pascalName} extends BasedLevel {\n\n`
        code += `    levelWidth: number = ${constantName}.levelWidth\n`
        code += `    levelHeight: number = ${constantName}.levelHeight\n\n`
        code += `    nextLevel: string = ${constantName}.nextLevel\n\n`
        code += `    playerStartPosition: any = ${constantName}.playerStart\n`
        code += `    rectangles: any[] = ${constantName}.rectangles\n`
        code += `    circles: any[] = ${constantName}.circles\n`
        code += `    polygons: any[] = ${constantName}.polygons\n`
        code += `    texts: any[] = ${constantName}.texts\n\n`
        code += `}\n`

        return code
    }
}
