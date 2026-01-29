import { BasedButton } from "../../../engine/BasedButton"
import { BasedLevel } from "../../../engine/BasedLevel"
import { drawBox, drawCircle, drawText, rotateDraw, drawLine, drawPolygon } from "../../../engine/libs/drawHelpers"
import { EditorLevelData, EditorObject, EditorTool, DEFAULT_OBJECTS, EditorWall, EditorPushBox, EditorMovingPlatform, EditorExitDoor, EditorHazardBlock, EditorPolygon, EditorText, VertexPoint } from "./LevelEditorTypes"
import { LevelEditorStorage } from "./LevelEditorStorage"
import { EditorInputManager } from "./EditorInputManager"
import { 
    PropertyPanel, 
    LevelSettingsPanel, 
    LevelListPanel, 
    ExportPanel 
} from "./panels"
import {
    BG_COLOR,
    GRID_COLOR,
    GRID_SIZE,
    TOOL_COLORS,
    FILL_COLOR,
    HOVER_COLOR,
    TEXT_COLOR,
    TEXT_HOVER_COLOR,
    TOOL_BUTTON_FILL,
    TOOL_BUTTON_HOVER,
    HANDLE_COLOR,
    HANDLE_BORDER,
    HANDLE_SIZE,
    MIN_OBJECT_SIZE,
    POLYGON_CLICK_DELAY,
    MIN_VERTEX_DISTANCE,
    DOUBLE_CLICK_THRESHOLD,
    TOOL_LABELS,
    TOOL_ORDER
} from "./EditorConstants"

export class LevelEditor extends BasedLevel {

    // Camera/Viewport
    cameraX: number = 0
    cameraY: number = 0
    zoom: number = 1
    panSpeed: number = 10
    isPanning: boolean = false
    panStart: { x: number, y: number } = { x: 0, y: 0 }

    // Level Data
    currentLevel: EditorLevelData | null = null

    // Editor State
    currentTool: EditorTool = 'select'
    selectedObject: EditorObject | null = null
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
    saveButton: any
    testButton: any
    exportButton: any
    newButton: any
    loadButton: any
    deleteObjectButton: any
    levelSettingsButton: any

    // Panels
    propertyPanel!: PropertyPanel
    levelSettingsPanel!: LevelSettingsPanel
    levelListPanel!: LevelListPanel
    exportPanel!: ExportPanel
    savedLevels: EditorLevelData[] = []

    // Messages
    messageText: string = ''
    messageTime: number = 0
    messageDuration: number = 2000

    async preload() {
        this.gameRef.drawLoading('Level Editor', 0.5)
    }

    initialize() {
        this.gameRef.cameraZoom = 1
        this.cameraX = 0
        this.cameraY = 0

        // Load current level or create new
        const currentId = LevelEditorStorage.getCurrentLevelId()
        if (currentId) {
            this.currentLevel = LevelEditorStorage.getLevel(currentId)
        }
        if (!this.currentLevel) {
            this.currentLevel = LevelEditorStorage.createNewLevel()
            LevelEditorStorage.saveLevel(this.currentLevel)
            LevelEditorStorage.setCurrentLevelId(this.currentLevel.id)
        }

        this.savedLevels = LevelEditorStorage.getAllLevels()

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
            getSelectedObject: () => this.selectedObject
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
            onLoadLevel: (level: EditorLevelData) => {
                this.saveCurrentLevel()
                this.currentLevel = level
                LevelEditorStorage.setCurrentLevelId(level.id)
                this.selectedObject = null
                this.propertyPanel.hide()
            }
        })

        // Export Panel
        this.exportPanel = new ExportPanel(this.gameRef, {
            getCurrentLevel: () => this.currentLevel
        })
    }

    centerOnPlayerStart() {
        if (!this.currentLevel) return
        const ps = this.currentLevel.playerStart
        this.cameraX = this.gameRef.gameWidth / 2 - ps.x * this.zoom
        this.cameraY = this.gameRef.gameHeight / 2 - ps.y * this.zoom
    }

    setupUI() {
        // Back button
        this.backButton = this.createButton('Back', 10, 10, 60, 35)
        this.backButton.clickFunction = () => {
            this.saveCurrentLevel()
            this.gameRef.loadLevel('start-screen')
        }

        // Tool buttons
        TOOL_ORDER.forEach((tool, index) => {
            const btn = this.createButton(TOOL_LABELS[tool], 10 + index * 55, 55, 50, 30)
            btn.fillColor = this.currentTool === tool ? TOOL_BUTTON_HOVER : TOOL_BUTTON_FILL
            btn.clickFunction = () => {
                // Cancel polygon drawing if switching away
                if (this.isDrawingPolygon && tool !== 'polygon') {
                    this.cancelPolygonDrawing()
                }
                this.currentTool = tool
                this.selectedObject = null
                this.propertyPanel.hide()
                // Reset any drag/handle state
                this.isDragging = false
                this.activeHandle = null
                this.dragOffset = { x: 0, y: 0 }
                this.updateToolButtonColors()
            }
            this.toolButtons.set(tool, btn)
        })

        // Action buttons (top right)
        const rightX = this.gameRef.gameWidth - 75

        this.saveButton = this.createButton('Save', rightX, 10, 65, 35)
        this.saveButton.clickFunction = () => {
            this.saveCurrentLevel()
            this.showMessage('Level Saved!')
        }

        this.testButton = this.createButton('Test', rightX - 70, 10, 65, 35)
        this.testButton.clickFunction = () => this.testLevel()

        this.exportButton = this.createButton('Export', rightX - 140, 10, 65, 35)
        this.exportButton.clickFunction = () => {
            this.exportPanel.toggle()
            this.levelListPanel.hide()
            this.levelSettingsPanel.hide()
        }

        this.newButton = this.createButton('New', rightX - 210, 10, 65, 35)
        this.newButton.clickFunction = () => {
            this.saveCurrentLevel()
            this.currentLevel = LevelEditorStorage.createNewLevel()
            LevelEditorStorage.saveLevel(this.currentLevel)
            LevelEditorStorage.setCurrentLevelId(this.currentLevel.id)
            this.savedLevels = LevelEditorStorage.getAllLevels()
            this.selectedObject = null
            this.showMessage('New Level Created!')
        }

        this.loadButton = this.createButton('Load', rightX - 280, 10, 65, 35)
        this.loadButton.clickFunction = () => {
            this.savedLevels = LevelEditorStorage.getAllLevels()
            this.levelListPanel.toggle()
            this.exportPanel.hide()
            this.levelSettingsPanel.hide()
        }

        this.levelSettingsButton = this.createButton('Settings', rightX - 360, 10, 75, 35)
        this.levelSettingsButton.clickFunction = () => {
            this.levelSettingsPanel.toggle()
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
    }

    showMessage(text: string) {
        this.messageText = text
        this.messageTime = this.gameRef.lastUpdate
    }

    saveCurrentLevel() {
        if (this.currentLevel) {
            LevelEditorStorage.saveLevel(this.currentLevel)
        }
    }

    testLevel() {
        if (this.currentLevel) {
            this.saveCurrentLevel()
            this.gameRef.basedObjectRefs.testLevelData = this.currentLevel
            this.gameRef.loadLevel('test-level')
        }
    }

    deleteSelectedObject() {
        if (!this.selectedObject || !this.currentLevel) return

        const obj = this.selectedObject
        switch (obj.type) {
            case 'wall':
                this.currentLevel.walls = this.currentLevel.walls.filter(w => w.id !== obj.id)
                break
            case 'polygon':
                this.currentLevel.polygons = this.currentLevel.polygons.filter(p => p.id !== obj.id)
                break
            case 'pushBox':
                this.currentLevel.pushBoxes = this.currentLevel.pushBoxes.filter(b => b.id !== obj.id)
                break
            case 'movingPlatform':
                this.currentLevel.movingPlatforms = this.currentLevel.movingPlatforms.filter(p => p.id !== obj.id)
                break
            case 'exitDoor':
                this.currentLevel.exitDoors = this.currentLevel.exitDoors.filter(d => d.id !== obj.id)
                break
            case 'hazardBlock':
                this.currentLevel.hazardBlocks = this.currentLevel.hazardBlocks.filter(h => h.id !== obj.id)
                break
            case 'levelText':
                this.currentLevel.levelTexts = this.currentLevel.levelTexts.filter(t => t.id !== obj.id)
                break
        }

        this.selectedObject = null
        this.propertyPanel.hide()
        this.saveCurrentLevel()
    }

    deleteCurrentLevel() {
        if (!this.currentLevel) return
        LevelEditorStorage.deleteLevel(this.currentLevel.id)
        this.savedLevels = LevelEditorStorage.getAllLevels()
        this.currentLevel = this.savedLevels[0] || LevelEditorStorage.createNewLevel()
        LevelEditorStorage.setCurrentLevelId(this.currentLevel.id)
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
            this.currentLevel.nextLevel = value || 'start-screen'
        }

        this.saveCurrentLevel()
        this.savedLevels = LevelEditorStorage.getAllLevels()
    }

    handleInput() {
        if (EditorInputManager.isInputFocused()) return

        const keys = this.gameRef.pressedKeys

        // Pan with arrow keys or WASD
        if (keys['ArrowLeft'] || keys['KeyA']) this.cameraX += this.panSpeed
        if (keys['ArrowRight'] || keys['KeyD']) this.cameraX -= this.panSpeed
        if (keys['ArrowUp'] || keys['KeyW']) this.cameraY += this.panSpeed
        if (keys['ArrowDown'] || keys['KeyS']) this.cameraY -= this.panSpeed

        // Zoom with +/-
        if (keys['Equal'] || keys['NumpadAdd']) {
            this.zoom = Math.min(2, this.zoom + 0.02)
        }
        if (keys['Minus'] || keys['NumpadSubtract']) {
            this.zoom = Math.max(0.25, this.zoom - 0.02)
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
                this.levelSettingsPanel.hide()
            }
        }
    }

    handleMouse() {
        const mouse = this.gameRef.mouseInfo
        const worldPos = this.screenToWorld(mouse.x, mouse.y)

        // Update placing preview
        if (this.currentTool !== 'select' && this.currentTool !== 'pan') {
            const defaults = DEFAULT_OBJECTS[this.currentTool] as any
            const snappedX = Math.round(worldPos.x / GRID_SIZE) * GRID_SIZE
            const snappedY = Math.round(worldPos.y / GRID_SIZE) * GRID_SIZE
            this.placingPreview = { x: snappedX, y: snappedY }
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
            } else if (this.currentTool === 'polygon') {
                this.handlePolygonClick(worldPos.x, worldPos.y)
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
            } else {
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

            if (this.selectedObject.type === 'movingPlatform') {
                const plat = this.selectedObject as any
                plat.minX += deltaX
                plat.maxX += deltaX
                plat.minY += deltaY
                plat.maxY += deltaY
            }
        }

        // Handle panning
        if (this.isPanning && mouse.mouseDown) {
            this.cameraX += mouse.x - this.panStart.x
            this.cameraY += mouse.y - this.panStart.y
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
        if (this.levelSettingsPanel.visible && this.levelSettingsPanel.isPointInside(x, y)) return true
        if (this.selectedObject && x < 90 && y > this.gameRef.gameHeight - 55) return true
        return false
    }

    getHandleAtPosition(x: number, y: number): string | null {
        if (!this.selectedObject) return null

        const handleRadius = this.handleSize / this.zoom

        // For polygons
        if (this.selectedObject.type === 'polygon') {
            const poly = this.selectedObject as EditorPolygon
            const angleRad = (poly.angle || 0) * Math.PI / 180
            const cosA = Math.cos(angleRad)
            const sinA = Math.sin(angleRad)

            const rotHandleX = poly.x
            const rotHandleY = poly.y - 60
            if (Math.abs(x - rotHandleX) < handleRadius && Math.abs(y - rotHandleY) < handleRadius) {
                return 'rotate'
            }

            for (let i = 0; i < poly.vertices.length; i++) {
                const v = poly.vertices[i]
                const rotX = v.x * cosA - v.y * sinA
                const rotY = v.x * sinA + v.y * cosA
                const worldVX = poly.x + rotX
                const worldVY = poly.y + rotY
                if (Math.abs(x - worldVX) < handleRadius && Math.abs(y - worldVY) < handleRadius) {
                    return `vertex-${i}`
                }
            }
        }

        // For level text rotation
        if (this.selectedObject.type === 'levelText') {
            const textObj = this.selectedObject as EditorText
            const angleRad = (textObj.angle || 0) * Math.PI / 180
            const rotHandleDistance = 60
            const rotHandleX = textObj.x - Math.sin(angleRad) * rotHandleDistance
            const rotHandleY = textObj.y - Math.cos(angleRad) * rotHandleDistance
            if (Math.abs(x - rotHandleX) < handleRadius && Math.abs(y - rotHandleY) < handleRadius) {
                return 'rotate'
            }
        }

        // For moving platforms
        if (this.selectedObject.type === 'movingPlatform') {
            const plat = this.selectedObject as EditorMovingPlatform
            if (Math.abs(x - plat.minX) < handleRadius && Math.abs(y - plat.minY) < handleRadius) {
                return 'minPoint'
            }
            if (Math.abs(x - plat.maxX) < handleRadius && Math.abs(y - plat.maxY) < handleRadius) {
                return 'maxPoint'
            }
        }

        // Resize handles for objects with width/height
        if ('width' in this.selectedObject && 'height' in this.selectedObject) {
            const obj = this.selectedObject as any
            const halfW = obj.width / 2
            const halfH = obj.height / 2

            if (Math.abs(x - (obj.x + halfW)) < handleRadius && Math.abs(y - (obj.y + halfH)) < handleRadius) return 'se'
            if (Math.abs(x - (obj.x - halfW)) < handleRadius && Math.abs(y - (obj.y + halfH)) < handleRadius) return 'sw'
            if (Math.abs(x - (obj.x + halfW)) < handleRadius && Math.abs(y - (obj.y - halfH)) < handleRadius) return 'ne'
            if (Math.abs(x - (obj.x - halfW)) < handleRadius && Math.abs(y - (obj.y - halfH)) < handleRadius) return 'nw'
            if (Math.abs(x - (obj.x + halfW)) < handleRadius && Math.abs(y - obj.y) < handleRadius) return 'e'
            if (Math.abs(x - (obj.x - halfW)) < handleRadius && Math.abs(y - obj.y) < handleRadius) return 'w'
            if (Math.abs(x - obj.x) < handleRadius && Math.abs(y - (obj.y - halfH)) < handleRadius) return 'n'
            if (Math.abs(x - obj.x) < handleRadius && Math.abs(y - (obj.y + halfH)) < handleRadius) return 's'
        }

        return null
    }

    handleHandleDrag(worldX: number, worldY: number) {
        if (!this.selectedObject || !this.activeHandle) return

        const snappedX = Math.round(worldX / GRID_SIZE) * GRID_SIZE
        const snappedY = Math.round(worldY / GRID_SIZE) * GRID_SIZE

        // Polygon vertex/rotation
        if (this.selectedObject.type === 'polygon') {
            const poly = this.selectedObject as EditorPolygon

            if (this.activeHandle === 'rotate') {
                const dx = worldX - poly.x
                const dy = worldY - poly.y
                const angle = Math.atan2(dy, dx) * 180 / Math.PI + 90
                poly.angle = Math.round(angle / 5) * 5
                return
            }

            if (this.activeHandle.startsWith('vertex-')) {
                const vertexIndex = parseInt(this.activeHandle.split('-')[1])
                if (vertexIndex >= 0 && vertexIndex < poly.vertices.length) {
                    const angleRad = (poly.angle || 0) * Math.PI / 180
                    const cosA = Math.cos(-angleRad)
                    const sinA = Math.sin(-angleRad)
                    const localX = snappedX - poly.x
                    const localY = snappedY - poly.y
                    poly.vertices[vertexIndex] = {
                        x: localX * cosA - localY * sinA,
                        y: localX * sinA + localY * cosA
                    }
                }
                return
            }
        }

        // Level text rotation
        if (this.selectedObject.type === 'levelText') {
            const textObj = this.selectedObject as EditorText

            if (this.activeHandle === 'rotate') {
                const dx = worldX - textObj.x
                const dy = worldY - textObj.y
                const angle = Math.atan2(dx, dy) * 180 / Math.PI
                textObj.angle = Math.round(-angle / 5) * 5
                return
            }
        }

        // Moving platform endpoints
        if (this.selectedObject.type === 'movingPlatform') {
            const plat = this.selectedObject as EditorMovingPlatform
            if (this.activeHandle === 'minPoint') {
                plat.minX = snappedX
                plat.minY = snappedY
                return
            }
            if (this.activeHandle === 'maxPoint') {
                plat.maxX = snappedX
                plat.maxY = snappedY
                return
            }
        }

        // Resize handles
        if ('width' in this.selectedObject && 'height' in this.selectedObject) {
            const obj = this.selectedObject as any
            const minSize = MIN_OBJECT_SIZE

            const currentLeft = obj.x - obj.width / 2
            const currentRight = obj.x + obj.width / 2
            const currentTop = obj.y - obj.height / 2
            const currentBottom = obj.y + obj.height / 2

            switch (this.activeHandle) {
                case 'e': {
                    const newRight = snappedX
                    const newWidth = Math.max(minSize, newRight - currentLeft)
                    obj.width = newWidth
                    obj.x = currentLeft + newWidth / 2
                    break
                }
                case 'w': {
                    const newLeft = snappedX
                    const newWidth = Math.max(minSize, currentRight - newLeft)
                    obj.width = newWidth
                    obj.x = currentRight - newWidth / 2
                    break
                }
                case 'n': {
                    const newTop = snappedY
                    const newHeight = Math.max(minSize, currentBottom - newTop)
                    obj.height = newHeight
                    obj.y = currentBottom - newHeight / 2
                    break
                }
                case 's': {
                    const newBottom = snappedY
                    const newHeight = Math.max(minSize, newBottom - currentTop)
                    obj.height = newHeight
                    obj.y = currentTop + newHeight / 2
                    break
                }
                case 'ne': {
                    const newRight = snappedX
                    const newTop = snappedY
                    const newWidth = Math.max(minSize, newRight - currentLeft)
                    const newHeight = Math.max(minSize, currentBottom - newTop)
                    obj.width = newWidth
                    obj.height = newHeight
                    obj.x = currentLeft + newWidth / 2
                    obj.y = currentBottom - newHeight / 2
                    break
                }
                case 'nw': {
                    const newLeft = snappedX
                    const newTop = snappedY
                    const newWidth = Math.max(minSize, currentRight - newLeft)
                    const newHeight = Math.max(minSize, currentBottom - newTop)
                    obj.width = newWidth
                    obj.height = newHeight
                    obj.x = currentRight - newWidth / 2
                    obj.y = currentBottom - newHeight / 2
                    break
                }
                case 'se': {
                    const newRight = snappedX
                    const newBottom = snappedY
                    const newWidth = Math.max(minSize, newRight - currentLeft)
                    const newHeight = Math.max(minSize, newBottom - currentTop)
                    obj.width = newWidth
                    obj.height = newHeight
                    obj.x = currentLeft + newWidth / 2
                    obj.y = currentTop + newHeight / 2
                    break
                }
                case 'sw': {
                    const newLeft = snappedX
                    const newBottom = snappedY
                    const newWidth = Math.max(minSize, currentRight - newLeft)
                    const newHeight = Math.max(minSize, newBottom - currentTop)
                    obj.width = newWidth
                    obj.height = newHeight
                    obj.x = currentRight - newWidth / 2
                    obj.y = currentTop + newHeight / 2
                    break
                }
            }
        }
    }

    screenToWorld(screenX: number, screenY: number): { x: number, y: number } {
        return {
            x: (screenX - this.cameraX) / this.zoom,
            y: (screenY - this.cameraY) / this.zoom
        }
    }

    worldToScreen(worldX: number, worldY: number): { x: number, y: number } {
        return {
            x: worldX * this.zoom + this.cameraX,
            y: worldY * this.zoom + this.cameraY
        }
    }

    getObjectAtPosition(x: number, y: number): EditorObject | null {
        if (!this.currentLevel) return null

        const ps = this.currentLevel.playerStart
        if (Math.abs(x - ps.x) < 25 && Math.abs(y - ps.y) < 25) {
            return { id: 'playerStart', type: 'playerStart', x: ps.x, y: ps.y }
        }

        for (const door of this.currentLevel.exitDoors) {
            if (this.isPointInRect(x, y, door)) return door
        }
        for (const plat of this.currentLevel.movingPlatforms) {
            if (this.isPointInRect(x, y, plat)) return plat
        }
        for (const box of this.currentLevel.pushBoxes) {
            if (this.isPointInRect(x, y, box)) return box
        }
        for (const wall of this.currentLevel.walls) {
            if (this.isPointInRect(x, y, wall)) return wall
        }
        for (const poly of (this.currentLevel.polygons || [])) {
            if (this.isPointInPolygon(x, y, poly)) return poly
        }
        for (const hazard of this.currentLevel.hazardBlocks) {
            if (this.isPointInRect(x, y, hazard)) return hazard
        }
        for (const text of (this.currentLevel.levelTexts || [])) {
            if (this.isPointInText(x, y, text)) return text
        }

        return null
    }

    isPointInRect(x: number, y: number, obj: { x: number, y: number, width: number, height: number }): boolean {
        const halfW = obj.width / 2
        const halfH = obj.height / 2
        return x >= obj.x - halfW && x <= obj.x + halfW && y >= obj.y - halfH && y <= obj.y + halfH
    }

    isPointInPolygon(x: number, y: number, poly: EditorPolygon): boolean {
        const angleRad = (poly.angle || 0) * Math.PI / 180
        const cosA = Math.cos(-angleRad)
        const sinA = Math.sin(-angleRad)
        const localX = (x - poly.x) * cosA - (y - poly.y) * sinA
        const localY = (x - poly.x) * sinA + (y - poly.y) * cosA

        const vertices = poly.vertices
        let inside = false

        for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
            const xi = vertices[i].x, yi = vertices[i].y
            const xj = vertices[j].x, yj = vertices[j].y
            if (((yi > localY) !== (yj > localY)) &&
                (localX < (xj - xi) * (localY - yi) / (yj - yi) + xi)) {
                inside = !inside
            }
        }
        return inside
    }

    isPointInText(x: number, y: number, text: EditorText): boolean {
        // Estimate text bounds (approximate width based on text length and font size)
        const estimatedWidth = text.text.length * text.fontSize * 0.6
        const estimatedHeight = text.fontSize * 1.2

        // Transform point to text's local coordinate system (accounting for rotation)
        const angleRad = (text.angle || 0) * Math.PI / 180
        const cosA = Math.cos(-angleRad)
        const sinA = Math.sin(-angleRad)
        const localX = (x - text.x) * cosA - (y - text.y) * sinA
        const localY = (x - text.x) * sinA + (y - text.y) * cosA

        // Check if point is within bounding box (centered on text position)
        const halfW = estimatedWidth / 2
        const halfH = estimatedHeight / 2
        return localX >= -halfW && localX <= halfW && localY >= -halfH && localY <= halfH
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

        const poly: EditorPolygon = {
            id: LevelEditorStorage.generateId(),
            type: 'polygon',
            x: centerX,
            y: centerY,
            vertices: localVertices,
            angle: 0,
            color: '#000'
        }

        this.currentLevel.polygons.push(poly)
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
        if (!this.currentLevel) return

        const id = LevelEditorStorage.generateId()

        switch (this.currentTool) {
            case 'wall':
                const wall: EditorWall = { id, type: 'wall', x, y, width: 100, height: 50, color: '#000' }
                this.currentLevel.walls.push(wall)
                this.selectedObject = wall
                break
            case 'pushBox':
                const box: EditorPushBox = { id, type: 'pushBox', x, y, width: 90, height: 90, color: 'red', sizeToMove: 40 }
                this.currentLevel.pushBoxes.push(box)
                this.selectedObject = box
                break
            case 'movingPlatform':
                const plat: EditorMovingPlatform = {
                    id, type: 'movingPlatform', x, y, width: 100, height: 50, color: 'purple',
                    xDirection: 1, yDirection: 0, xSpeed: 3, ySpeed: 0,
                    minX: x - 100, maxX: x + 100, minY: y, maxY: y
                }
                this.currentLevel.movingPlatforms.push(plat)
                this.selectedObject = plat
                break
            case 'exitDoor':
                const door: EditorExitDoor = { id, type: 'exitDoor', x, y, width: 100, height: 100, color: 'yellow', doorPath: 'start-screen' }
                this.currentLevel.exitDoors.push(door)
                this.selectedObject = door
                break
            case 'hazardBlock':
                const hazard: EditorHazardBlock = { id, type: 'hazardBlock', x, y, width: 100, height: 50 }
                this.currentLevel.hazardBlocks.push(hazard)
                this.selectedObject = hazard
                break
            case 'levelText':
                const textObj: EditorText = { id, type: 'levelText', x, y, text: 'Text', fontSize: 24, color: '#ffffff', angle: 0 }
                this.currentLevel.levelTexts.push(textObj)
                this.selectedObject = textObj
                break
            case 'playerStart':
                this.currentLevel.playerStart = { x, y }
                this.selectedObject = { id: 'playerStart', type: 'playerStart', x, y }
                break
        }

        this.propertyPanel.show()
        this.saveCurrentLevel()
    }

    update() {
        this.handleInput()
        this.handleMouse()

        // Update buttons
        this.backButton.update()
        this.saveButton.update()
        this.testButton.update()
        this.exportButton.update()
        this.newButton.update()
        this.loadButton.update()
        this.levelSettingsButton.update()

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
        this.newButton.x = rightX - 210
        this.loadButton.x = rightX - 280
        this.levelSettingsButton.x = rightX - 360
        this.deleteObjectButton.y = this.gameRef.gameHeight - 45

        // Update panel positions
        this.propertyPanel.onResize()
        this.levelSettingsPanel.onResize()
        this.levelListPanel.onResize()
        this.exportPanel.onResize()
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

        const levelScreen = this.worldToScreen(0, 0)

        // Level background
        drawBox({
            c: ctx, x: levelScreen.x, y: levelScreen.y,
            width: this.currentLevel.levelWidth * this.zoom,
            height: this.currentLevel.levelHeight * this.zoom,
            fillColor: '#444'
        })

        // Grid
        for (let x = 0; x <= this.currentLevel.levelWidth; x += GRID_SIZE) {
            const screenX = levelScreen.x + x * this.zoom
            drawLine({ c: ctx, x: screenX, y: levelScreen.y, toX: screenX, toY: levelScreen.y + this.currentLevel.levelHeight * this.zoom, strokeColor: GRID_COLOR, strokeWidth: 1 })
        }
        for (let y = 0; y <= this.currentLevel.levelHeight; y += GRID_SIZE) {
            const screenY = levelScreen.y + y * this.zoom
            drawLine({ c: ctx, x: levelScreen.x, y: screenY, toX: levelScreen.x + this.currentLevel.levelWidth * this.zoom, toY: screenY, strokeColor: GRID_COLOR, strokeWidth: 1 })
        }

        // Draw objects
        this.currentLevel.walls.forEach(wall => this.drawEditorRect(wall, wall.color, this.selectedObject?.id === wall.id))
        this.currentLevel.polygons.forEach(poly => this.drawEditorPolygon(poly, this.selectedObject?.id === poly.id))

        // Level Texts
        this.currentLevel.levelTexts.forEach(text => this.drawEditorText(text, this.selectedObject?.id === text.id));

        // Push boxes
        this.currentLevel.pushBoxes.forEach(box => this.drawEditorRect(box, '#d4c9b2', this.selectedObject?.id === box.id))

        // Moving platforms (draw range, platform, then handles)
        this.currentLevel.movingPlatforms.forEach(plat => {
            const isSelected = this.selectedObject?.id === plat.id
            this.drawMovementRangeLine(plat, isSelected)
            this.drawEditorRect(plat, plat.color, isSelected)
        })
        this.currentLevel.movingPlatforms.forEach(plat => this.drawMovementRangeHandles(plat, this.selectedObject?.id === plat.id))

        // Exit doors
        this.currentLevel.exitDoors.forEach(door => {
            this.drawEditorRect(door, '#333', this.selectedObject?.id === door.id)
            const pos = this.worldToScreen(door.x, door.y)
            drawText({ c: ctx, x: pos.x, y: pos.y + 5, align: 'center', fillColor: '#ff0', fontSize: 12 * this.zoom, fontFamily: 'sans-serif', weight: 'bold', style: '', text: 'EXIT' })
        })

        // Hazards
        this.currentLevel.hazardBlocks.forEach(hazard => this.drawEditorRect(hazard, '#f00', this.selectedObject?.id === hazard.id));


        // Player start
        const ps = this.currentLevel.playerStart
        const psScreen = this.worldToScreen(ps.x, ps.y)
        const isSelected = this.selectedObject?.type === 'playerStart'
        drawCircle({ c: ctx, x: psScreen.x, y: psScreen.y, radius: 25 * this.zoom, fillColor: '#ff9900', strokeColor: isSelected ? '#fff' : '#ff0', strokeWidth: isSelected ? 3 : 2 })
        drawText({ c: ctx, x: psScreen.x, y: psScreen.y + 5, align: 'center', fillColor: '#fff', fontSize: 12 * this.zoom, fontFamily: 'sans-serif', weight: 'bold', style: '', text: 'START' })

        // Placement preview
        if (this.placingPreview && this.currentTool !== 'select' && this.currentTool !== 'pan' && this.currentTool !== 'polygon') {
            const previewScreen = this.worldToScreen(this.placingPreview.x, this.placingPreview.y)
            ctx.globalAlpha = 0.5

            if (this.currentTool === 'playerStart') {
                drawCircle({ c: ctx, x: previewScreen.x, y: previewScreen.y, radius: 25 * this.zoom, fillColor: '#ff9900' })
            } else {
                const defaults = DEFAULT_OBJECTS[this.currentTool] as any
                const w = (defaults?.width || 100) * this.zoom
                const h = (defaults?.height || 50) * this.zoom
                drawBox({ c: ctx, x: previewScreen.x - w / 2, y: previewScreen.y - h / 2, width: w, height: h, fillColor: TOOL_COLORS[this.currentTool] })
            }

            ctx.globalAlpha = 1
        }

        // Polygon in progress
        if (this.isDrawingPolygon && this.polygonVertices.length > 0) {
            this.drawPolygonInProgress()
        }
    }

    drawEditorRect(obj: { x: number, y: number, width: number, height: number }, color: string, selected: boolean) {
        const ctx = this.gameRef.ctx
        const pos = this.worldToScreen(obj.x, obj.y)
        const w = obj.width * this.zoom
        const h = obj.height * this.zoom

        drawBox({ c: ctx, x: pos.x - w / 2, y: pos.y - h / 2, width: w, height: h, fillColor: color, strokeColor: selected ? '#fff' : '#666', strokeWidth: selected ? 3 : 1 })

        if (selected) this.drawResizeHandles(obj)
    }

    drawResizeHandles(obj: { x: number, y: number, width: number, height: number }) {
        const ctx = this.gameRef.ctx
        const pos = this.worldToScreen(obj.x, obj.y)
        const halfW = (obj.width / 2) * this.zoom
        const halfH = (obj.height / 2) * this.zoom
        const size = this.handleSize

        const corners = [
            { x: pos.x - halfW, y: pos.y - halfH },
            { x: pos.x + halfW, y: pos.y - halfH },
            { x: pos.x - halfW, y: pos.y + halfH },
            { x: pos.x + halfW, y: pos.y + halfH },
        ]
        const edges = [
            { x: pos.x, y: pos.y - halfH },
            { x: pos.x, y: pos.y + halfH },
            { x: pos.x - halfW, y: pos.y },
            { x: pos.x + halfW, y: pos.y },
        ]

        ;[...corners, ...edges].forEach(p => {
            drawBox({ c: ctx, x: p.x - size / 2, y: p.y - size / 2, width: size, height: size, fillColor: HANDLE_COLOR, strokeColor: HANDLE_BORDER, strokeWidth: 1 })
        })
    }

    drawEditorPolygon(poly: EditorPolygon, selected: boolean) {
        const ctx = this.gameRef.ctx
        const pos = this.worldToScreen(poly.x, poly.y)
        const scaledVertices = poly.vertices.map(v => ({ x: v.x * this.zoom, y: v.y * this.zoom }))

        rotateDraw({ c: ctx, x: pos.x, y: pos.y, a: poly.angle || 0 }, () => {
            drawPolygon({ c: ctx, vertices: scaledVertices, fillColor: poly.color || '#222', strokeColor: selected ? '#fff' : '#666', strokeWidth: selected ? 3 : 1 })
        })

        if (selected) this.drawPolygonHandles(poly)
    }

    drawEditorText(textObj: EditorText, selected: boolean) {
        const ctx = this.gameRef.ctx
        const pos = this.worldToScreen(textObj.x, textObj.y)
        const fontSize = textObj.fontSize * this.zoom

        // Draw the text with rotation
        rotateDraw({ c: ctx, x: pos.x, y: pos.y, a: textObj.angle || 0 }, () => {
            drawText({
                c: ctx,
                x: 0,
                // y: fontSize * 0.35,
                y: 0,
                align: 'center',
                fillColor: textObj.color || '#ffffff',
                fontSize: fontSize,
                fontFamily: 'sans-serif',
                weight: 'bold',
                style: '',
                text: textObj.text || 'Text'
            })
        })

        // Draw selection outline and handles
        if (selected) {
            this.drawTextHandles(textObj)
        }
    }

    drawTextHandles(textObj: EditorText) {
        const ctx = this.gameRef.ctx
        const pos = this.worldToScreen(textObj.x, textObj.y)
        const size = this.handleSize

        // Draw bounding box outline (rotated)
        const estimatedWidth = textObj.text.length * textObj.fontSize * 0.6 * this.zoom
        const estimatedHeight = textObj.fontSize * 1.2 * this.zoom

        rotateDraw({ c: ctx, x: pos.x, y: pos.y, a: textObj.angle || 0 }, () => {
            ctx.strokeStyle = '#fff'
            ctx.lineWidth = 2
            ctx.setLineDash([5, 5])
            ctx.strokeRect(-estimatedWidth / 2, -estimatedHeight / 2, estimatedWidth, estimatedHeight)
            ctx.setLineDash([])
        })

        // Rotation handle (above the text)
        const angleRad = (textObj.angle || 0) * Math.PI / 180
        const rotHandleDistance = 60 * this.zoom
        const rotHandleX = pos.x - Math.sin(angleRad) * rotHandleDistance
        const rotHandleY = pos.y - Math.cos(angleRad) * rotHandleDistance

        drawLine({ c: ctx, x: pos.x, y: pos.y, toX: rotHandleX, toY: rotHandleY, strokeColor: '#88f', strokeWidth: 2 })
        drawCircle({ c: ctx, x: rotHandleX, y: rotHandleY, radius: size, fillColor: '#88f', strokeColor: HANDLE_BORDER, strokeWidth: 1 })
        drawText({ c: ctx, x: rotHandleX + 15, y: rotHandleY + 4, align: 'left', fillColor: '#88f', fontSize: 10, fontFamily: 'sans-serif', weight: 'bold', style: '', text: 'ROT' })
    }

    drawPolygonHandles(poly: EditorPolygon) {
        const ctx = this.gameRef.ctx
        const pos = this.worldToScreen(poly.x, poly.y)
        const angleRad = (poly.angle || 0) * Math.PI / 180
        const cosA = Math.cos(angleRad)
        const sinA = Math.sin(angleRad)
        const size = this.handleSize

        poly.vertices.forEach(v => {
            const rotX = v.x * cosA - v.y * sinA
            const rotY = v.x * sinA + v.y * cosA
            const screenPos = this.worldToScreen(poly.x + rotX, poly.y + rotY)
            drawBox({ c: ctx, x: screenPos.x - size / 2, y: screenPos.y - size / 2, width: size, height: size, fillColor: HANDLE_COLOR, strokeColor: HANDLE_BORDER, strokeWidth: 1 })
        })

        // Rotation handle
        const rotHandleY = pos.y - 60 * this.zoom
        drawLine({ c: ctx, x: pos.x, y: pos.y, toX: pos.x, toY: rotHandleY, strokeColor: '#88f', strokeWidth: 2 })
        drawCircle({ c: ctx, x: pos.x, y: rotHandleY, radius: size, fillColor: '#88f', strokeColor: HANDLE_BORDER, strokeWidth: 1 })
        drawText({ c: ctx, x: pos.x + 15, y: rotHandleY + 4, align: 'left', fillColor: '#88f', fontSize: 10, fontFamily: 'sans-serif', weight: 'bold', style: '', text: 'ROT' })
    }

    drawPolygonInProgress() {
        const ctx = this.gameRef.ctx
        const mouse = this.gameRef.mouseInfo
        const mouseWorld = this.screenToWorld(mouse.x, mouse.y)
        const snappedMouse = { x: Math.round(mouseWorld.x / GRID_SIZE) * GRID_SIZE, y: Math.round(mouseWorld.y / GRID_SIZE) * GRID_SIZE }
        const mouseScreen = this.worldToScreen(snappedMouse.x, snappedMouse.y)

        ctx.globalAlpha = 0.7

        for (let i = 0; i < this.polygonVertices.length - 1; i++) {
            const fromScreen = this.worldToScreen(this.polygonVertices[i].x, this.polygonVertices[i].y)
            const toScreen = this.worldToScreen(this.polygonVertices[i + 1].x, this.polygonVertices[i + 1].y)
            drawLine({ c: ctx, x: fromScreen.x, y: fromScreen.y, toX: toScreen.x, toY: toScreen.y, strokeColor: '#81B622', strokeWidth: 2 })
        }

        if (this.polygonVertices.length > 0) {
            const lastScreen = this.worldToScreen(this.polygonVertices[this.polygonVertices.length - 1].x, this.polygonVertices[this.polygonVertices.length - 1].y)
            drawLine({ c: ctx, x: lastScreen.x, y: lastScreen.y, toX: mouseScreen.x, toY: mouseScreen.y, strokeColor: '#81B622', strokeWidth: 2 })
        }

        this.polygonVertices.forEach((v, i) => {
            const screenPos = this.worldToScreen(v.x, v.y)
            drawCircle({ c: ctx, x: screenPos.x, y: screenPos.y, radius: 6, fillColor: i === 0 ? '#ff0' : '#81B622', strokeColor: '#fff', strokeWidth: 2 })
        })

        drawCircle({ c: ctx, x: mouseScreen.x, y: mouseScreen.y, radius: 6, fillColor: '#81B622', strokeColor: '#fff', strokeWidth: 2 })

        ctx.globalAlpha = 1

        const vertCount = this.polygonVertices.length
        const instructionText = vertCount < 3 ? `Click to add points (${vertCount}/3 min)` : `Click to add, double-click or Enter to finish, Esc to cancel`
        drawText({ c: ctx, x: this.gameRef.gameWidth / 2, y: this.gameRef.gameHeight - 40, align: 'center', fillColor: '#81B622', fontSize: 14, fontFamily: 'sans-serif', weight: 'bold', style: '', text: instructionText })
    }

    drawMovementRangeLine(plat: EditorMovingPlatform, selected: boolean = false) {
        const ctx = this.gameRef.ctx
        ctx.globalAlpha = selected ? 1 : 0.3
        ctx.strokeStyle = selected ? 'rgba(255, 255, 0, 0.7)' : 'rgba(255, 255, 0, 0.5)'
        ctx.lineWidth = selected ? 2 : 1
        ctx.setLineDash([5, 5])

        const minPos = this.worldToScreen(plat.minX, plat.minY)
        const maxPos = this.worldToScreen(plat.maxX, plat.maxY)

        ctx.beginPath()
        ctx.moveTo(minPos.x, minPos.y)
        ctx.lineTo(maxPos.x, maxPos.y)
        ctx.stroke()

        ctx.setLineDash([])
        ctx.globalAlpha = 1
    }

    drawMovementRangeHandles(plat: EditorMovingPlatform, selected: boolean = false) {
        const ctx = this.gameRef.ctx
        ctx.globalAlpha = selected ? 1 : 0.3

        const minPos = this.worldToScreen(plat.minX, plat.minY)
        const maxPos = this.worldToScreen(plat.maxX, plat.maxY)
        const handleSize = selected ? this.handleSize + 4 : 6

        drawCircle({ c: ctx, x: minPos.x, y: minPos.y, radius: handleSize / 2, fillColor: '#00ff00', strokeColor: selected ? '#fff' : undefined, strokeWidth: selected ? 2 : undefined })
        drawCircle({ c: ctx, x: maxPos.x, y: maxPos.y, radius: handleSize / 2, fillColor: '#ff4444', strokeColor: selected ? '#fff' : undefined, strokeWidth: selected ? 2 : undefined })

        if (selected) {
            ctx.globalAlpha = 1
            drawText({ c: ctx, x: minPos.x, y: minPos.y - handleSize, align: 'center', fillColor: '#0f0', fontSize: 10, fontFamily: 'sans-serif', weight: 'bold', style: '', text: 'MIN' })
            drawText({ c: ctx, x: maxPos.x, y: maxPos.y - handleSize, align: 'center', fillColor: '#f44', fontSize: 10, fontFamily: 'sans-serif', weight: 'bold', style: '', text: 'MAX' })
        }

        ctx.globalAlpha = 1
    }

    drawUI() {
        const ctx = this.gameRef.ctx

        // Top bar
        drawBox({ c: ctx, x: 0, y: 0, width: this.gameRef.gameWidth, height: 100, fillColor: 'rgba(0, 0, 0, 0.8)' })

        if (this.currentLevel) {
            drawText({ c: ctx, x: this.gameRef.gameWidth / 2, y: 30, align: 'center', fillColor: '#fff', fontSize: 18, fontFamily: 'sans-serif', weight: 'bold', style: '', text: this.currentLevel.name })
            drawText({ c: ctx, x: this.gameRef.gameWidth / 2, y: 50, align: 'center', fillColor: '#888', fontSize: 12, fontFamily: 'sans-serif', weight: 'normal', style: '', text: `${this.currentLevel.levelWidth}x${this.currentLevel.levelHeight} | Zoom: ${Math.round(this.zoom * 100)}%` })
        }

        // Buttons
        this.backButton.draw()
        this.saveButton.draw()
        this.testButton.draw()
        this.exportButton.draw()
        this.newButton.draw()
        this.loadButton.draw()
        this.levelSettingsButton.draw()
        this.toolButtons.forEach(btn => btn.draw())

        drawText({ c: ctx, x: 10, y: 95, align: 'left', fillColor: '#888', fontSize: 11, fontFamily: 'sans-serif', weight: 'normal', style: '', text: `Tool: ${this.currentTool} | Pan: Arrow keys/WASD | Zoom: +/-` })

        // Panels
        this.propertyPanel.draw()
        if (this.selectedObject) this.deleteObjectButton.draw()
        this.levelListPanel.draw()
        this.exportPanel.draw()
        this.levelSettingsPanel.draw()
    }

    tearDown() {
        this.propertyPanel.tearDown()
        this.levelSettingsPanel.tearDown()
        this.levelListPanel.tearDown()
        this.exportPanel.tearDown()
        this.saveCurrentLevel()
    }
}
