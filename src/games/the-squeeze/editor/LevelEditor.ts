import { BasedButton } from "../../../engine/BasedButton"
import { BasedLevel } from "../../../engine/BasedLevel"
import { drawBox, drawCircle, drawText, rotateDraw } from "../../../engine/libs/drawHelpers"
import { EditorLevelData, EditorObject, EditorTool, DEFAULT_OBJECTS, OBJECT_PROPERTIES, EditorWall, EditorPushBox, EditorMovingPlatform, EditorExitDoor } from "./LevelEditorTypes"
import { LevelEditorStorage } from "./LevelEditorStorage"

const BG_COLOR = '#1a1a1a'
const GRID_COLOR = '#2a2a2a'
const GRID_SIZE = 25

const TOOL_COLORS: Record<EditorTool, string> = {
    select: '#fff',
    wall: '#222',
    pushBox: '#d4c9b2',
    movingPlatform: '#222',
    exitDoor: '#000',
    playerStart: '#ff0',
    pan: '#888',
}

const FILL_COLOR = '#81B622'
const HOVER_COLOR = '#ECF87F'
const TEXT_COLOR = '#FFFFFF'
const TEXT_HOVER_COLOR = '#000000'
const TOOL_BUTTON_FILL = '#333'
const TOOL_BUTTON_HOVER = '#555'

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
    activeHandle: string | null = null  // 'n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw', 'minX', 'maxX', 'minY', 'maxY'
    handleSize: number = 10
    
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
    showPropertyPanel: boolean = false
    showLevelList: boolean = false
    showExportPanel: boolean = false
    showLevelSettings: boolean = false
    savedLevels: EditorLevelData[] = []
    
    // Property editing
    editingProperty: string | null = null
    propertyInputValue: string = ''
    
    // Level settings editing
    editingLevelSetting: string | null = null
    levelSettingInputValue: string = ''

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
        
        this.setupUI()
        this.onResize()
    }

    setupUI() {
        // Back button
        this.backButton = this.createButton('Back', 10, 10, 60, 35)
        this.backButton.clickFunction = () => {
            this.saveCurrentLevel()
            this.gameRef.loadLevel('start-screen')
        }

        // Tool buttons
        const tools: EditorTool[] = ['select', 'pan', 'wall', 'pushBox', 'movingPlatform', 'exitDoor', 'playerStart']
        const toolLabels: Record<EditorTool, string> = {
            select: 'Select',
            pan: 'Pan',
            wall: 'Wall',
            pushBox: 'Box',
            movingPlatform: 'Platform',
            exitDoor: 'Exit',
            playerStart: 'Start',
        }
        
        tools.forEach((tool, index) => {
            const btn = this.createButton(toolLabels[tool], 10 + index * 75, 55, 70, 30)
            btn.fillColor = this.currentTool === tool ? TOOL_BUTTON_HOVER : TOOL_BUTTON_FILL
            btn.clickFunction = () => {
                this.currentTool = tool
                this.selectedObject = null
                this.showPropertyPanel = false
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
        this.testButton.clickFunction = () => {
            this.testLevel()
        }

        this.exportButton = this.createButton('Export', rightX - 140, 10, 65, 35)
        this.exportButton.clickFunction = () => {
            this.showExportPanel = !this.showExportPanel
            this.showLevelList = false
            this.showLevelSettings = false
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
            this.showLevelList = !this.showLevelList
            this.showExportPanel = false
            this.showLevelSettings = false
        }

        this.levelSettingsButton = this.createButton('Settings', rightX - 360, 10, 75, 35)
        this.levelSettingsButton.clickFunction = () => {
            this.showLevelSettings = !this.showLevelSettings
            this.showLevelList = false
            this.showExportPanel = false
        }

        this.deleteObjectButton = this.createButton('Delete', 10, this.gameRef.gameHeight - 45, 70, 35)
        this.deleteObjectButton.fillColor = '#a33'
        this.deleteObjectButton.clickFunction = () => {
            this.deleteSelectedObject()
        }
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
            // Store level data for test level to use
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
            case 'pushBox':
                this.currentLevel.pushBoxes = this.currentLevel.pushBoxes.filter(b => b.id !== obj.id)
                break
            case 'movingPlatform':
                this.currentLevel.movingPlatforms = this.currentLevel.movingPlatforms.filter(p => p.id !== obj.id)
                break
            case 'exitDoor':
                this.currentLevel.exitDoors = this.currentLevel.exitDoors.filter(d => d.id !== obj.id)
                break
        }
        
        this.selectedObject = null
        this.showPropertyPanel = false
        this.saveCurrentLevel()
    }

    handleInput() {
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
            if (this.selectedObject && !this.editingProperty && !this.editingLevelSetting) {
                this.deleteSelectedObject()
            }
        }
        
        // Escape to deselect
        if (keys['Escape']) {
            this.selectedObject = null
            this.showPropertyPanel = false
            this.showLevelList = false
            this.showExportPanel = false
            this.showLevelSettings = false
            this.editingProperty = null
            this.editingLevelSetting = null
        }
    }

    handleMouse() {
        const mouse = this.gameRef.mouseInfo
        const worldPos = this.screenToWorld(mouse.x, mouse.y)
        
        // Update placing preview
        if (this.currentTool !== 'select' && this.currentTool !== 'pan') {
            this.placingPreview = { x: Math.round(worldPos.x / GRID_SIZE) * GRID_SIZE, y: Math.round(worldPos.y / GRID_SIZE) * GRID_SIZE }
        } else {
            this.placingPreview = null
        }

        // Handle mouse down
        if (mouse.mouseDown && !this.isDragging && !this.isPanning && !this.activeHandle) {
            // Check if clicking on UI areas
            if (mouse.y < 100 || this.isClickOnPanel(mouse.x, mouse.y)) {
                return
            }

            // Check if clicking on a handle first (only in select mode with selected object)
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
                // Try to select an object
                const clicked = this.getObjectAtPosition(worldPos.x, worldPos.y)
                if (clicked) {
                    this.selectedObject = clicked
                    this.showPropertyPanel = true
                    this.isDragging = true
                    this.dragOffset = {
                        x: worldPos.x - clicked.x,
                        y: worldPos.y - clicked.y
                    }
                } else {
                    this.selectedObject = null
                    this.showPropertyPanel = false
                }
            } else {
                // Place new object
                this.placeObject(worldPos.x, worldPos.y)
                // Set isDragging to prevent placing multiple objects while mouse is held
                this.isDragging = true
            }
        }

        // Handle active handle dragging
        if (this.activeHandle && this.selectedObject && mouse.mouseDown) {
            this.handleHandleDrag(worldPos.x, worldPos.y)
        }

        // Handle dragging
        if (this.isDragging && this.selectedObject && mouse.mouseDown && !this.activeHandle) {
            const snappedX = Math.round((worldPos.x - this.dragOffset.x) / GRID_SIZE) * GRID_SIZE
            const snappedY = Math.round((worldPos.y - this.dragOffset.y) / GRID_SIZE) * GRID_SIZE
            
            // Calculate delta for relative movement
            const deltaX = snappedX - this.selectedObject.x
            const deltaY = snappedY - this.selectedObject.y
            
            this.selectedObject.x = snappedX
            this.selectedObject.y = snappedY
            
            // Update playerStart if it's being moved
            if (this.selectedObject.type === 'playerStart' && this.currentLevel) {
                this.currentLevel.playerStart = { x: snappedX, y: snappedY }
            }
            
            // Update moving platform bounds relatively
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

    getHandleAtPosition(x: number, y: number): string | null {
        if (!this.selectedObject) return null
        
        const handleRadius = this.handleSize / this.zoom
        
        // For moving platforms, check the min/max endpoint handles first
        if (this.selectedObject.type === 'movingPlatform') {
            const plat = this.selectedObject as EditorMovingPlatform
            
            // Min point handle
            if (Math.abs(x - plat.minX) < handleRadius && Math.abs(y - plat.minY) < handleRadius) {
                return 'minPoint'
            }
            // Max point handle
            if (Math.abs(x - plat.maxX) < handleRadius && Math.abs(y - plat.maxY) < handleRadius) {
                return 'maxPoint'
            }
        }
        
        // Check resize handles for objects with width/height
        if ('width' in this.selectedObject && 'height' in this.selectedObject) {
            const obj = this.selectedObject as any
            const halfW = obj.width / 2
            const halfH = obj.height / 2
            
            // Corner handles
            if (Math.abs(x - (obj.x + halfW)) < handleRadius && Math.abs(y - (obj.y + halfH)) < handleRadius) return 'se'
            if (Math.abs(x - (obj.x - halfW)) < handleRadius && Math.abs(y - (obj.y + halfH)) < handleRadius) return 'sw'
            if (Math.abs(x - (obj.x + halfW)) < handleRadius && Math.abs(y - (obj.y - halfH)) < handleRadius) return 'ne'
            if (Math.abs(x - (obj.x - halfW)) < handleRadius && Math.abs(y - (obj.y - halfH)) < handleRadius) return 'nw'
            
            // Edge handles
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
        
        // Handle moving platform endpoint dragging
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
        
        // Handle resize for objects with width/height
        if ('width' in this.selectedObject && 'height' in this.selectedObject) {
            const obj = this.selectedObject as any
            const minSize = 20
            
            switch (this.activeHandle) {
                case 'e': {
                    const newWidth = Math.max(minSize, (snappedX - obj.x) * 2)
                    obj.width = newWidth
                    break
                }
                case 'w': {
                    const newWidth = Math.max(minSize, (obj.x - snappedX) * 2)
                    obj.width = newWidth
                    break
                }
                case 'n': {
                    const newHeight = Math.max(minSize, (obj.y - snappedY) * 2)
                    obj.height = newHeight
                    break
                }
                case 's': {
                    const newHeight = Math.max(minSize, (snappedY - obj.y) * 2)
                    obj.height = newHeight
                    break
                }
                case 'ne': {
                    const newWidth = Math.max(minSize, (snappedX - obj.x) * 2)
                    const newHeight = Math.max(minSize, (obj.y - snappedY) * 2)
                    obj.width = newWidth
                    obj.height = newHeight
                    break
                }
                case 'nw': {
                    const newWidth = Math.max(minSize, (obj.x - snappedX) * 2)
                    const newHeight = Math.max(minSize, (obj.y - snappedY) * 2)
                    obj.width = newWidth
                    obj.height = newHeight
                    break
                }
                case 'se': {
                    const newWidth = Math.max(minSize, (snappedX - obj.x) * 2)
                    const newHeight = Math.max(minSize, (snappedY - obj.y) * 2)
                    obj.width = newWidth
                    obj.height = newHeight
                    break
                }
                case 'sw': {
                    const newWidth = Math.max(minSize, (obj.x - snappedX) * 2)
                    const newHeight = Math.max(minSize, (snappedY - obj.y) * 2)
                    obj.width = newWidth
                    obj.height = newHeight
                    break
                }
            }
        }
    }

    isClickOnPanel(x: number, y: number): boolean {
        // Property panel on the right
        if (this.showPropertyPanel && x > this.gameRef.gameWidth - 220) {
            return true
        }
        // Level list panel
        if (this.showLevelList && x > this.gameRef.gameWidth - 320 && y > 50 && y < 400) {
            return true
        }
        // Export panel
        if (this.showExportPanel && x > 100 && x < this.gameRef.gameWidth - 100 && y > 100 && y < this.gameRef.gameHeight - 100) {
            return true
        }
        // Level settings panel
        if (this.showLevelSettings && x > this.gameRef.gameWidth - 320 && y > 50 && y < 300) {
            return true
        }
        // Delete button area
        if (this.selectedObject && x < 90 && y > this.gameRef.gameHeight - 55) {
            return true
        }
        return false
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

        // Check player start
        const ps = this.currentLevel.playerStart
        if (Math.abs(x - ps.x) < 25 && Math.abs(y - ps.y) < 25) {
            return { id: 'playerStart', type: 'playerStart', x: ps.x, y: ps.y }
        }

        // Check exit doors
        for (const door of this.currentLevel.exitDoors) {
            if (this.isPointInRect(x, y, door)) return door
        }

        // Check moving platforms
        for (const plat of this.currentLevel.movingPlatforms) {
            if (this.isPointInRect(x, y, plat)) return plat
        }

        // Check push boxes
        for (const box of this.currentLevel.pushBoxes) {
            if (this.isPointInRect(x, y, box)) return box
        }

        // Check walls
        for (const wall of this.currentLevel.walls) {
            if (this.isPointInRect(x, y, wall)) return wall
        }

        return null
    }

    isPointInRect(x: number, y: number, obj: { x: number, y: number, width: number, height: number }): boolean {
        const halfW = obj.width / 2
        const halfH = obj.height / 2
        return x >= obj.x - halfW && x <= obj.x + halfW && y >= obj.y - halfH && y <= obj.y + halfH
    }

    placeObject(x: number, y: number) {
        if (!this.currentLevel) return

        const snappedX = Math.round(x / GRID_SIZE) * GRID_SIZE
        const snappedY = Math.round(y / GRID_SIZE) * GRID_SIZE
        const id = LevelEditorStorage.generateId()

        switch (this.currentTool) {
            case 'wall':
                const wall: EditorWall = {
                    id,
                    type: 'wall',
                    x: snappedX,
                    y: snappedY,
                    width: 100,
                    height: 50,
                    color: '#000'
                }
                this.currentLevel.walls.push(wall)
                this.selectedObject = wall
                break

            case 'pushBox':
                const box: EditorPushBox = {
                    id,
                    type: 'pushBox',
                    x: snappedX,
                    y: snappedY,
                    width: 90,
                    height: 90,
                    color: 'red',
                    sizeToMove: 40
                }
                this.currentLevel.pushBoxes.push(box)
                this.selectedObject = box
                break

            case 'movingPlatform':
                const plat: EditorMovingPlatform = {
                    id,
                    type: 'movingPlatform',
                    x: snappedX,
                    y: snappedY,
                    width: 100,
                    height: 50,
                    color: 'purple',
                    xDirection: 1,
                    yDirection: 0,
                    xSpeed: 3,
                    ySpeed: 0,
                    minX: snappedX - 100,
                    maxX: snappedX + 100,
                    minY: snappedY,
                    maxY: snappedY
                }
                this.currentLevel.movingPlatforms.push(plat)
                this.selectedObject = plat
                break

            case 'exitDoor':
                const door: EditorExitDoor = {
                    id,
                    type: 'exitDoor',
                    x: snappedX,
                    y: snappedY,
                    width: 100,
                    height: 100,
                    color: 'yellow',
                    doorPath: 'start-screen'
                }
                this.currentLevel.exitDoors.push(door)
                this.selectedObject = door
                break

            case 'playerStart':
                this.currentLevel.playerStart = { x: snappedX, y: snappedY }
                this.selectedObject = { id: 'playerStart', type: 'playerStart', x: snappedX, y: snappedY }
                break
        }

        this.showPropertyPanel = true
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
        // Reposition buttons on resize
        const rightX = this.gameRef.gameWidth - 75
        this.saveButton.x = rightX
        this.testButton.x = rightX - 70
        this.exportButton.x = rightX - 140
        this.newButton.x = rightX - 210
        this.loadButton.x = rightX - 280
        this.levelSettingsButton.x = rightX - 360
        this.deleteObjectButton.y = this.gameRef.gameHeight - 45
    }

    draw() {
        const ctx = this.gameRef.ctx

        // Background
        ctx.fillStyle = BG_COLOR
        ctx.fillRect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)

        // Draw level area
        if (this.currentLevel) {
            this.drawLevel()
        }

        // Draw UI
        this.drawUI()
        
        // Draw message
        if (this.messageText && this.gameRef.lastUpdate - this.messageTime < this.messageDuration) {
            drawText({
                c: ctx,
                x: this.gameRef.gameWidth / 2,
                y: this.gameRef.gameHeight - 20,
                align: 'center',
                fillColor: '#0f0',
                fontSize: 16,
                fontFamily: 'sans-serif',
                weight: 'bold',
                style: '',
                text: this.messageText
            })
        }
    }

    drawLevel() {
        const ctx = this.gameRef.ctx

        if (!this.currentLevel) return

        // Level background
        const levelScreen = this.worldToScreen(0, 0)
        ctx.fillStyle = '#444'
        ctx.fillRect(
            levelScreen.x,
            levelScreen.y,
            this.currentLevel.levelWidth * this.zoom,
            this.currentLevel.levelHeight * this.zoom
        )

        // Grid
        ctx.strokeStyle = GRID_COLOR
        ctx.lineWidth = 1
        for (let x = 0; x <= this.currentLevel.levelWidth; x += GRID_SIZE) {
            const screenX = levelScreen.x + x * this.zoom
            ctx.beginPath()
            ctx.moveTo(screenX, levelScreen.y)
            ctx.lineTo(screenX, levelScreen.y + this.currentLevel.levelHeight * this.zoom)
            ctx.stroke()
        }
        for (let y = 0; y <= this.currentLevel.levelHeight; y += GRID_SIZE) {
            const screenY = levelScreen.y + y * this.zoom
            ctx.beginPath()
            ctx.moveTo(levelScreen.x, screenY)
            ctx.lineTo(levelScreen.x + this.currentLevel.levelWidth * this.zoom, screenY)
            ctx.stroke()
        }

        // Draw walls
        this.currentLevel.walls.forEach(wall => {
            this.drawEditorRect(wall, wall.color, this.selectedObject?.id === wall.id)
        })

        // Draw push boxes
        this.currentLevel.pushBoxes.forEach(box => {
            this.drawEditorRect(box, '#d4c9b2', this.selectedObject?.id === box.id)
        })

        // Draw moving platforms
        this.currentLevel.movingPlatforms.forEach(plat => {
            const isSelected = this.selectedObject?.id === plat.id
            // Always draw movement range, but with different opacity
            this.drawMovementRange(plat, isSelected)
            this.drawEditorRect(plat, plat.color, isSelected)
        })

        // Draw exit doors
        this.currentLevel.exitDoors.forEach(door => {
            this.drawEditorRect(door, '#333', this.selectedObject?.id === door.id)
            // Draw exit indicator
            const pos = this.worldToScreen(door.x, door.y)
            drawText({
                c: ctx,
                x: pos.x,
                y: pos.y + 5,
                align: 'center',
                fillColor: '#ff0',
                fontSize: 12 * this.zoom,
                fontFamily: 'sans-serif',
                weight: 'bold',
                style: '',
                text: 'EXIT'
            })
        })

        // Draw player start
        const ps = this.currentLevel.playerStart
        const psScreen = this.worldToScreen(ps.x, ps.y)
        const isSelected = this.selectedObject?.type === 'playerStart'
        drawCircle({
            c: ctx,
            x: psScreen.x,
            y: psScreen.y,
            radius: 25 * this.zoom,
            fillColor: '#ff9900',
            strokeColor: isSelected ? '#fff' : '#ff0',
            strokeWidth: isSelected ? 3 : 2
        })
        drawText({
            c: ctx,
            x: psScreen.x,
            y: psScreen.y + 5,
            align: 'center',
            fillColor: '#fff',
            fontSize: 12 * this.zoom,
            fontFamily: 'sans-serif',
            weight: 'bold',
            style: '',
            text: 'START'
        })

        // Draw placement preview
        if (this.placingPreview && this.currentTool !== 'select' && this.currentTool !== 'pan') {
            const previewScreen = this.worldToScreen(this.placingPreview.x, this.placingPreview.y)
            ctx.globalAlpha = 0.5
            
            if (this.currentTool === 'playerStart') {
                drawCircle({
                    c: ctx,
                    x: previewScreen.x,
                    y: previewScreen.y,
                    radius: 25 * this.zoom,
                    fillColor: '#ff9900'
                })
            } else {
                const defaults = DEFAULT_OBJECTS[this.currentTool] as any
                const w = (defaults?.width || 100) * this.zoom
                const h = (defaults?.height || 50) * this.zoom
                ctx.fillStyle = TOOL_COLORS[this.currentTool]
                ctx.fillRect(previewScreen.x - w/2, previewScreen.y - h/2, w, h)
            }
            
            ctx.globalAlpha = 1
        }
    }

    drawEditorRect(obj: { x: number, y: number, width: number, height: number }, color: string, selected: boolean) {
        const ctx = this.gameRef.ctx
        const pos = this.worldToScreen(obj.x, obj.y)
        const w = obj.width * this.zoom
        const h = obj.height * this.zoom

        ctx.fillStyle = color
        ctx.fillRect(pos.x - w/2, pos.y - h/2, w, h)

        ctx.strokeStyle = selected ? '#fff' : '#666'
        ctx.lineWidth = selected ? 3 : 1
        ctx.strokeRect(pos.x - w/2, pos.y - h/2, w, h)

        // Draw resize handles if selected
        if (selected) {
            this.drawResizeHandles(obj)
        }
    }

    drawResizeHandles(obj: { x: number, y: number, width: number, height: number }) {
        const ctx = this.gameRef.ctx
        const pos = this.worldToScreen(obj.x, obj.y)
        const halfW = (obj.width / 2) * this.zoom
        const halfH = (obj.height / 2) * this.zoom
        const size = this.handleSize

        const handleColor = '#81B622'
        const handleBorder = '#fff'

        // Corner handles
        const corners = [
            { x: pos.x - halfW, y: pos.y - halfH }, // nw
            { x: pos.x + halfW, y: pos.y - halfH }, // ne
            { x: pos.x - halfW, y: pos.y + halfH }, // sw
            { x: pos.x + halfW, y: pos.y + halfH }, // se
        ]

        corners.forEach(corner => {
            ctx.fillStyle = handleColor
            ctx.fillRect(corner.x - size/2, corner.y - size/2, size, size)
            ctx.strokeStyle = handleBorder
            ctx.lineWidth = 1
            ctx.strokeRect(corner.x - size/2, corner.y - size/2, size, size)
        })

        // Edge handles
        const edges = [
            { x: pos.x, y: pos.y - halfH }, // n
            { x: pos.x, y: pos.y + halfH }, // s
            { x: pos.x - halfW, y: pos.y }, // w
            { x: pos.x + halfW, y: pos.y }, // e
        ]

        edges.forEach(edge => {
            ctx.fillStyle = handleColor
            ctx.fillRect(edge.x - size/2, edge.y - size/2, size, size)
            ctx.strokeStyle = handleBorder
            ctx.lineWidth = 1
            ctx.strokeRect(edge.x - size/2, edge.y - size/2, size, size)
        })
    }

    drawMovementRange(plat: EditorMovingPlatform, selected: boolean = false) {
        const ctx = this.gameRef.ctx
        const opacity = selected ? 1 : 0.3
        
        ctx.globalAlpha = opacity
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

        // Draw endpoint handles (smaller when not selected)
        const handleSize = selected ? this.handleSize + 4 : 6

        // Min point handle (green)
        ctx.fillStyle = '#00ff00'
        ctx.beginPath()
        ctx.arc(minPos.x, minPos.y, handleSize/2, 0, Math.PI * 2)
        ctx.fill()
        if (selected) {
            ctx.strokeStyle = '#fff'
            ctx.lineWidth = 2
            ctx.stroke()
        }

        // Max point handle (red)
        ctx.fillStyle = '#ff4444'
        ctx.beginPath()
        ctx.arc(maxPos.x, maxPos.y, handleSize/2, 0, Math.PI * 2)
        ctx.fill()
        if (selected) {
            ctx.strokeStyle = '#fff'
            ctx.lineWidth = 2
            ctx.stroke()
        }

        // Labels (only when selected)
        if (selected) {
            ctx.globalAlpha = 1
            drawText({
                c: ctx,
                x: minPos.x,
                y: minPos.y - handleSize,
                align: 'center',
                fillColor: '#0f0',
                fontSize: 10,
                fontFamily: 'sans-serif',
                weight: 'bold',
                style: '',
                text: 'MIN'
            })

            drawText({
                c: ctx,
                x: maxPos.x,
                y: maxPos.y - handleSize,
                align: 'center',
                fillColor: '#f44',
                fontSize: 10,
                fontFamily: 'sans-serif',
                weight: 'bold',
                style: '',
                text: 'MAX'
            })
        }
        
        ctx.globalAlpha = 1
    }

    drawUI() {
        const ctx = this.gameRef.ctx

        // Top bar background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
        ctx.fillRect(0, 0, this.gameRef.gameWidth, 100)

        // Draw level name
        if (this.currentLevel) {
            drawText({
                c: ctx,
                x: this.gameRef.gameWidth / 2,
                y: 30,
                align: 'center',
                fillColor: '#fff',
                fontSize: 18,
                fontFamily: 'sans-serif',
                weight: 'bold',
                style: '',
                text: this.currentLevel.name
            })
            
            drawText({
                c: ctx,
                x: this.gameRef.gameWidth / 2,
                y: 50,
                align: 'center',
                fillColor: '#888',
                fontSize: 12,
                fontFamily: 'sans-serif',
                weight: 'normal',
                style: '',
                text: `${this.currentLevel.levelWidth}x${this.currentLevel.levelHeight} | Zoom: ${Math.round(this.zoom * 100)}%`
            })
        }

        // Draw buttons
        this.backButton.draw()
        this.saveButton.draw()
        this.testButton.draw()
        this.exportButton.draw()
        this.newButton.draw()
        this.loadButton.draw()
        this.levelSettingsButton.draw()
        this.toolButtons.forEach(btn => btn.draw())

        // Current tool indicator
        drawText({
            c: ctx,
            x: 10,
            y: 95,
            align: 'left',
            fillColor: '#888',
            fontSize: 11,
            fontFamily: 'sans-serif',
            weight: 'normal',
            style: '',
            text: `Tool: ${this.currentTool} | Pan: Arrow keys/WASD | Zoom: +/-`
        })

        // Property panel
        if (this.showPropertyPanel && this.selectedObject) {
            this.drawPropertyPanel()
        }

        // Delete button (only when object selected)
        if (this.selectedObject) {
            this.deleteObjectButton.draw()
        }

        // Level list panel
        if (this.showLevelList) {
            this.drawLevelListPanel()
        }

        // Export panel
        if (this.showExportPanel) {
            this.drawExportPanel()
        }

        // Level settings panel
        if (this.showLevelSettings) {
            this.drawLevelSettingsPanel()
        }
    }

    drawPropertyPanel() {
        if (!this.selectedObject) return

        const ctx = this.gameRef.ctx
        const panelX = this.gameRef.gameWidth - 210
        const panelY = 110
        const panelW = 200
        // const panelH = 400
        const panelH = (OBJECT_PROPERTIES[this.selectedObject.type]?.length || 0) * 40 + 60

        // Panel background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)'
        ctx.fillRect(panelX, panelY, panelW, panelH)
        ctx.strokeStyle = '#444'
        ctx.lineWidth = 1
        ctx.strokeRect(panelX, panelY, panelW, panelH)

        // Title
        drawText({
            c: ctx,
            x: panelX + 10,
            y: panelY + 25,
            align: 'left',
            fillColor: '#fff',
            fontSize: 14,
            fontFamily: 'sans-serif',
            weight: 'bold',
            style: '',
            text: `Edit ${this.selectedObject.type}`
        })

        // Properties
        const props = OBJECT_PROPERTIES[this.selectedObject.type] || []
        let y = panelY + 50

        props.forEach((prop, index) => {
            const value = (this.selectedObject as any)[prop.key]
            const isEditing = this.editingProperty === prop.key

            drawText({
                c: ctx,
                x: panelX + 10,
                y: y,
                align: 'left',
                fillColor: '#888',
                fontSize: 11,
                fontFamily: 'sans-serif',
                weight: 'normal',
                style: '',
                text: prop.label
            })

            // Value box
            ctx.fillStyle = isEditing ? '#444' : '#222'
            ctx.fillRect(panelX + 10, y + 5, panelW - 20, 25)
            ctx.strokeStyle = isEditing ? '#81B622' : '#444'
            ctx.strokeRect(panelX + 10, y + 5, panelW - 20, 25)

            drawText({
                c: ctx,
                x: panelX + 15,
                y: y + 22,
                align: 'left',
                fillColor: '#fff',
                fontSize: 12,
                fontFamily: 'sans-serif',
                weight: 'normal',
                style: '',
                text: isEditing ? this.propertyInputValue : String(value ?? '')
            })

            // Handle clicks on property fields
            const mouse = this.gameRef.mouseInfo
            if (mouse.mouseDown && !this.isDragging) {
                if (mouse.x > panelX + 10 && mouse.x < panelX + panelW - 10 &&
                    mouse.y > y + 5 && mouse.y < y + 30) {
                    if (this.editingProperty !== prop.key) {
                        this.editingProperty = prop.key
                        this.propertyInputValue = String(value ?? '')
                        this.setupPropertyInput(prop.key, panelX + 10, y + 5, panelW - 20, 25)
                    }
                }
            }

            y += 40
        })
    }

    setupPropertyInput(propKey: string, x: number, y: number, width: number, height: number) {
        // Remove any existing input
        const existingInput = document.getElementById('editor-property-input')
        if (existingInput) existingInput.remove()

        // Create input element
        const input = document.createElement('input')
        input.id = 'editor-property-input'
        input.type = 'text'
        input.value = this.propertyInputValue
        input.style.position = 'absolute'
        input.style.left = `${x}px`
        input.style.top = `${y}px`
        input.style.width = `${width}px`
        input.style.height = `${height}px`
        input.style.background = '#333'
        input.style.color = '#fff'
        input.style.border = '2px solid #81B622'
        input.style.fontSize = '12px'
        input.style.padding = '2px 5px'
        input.style.zIndex = '1000'

        input.onblur = () => {
            this.applyPropertyValue(propKey, input.value)
            input.remove()
            this.editingProperty = null
        }

        input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                this.applyPropertyValue(propKey, input.value)
                input.remove()
                this.editingProperty = null
            } else if (e.key === 'Escape') {
                input.remove()
                this.editingProperty = null
            }
        }

        document.body.appendChild(input)
        input.focus()
        input.select()
    }

    applyPropertyValue(propKey: string, value: string) {
        if (!this.selectedObject || !this.currentLevel) return

        const props = OBJECT_PROPERTIES[this.selectedObject.type]
        const propDef = props?.find(p => p.key === propKey)

        let parsedValue: any = value
        if (propDef?.type === 'number') {
            parsedValue = parseFloat(value) || 0
            if (propDef.min !== undefined) parsedValue = Math.max(propDef.min, parsedValue)
            if (propDef.max !== undefined) parsedValue = Math.min(propDef.max, parsedValue)
        }

        (this.selectedObject as any)[propKey] = parsedValue

        // Handle special case for playerStart
        if (this.selectedObject.type === 'playerStart') {
            this.currentLevel.playerStart = {
                x: this.selectedObject.x,
                y: this.selectedObject.y
            }
        }

        this.saveCurrentLevel()
    }

    drawLevelListPanel() {
        const ctx = this.gameRef.ctx
        const panelX = this.gameRef.gameWidth - 310
        const panelY = 50
        const panelW = 300
        const panelH = 350

        ctx.fillStyle = 'rgba(0, 0, 0, 0.95)'
        ctx.fillRect(panelX, panelY, panelW, panelH)
        ctx.strokeStyle = '#444'
        ctx.strokeRect(panelX, panelY, panelW, panelH)

        drawText({
            c: ctx,
            x: panelX + 10,
            y: panelY + 25,
            align: 'left',
            fillColor: '#fff',
            fontSize: 14,
            fontFamily: 'sans-serif',
            weight: 'bold',
            style: '',
            text: 'Load Level'
        })

        let y = panelY + 50
        const mouse = this.gameRef.mouseInfo

        this.savedLevels.forEach((level, index) => {
            const isHovered = mouse.x > panelX + 10 && mouse.x < panelX + panelW - 10 &&
                             mouse.y > y && mouse.y < y + 30
            const isCurrent = level.id === this.currentLevel?.id

            ctx.fillStyle = isHovered ? '#444' : (isCurrent ? '#333' : '#222')
            ctx.fillRect(panelX + 10, y, panelW - 20, 30)

            drawText({
                c: ctx,
                x: panelX + 15,
                y: y + 20,
                align: 'left',
                fillColor: isCurrent ? '#81B622' : '#fff',
                fontSize: 12,
                fontFamily: 'sans-serif',
                weight: isCurrent ? 'bold' : 'normal',
                style: '',
                text: level.name
            })

            if (isHovered && mouse.mouseDown) {
                this.saveCurrentLevel()
                this.currentLevel = level
                LevelEditorStorage.setCurrentLevelId(level.id)
                this.showLevelList = false
                this.selectedObject = null
                this.showPropertyPanel = false
            }

            y += 35
        })
    }

    drawExportPanel() {
        if (!this.currentLevel) return

        const ctx = this.gameRef.ctx
        const panelX = 50
        const panelY = 50
        const panelW = this.gameRef.gameWidth - 100
        const panelH = this.gameRef.gameHeight - 100

        ctx.fillStyle = 'rgba(0, 0, 0, 0.95)'
        ctx.fillRect(panelX, panelY, panelW, panelH)
        ctx.strokeStyle = '#444'
        ctx.strokeRect(panelX, panelY, panelW, panelH)

        drawText({
            c: ctx,
            x: panelX + 20,
            y: panelY + 30,
            align: 'left',
            fillColor: '#fff',
            fontSize: 16,
            fontFamily: 'sans-serif',
            weight: 'bold',
            style: '',
            text: 'Export Level - Copy the code below'
        })

        // Constants code
        drawText({
            c: ctx,
            x: panelX + 20,
            y: panelY + 60,
            align: 'left',
            fillColor: '#81B622',
            fontSize: 12,
            fontFamily: 'sans-serif',
            weight: 'bold',
            style: '',
            text: 'Constants File (save as constants/yourLevelConstants.ts):'
        })

        const constantsCode = LevelEditorStorage.exportLevelAsCode(this.currentLevel)
        
        // Create a textarea for easy copying
        let textarea = document.getElementById('export-constants') as HTMLTextAreaElement
        if (!textarea) {
            textarea = document.createElement('textarea')
            textarea.id = 'export-constants'
            textarea.style.position = 'absolute'
            textarea.style.left = `${panelX + 20}px`
            textarea.style.top = `${panelY + 70}px`
            textarea.style.width = `${panelW - 40}px`
            textarea.style.height = `${(panelH - 200) / 2}px`
            textarea.style.background = '#111'
            textarea.style.color = '#0f0'
            textarea.style.border = '1px solid #444'
            textarea.style.fontSize = '10px'
            textarea.style.fontFamily = 'monospace'
            textarea.style.padding = '10px'
            textarea.style.resize = 'none'
            textarea.readOnly = true
            document.body.appendChild(textarea)
        }
        textarea.value = constantsCode

        // Level class code
        drawText({
            c: ctx,
            x: panelX + 20,
            y: panelY + (panelH / 2) + 20,
            align: 'left',
            fillColor: '#81B622',
            fontSize: 12,
            fontFamily: 'sans-serif',
            weight: 'bold',
            style: '',
            text: 'Level Class File (save as levels/yourLevel.ts):'
        })

        const classCode = LevelEditorStorage.exportLevelClassCode(this.currentLevel)
        
        let textarea2 = document.getElementById('export-class') as HTMLTextAreaElement
        if (!textarea2) {
            textarea2 = document.createElement('textarea')
            textarea2.id = 'export-class'
            textarea2.style.position = 'absolute'
            textarea2.style.left = `${panelX + 20}px`
            textarea2.style.top = `${panelY + (panelH / 2) + 30}px`
            textarea2.style.width = `${panelW - 40}px`
            textarea2.style.height = `${(panelH - 200) / 2}px`
            textarea2.style.background = '#111'
            textarea2.style.color = '#0f0'
            textarea2.style.border = '1px solid #444'
            textarea2.style.fontSize = '10px'
            textarea2.style.fontFamily = 'monospace'
            textarea2.style.padding = '10px'
            textarea2.style.resize = 'none'
            textarea2.readOnly = true
            document.body.appendChild(textarea2)
        }
        textarea2.value = classCode

        // Close instruction
        drawText({
            c: ctx,
            x: panelX + panelW - 20,
            y: panelY + 30,
            align: 'right',
            fillColor: '#888',
            fontSize: 12,
            fontFamily: 'sans-serif',
            weight: 'normal',
            style: '',
            text: 'Press ESC or click Export again to close'
        })
    }

    drawLevelSettingsPanel() {
        if (!this.currentLevel) return

        const ctx = this.gameRef.ctx
        const panelX = this.gameRef.gameWidth - 310
        const panelY = 50
        const panelW = 300
        const panelH = 250

        ctx.fillStyle = 'rgba(0, 0, 0, 0.95)'
        ctx.fillRect(panelX, panelY, panelW, panelH)
        ctx.strokeStyle = '#444'
        ctx.strokeRect(panelX, panelY, panelW, panelH)

        drawText({
            c: ctx,
            x: panelX + 10,
            y: panelY + 25,
            align: 'left',
            fillColor: '#fff',
            fontSize: 14,
            fontFamily: 'sans-serif',
            weight: 'bold',
            style: '',
            text: 'Level Settings'
        })

        const settings = [
            { key: 'name', label: 'Level Name', value: this.currentLevel.name },
            { key: 'levelWidth', label: 'Width', value: this.currentLevel.levelWidth },
            { key: 'levelHeight', label: 'Height', value: this.currentLevel.levelHeight },
        ]

        let y = panelY + 50
        const mouse = this.gameRef.mouseInfo

        settings.forEach((setting) => {
            const isEditing = this.editingLevelSetting === setting.key

            drawText({
                c: ctx,
                x: panelX + 10,
                y: y,
                align: 'left',
                fillColor: '#888',
                fontSize: 11,
                fontFamily: 'sans-serif',
                weight: 'normal',
                style: '',
                text: setting.label
            })

            ctx.fillStyle = isEditing ? '#444' : '#222'
            ctx.fillRect(panelX + 10, y + 5, panelW - 20, 25)
            ctx.strokeStyle = isEditing ? '#81B622' : '#444'
            ctx.strokeRect(panelX + 10, y + 5, panelW - 20, 25)

            drawText({
                c: ctx,
                x: panelX + 15,
                y: y + 22,
                align: 'left',
                fillColor: '#fff',
                fontSize: 12,
                fontFamily: 'sans-serif',
                weight: 'normal',
                style: '',
                text: isEditing ? this.levelSettingInputValue : String(setting.value)
            })

            if (mouse.mouseDown && !this.isDragging) {
                if (mouse.x > panelX + 10 && mouse.x < panelX + panelW - 10 &&
                    mouse.y > y + 5 && mouse.y < y + 30) {
                    if (this.editingLevelSetting !== setting.key) {
                        this.editingLevelSetting = setting.key
                        this.levelSettingInputValue = String(setting.value)
                        this.setupLevelSettingInput(setting.key, panelX + 10, y + 5, panelW - 20, 25)
                    }
                }
            }

            y += 45
        })

        // Delete level button
        const deleteY = panelY + panelH - 45
        const isDeleteHovered = mouse.x > panelX + 10 && mouse.x < panelX + panelW - 10 &&
                               mouse.y > deleteY && mouse.y < deleteY + 35

        ctx.fillStyle = isDeleteHovered ? '#a33' : '#633'
        ctx.fillRect(panelX + 10, deleteY, panelW - 20, 35)

        drawText({
            c: ctx,
            x: panelX + panelW / 2,
            y: deleteY + 23,
            align: 'center',
            fillColor: '#fff',
            fontSize: 12,
            fontFamily: 'sans-serif',
            weight: 'bold',
            style: '',
            text: 'Delete Level'
        })

        if (isDeleteHovered && mouse.mouseDown) {
            if (this.savedLevels.length > 1) {
                LevelEditorStorage.deleteLevel(this.currentLevel.id)
                this.savedLevels = LevelEditorStorage.getAllLevels()
                this.currentLevel = this.savedLevels[0] || LevelEditorStorage.createNewLevel()
                LevelEditorStorage.setCurrentLevelId(this.currentLevel.id)
                this.showLevelSettings = false
                this.showMessage('Level Deleted')
            } else {
                this.showMessage('Cannot delete the only level')
            }
        }
    }

    setupLevelSettingInput(settingKey: string, x: number, y: number, width: number, height: number) {
        const existingInput = document.getElementById('editor-setting-input')
        if (existingInput) existingInput.remove()

        const input = document.createElement('input')
        input.id = 'editor-setting-input'
        input.type = 'text'
        input.value = this.levelSettingInputValue
        input.style.position = 'absolute'
        input.style.left = `${x}px`
        input.style.top = `${y}px`
        input.style.width = `${width}px`
        input.style.height = `${height}px`
        input.style.background = '#333'
        input.style.color = '#fff'
        input.style.border = '2px solid #81B622'
        input.style.fontSize = '12px'
        input.style.padding = '2px 5px'
        input.style.zIndex = '1000'

        input.onblur = () => {
            this.applyLevelSettingValue(settingKey, input.value)
            input.remove()
            this.editingLevelSetting = null
        }

        input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                this.applyLevelSettingValue(settingKey, input.value)
                input.remove()
                this.editingLevelSetting = null
            } else if (e.key === 'Escape') {
                input.remove()
                this.editingLevelSetting = null
            }
        }

        document.body.appendChild(input)
        input.focus()
        input.select()
    }

    applyLevelSettingValue(settingKey: string, value: string) {
        if (!this.currentLevel) return

        if (settingKey === 'name') {
            this.currentLevel.name = value || 'Untitled Level'
        } else if (settingKey === 'levelWidth') {
            this.currentLevel.levelWidth = Math.max(200, parseInt(value) || 800)
        } else if (settingKey === 'levelHeight') {
            this.currentLevel.levelHeight = Math.max(200, parseInt(value) || 600)
        }

        this.saveCurrentLevel()
        this.savedLevels = LevelEditorStorage.getAllLevels()
    }

    tearDown() {
        // Remove any HTML elements we created
        const input1 = document.getElementById('editor-property-input')
        if (input1) input1.remove()
        
        const input2 = document.getElementById('editor-setting-input')
        if (input2) input2.remove()
        
        const textarea1 = document.getElementById('export-constants')
        if (textarea1) textarea1.remove()
        
        const textarea2 = document.getElementById('export-class')
        if (textarea2) textarea2.remove()

        this.saveCurrentLevel()
    }
}
