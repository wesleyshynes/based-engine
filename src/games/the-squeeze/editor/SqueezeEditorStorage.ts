// Squeeze Level Editor Storage - Custom storage with Squeeze-specific export templates

import { BaseEditorStorage, BaseEditorLevelData, EditorConfig } from "../../../engine/tools/levelEditor"
import { SqueezeEditorLevelData } from "./SqueezeEditorTypes"

/**
 * Squeeze-specific storage with custom export templates
 */
export class SqueezeEditorStorage extends BaseEditorStorage {
    
    constructor(config: EditorConfig) {
        super(config)
    }

    /**
     * Create a new Squeeze level with all required arrays
     */
    createNewLevel(name?: string): SqueezeEditorLevelData {
        const base = super.createNewLevel(name) as any
        return {
            ...base,
            walls: [],
            polygons: [],
            pushBoxes: [],
            bounceBalls: [],
            movingPlatforms: [],
            exitDoors: [],
            hazardBlocks: [],
            levelTexts: [],
            levelSensors: [],
            conditionalWalls: [],
            collectibles: [],
        } as SqueezeEditorLevelData
    }

    /**
     * Sanitize a loaded level to ensure all arrays exist
     */
    sanitizeLevel(level: BaseEditorLevelData): SqueezeEditorLevelData {
        const sanitized = super.sanitizeLevel(level) as any
        return {
            ...sanitized,
            walls: sanitized.walls || [],
            polygons: sanitized.polygons || [],
            pushBoxes: sanitized.pushBoxes || [],
            bounceBalls: sanitized.bounceBalls || [],
            movingPlatforms: sanitized.movingPlatforms || [],
            exitDoors: sanitized.exitDoors || [],
            hazardBlocks: sanitized.hazardBlocks || [],
            levelTexts: sanitized.levelTexts || [],
            levelSensors: sanitized.levelSensors || [],
            conditionalWalls: sanitized.conditionalWalls || [],
            collectibles: sanitized.collectibles || [],
        } as SqueezeEditorLevelData
    }

    /**
     * Export level as TypeScript constants file (Squeeze format)
     */
    exportLevelAsCode(level: BaseEditorLevelData): string {
        const squeezeLevel = level as unknown as SqueezeEditorLevelData
        const sanitizedName = squeezeLevel.name.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()

        let code = `import { SqueezeLevelData } from "../editor/SqueezeEditorTypes"\n`
        code += `import { generateLevelBoundaries } from "../helpers"\n\n`

        code += `const WIDTH = ${squeezeLevel.levelWidth}\n`
        code += `const HEIGHT = ${squeezeLevel.levelHeight}\n\n`

        // Main level data object
        code += `export const ${sanitizedName}: SqueezeLevelData = {\n`
        code += `    name: '${squeezeLevel.name}',\n`
        code += `    levelWidth: WIDTH,\n`
        code += `    levelHeight: HEIGHT,\n`
        code += `    nextLevel: '${squeezeLevel.nextLevel}',\n`
        code += `    playerStart: { x: ${squeezeLevel.playerStart.x}, y: ${squeezeLevel.playerStart.y} },\n`
        code += `    boundaries: generateLevelBoundaries({ width: WIDTH, height: HEIGHT, offset: 200 }).map(x => ({ ...x, color: '#111' })),\n`

        // Walls
        code += `    walls: [\n`
        squeezeLevel.walls.forEach(wall => {
            const angleStr = wall.angle ? `, angle: ${wall.angle}` : ''
            code += `        { x: ${wall.x}, y: ${wall.y}, width: ${wall.width}, height: ${wall.height}, color: '${wall.color}'${angleStr} },\n`
        })
        code += `    ],\n`

        // Polygons
        code += `    polygons: [\n`
        ;(squeezeLevel.polygons || []).forEach(poly => {
            const verticesStr = JSON.stringify(poly.vertices)
            code += `        { x: ${poly.x}, y: ${poly.y}, vertices: ${verticesStr}, angle: ${poly.angle}, color: '${poly.color}' },\n`
        })
        code += `    ],\n`

        // Push Boxes
        code += `    pushBoxes: [\n`
        squeezeLevel.pushBoxes.forEach(box => {
            const angleStr = box.angle ? `, angle: ${box.angle}` : ''
            code += `        { x: ${box.x}, y: ${box.y}, width: ${box.width}, height: ${box.height}, color: '${box.color}', sizeToMove: ${box.sizeToMove}${angleStr} },\n`
        })
        code += `    ],\n`

        // Bounce Balls
        code += `    bounceBalls: [\n`
        ;(squeezeLevel.bounceBalls || []).forEach(ball => {
            code += `        { x: ${ball.x}, y: ${ball.y}, radius: ${ball.radius}, color: '${ball.color}', sizeToMove: ${ball.sizeToMove} },\n`
        })
        code += `    ],\n`

        // Moving Platforms
        code += `    movingPlatforms: [\n`
        squeezeLevel.movingPlatforms.forEach(plat => {
            code += `        {\n`
            code += `            x: ${plat.x},\n`
            code += `            y: ${plat.y},\n`
            code += `            width: ${plat.width},\n`
            code += `            height: ${plat.height},\n`
            if (plat.angle) code += `            angle: ${plat.angle},\n`
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
        squeezeLevel.exitDoors.forEach(door => {
            const angleStr = door.angle ? `, angle: ${door.angle}` : ''
            code += `        { x: ${door.x}, y: ${door.y}, width: ${door.width}, height: ${door.height}, color: '${door.color}', doorPath: '${door.doorPath}'${angleStr} },\n`
        })
        code += `    ],\n`

        // Hazard Blocks
        code += `    hazardBlocks: [\n`
        squeezeLevel.hazardBlocks.forEach(block => {
            const angleStr = block.angle ? `, angle: ${block.angle}` : ''
            code += `        { x: ${block.x}, y: ${block.y}, width: ${block.width}, height: ${block.height}${angleStr} },\n`
        })
        code += `    ],\n`

        // Level Texts
        code += `    levelTexts: [\n`
        ;(squeezeLevel.levelTexts || []).forEach(text => {
            code += `        { x: ${text.x}, y: ${text.y}, text: '${text.text.replace(/'/g, "\\'")}', fontSize: ${text.fontSize}, color: '${text.color}', angle: ${text.angle} },\n`
        })
        code += `    ],\n`

        // Level Sensors
        code += `    levelSensors: [\n`
        ;(squeezeLevel.levelSensors || []).forEach(sensor => {
            const angleStr = sensor.angle ? `, angle: ${sensor.angle}` : ''
            const triggerTagsStr = sensor.triggerTags ? `, triggerTags: ${JSON.stringify(sensor.triggerTags)}` : ''
            const invertFlagStr = sensor.invertFlag ? `, invertFlag: ${sensor.invertFlag}` : ''
            code += `        { x: ${sensor.x}, y: ${sensor.y}, width: ${sensor.width}, height: ${sensor.height}, type: 'box', flagName: '${sensor.flagName}'${angleStr}${triggerTagsStr}${invertFlagStr} },\n`
        })
        code += `    ],\n`

        // Conditional Walls
        code += `    conditionalWalls: [\n`
        ;(squeezeLevel.conditionalWalls || []).forEach(wall => {
            const angleStr = wall.angle ? `, angle: ${wall.angle}` : ''
            const showWhenTrueStr = wall.showWhenTrue !== undefined ? `, showWhenTrue: ${wall.showWhenTrue}` : ''
            const hiddenOpacityStr = wall.hiddenOpacity !== undefined ? `, hiddenOpacity: ${wall.hiddenOpacity}` : ''
            code += `        { x: ${wall.x}, y: ${wall.y}, width: ${wall.width}, height: ${wall.height}, color: '${wall.color}', flagName: '${wall.flagName}'${angleStr}${showWhenTrueStr}${hiddenOpacityStr} },\n`
        })
        code += `    ],\n`

        // Collectibles
        code += `    collectibles: [\n`
        ;(squeezeLevel.collectibles || []).forEach(collectible => {
            code += `        { x: ${collectible.x}, y: ${collectible.y}, radius: ${collectible.radius}, color: '${collectible.color}' },\n`
        })
        code += `    ],\n`

        code += `}\n`

        return code
    }

    /**
     * Export level as TypeScript class file (Squeeze format)
     */
    exportLevelClassCode(level: BaseEditorLevelData): string {
        const squeezeLevel = level as unknown as SqueezeEditorLevelData
        const sanitizedName = squeezeLevel.name.replace(/[^a-zA-Z0-9]/g, '_')
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
        code += `    levelPolygons: any[] = []\n`
        code += `    _levelPolygons: any[] = ${constantName}.polygons || []\n`
        code += `    pushBoxes: any[] = []\n`
        code += `    _pushBoxes: any[] = ${constantName}.pushBoxes\n`
        code += `    bounceBalls: any[] = []\n`
        code += `    _bounceBalls: any[] = ${constantName}.bounceBalls || []\n`
        code += `    movingPlatforms: any[] = []\n`
        code += `    _movingPlatforms: any[] = ${constantName}.movingPlatforms\n`
        code += `    exitDoors: any[] = []\n`
        code += `    _exitDoors: any[] = ${constantName}.exitDoors\n\n`
        code += `    hazardBlocks: any[] = []\n`
        code += `    _hazardBlocks: any[] = ${constantName}.hazardBlocks\n\n`
        code += `    levelTexts: any[] = []\n`
        code += `    _levelTexts: any[] = ${constantName}.levelTexts || []\n\n`
        code += `    levelSensors: any[] = []\n`
        code += `    _levelSensors: any[] = ${constantName}.levelSensors || []\n\n`
        code += `    conditionalWalls: any[] = []\n`
        code += `    _conditionalWalls: any[] = ${constantName}.conditionalWalls || []\n\n`
        code += `    collectibles: any[] = []\n`
        code += `    _collectibles: any[] = ${constantName}.collectibles || []\n\n`
        code += `}\n`

        return code
    }
}
