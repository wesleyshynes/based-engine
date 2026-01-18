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
            playerStart: { x: 100, y: 100 },
            walls: [],
            pushBoxes: [],
            movingPlatforms: [],
            exitDoors: [],
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
        
        let code = `import { generateLevelBoundaries } from "../helpers"\n\n`

        // Level dimensions
        code += `export const ${sanitizedName}_WIDTH = ${level.levelWidth}\n`
        code += `export const ${sanitizedName}_HEIGHT = ${level.levelHeight}\n\n`

        // Boundaries
        code += `export const ${sanitizedName}_BOUNDARIES = generateLevelBoundaries({\n`
        code += `    width: ${sanitizedName}_WIDTH,\n`
        code += `    height: ${sanitizedName}_HEIGHT,\n`
        code += `    offset: 200,\n`
        code += `}).map(x => {\n`
        code += `    return {\n`
        code += `        ...x,\n`
        code += `        color: '#111'\n`
        code += `    }\n`
        code += `})\n\n`

        // Walls
        code += `export const ${sanitizedName}_WALLS: {\n`
        code += `    x: number,\n`
        code += `    y: number,\n`
        code += `    width: number,\n`
        code += `    height: number,\n`
        code += `    color: string,\n`
        code += `}[] = [\n`
        level.walls.forEach(wall => {
            code += `    '${wall.x} ${wall.y} ${wall.width} ${wall.height} ${wall.color}',\n`
        })
        code += `].map(w => {\n`
        code += `    const [x, y, width, height, color] = w.split(' ')\n`
        code += `    return {\n`
        code += `        x: parseInt(x),\n`
        code += `        y: parseInt(y),\n`
        code += `        width: parseInt(width),\n`
        code += `        height: parseInt(height),\n`
        code += `        color,\n`
        code += `    }\n`
        code += `})\n\n`

        // Push Boxes
        code += `export const ${sanitizedName}_PUSH_BOXES: {\n`
        code += `    x: number,\n`
        code += `    y: number,\n`
        code += `    width: number,\n`
        code += `    height: number,\n`
        code += `    color: string,\n`
        code += `    sizeToMove: number,\n`
        code += `}[] = [\n`
        level.pushBoxes.forEach(box => {
            code += `    '${box.x} ${box.y} ${box.width} ${box.height} ${box.color} ${box.sizeToMove}',\n`
        })
        code += `].map(w => {\n`
        code += `    const [x, y, width, height, color, sizeToMove] = w.split(' ')\n`
        code += `    return {\n`
        code += `        x: parseInt(x),\n`
        code += `        y: parseInt(y),\n`
        code += `        width: parseInt(width),\n`
        code += `        height: parseInt(height),\n`
        code += `        color,\n`
        code += `        sizeToMove: sizeToMove ? +sizeToMove : (+width + +height)/4,\n`
        code += `    }\n`
        code += `})\n\n`

        // Moving Platforms
        code += `export const ${sanitizedName}_MOVING_PLATFORMS = [\n`
        level.movingPlatforms.forEach(plat => {
            code += `    {\n`
            code += `        x: ${plat.x},\n`
            code += `        y: ${plat.y},\n`
            code += `        width: ${plat.width},\n`
            code += `        height: ${plat.height},\n`
            code += `        xDirection: ${plat.xDirection},\n`
            code += `        yDirection: ${plat.yDirection},\n`
            code += `        xSpeed: ${plat.xSpeed},\n`
            code += `        ySpeed: ${plat.ySpeed},\n`
            code += `        minX: ${plat.minX},\n`
            code += `        maxX: ${plat.maxX},\n`
            code += `        minY: ${plat.minY},\n`
            code += `        maxY: ${plat.maxY},\n`
            code += `        color: '${plat.color}'\n`
            code += `    },\n`
        })
        code += `]\n\n`

        // Exit Doors
        code += `export const ${sanitizedName}_EXIT_DOORS = [\n`
        level.exitDoors.forEach(door => {
            code += `    {\n`
            code += `        x: ${door.x},\n`
            code += `        y: ${door.y},\n`
            code += `        width: ${door.width},\n`
            code += `        height: ${door.height},\n`
            code += `        color: '${door.color}',\n`
            code += `        doorPath: '${door.doorPath}'\n`
            code += `    },\n`
        })
        code += `]\n\n`

        // Player Start
        code += `export const ${sanitizedName}_PLAYER_START = { x: ${level.playerStart.x}, y: ${level.playerStart.y} }\n`

        return code
    }

    static exportLevelClassCode(level: EditorLevelData): string {
        const sanitizedName = level.name.replace(/[^a-zA-Z0-9]/g, '_')
        const pascalName = sanitizedName.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join('')
        const constantName = sanitizedName.toUpperCase()

        let code = `import { SqueezeBaseLevel } from "./SqueezeBaseLevel";\n`
        code += `import { ${constantName}_BOUNDARIES, ${constantName}_EXIT_DOORS, ${constantName}_MOVING_PLATFORMS, ${constantName}_PUSH_BOXES, ${constantName}_WALLS, ${constantName}_PLAYER_START, ${constantName}_WIDTH, ${constantName}_HEIGHT } from "../constants/${sanitizedName.toLowerCase()}Constants";\n\n`
        
        code += `export class ${pascalName} extends SqueezeBaseLevel {\n\n`
        code += `    levelWidth: number = ${constantName}_WIDTH\n`
        code += `    levelHeight: number = ${constantName}_HEIGHT\n\n`
        code += `    nextLevel: string = 'start-screen'\n\n`
        code += `    playerStartPosition: any = ${constantName}_PLAYER_START\n`
        code += `    levelWalls: any[] = []\n`
        code += `    _levelBoundaries: any[] = ${constantName}_BOUNDARIES\n`
        code += `    _levelWalls: any[] = ${constantName}_WALLS\n`
        code += `    pushBoxes: any[] = []\n`
        code += `    _pushBoxes: any[] = ${constantName}_PUSH_BOXES\n`
        code += `    movingPlatforms: any[] = []\n`
        code += `    _movingPlatforms: any[] = ${constantName}_MOVING_PLATFORMS\n`
        code += `    exitDoors: any[] = []\n`
        code += `    _exitDoors: any[] = ${constantName}_EXIT_DOORS\n\n`
        code += `}\n`

        return code
    }
}
