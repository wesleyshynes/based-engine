// Level Editor Storage - Handles saving/loading levels from localStorage

import { EditorLevelData } from './LevelEditorTypes'

const STORAGE_KEY = 'the-squeeze-editor-levels'
const CURRENT_LEVEL_KEY = 'the-squeeze-editor-current-level'

export class LevelEditorStorage {

    static generateId(): string {
        return `level-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }

    static createNewLevel(name: string = 'Untitled Level'): EditorLevelData {
        const now = Date.now()
        return {
            id: this.generateId(),
            name,
            levelWidth: 800,
            levelHeight: 600,
            nextLevel: 'start-screen',
            playerStart: { x: 100, y: 100 },
            walls: [],
            pushBoxes: [],
            movingPlatforms: [],
            exitDoors: [],
            hazardBlocks: [],
            createdAt: now,
            updatedAt: now,
        }
    }

    static getAllLevels(): EditorLevelData[] {
        try {
            const data = localStorage.getItem(STORAGE_KEY)
            if (data) {
                return JSON.parse(data)
            }
        } catch (e) {
            console.error('Error loading levels from localStorage:', e)
        }
        return []
    }

    static saveLevel(level: EditorLevelData): void {
        try {
            const levels = this.getAllLevels()
            const existingIndex = levels.findIndex(l => l.id === level.id)

            level.updatedAt = Date.now()

            if (existingIndex >= 0) {
                levels[existingIndex] = level
            } else {
                levels.push(level)
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(levels))
        } catch (e) {
            console.error('Error saving level to localStorage:', e)
        }
    }

    static getLevel(id: string): EditorLevelData | null {
        const levels = this.getAllLevels()
        return levels.find(l => l.id === id) || null
    }

    static deleteLevel(id: string): void {
        try {
            const levels = this.getAllLevels().filter(l => l.id !== id)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(levels))
        } catch (e) {
            console.error('Error deleting level from localStorage:', e)
        }
    }

    static setCurrentLevelId(id: string): void {
        localStorage.setItem(CURRENT_LEVEL_KEY, id)
    }

    static getCurrentLevelId(): string | null {
        return localStorage.getItem(CURRENT_LEVEL_KEY)
    }

    static clearCurrentLevel(): void {
        localStorage.removeItem(CURRENT_LEVEL_KEY)
    }

    static exportLevelAsCode(level: EditorLevelData): string {
        const sanitizedName = level.name.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()

        let code = `import { LevelData } from "../editor/LevelEditorTypes"\n`
        code += `import { generateLevelBoundaries } from "../helpers"\n\n`

        code += `const WIDTH = ${level.levelWidth}\n`
        code += `const HEIGHT = ${level.levelHeight}\n\n`

        // Main level data object
        code += `export const ${sanitizedName}: LevelData = {\n`
        code += `    name: '${level.name}',\n`
        code += `    levelWidth: WIDTH,\n`
        code += `    levelHeight: HEIGHT,\n`
        code += `    nextLevel: '${level.nextLevel}',\n`
        code += `    playerStart: { x: ${level.playerStart.x}, y: ${level.playerStart.y} },\n`
        code += `    boundaries: generateLevelBoundaries({ width: WIDTH, height: HEIGHT, offset: 200 }).map(x => ({ ...x, color: '#111' })),\n`

        // Walls
        code += `    walls: [\n`
        level.walls.forEach(wall => {
            code += `        { x: ${wall.x}, y: ${wall.y}, width: ${wall.width}, height: ${wall.height}, color: '${wall.color}' },\n`
        })
        code += `    ],\n`

        // Push Boxes
        code += `    pushBoxes: [\n`
        level.pushBoxes.forEach(box => {
            code += `        { x: ${box.x}, y: ${box.y}, width: ${box.width}, height: ${box.height}, color: '${box.color}', sizeToMove: ${box.sizeToMove} },\n`
        })
        code += `    ],\n`

        // Moving Platforms
        code += `    movingPlatforms: [\n`
        level.movingPlatforms.forEach(plat => {
            code += `        {\n`
            code += `            x: ${plat.x},\n`
            code += `            y: ${plat.y},\n`
            code += `            width: ${plat.width},\n`
            code += `            height: ${plat.height},\n`
            code += `            xDirection: ${plat.xDirection},\n`
            code += `            yDirection: ${plat.yDirection},\n`
            code += `            xSpeed: ${plat.xSpeed},\n`
            code += `            ySpeed: ${plat.ySpeed},\n`
            code += `            minX: ${plat.minX},\n`
            code += `            maxX: ${plat.maxX},\n`
            code += `            minY: ${plat.minY},\n`
            code += `            maxY: ${plat.maxY},\n`
            code += `            color: '${plat.color}'\n`
            code += `        },\n`
        })
        code += `    ],\n`

        // Exit Doors
        code += `    exitDoors: [\n`
        level.exitDoors.forEach(door => {
            code += `        { x: ${door.x}, y: ${door.y}, width: ${door.width}, height: ${door.height}, color: '${door.color}', doorPath: '${door.doorPath}' },\n`
        })
        code += `    ],\n`

        // Hazard Blocks
        code += `    hazardBlocks: [\n`
        level.hazardBlocks.forEach(block => {
            code += `        { x: ${block.x}, y: ${block.y}, width: ${block.width}, height: ${block.height}, },\n`
        })
        code += `    ],\n`

        code += `}\n`

        return code
    }

    static exportLevelClassCode(level: EditorLevelData): string {
        const sanitizedName = level.name.replace(/[^a-zA-Z0-9]/g, '_')
        const pascalName = sanitizedName.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join('')
        const constantName = sanitizedName.toUpperCase()

        let code = `import { ${constantName} } from "../constants/${sanitizedName.toLowerCase()}Constants";\n`
        code += `import { SqueezeBaseLevel } from "./SqueezeBaseLevel";\n\n`

        code += `export class ${pascalName} extends SqueezeBaseLevel {\n\n`
        code += `    levelWidth: number = ${constantName}.levelWidth\n`
        code += `    levelHeight: number = ${constantName}.levelHeight\n\n`
        code += `    nextLevel: string = ${constantName}.nextLevel\n\n`
        code += `    playerStartPosition: any = ${constantName}.playerStart\n`
        code += `    levelWalls: any[] = []\n`
        code += `    _levelBoundaries: any[] = ${constantName}.boundaries\n`
        code += `    _levelWalls: any[] = ${constantName}.walls\n`
        code += `    pushBoxes: any[] = []\n`
        code += `    _pushBoxes: any[] = ${constantName}.pushBoxes\n`
        code += `    movingPlatforms: any[] = []\n`
        code += `    _movingPlatforms: any[] = ${constantName}.movingPlatforms\n`
        code += `    exitDoors: any[] = []\n`
        code += `    _exitDoors: any[] = ${constantName}.exitDoors\n\n`
        code += `    hazardBlocks: any[] = []\n`
        code += `    _hazardBlocks: any[] = ${constantName}.hazardBlocks\n\n`
        code += `}\n`

        return code
    }
}
