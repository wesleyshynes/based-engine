// Editor Data Loader - Helper for loading editor level data into game levels
// Uses composition pattern to allow any level class to load editor data

import { BasedGame } from "../../BasedEngine"
import { BaseEditorLevelData } from "./EditorTypes"

/**
 * Helper class for loading level data from the editor into game levels.
 * Uses a composition pattern - call these methods from your level's preload/initialize.
 */
export class EditorDataLoader {
    /**
     * Get the test level data from the game's basedObjectRefs.
     * Returns null if no test data is available.
     */
    static getTestLevelData(gameRef: BasedGame): BaseEditorLevelData | null {
        return gameRef.basedObjectRefs.testLevelData || null
    }

    /**
     * Check if there is test level data available
     */
    static hasTestLevelData(gameRef: BasedGame): boolean {
        return !!gameRef.basedObjectRefs.testLevelData
    }

    /**
     * Clear the test level data from basedObjectRefs
     */
    static clearTestLevelData(gameRef: BasedGame): void {
        delete gameRef.basedObjectRefs.testLevelData
    }

    /**
     * Map editor level data to game level properties.
     * Call this in your level's preload() method.
     * 
     * @param levelData - The editor level data
     * @param mappings - Object mapping editor array keys to transformation functions
     * @returns Object with mapped arrays ready to assign to level properties
     * 
     * @example
     * ```ts
     * const levelData = EditorDataLoader.getTestLevelData(this.gameRef)
     * if (levelData) {
     *     const mapped = EditorDataLoader.mapLevelData(levelData, {
     *         walls: (items) => items.map(wall => ({ ...wall })),
     *         pushBoxes: (items) => items.map(box => ({ ...box })),
     *     })
     *     this._levelWalls = mapped.walls
     *     this._pushBoxes = mapped.pushBoxes
     * }
     * ```
     */
    static mapLevelData<T extends Record<string, any>>(
        levelData: BaseEditorLevelData,
        mappings: { [K in keyof T]: (items: any[], levelData: BaseEditorLevelData) => T[K] }
    ): T {
        const result = {} as T

        for (const key in mappings) {
            const sourceArray = (levelData as any)[key] || []
            result[key] = mappings[key](sourceArray, levelData)
        }

        return result
    }

    /**
     * Simple identity mapping - just copies the array with spread
     */
    static identityMapper<T>(items: T[]): T[] {
        return items.map(item => ({ ...item } as T))
    }

    /**
     * Create a mapper that adds/transforms properties
     */
    static createMapper<TInput, TOutput>(
        transform: (item: TInput, index: number) => TOutput
    ): (items: TInput[]) => TOutput[] {
        return (items) => items.map(transform)
    }
}
