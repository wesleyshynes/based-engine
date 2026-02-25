// Base Level Editor - Extensible level editor for game development

import { BasedButton } from "../../BasedButton"
import { BasedLevel } from "../../BasedLevel"
import { drawBox, drawCircle, drawText, drawLine } from "../../libs/drawHelpers"
import { XYCoordinateType } from "../../libs/mathHelpers"
import { 
    BaseEditorLevelData, 
    EditorTool, 
    VertexPoint,
    EditorConfig,
    ObjectDefinition,
} from "./EditorTypes"
import { BaseEditorStorage } from "./BaseEditorStorage"
import { EditorInputManager } from "./EditorInputManager"
import { PropertyPanel } from "./panels/PropertyPanel"
import { LevelSettingsPanel } from "./panels/LevelSettingsPanel"
import { LevelListPanel } from "./panels/LevelListPanel"
import { ExportPanel } from "./panels/ExportPanel"
import { ImportPanel } from "./panels/ImportPanel"
import type { RegisteredLevel } from "./panels/ImportPanel"
import {
    BG_COLOR,
    GRID_COLOR,
    GRID_SIZE,
    FILL_COLOR,
    HOVER_COLOR,
    TEXT_COLOR,
    TEXT_HOVER_COLOR,
    TOOL_BUTTON_FILL,
    TOOL_BUTTON_HOVER,
    HANDLE_SIZE,
    POLYGON_CLICK_DELAY,
    MIN_VERTEX_DISTANCE,
    DOUBLE_CLICK_THRESHOLD,
} from "./EditorConstants"
import {
    BASE_OBJECT_REGISTRY,
    BASE_OBJECT_REGISTRY_ORDER,
    getObjectDefinition,
    getObjectDefaults,
    getObjectColor,
    getAllObjectsForRendering,
    isPlaceableObjectType,
} from "./BaseObjectRegistry"
import {
    DrawContext,
    PRIMITIVES,
    getPrimitive,
    drawCoordinateHandle,
    getCoordinateHandleAtPosition,
    handleCoordinateDrag,
} from "./EditorPrimitives"

/**
 * Base Level Editor class that can be extended for game-specific editors.
 * Provides all core editing functionality with configurable object registry,
 * storage keys, and export callbacks.
 */
export class BaseLevelEditor extends BasedLevel {

    // Configuration
    protected editorConfig: EditorConfig
    protected storage: BaseEditorStorage

    // Camera/Viewport (using engine's cameraPos and cameraZoom)
    panSpeed: number = 10
    isPanning: boolean = false
    panStart: { x: number, y: number } = { x: 0, y: 0 }

    // Level Data
    currentLevel: BaseEditorLevelData | null = null

    // Editor State
    currentTool: EditorTool = 'select'
    selectedObject: any | null = null
    isDragging: boolean = false
    dragOffset: { x: number, y: number } = { x: 0, y: 0 }
    isPlacing: boolean = false
    placingPreview: { x: number, y: number } | null = null

    // Handle dragging
    activeHandle: string | null = null
    handleSize: number = HANDLE_SIZE

    // Polygon creation state
    isDrawingPolygon: boolean = false
    polygonVertices: VertexPoint[] = []
    lastClickTime: number = 0
    lastPolygonClickTime: number = 0

    // UI Elements
    toolButtons: Map<EditorTool, any> = new Map()
    backButton: any
    selectButton: any
    panButton: any
    saveButton: any
    testButton: any
    exportButton: any
    newButton: any
    loadButton: any
    importButton: any
    deleteObjectButton: any
    levelSettingsButton: any

    // Panels
    propertyPanel!: PropertyPanel
    levelSettingsPanel!: LevelSettingsPanel
    levelListPanel!: LevelListPanel
    exportPanel!: ExportPanel
    importPanel!: ImportPanel
    savedLevels: BaseEditorLevelData[] = []

    // Messages
    messageText: string = ''
    messageTime: number = 0
    messageDuration: number = 2000

    constructor(config: { key: string, gameRef: any }) {
        super(config)
        // Initialize with default config - subclasses should override getEditorConfig()
        this.editorConfig = this.getEditorConfig()
        this.storage = new BaseEditorStorage(this.editorConfig)
    }

    /**
     * Override this method in subclasses to provide custom editor configuration.
     * This is called in the constructor, so be careful with dependencies.
     */
    protected getEditorConfig(): EditorConfig {
        return {
            storageKey: 'base-editor-levels',
            currentLevelKey: 'base-editor-current-level',
            objectRegistry: BASE_OBJECT_REGISTRY,
            objectRegistryOrder: BASE_OBJECT_REGISTRY_ORDER,
            levelKeys: {
                editor: 'level-editor',
                test: 'test-level',
                menu: 'start-screen',
            },
            defaultLevelSettings: {
                levelWidth: 800,
                levelHeight: 600,
                nextLevel: 'start-screen',
            },
        }
    }

    /**
     * Get the object registry from config
     */
    protected get objectRegistry(): Record<string, ObjectDefinition> {
        return this.editorConfig.objectRegistry
    }

    /**
     * Get the object registry order from config
     */
    protected get objectRegistryOrder(): string[] {
        return this.editorConfig.objectRegistryOrder
    }

    async preload() {
        this.gameRef.drawLoading('Level Editor', 0.5)
    }

    initialize() {
        this.gameRef.cameraZoom = 1
        this.gameRef.cameraPos = { x: 0, y: 0 }

        // Load current level or create new
        const currentId = this.storage.getCurrentLevelId()
        if (currentId) {
            this.currentLevel = this.storage.getLevel(currentId)
        }
        if (!this.currentLevel) {
            this.currentLevel = this.storage.createNewLevel()
            this.storage.saveLevel(this.currentLevel)
            this.storage.setCurrentLevelId(this.currentLevel.id)
        }

        this.savedLevels = this.storage.getAllLevels()

        this.setupPanels()
        this.setupUI()
        this.onResize()

        // Center camera on player start position
        if (this.currentLevel) {
            this.centerOnPlayerStart()
        }
    }

    setupPanels() {
        // Property Panel
        this.propertyPanel = new PropertyPanel(this.gameRef, {
            onPropertyChange: (key: string, value: any) => {
                if (this.selectedObject) {
                    (this.selectedObject as any)[key] = value
                    // Handle special case for playerStart
                    if (this.selectedObject.type === 'playerStart' && this.currentLevel) {
                        this.currentLevel.playerStart = {
                            x: this.selectedObject.x,
                            y: this.selectedObject.y
                        }
                    }
                    this.saveCurrentLevel()
                }
            },
            getSelectedObject: () => this.selectedObject,
            getObjectDefinition: (type: string) => getObjectDefinition(type, this.objectRegistry)
        })

        // Level Settings Panel
        this.levelSettingsPanel = new LevelSettingsPanel(this.gameRef, {
            getCurrentLevel: () => this.currentLevel,
            onSettingChange: (key: string, value: any) => this.applyLevelSettingValue(key, value),
            onDeleteLevel: () => this.deleteCurrentLevel(),
            canDeleteLevel: () => this.savedLevels.length > 1,
            showMessage: (msg: string) => this.showMessage(msg)
        })

        // Level List Panel
        this.levelListPanel = new LevelListPanel(this.gameRef, {
            getSavedLevels: () => this.savedLevels,
            getCurrentLevelId: () => this.currentLevel?.id || null,
            onLoadLevel: (level: BaseEditorLevelData) => {
                this.saveCurrentLevel()
                this.currentLevel = level
                this.storage.setCurrentLevelId(level.id)
                this.selectedObject = null
                this.propertyPanel.hide()
            }
        })

        // Export Panel
        this.exportPanel = new ExportPanel(this.gameRef, {
            getCurrentLevel: () => this.currentLevel,
            exportLevelAsCode: (level) => this.storage.exportLevelAsCode(level),
            exportLevelClassCode: (level) => this.storage.exportLevelClassCode(level)
        })

        // Import Panel
        this.importPanel = new ImportPanel(this.gameRef, {
            getRegisteredLevels: () => this.getRegisteredLevels(),
            importLevelData: (data: any) => this.convertImportData(data),
            onLevelImported: (level: BaseEditorLevelData) => this.handleLevelImported(level),
            showMessage: (msg: string) => this.showMessage(msg),
        })
    }

    centerOnPlayerStart() {
        if (!this.currentLevel) return
        const ps = this.currentLevel.playerStart
        this.gameRef.cameraPos.x = this.gameRef.gameWidth / 2 - ps.x * this.gameRef.cameraZoom
        this.gameRef.cameraPos.y = this.gameRef.gameHeight / 2 - ps.y * this.gameRef.cameraZoom
    }

    setupUI() {
        // Back button
        this.backButton = this.createButton('Back', 10, 10, 60, 35)
        this.backButton.clickFunction = () => {
            this.saveCurrentLevel()
            this.gameRef.loadLevel(this.editorConfig.levelKeys.menu)
        }

        // Tool buttons - auto-generated from object registry
        this.objectRegistryOrder.forEach((objectType, index) => {
            const definition = this.objectRegistry[objectType]
            if (!definition) return
            
            const btn = this.createButton(definition.toolLabel, 10 + index * 55, 55, 50, 30)
            btn.fillColor = this.currentTool === objectType ? TOOL_BUTTON_HOVER : TOOL_BUTTON_FILL
            btn.clickFunction = () => {
                // Cancel polygon drawing if switching away from multi-click mode
                if (this.isDrawingPolygon && definition.creationMode !== 'multi-click') {
                    this.cancelPolygonDrawing()
                }
                this.currentTool = objectType
                this.selectedObject = null
                this.propertyPanel.hide()
                // Reset any drag/handle state
                this.isDragging = false
                this.activeHandle = null
                this.dragOffset = { x: 0, y: 0 }
                this.updateToolButtonColors()
            }
            this.toolButtons.set(objectType, btn)
        })

        // Action buttons (top right)
        const rightX = this.gameRef.gameWidth - 75

        this.saveButton = this.createButton('Save', rightX, 10, 65, 35)
        this.saveButton.clickFunction = () => {
            this.saveCurrentLevel()
            this.showMessage('Level Saved!')
        }

        // Select and Pan buttons (right side, second row)
        this.selectButton = this.createButton('Select', rightX, 55, 65, 30)
        this.selectButton.fillColor = this.currentTool === 'select' ? TOOL_BUTTON_HOVER : TOOL_BUTTON_FILL
        this.selectButton.clickFunction = () => {
            if (this.isDrawingPolygon) this.cancelPolygonDrawing()
            this.currentTool = 'select'
            this.selectedObject = null
            this.propertyPanel.hide()
            this.isDragging = false
            this.activeHandle = null
            this.dragOffset = { x: 0, y: 0 }
            this.updateToolButtonColors()
        }

        this.panButton = this.createButton('Pan', rightX - 70, 55, 65, 30)
        this.panButton.fillColor = this.currentTool === 'pan' ? TOOL_BUTTON_HOVER : TOOL_BUTTON_FILL
        this.panButton.clickFunction = () => {
            if (this.isDrawingPolygon) this.cancelPolygonDrawing()
            this.currentTool = 'pan'
            this.selectedObject = null
            this.propertyPanel.hide()
            this.isDragging = false
            this.activeHandle = null
            this.dragOffset = { x: 0, y: 0 }
            this.updateToolButtonColors()
        }

        this.testButton = this.createButton('Test', rightX - 70, 10, 65, 35)
        this.testButton.clickFunction = () => this.testLevel()

        this.exportButton = this.createButton('Export', rightX - 140, 10, 65, 35)
        this.exportButton.clickFunction = () => {
            this.exportPanel.toggle()
            this.importPanel.hide()
            this.levelListPanel.hide()
            this.levelSettingsPanel.hide()
        }

        this.importButton = this.createButton('Import', rightX - 210, 10, 65, 35)
        this.importButton.clickFunction = () => {
            this.importPanel.toggle()
            this.exportPanel.hide()
            this.levelListPanel.hide()
            this.levelSettingsPanel.hide()
        }

        this.newButton = this.createButton('New', rightX - 280, 10, 65, 35)
        this.newButton.clickFunction = () => {
            this.saveCurrentLevel()
            this.currentLevel = this.storage.createNewLevel()
            this.storage.saveLevel(this.currentLevel)
            this.storage.setCurrentLevelId(this.currentLevel.id)
            this.savedLevels = this.storage.getAllLevels()
            this.selectedObject = null
            this.showMessage('New Level Created!')
        }

        this.loadButton = this.createButton('Load', rightX - 350, 10, 65, 35)
        this.loadButton.clickFunction = () => {
            this.savedLevels = this.storage.getAllLevels()
            this.levelListPanel.toggle()
            this.importPanel.hide()
            this.exportPanel.hide()
            this.levelSettingsPanel.hide()
        }

        this.levelSettingsButton = this.createButton('Settings', rightX - 430, 10, 75, 35)
        this.levelSettingsButton.clickFunction = () => {
            this.levelSettingsPanel.toggle()
            this.importPanel.hide()
            this.levelListPanel.hide()
            this.exportPanel.hide()
        }

        this.deleteObjectButton = this.createButton('Delete', 10, this.gameRef.gameHeight - 45, 70, 35)
        this.deleteObjectButton.fillColor = '#a33'
        this.deleteObjectButton.clickFunction = () => this.deleteSelectedObject()
    }

    createButton(text: string, x: number, y: number, width: number, height: number): any {
        const btn = new BasedButton({ key: `btn-${text}`, gameRef: this.gameRef })
        btn.x = x
        btn.y = y
        btn.width = width
        btn.height = height
        btn.buttonText = text
        btn.fillColor = FILL_COLOR
        btn.hoverColor = HOVER_COLOR
        btn.textColor = TEXT_COLOR
        btn.textHoverColor = TEXT_HOVER_COLOR
        btn.fontSize = 12
        return btn
    }

    updateToolButtonColors() {
        this.toolButtons.forEach((btn, tool) => {
            btn.fillColor = this.currentTool === tool ? TOOL_BUTTON_HOVER : TOOL_BUTTON_FILL
        })
        // Update select and pan button colors
        this.selectButton.fillColor = this.currentTool === 'select' ? TOOL_BUTTON_HOVER : TOOL_BUTTON_FILL
        this.panButton.fillColor = this.currentTool === 'pan' ? TOOL_BUTTON_HOVER : TOOL_BUTTON_FILL
    }

    showMessage(text: string) {
        this.messageText = text
        this.messageTime = this.gameRef.lastUpdate
    }

    /**
     * Get the list of pre-registered levels available for import.
     * Override in subclass to provide game-specific registered levels.
     */
    protected getRegisteredLevels(): RegisteredLevel[] {
        return []
    }

    /**
     * Convert imported data into editor level data.
     * Override in subclass for game-specific conversion.
     * Returns null if the data cannot be parsed/converted.
     */
    protected convertImportData(data: any): BaseEditorLevelData | null {
        if (!data || typeof data !== 'object') return null
        const now = Date.now()
        return {
            ...data,
            id: this.storage.generateId(),
            createdAt: now,
            updatedAt: now,
            name: data.name || 'Imported Level',
            levelWidth: data.levelWidth || 800,
            levelHeight: data.levelHeight || 600,
            playerStart: data.playerStart || { x: 100, y: 100 },
            nextLevel: data.nextLevel || this.editorConfig.levelKeys.menu,
        }
    }

    /**
     * Handle a successfully imported level: save it and make it active.
     */
    protected handleLevelImported(level: BaseEditorLevelData): void {
        this.saveCurrentLevel()
        this.storage.saveLevel(level)
        this.storage.setCurrentLevelId(level.id)
        this.currentLevel = level
        this.savedLevels = this.storage.getAllLevels()
        this.selectedObject = null
        this.propertyPanel.hide()
        this.importPanel.hide()
        this.centerOnPlayerStart()
    }

    saveCurrentLevel() {
        if (this.currentLevel) {
            this.storage.saveLevel(this.currentLevel)
        }
    }

    testLevel() {
        if (this.currentLevel) {
            this.saveCurrentLevel()
            this.gameRef.basedObjectRefs.testLevelData = this.currentLevel
            this.gameRef.loadLevel(this.editorConfig.levelKeys.test)
        }
    }

    deleteSelectedObject() {
        if (!this.selectedObject || !this.currentLevel) return

        const obj = this.selectedObject
        const definition = getObjectDefinition(obj.type, this.objectRegistry)
        
        if (!definition || definition.arrayKey === 'playerStart') {
            // Can't delete playerStart
            return
        }

        // Get the array and filter out the selected object
        const array = this.currentLevel[definition.arrayKey] as any[]
        if (array) {
            const index = array.findIndex((item: any) => item.id === obj.id)
            if (index !== -1) {
                array.splice(index, 1)
            }
        }

        this.selectedObject = null
        this.propertyPanel.hide()
        this.saveCurrentLevel()
    }

    deleteCurrentLevel() {
        if (!this.currentLevel) return
        this.storage.deleteLevel(this.currentLevel.id)
        this.savedLevels = this.storage.getAllLevels()
        this.currentLevel = this.savedLevels[0] || this.storage.createNewLevel()
        this.storage.setCurrentLevelId(this.currentLevel.id)
        this.levelSettingsPanel.hide()
        this.showMessage('Level Deleted')
    }

    applyLevelSettingValue(settingKey: string, value: string) {
        if (!this.currentLevel) return

        if (settingKey === 'name') {
            this.currentLevel.name = value || 'Untitled Level'
        } else if (settingKey === 'levelWidth') {
            this.currentLevel.levelWidth = Math.max(200, parseInt(value) || 800)
        } else if (settingKey === 'levelHeight') {
            this.currentLevel.levelHeight = Math.max(200, parseInt(value) || 600)
        } else if (settingKey === 'nextLevel') {
            this.currentLevel.nextLevel = value || this.editorConfig.levelKeys.menu
        }

        this.saveCurrentLevel()
        this.savedLevels = this.storage.getAllLevels()
    }

    handleInput() {
        if (EditorInputManager.isInputFocused()) return

        const keys = this.gameRef.pressedKeys

        // Pan with arrow keys or WASD
        if (keys['ArrowLeft'] || keys['KeyA']) this.gameRef.cameraPos.x += this.panSpeed
        if (keys['ArrowRight'] || keys['KeyD']) this.gameRef.cameraPos.x -= this.panSpeed
        if (keys['ArrowUp'] || keys['KeyW']) this.gameRef.cameraPos.y += this.panSpeed
        if (keys['ArrowDown'] || keys['KeyS']) this.gameRef.cameraPos.y -= this.panSpeed

        // Zoom with +/-
        if (keys['Equal'] || keys['NumpadAdd']) {
            this.gameRef.cameraZoom = Math.min(2, this.gameRef.cameraZoom + 0.02)
        }
        if (keys['Minus'] || keys['NumpadSubtract']) {
            this.gameRef.cameraZoom = Math.max(0.25, this.gameRef.cameraZoom - 0.02)
        }

        // Delete selected object
        if (keys['Delete'] || keys['Backspace']) {
            if (this.selectedObject && !this.propertyPanel.isEditing && !this.levelSettingsPanel.isEditing) {
                this.deleteSelectedObject()
            }
        }

        // P to toggle pan tool
        if (keys['KeyP']) this.currentTool = 'pan'

        // V to toggle select tool
        if (keys['KeyV']) this.currentTool = 'select'

        // Enter to finalize polygon drawing
        if (keys['Enter'] && this.isDrawingPolygon) {
            this.finalizePolygon()
        }

        // Escape to deselect or cancel/close panels
        if (keys['Escape']) {
            if (this.isDrawingPolygon) {
                this.cancelPolygonDrawing()
            } else {
                this.selectedObject = null
                this.propertyPanel.hide()
                this.levelListPanel.hide()
                this.exportPanel.hide()
                this.importPanel.hide()
                this.levelSettingsPanel.hide()
            }
        }
    }

    handleMouse() {
        const mouse = this.gameRef.mouseInfo
        const worldPos = this.gameRef.screenToWorld(mouse.x, mouse.y)

        // Update placing preview for placeable tools
        if (isPlaceableObjectType(this.currentTool, this.objectRegistry)) {
            const definition = getObjectDefinition(this.currentTool, this.objectRegistry)
            // Only show preview for single-click creation (not multi-click like polygon)
            if (definition && definition.creationMode === 'single-click') {
                const snappedX = Math.round(worldPos.x / GRID_SIZE) * GRID_SIZE
                const snappedY = Math.round(worldPos.y / GRID_SIZE) * GRID_SIZE
                this.placingPreview = { x: snappedX, y: snappedY }
            } else {
                this.placingPreview = null
            }
        } else {
            this.placingPreview = null
        }

        // Handle mouse down
        if (mouse.mouseDown && !this.isDragging && !this.isPanning && !this.activeHandle) {
            if (mouse.y < 100 || this.isClickOnPanel(mouse.x, mouse.y)) {
                return
            }

            // Check for handle first
            if (this.currentTool === 'select' && this.selectedObject) {
                const handle = this.getHandleAtPosition(worldPos.x, worldPos.y)
                if (handle) {
                    this.activeHandle = handle
                    return
                }
            }

            if (this.currentTool === 'pan') {
                this.isPanning = true
                this.panStart = { x: mouse.x, y: mouse.y }
            } else if (this.currentTool === 'select') {
                const clicked = this.getObjectAtPosition(worldPos.x, worldPos.y)
                if (clicked) {
                    this.selectedObject = clicked
                    this.propertyPanel.show()
                    this.isDragging = true
                    this.dragOffset = {
                        x: worldPos.x - clicked.x,
                        y: worldPos.y - clicked.y
                    }
                } else {
                    this.selectedObject = null
                    this.propertyPanel.hide()
                }
            } else if (isPlaceableObjectType(this.currentTool, this.objectRegistry)) {
                const definition = getObjectDefinition(this.currentTool, this.objectRegistry)
                if (definition && definition.creationMode === 'multi-click') {
                    // Multi-click mode (like polygon)
                    this.handleMultiClickPlacement(worldPos.x, worldPos.y)
                } else {
                    // Single-click placement
                    if (this.placingPreview) {
                        this.placeObject(this.placingPreview.x, this.placingPreview.y)
                    } else {
                        const snappedX = Math.round(worldPos.x / GRID_SIZE) * GRID_SIZE
                        const snappedY = Math.round(worldPos.y / GRID_SIZE) * GRID_SIZE
                        this.placeObject(snappedX, snappedY)
                    }
                    this.isDragging = true
                }
            }
        }

        // Handle active handle dragging
        if (this.activeHandle && this.selectedObject && mouse.mouseDown) {
            this.handleHandleDrag(worldPos.x, worldPos.y)
        }

        // Handle dragging
        if (this.isDragging && this.selectedObject && mouse.mouseDown && !this.activeHandle && this.currentTool === 'select') {
            const snappedX = Math.round((worldPos.x - this.dragOffset.x) / GRID_SIZE) * GRID_SIZE
            const snappedY = Math.round((worldPos.y - this.dragOffset.y) / GRID_SIZE) * GRID_SIZE

            const deltaX = snappedX - this.selectedObject.x
            const deltaY = snappedY - this.selectedObject.y

            this.selectedObject.x = snappedX
            this.selectedObject.y = snappedY

            if (this.selectedObject.type === 'playerStart' && this.currentLevel) {
                this.currentLevel.playerStart = { x: snappedX, y: snappedY }
            }

            // Handle coordinate handles movement (like movingPlatform min/max)
            const definition = getObjectDefinition(this.selectedObject.type, this.objectRegistry)
            if (definition?.coordinateHandles) {
                for (const coordHandle of definition.coordinateHandles) {
                    this.selectedObject[coordHandle.xKey] += deltaX
                    this.selectedObject[coordHandle.yKey] += deltaY
                }
            }
        }

        // Handle panning
        if (this.isPanning && mouse.mouseDown) {
            this.gameRef.cameraPos.x += mouse.x - this.panStart.x
            this.gameRef.cameraPos.y += mouse.y - this.panStart.y
            this.panStart = { x: mouse.x, y: mouse.y }
        }

        // Handle mouse up
        if (!mouse.mouseDown) {
            if (this.isDragging || this.activeHandle) {
                this.saveCurrentLevel()
            }
            this.isDragging = false
            this.isPanning = false
            this.activeHandle = null
        }
    }

    isClickOnPanel(x: number, y: number): boolean {
        if (this.propertyPanel.visible && x > this.gameRef.gameWidth - 220) return true
        if (this.levelListPanel.visible && this.levelListPanel.isPointInside(x, y)) return true
        if (this.exportPanel.visible && this.exportPanel.isPointInside(x, y)) return true
        if (this.importPanel.visible && this.importPanel.isPointInside(x, y)) return true
        if (this.levelSettingsPanel.visible && this.levelSettingsPanel.isPointInside(x, y)) return true
        if (this.selectedObject && x < 90 && y > this.gameRef.gameHeight - 55) return true
        return false
    }

    getHandleAtPosition(x: number, y: number): string | null {
        if (!this.selectedObject) return null

        const ctx = this.gameRef.ctx as CanvasRenderingContext2D
        const drawCtx: DrawContext = {
            ctx,
            cameraPos: { x: this.gameRef.cameraPos.x, y: this.gameRef.cameraPos.y },
            cameraZoom: this.gameRef.cameraZoom,
            handleSize: this.handleSize,
            worldToScreen: this.gameRef.worldToScreen.bind(this.gameRef),
            screenToWorld: this.gameRef.screenToWorld.bind(this.gameRef)
        }

        // Look up the object definition from registry
        const definition = getObjectDefinition(this.selectedObject.type, this.objectRegistry)
        if (!definition) return null

        // Check coordinate handles first (like minPoint/maxPoint)
        if (definition.coordinateHandles) {
            for (const coordHandle of definition.coordinateHandles) {
                // Use handleId based on keys (e.g., 'minX-minY' -> 'minPoint', 'maxX-maxY' -> 'maxPoint')
                const handleId = coordHandle.xKey.replace('X', 'Point')
                const result = getCoordinateHandleAtPosition(
                    this.selectedObject,
                    coordHandle,
                    x,
                    y,
                    drawCtx,
                    handleId
                )
                if (result) return result
            }
        }

        // Check primitive handles
        const primitive = getPrimitive(definition.primitive)
        if (primitive) {
            const handle = primitive.getHandleAtPosition(this.selectedObject, x, y, drawCtx)
            if (handle) {
                // Convert from primitive format to legacy format (resize-se -> se, resize-e -> e)
                if (handle.startsWith('resize-')) {
                    return handle.replace('resize-', '')
                }
                return handle
            }
        }

        return null
    }

    handleHandleDrag(worldX: number, worldY: number) {
        if (!this.selectedObject || !this.activeHandle) return

        const snappedX = Math.round(worldX / GRID_SIZE) * GRID_SIZE
        const snappedY = Math.round(worldY / GRID_SIZE) * GRID_SIZE

        // Look up the object definition from registry
        const definition = getObjectDefinition(this.selectedObject.type, this.objectRegistry)
        if (!definition) return

        // Check for coordinate handle drags first (minPoint, maxPoint, etc.)
        if (definition.coordinateHandles) {
            for (const coordHandle of definition.coordinateHandles) {
                const handleId = coordHandle.xKey.replace('X', 'Point')
                if (this.activeHandle === handleId) {
                    handleCoordinateDrag(this.selectedObject, coordHandle, snappedX, snappedY)
                    return
                }
            }
        }

        // Delegate to primitive's handleDrag
        const primitive = getPrimitive(definition.primitive)
        if (primitive) {
            // Convert legacy handle names to primitive format (e -> resize-e, etc.)
            let primitiveHandle = this.activeHandle
            if (['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'].includes(this.activeHandle)) {
                primitiveHandle = `resize-${this.activeHandle}`
            }
            primitive.handleDrag(this.selectedObject, primitiveHandle, worldX, worldY, snappedX, snappedY)
        }
    }

    getObjectAtPosition(x: number, y: number): any | null {
        if (!this.currentLevel) return null

        // Get all objects sorted by zIndex (reverse so highest zIndex is first)
        const allObjects = getAllObjectsForRendering(
            this.currentLevel, 
            this.objectRegistry, 
            this.objectRegistryOrder
        ).reverse()

        for (const { obj, definition } of allObjects) {
            const primitive = getPrimitive(definition.primitive)
            if (primitive && primitive.isPointInside(obj, x, y)) {
                return obj
            }
        }

        return null
    }

    // Multi-click placement (for polygon and future multi-click objects)
    handleMultiClickPlacement(worldX: number, worldY: number) {
        const definition = getObjectDefinition(this.currentTool, this.objectRegistry)
        if (definition && definition.creationMode === 'multi-click') {
            this.handlePolygonClick(worldX, worldY)
        }
    }

    // Polygon creation
    handlePolygonClick(worldX: number, worldY: number) {
        const snappedX = Math.round(worldX / GRID_SIZE) * GRID_SIZE
        const snappedY = Math.round(worldY / GRID_SIZE) * GRID_SIZE
        const now = Date.now()

        if ((now - this.lastPolygonClickTime) < POLYGON_CLICK_DELAY) return

        const isDoubleClick = (now - this.lastClickTime) < DOUBLE_CLICK_THRESHOLD
        this.lastClickTime = now
        this.lastPolygonClickTime = now

        if (isDoubleClick && this.polygonVertices.length >= 3) {
            this.finalizePolygon()
            return
        }

        if (this.polygonVertices.length > 0) {
            const lastVertex = this.polygonVertices[this.polygonVertices.length - 1]
            const dist = Math.sqrt(Math.pow(snappedX - lastVertex.x, 2) + Math.pow(snappedY - lastVertex.y, 2))
            if (dist < MIN_VERTEX_DISTANCE) return
        }

        this.isDrawingPolygon = true
        this.polygonVertices.push({ x: snappedX, y: snappedY })

        if (this.polygonVertices.length >= 3) {
            const first = this.polygonVertices[0]
            const dist = Math.sqrt(Math.pow(snappedX - first.x, 2) + Math.pow(snappedY - first.y, 2))
            if (dist < GRID_SIZE * 2) {
                this.polygonVertices.pop()
                this.finalizePolygon()
            }
        }
    }

    finalizePolygon() {
        if (!this.currentLevel || this.polygonVertices.length < 3) {
            this.cancelPolygonDrawing()
            return
        }

        let centerX = 0, centerY = 0
        this.polygonVertices.forEach(v => { centerX += v.x; centerY += v.y })
        centerX /= this.polygonVertices.length
        centerY /= this.polygonVertices.length
        centerX = Math.round(centerX / GRID_SIZE) * GRID_SIZE
        centerY = Math.round(centerY / GRID_SIZE) * GRID_SIZE

        const localVertices = this.polygonVertices.map(v => ({
            x: v.x - centerX,
            y: v.y - centerY
        }))

        const definition = getObjectDefinition(this.currentTool, this.objectRegistry)
        if (!definition) {
            this.cancelPolygonDrawing()
            return
        }

        const poly: any = {
            id: this.storage.generateId(),
            type: this.currentTool,
            x: centerX,
            y: centerY,
            vertices: localVertices,
            angle: 0,
            color: definition.defaults.color || '#333333'
        }

        // Get the array to push to
        const array = this.currentLevel[definition.arrayKey] as any[]
        if (array) {
            array.push(poly)
        }

        this.selectedObject = poly
        this.propertyPanel.show()
        this.saveCurrentLevel()

        this.isDrawingPolygon = false
        this.polygonVertices = []
        this.showMessage('Polygon created!')
    }

    cancelPolygonDrawing() {
        this.isDrawingPolygon = false
        this.polygonVertices = []
    }

    placeObject(x: number, y: number) {
        if (!this.currentLevel || !isPlaceableObjectType(this.currentTool, this.objectRegistry)) return

        const definition = getObjectDefinition(this.currentTool, this.objectRegistry)
        if (!definition) return
        
        const defaults = getObjectDefaults(this.currentTool, this.objectRegistry)
        const id = this.storage.generateId()

        // Special handling for playerStart (not stored in an array)
        if (definition.arrayKey === 'playerStart') {
            this.currentLevel.playerStart = { x, y }
            this.selectedObject = { id: 'playerStart', type: 'playerStart', x, y }
            this.propertyPanel.show()
            this.saveCurrentLevel()
            return
        }

        // Create the object with defaults merged with position
        const newObject: any = {
            ...defaults,
            id,
            x,
            y,
        }

        // Special handling for objects with coordinate handles - offset by position
        if (definition.coordinateHandles) {
            for (const coordHandle of definition.coordinateHandles) {
                if (defaults[coordHandle.xKey] !== undefined) {
                    newObject[coordHandle.xKey] = x + (defaults[coordHandle.xKey] || 0)
                }
                if (defaults[coordHandle.yKey] !== undefined) {
                    newObject[coordHandle.yKey] = y + (defaults[coordHandle.yKey] || 0)
                }
            }
        }

        // Get the array to push to
        const targetArray = this.currentLevel[definition.arrayKey] as any[]
        
        if (targetArray) {
            targetArray.push(newObject)
            this.selectedObject = newObject
            this.propertyPanel.show()
            this.saveCurrentLevel()
        }
    }

    update() {
        this.handleInput()
        this.handleMouse()

        // Update buttons
        this.backButton.update()
        this.saveButton.update()
        this.testButton.update()
        this.exportButton.update()
        this.importButton.update()
        this.newButton.update()
        this.loadButton.update()
        this.levelSettingsButton.update()
        this.selectButton.update()
        this.panButton.update()

        if (this.selectedObject) {
            this.deleteObjectButton.update()
        }

        this.toolButtons.forEach(btn => btn.update())
    }

    onResize() {
        const rightX = this.gameRef.gameWidth - 75
        this.saveButton.x = rightX
        this.testButton.x = rightX - 70
        this.exportButton.x = rightX - 140
        this.importButton.x = rightX - 210
        this.newButton.x = rightX - 280
        this.loadButton.x = rightX - 350
        this.levelSettingsButton.x = rightX - 430
        // Select and Pan buttons on second row
        this.selectButton.x = rightX
        this.panButton.x = rightX - 70
        this.deleteObjectButton.y = this.gameRef.gameHeight - 45

        // Update panel positions
        this.propertyPanel.onResize()
        this.levelSettingsPanel.onResize()
        this.levelListPanel.onResize()
        this.exportPanel.onResize()
        this.importPanel.onResize()
    }

    draw() {
        const ctx = this.gameRef.ctx

        // Background
        drawBox({ c: ctx, x: 0, y: 0, width: this.gameRef.gameWidth, height: this.gameRef.gameHeight, fillColor: BG_COLOR })

        if (this.currentLevel) {
            this.drawLevel()
        }

        this.drawUI()

        // Draw message
        if (this.messageText && this.gameRef.lastUpdate - this.messageTime < this.messageDuration) {
            drawText({
                c: ctx, x: this.gameRef.gameWidth / 2, y: this.gameRef.gameHeight - 20,
                align: 'center', fillColor: '#0f0', fontSize: 16, fontFamily: 'sans-serif',
                weight: 'bold', style: '', text: this.messageText
            })
        }
    }

    drawLevel() {
        const ctx = this.gameRef.ctx
        if (!this.currentLevel) return

        const levelScreen = this.gameRef.worldToScreen(0, 0)

        // Level background
        drawBox({
            c: ctx, x: levelScreen.x, y: levelScreen.y,
            width: this.currentLevel.levelWidth,
            height: this.currentLevel.levelHeight,
            fillColor: '#444',
            zoom: this.gameRef.cameraZoom
        })

        // Grid
        for (let x = 0; x <= this.currentLevel.levelWidth; x += GRID_SIZE) {
            const screenX = levelScreen.x + x * this.gameRef.cameraZoom
            drawLine({ c: ctx, x: screenX, y: levelScreen.y, toX: screenX, toY: levelScreen.y + this.currentLevel.levelHeight, strokeColor: GRID_COLOR, strokeWidth: 1, zoom: this.gameRef.cameraZoom })
        }
        for (let y = 0; y <= this.currentLevel.levelHeight; y += GRID_SIZE) {
            const screenY = levelScreen.y + y * this.gameRef.cameraZoom
            drawLine({ c: ctx, x: levelScreen.x, y: screenY, toX: levelScreen.x + this.currentLevel.levelWidth, toY: screenY, strokeColor: GRID_COLOR, strokeWidth: 1, zoom: this.gameRef.cameraZoom })
        }

        // Create draw context for primitives
        const drawCtx: DrawContext = {
            ctx,
            cameraPos: { x: this.gameRef.cameraPos.x, y: this.gameRef.cameraPos.y },
            cameraZoom: this.gameRef.cameraZoom,
            handleSize: this.handleSize,
            worldToScreen: (wx, wy) => this.gameRef.worldToScreen(wx, wy),
            screenToWorld: (sx, sy) => this.gameRef.screenToWorld(sx, sy),
        }

        // Get all objects sorted by zIndex
        const allObjects = getAllObjectsForRendering(
            this.currentLevel,
            this.objectRegistry,
            this.objectRegistryOrder
        )

        // Draw all objects using primitives
        allObjects.forEach(({ obj, definition }) => {
            const isSelected = this.selectedObject?.id === obj.id || 
                              (obj.type === 'playerStart' && this.selectedObject?.type === 'playerStart')
            const color = getObjectColor(obj, definition)
            const primitive = getPrimitive(definition.primitive)

            // Draw custom elements first (like movingPlatform range line)
            if (definition.customDraw) {
                definition.customDraw(obj, drawCtx, isSelected)
            }

            // Draw the primitive
            primitive.draw(obj, drawCtx, isSelected, color)

            // Draw handles when selected
            if (isSelected) {
                primitive.drawHandles(obj, drawCtx)
                
                // Draw coordinate handles (like movingPlatform min/max)
                if (definition.coordinateHandles) {
                    definition.coordinateHandles.forEach(config => {
                        drawCoordinateHandle(obj, config, drawCtx, isSelected)
                    })
                }
            }
        })

        // Placement preview
        if (this.placingPreview && isPlaceableObjectType(this.currentTool, this.objectRegistry)) {
            const definition = getObjectDefinition(this.currentTool, this.objectRegistry)
            if (definition && definition.creationMode === 'single-click') {
                const defaults = getObjectDefaults(this.currentTool, this.objectRegistry)
                const color = definition.fixedColor || defaults.color || '#888'
                
                ctx.globalAlpha = 0.5

                const primitive = getPrimitive(definition.primitive)
                const previewObj = { ...defaults, x: this.placingPreview.x, y: this.placingPreview.y }
                primitive.draw(previewObj, drawCtx, false, color)

                ctx.globalAlpha = 1
            }
        }

        // Polygon in progress
        if (this.isDrawingPolygon && this.polygonVertices.length > 0) {
            this.drawPolygonInProgress()
        }
    }

    drawPolygonInProgress() {
        const ctx = this.gameRef.ctx
        const mouse = this.gameRef.mouseInfo
        const mouseWorld = this.gameRef.screenToWorld(mouse.x, mouse.y)
        const snappedMouse = { x: Math.round(mouseWorld.x / GRID_SIZE) * GRID_SIZE, y: Math.round(mouseWorld.y / GRID_SIZE) * GRID_SIZE }
        const mouseScreen = this.gameRef.worldToScreen(snappedMouse.x, snappedMouse.y)

        ctx.globalAlpha = 0.7

        for (let i = 0; i < this.polygonVertices.length - 1; i++) {
            const fromScreen = this.gameRef.worldToScreen(this.polygonVertices[i].x, this.polygonVertices[i].y)
            const toScreen = this.gameRef.worldToScreen(this.polygonVertices[i + 1].x, this.polygonVertices[i + 1].y)
            drawLine({ c: ctx, x: fromScreen.x, y: fromScreen.y, toX: toScreen.x, toY: toScreen.y, strokeColor: '#81B622', strokeWidth: 2 })
        }

        if (this.polygonVertices.length > 0) {
            const lastScreen = this.gameRef.worldToScreen(this.polygonVertices[this.polygonVertices.length - 1].x, this.polygonVertices[this.polygonVertices.length - 1].y)
            drawLine({ c: ctx, x: lastScreen.x, y: lastScreen.y, toX: mouseScreen.x, toY: mouseScreen.y, strokeColor: '#81B622', strokeWidth: 2 })
        }

        this.polygonVertices.forEach((v, i) => {
            const screenPos = this.gameRef.worldToScreen(v.x, v.y)
            drawCircle({ c: ctx, x: screenPos.x, y: screenPos.y, radius: 6, fillColor: i === 0 ? '#ff0' : '#81B622', strokeColor: '#fff', strokeWidth: 2 })
        })

        drawCircle({ c: ctx, x: mouseScreen.x, y: mouseScreen.y, radius: 6, fillColor: '#81B622', strokeColor: '#fff', strokeWidth: 2 })

        ctx.globalAlpha = 1

        const vertCount = this.polygonVertices.length
        const instructionText = vertCount < 3 ? `Click to add points (${vertCount}/3 min)` : `Click to add, double-click or Enter to finish, Esc to cancel`
        drawText({ c: ctx, x: this.gameRef.gameWidth / 2, y: this.gameRef.gameHeight - 40, align: 'center', fillColor: '#81B622', fontSize: 14, fontFamily: 'sans-serif', weight: 'bold', style: '', text: instructionText })
    }

    drawUI() {
        const ctx = this.gameRef.ctx

        // Top bar
        drawBox({ c: ctx, x: 0, y: 0, width: this.gameRef.gameWidth, height: 100, fillColor: 'rgba(0, 0, 0, 0.8)' })

        if (this.currentLevel) {
            drawText({ c: ctx, x: this.gameRef.gameWidth / 2, y: 30, align: 'center', fillColor: '#fff', fontSize: 18, fontFamily: 'sans-serif', weight: 'bold', style: '', text: this.currentLevel.name })
            drawText({ c: ctx, x: this.gameRef.gameWidth / 2, y: 50, align: 'center', fillColor: '#888', fontSize: 12, fontFamily: 'sans-serif', weight: 'normal', style: '', text: `${this.currentLevel.levelWidth}x${this.currentLevel.levelHeight} | Zoom: ${Math.round(this.gameRef.cameraZoom * 100)}%` })
        }

        // Buttons
        this.backButton.draw()
        this.saveButton.draw()
        this.testButton.draw()
        this.exportButton.draw()
        this.importButton.draw()
        this.newButton.draw()
        this.loadButton.draw()
        this.levelSettingsButton.draw()
        this.selectButton.draw()
        this.panButton.draw()
        this.toolButtons.forEach(btn => btn.draw())

        drawText({ c: ctx, x: 10, y: 95, align: 'left', fillColor: '#888', fontSize: 11, fontFamily: 'sans-serif', weight: 'normal', style: '', text: `Tool: ${this.currentTool} | Pan: Arrow keys/WASD | Zoom: +/-` })

        // Panels
        this.propertyPanel.draw()
        if (this.selectedObject) this.deleteObjectButton.draw()
        this.levelListPanel.draw()
        this.exportPanel.draw()
        this.importPanel.draw()
        this.levelSettingsPanel.draw()
    }

    tearDown() {
        this.propertyPanel.tearDown()
        this.levelSettingsPanel.tearDown()
        this.levelListPanel.tearDown()
        this.exportPanel.tearDown()
        this.importPanel.tearDown()
        this.saveCurrentLevel()
    }
}
