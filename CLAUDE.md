# CLAUDE.md - Based Engine Development Guide

This document serves as the primary reference for AI assistants and developers working on based-engine games.

---

## Project Overview & Conventions

### Key Rules

1. **No barrel imports** - Import directly from the source file, not from index files
   ```typescript
   // ✅ Correct
   import { BasedLevel } from "../../engine/BasedLevel"
   import { drawBox } from "../../engine/libs/drawHelpers"
   
   // ❌ Wrong - no barrel imports
   import { BasedLevel, drawBox } from "../../engine"
   ```

2. **Follow existing code patterns** - Look at similar implementations before writing new code

3. **Check for existing helpers first** - Before creating a utility function, check:
   - `src/engine/libs/drawHelpers.ts` - Drawing utilities
   - `src/engine/libs/mathHelpers.ts` - Math and vector utilities
   - `src/engine/libs/collisionHelpers.ts` - Collision detection
   - `src/engine/libs/interfaceHelpers.ts` - Time formatting

4. **Make utilities general-purpose** - If you must create a new helper, design it to benefit other games. Place it in the appropriate `libs/` file or create a new one if the category doesn't exist.

5. **Use existing engine systems** - The engine provides camera, physics, controls, buttons, sounds, and UI components. Use them instead of reimplementing.

### File Naming

- **Classes**: PascalCase matching the class name (`BasedLevel.ts`, `MainPlayer.ts`)
- **Utilities/helpers**: camelCase (`drawHelpers.ts`, `mathHelpers.ts`)
- **Level keys**: kebab-case strings (`'level-01'`, `'start-screen'`)
- **Object keys**: Unique identifiers, typically kebab-case (`'main-player'`, `'wall-0'`)

---

## Core Architecture

### BasedEngine (`src/engine/BasedEngine.ts`)

The main game engine class that manages everything:

```typescript
import { BasedGame } from "../../engine/BasedEngine"

const game = new BasedGame({
    canvasElementId: 'game-container',
    width: window.innerWidth,
    height: window.innerHeight,
    levels: [
        { key: 'start-screen', level: StartScreen },
        { key: 'level-01', level: Level01 },
    ]
})
game.enableMouse()
game.enableKeyboard()
game.start()
```

**Key Properties:**
- `ctx` - Canvas 2D rendering context
- `gameWidth`, `gameHeight` - Canvas dimensions
- `cameraPos`, `cameraZoom` - Camera state
- `pressedKeys` - Currently pressed keyboard keys
- `mouseInfo` - Mouse state (screen-space)
- `cameraMouseInfo` - Mouse state (world-space)
- `touchMode` - Whether touch input is active
- `soundPlayer` - Audio system instance

**Key Methods:**
- `enableMouse()` / `enableKeyboard()` - Enable input handlers
- `initializePhysics()` - Create Matter.js physics world
- `addToWorld(body)` / `removeFromWorld(body)` - Physics body management
- `updatePhysics()` - Step physics simulation (returns true when stepped)
- `loadLevel(key)` - Transition to another level
- `updateCamera(target, bounds?)` - Update camera position
- `createCameraShake(intensity)` - Screen shake effect
- `getXYFromCamera(x, y)` - Convert screen to world coordinates

### BasedLevel (`src/engine/BasedLevel.ts`)

Base class for all game levels with lifecycle methods:

```typescript
import { BasedLevel } from "../../engine/BasedLevel"

export class MyLevel extends BasedLevel {
    levelWidth = 800
    levelHeight = 600

    async preload(): Promise<void> {
        // Load assets (sounds, sprites)
    }

    initialize(): void {
        // Create entities, setup physics, initialize state
    }

    update(): void {
        // Game logic, input handling, entity updates
    }

    draw(): void {
        // Render everything
    }

    onResize(): void {
        // Handle window resize
    }

    tearDown(): void {
        // Cleanup when leaving level
    }
}
```

### BasedObject (`src/engine/BasedObject.ts`)

Base class for all game entities:

```typescript
import { BasedObject } from "../../engine/BasedObject"

export class MyEntity extends BasedObject {
    x = 0
    y = 0
    options = {
        tags: {
            player: true,  // For collision identification
        }
    }

    initialize(): void { }
    update(): void { }
    draw(): void { }
    tearDown(): void { }
}
```

**Tag System:** Use `options.tags` for collision identification. Check with `hasTag(tagName)` or `hasTags(tagArray)`.

---

## Available Helpers

### Drawing Helpers (`src/engine/libs/drawHelpers.ts`)

All draw functions accept camera parameters for world-space rendering.

| Function | Description |
|----------|-------------|
| `rotateDraw(settings)` | Draw with rotation, camera-aware |
| `drawBox(settings)` | Rectangle with optional border radius |
| `drawCircle(settings)` | Circle/arc with optional stroke |
| `drawEllipse(settings)` | Ellipse shape |
| `drawLine(settings)` | Line between two points |
| `drawText(settings)` | Text with font, stroke, fill options |
| `drawPoly(settings)` | Polygon from vertices array |
| `drawImage(settings)` | Draw sprite/image |
| `drawSvg(settings)` | Draw SVG image |
| `createSprite(url)` | Async load and cache sprite image |
| `rotateCameraDraw(settings)` | Draw with camera rotation applied |

**Common Settings:**
```typescript
{
    c: ctx,              // Canvas context (required)
    x: 100, y: 100,      // Position
    width: 50, height: 50,
    fillColor: '#fff',
    strokeColor: '#000',
    strokeWidth: 2,
    cameraPos: gameRef.cameraPos,  // For world-space
    zoom: gameRef.cameraZoom,       // For world-space
}
```

### Math Helpers (`src/engine/libs/mathHelpers.ts`)

| Function | Description |
|----------|-------------|
| `XYCoordinateType` | Interface `{ x: number, y: number }` |
| `getRandomInt(max)` | Random integer 0 to max-1 |
| `getSign(n)` | Returns -1, 0, or 1 |
| `getClickPosition(event)` | Get [x, y] from mouse event |
| `getTouchPosition(event)` | Get [x, y] from touch event |
| `getAllTouchPositions(event)` | Get all touches as array |
| `distanceBetween(p1, p2)` | Euclidean distance |
| `angleBetween(p1, p2, degrees?)` | Angle between points |
| `pointOnCircle(angle, radius)` | Get {x, y} offset at angle |
| `radToDeg(rad)` | Convert radians to degrees |
| `degToRad(deg)` | Convert degrees to radians |
| `addVector(v1, v2)` | Add two vectors |
| `subVector(v1, v2)` | Subtract v2 from v1 |
| `normalizeVector(v, magnitude?)` | Normalize to magnitude (default 1) |

### Collision Helpers (`src/engine/libs/collisionHelpers.ts`)

| Function | Description |
|----------|-------------|
| `boxCollision(a, b)` | AABB collision check (x, y, w, h objects) |

### Interface Helpers (`src/engine/libs/interfaceHelpers.ts`)

| Function | Description |
|----------|-------------|
| `textToTime(ms)` | Format milliseconds as "mm:ss:mmm" |

---

## Built-in Systems

### Camera - FollowCam (`src/engine/cameras/FollowCam.ts`)

Smooth-following camera with zoom support:

```typescript
import { FollowCam } from "../../engine/cameras/FollowCam"

// In initialize():
this.followCam = new FollowCam({ key: 'follow-cam', gameRef: this.gameRef })
this.followCam.levelWidth = this.levelWidth
this.followCam.levelHeight = this.levelHeight
this.followCam.zoomSetting = 1.0      // Target zoom
this.followCam.cameraSpeed = 50        // Follow speed
this.followCam.initialize()

// In update (after physics):
this.followCam.setTarget({ x: player.body.position.x, y: player.body.position.y })
this.followCam.update()
```

**Properties:**
- `targetPosition` - Current target to follow
- `zoomSetting` - Target zoom level
- `cameraSpeed` - How fast camera follows (higher = faster)
- `zoomSpeed` - Zoom interpolation speed
- `fullScreen` - Toggle to show entire level
- `minZoom`, `maxZoom` - Zoom limits

### Physics System

Uses **Matter.js** for 2D physics. Three physics object types are provided:

#### PhysBall (`src/engine/physicsObjects/PhysBall.ts`)
```typescript
import { PhysBall } from "../../engine/physicsObjects/PhysBall"

export class Player extends PhysBall {
    radius = 20
    color = '#ff0000'
    bodyOptions = { 
        label: 'player',
        restitution: 0.5,  // Bounciness
        friction: 0.1,
    }
    options = { tags: { player: true } }
    
    collisionStartFn = (otherBody: any) => {
        const ref = otherBody.plugin.basedRef()
        if (ref?.options?.tags?.hazard) {
            // Handle hazard collision
        }
    }
}
```

#### PhysBox (`src/engine/physicsObjects/PhysBox.ts`)
```typescript
import { PhysBox } from "../../engine/physicsObjects/PhysBox"

export class Wall extends PhysBox {
    width = 100
    height = 50
    color = '#000000'
    bodyOptions = { isStatic: true, label: 'wall' }
}
```

#### PhysPoly (`src/engine/physicsObjects/PhysPoly.ts`)
```typescript
import { PhysPoly } from "../../engine/physicsObjects/PhysPoly"

export class Triangle extends PhysPoly {
    vertices = [
        { x: 0, y: -50 },
        { x: 50, y: 50 },
        { x: -50, y: 50 },
    ]
}
```

#### Physics Setup Pattern:
```typescript
// In level initialize():
this.gameRef.initializePhysics()
this.gameRef.physics.world.gravity.y = 0  // Top-down game

// Create entity:
this.player = new Player({ key: 'player', gameRef: this.gameRef })
this.player.x = 100
this.player.y = 100
this.player.initialize()
this.gameRef.addToWorld(this.player.body)

// In level update():
if (this.gameRef.updatePhysics()) {
    // Physics stepped - update entities
    this.player.update()
}

// In level tearDown():
this.gameRef.removeFromWorld(this.player.body)
```

### Controls

#### TouchKnob (`src/engine/controls/TouchKnob.ts`)

Virtual joystick for touch/mouse input:

```typescript
import { TouchKnob } from "../../engine/controls/TouchKnob"

// In initialize():
this.moveKnob = new TouchKnob({ key: 'move-knob', gameRef: this.gameRef })
this.moveKnob.width = 160
this.moveKnob.height = 160
this.moveKnob.knobSize = 40
this.moveKnob.maxOffset = 50
// Position in bottom-left corner (set in onResize)

// In entity update - get normalized input:
if (this.moveKnob?.knobActive) {
    const inputX = this.moveKnob.knobCoord.x / this.moveKnob.maxOffset  // -1 to 1
    const inputY = this.moveKnob.knobCoord.y / this.moveKnob.maxOffset  // -1 to 1
    moveX += inputX * speed
    moveY += inputY * speed
}

// In level update():
this.moveKnob.update()

// In level draw() - only show in touch mode:
if (this.gameRef.touchMode) {
    this.moveKnob.draw()
}
```

#### SliderControl (`src/engine/controls/SliderControl.ts`)

Slider with +/- buttons for value adjustment.

### Buttons - BasedButton (`src/engine/BasedButton.ts`)

Interactive UI buttons supporting mouse and touch:

```typescript
import { BasedButton } from "../../engine/BasedButton"

// In initialize():
this.playButton = new BasedButton({ key: 'play-btn', gameRef: this.gameRef })
this.playButton.x = 100
this.playButton.y = 200
this.playButton.width = 150
this.playButton.height = 50
this.playButton.buttonText = 'PLAY'
this.playButton.fillColor = '#4CAF50'
this.playButton.hoverColor = '#66BB6A'
this.playButton.textColor = '#fff'
this.playButton.clickFunction = () => {
    this.gameRef.loadLevel('level-01')
}

// In update():
this.playButton.update()

// In draw():
this.playButton.draw()
```

### Sounds - BasedSounds (`src/engine/BasedSounds.ts`)

Audio system using Web Audio API:

```typescript
// In preload():
this.jumpSound = await this.gameRef.soundPlayer.loadSound('/assets/jump.mp3')
this.bgMusic = await this.gameRef.soundPlayer.loadSound('/assets/music.mp3')

// Play sound effect:
this.gameRef.soundPlayer.playSound(this.jumpSound)

// Play with callback:
this.gameRef.soundPlayer.playSound(this.jumpSound, () => {
    console.log('Sound finished')
})

// Simple beeps (no loading required):
this.gameRef.soundPlayer.playNote(440, 0.1, 'sine')  // A4 for 0.1 seconds
this.gameRef.soundPlayer.playTone([440, 880, 440], 0.1, 'square')  // Sequence
```

### UI Components

#### TextContainer (`src/engine/ui/TextContainer.ts`)

Scrollable text display with pagination, word-wrap, and close button.

#### Toasts (`src/engine/ui/Toasts.ts`)

Temporary floating messages:

```typescript
import { Toasts } from "../../engine/ui/Toasts"

// In initialize():
this.toasts = new Toasts({ key: 'toasts', gameRef: this.gameRef })

// Show a toast:
this.toasts.addToast('Score +100', { duration: 1500, yOffset: -50 })

// In update() and draw():
this.toasts.update()
this.toasts.draw()
```

---

## Input Handling

### Keyboard Input

```typescript
// Check if key is currently pressed
if (this.gameRef.pressedKeys['KeyW'] || this.gameRef.pressedKeys['ArrowUp']) {
    moveY -= speed
}
if (this.gameRef.pressedKeys['KeyA'] || this.gameRef.pressedKeys['ArrowLeft']) {
    moveX -= speed
}
if (this.gameRef.pressedKeys['KeyS'] || this.gameRef.pressedKeys['ArrowDown']) {
    moveY += speed
}
if (this.gameRef.pressedKeys['KeyD'] || this.gameRef.pressedKeys['ArrowRight']) {
    moveX += speed
}
if (this.gameRef.pressedKeys['Space']) {
    this.jump()
}
```

Key codes use the `event.code` format (e.g., `'KeyW'`, `'Space'`, `'ArrowUp'`, `'Escape'`).

### Mouse Input

```typescript
// Screen-space coordinates (for UI)
const screenX = this.gameRef.mouseInfo.x
const screenY = this.gameRef.mouseInfo.y
const isMouseDown = this.gameRef.mouseInfo.mouseDown

// World-space coordinates (for game objects)
const worldX = this.gameRef.cameraMouseInfo.x
const worldY = this.gameRef.cameraMouseInfo.y

// Convert screen to world manually:
const [worldX, worldY] = this.gameRef.getXYFromCamera(screenX, screenY)
```

### Touch Input

```typescript
// Check if we're in touch mode
if (this.gameRef.touchMode) {
    // Show touch controls
    this.moveKnob.draw()
    this.actionButton.draw()
}

// Touch info is also available via mouseInfo when touch is active
// Use TouchKnob for virtual joystick input (see Controls section)
```

---

## Drawing: Camera-Aware vs Screen-Space

### ⚠️ Critical Distinction

**World-space objects** (game entities, level geometry) need camera parameters:

```typescript
// ✅ World-space - affected by camera
drawBox({
    c: this.gameRef.ctx,
    x: this.x,
    y: this.y,
    width: this.width,
    height: this.height,
    fillColor: this.color,
    cameraPos: this.gameRef.cameraPos,  // Required!
    zoom: this.gameRef.cameraZoom,       // Required!
})
```

**Screen-space elements** (UI, buttons, HUD) omit camera parameters:

```typescript
// ✅ Screen-space - fixed on screen
drawBox({
    c: this.gameRef.ctx,
    x: 10,
    y: 10,
    width: 100,
    height: 30,
    fillColor: '#000',
    // NO cameraPos or zoom!
})

drawText({
    c: this.gameRef.ctx,
    x: this.gameRef.gameWidth / 2,
    y: 50,
    text: 'SCORE: 100',
    fontSize: 24,
    fillColor: '#fff',
    // NO cameraPos or zoom!
})
```

### Common Mistake

```typescript
// ❌ WRONG - UI moves with camera
drawText({
    c: this.gameRef.ctx,
    x: 100, y: 50,
    text: 'Score',
    cameraPos: this.gameRef.cameraPos,  // Don't do this for UI!
    zoom: this.gameRef.cameraZoom,
})

// ❌ WRONG - Game object doesn't move with camera
this.player.draw()  // Inside draw(): missing cameraPos/zoom
```

### Draw Order

```typescript
draw(): void {
    // 1. Clear screen
    this.gameRef.ctx.fillStyle = '#1a1a2e'
    this.gameRef.ctx.fillRect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
    
    // 2. Draw world-space objects (with camera)
    drawBox({
        c: this.gameRef.ctx,
        x: 0, y: 0,
        width: this.levelWidth,
        height: this.levelHeight,
        fillColor: '#2d2d44',
        cameraPos: this.gameRef.cameraPos,
        zoom: this.gameRef.cameraZoom,
    })
    
    this.walls.forEach(wall => wall.draw())
    this.player.draw()
    
    // 3. Draw screen-space UI (no camera)
    this.drawHUD()
    if (this.gameRef.touchMode) {
        this.moveKnob.draw()
    }
    this.playButton.draw()
}
```

---

## Game Development Guide

### Recommended Game Structure

Follow the pattern established in `src/games/the-squeeze/`:

```
my-game/
├── startGame.ts           # Entry point - creates BasedGame
├── helpers.ts             # Game-specific utility functions
├── constants/
│   ├── sharedConstants.ts # Colors, physics settings, shared data
│   ├── level01Constants.ts
│   └── level02Constants.ts
├── levels/
│   ├── MyGameBaseLevel.ts # Shared level logic (extend this)
│   ├── startScreen.ts     # Title/menu screen
│   ├── level01.ts         # Extends base level with specific data
│   └── creditsScreen.ts
├── entities/
│   ├── player.ts          # Player entity
│   ├── enemy.ts
│   └── pickup.ts
└── ui/                    # Game-specific UI components (if needed)
```

### Entry Point Pattern (`startGame.ts`)

```typescript
import { BasedGame } from "../../engine/BasedEngine"
import { StartScreen } from "./levels/startScreen"
import { Level01 } from "./levels/level01"
import { Level02 } from "./levels/level02"

export function startGame() {
    const newGame = new BasedGame({
        canvasElementId: 'game-container',
        width: window.innerWidth,
        height: window.innerHeight,
        levels: [
            { key: 'start-screen', level: StartScreen },
            { key: 'level-01', level: Level01 },
            { key: 'level-02', level: Level02 },
        ]
    })
    newGame.enableMouse()
    newGame.enableKeyboard()
    newGame.start()
}
```

### Base Level Pattern

Create a base level class with all shared logic, then extend it for specific levels:

```typescript
// levels/MyGameBaseLevel.ts
import { BasedLevel } from "../../../engine/BasedLevel"
import { FollowCam } from "../../../engine/cameras/FollowCam"
import { TouchKnob } from "../../../engine/controls/TouchKnob"
import { BasedButton } from "../../../engine/BasedButton"
import { Player } from "../entities/player"
import { Wall } from "../entities/wall"

export class MyGameBaseLevel extends BasedLevel {
    // Override in subclass
    levelWidth = 800
    levelHeight = 600
    nextLevel = 'start-screen'
    playerStartPosition = { x: 100, y: 100 }
    
    // Level data (set by subclass)
    _walls: WallData[] = []
    _pickups: PickupData[] = []
    
    // Runtime objects
    followCam!: FollowCam
    moveKnob!: TouchKnob
    player!: Player
    walls: Wall[] = []
    
    gameState: 'loading' | 'active' | 'paused' | 'complete' = 'loading'

    async preload(): Promise<void> {
        // Load sounds
        this.jumpSound = await this.gameRef.soundPlayer.loadSound('/sounds/jump.mp3')
    }

    initialize(): void {
        this.gameState = 'loading'
        
        // Physics
        this.gameRef.initializePhysics()
        this.gameRef.physics.world.gravity.y = 0
        
        // Camera
        this.followCam = new FollowCam({ key: 'follow-cam', gameRef: this.gameRef })
        this.followCam.levelWidth = this.levelWidth
        this.followCam.levelHeight = this.levelHeight
        this.followCam.initialize()
        
        // Controls
        this.moveKnob = new TouchKnob({ key: 'move-knob', gameRef: this.gameRef })
        this.moveKnob.width = 160
        this.moveKnob.height = 160
        
        // Player
        this.player = new Player({ key: 'player', gameRef: this.gameRef })
        this.player.x = this.playerStartPosition.x
        this.player.y = this.playerStartPosition.y
        this.player.moveKnob = this.moveKnob  // Pass reference for input
        this.player.initialize()
        this.gameRef.addToWorld(this.player.body)
        
        // Setup level objects from constants
        this.setupWalls()
        
        this.onResize()
        this.gameState = 'active'
    }

    setupWalls(): void {
        this.walls = this._walls.map((data, idx) => {
            const wall = new Wall({ key: `wall-${idx}`, gameRef: this.gameRef })
            wall.x = data.x
            wall.y = data.y
            wall.width = data.width
            wall.height = data.height
            wall.color = data.color
            wall.initialize()
            this.gameRef.addToWorld(wall.body)
            return wall
        })
    }

    update(): void {
        if (this.gameState !== 'active') return
        
        // Physics
        if (this.gameRef.updatePhysics()) {
            this.onPhysicsUpdate()
        }
        
        // Controls
        this.moveKnob.update()
        
        // Check win condition
        if (this.checkWinCondition()) {
            this.gameRef.loadLevel(this.nextLevel)
        }
    }

    onPhysicsUpdate(): void {
        this.player.update()
        
        // Update camera
        this.followCam.setTarget(this.player.body.position)
        this.followCam.update()
    }

    draw(): void {
        // Clear
        this.gameRef.ctx.fillStyle = '#1a1a2e'
        this.gameRef.ctx.fillRect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
        
        // World objects
        this.walls.forEach(w => w.draw())
        this.player.draw()
        
        // UI
        if (this.gameRef.touchMode) {
            this.moveKnob.draw()
        }
    }

    onResize(): void {
        // Position touch controls
        this.moveKnob.x = 20
        this.moveKnob.y = this.gameRef.gameHeight - this.moveKnob.height - 20
    }

    tearDown(): void {
        this.walls.forEach(w => this.gameRef.removeFromWorld(w.body))
        this.gameRef.removeFromWorld(this.player.body)
    }
}
```

### Concrete Level Pattern

```typescript
// levels/level01.ts
import { LEVEL_01 } from "../constants/level01Constants"
import { MyGameBaseLevel } from "./MyGameBaseLevel"

export class Level01 extends MyGameBaseLevel {
    levelWidth = LEVEL_01.levelWidth
    levelHeight = LEVEL_01.levelHeight
    nextLevel = LEVEL_01.nextLevel
    playerStartPosition = LEVEL_01.playerStart
    
    _walls = LEVEL_01.walls
    _pickups = LEVEL_01.pickups
}
```

### Level Constants Pattern

```typescript
// constants/level01Constants.ts
import { LevelData } from "./sharedConstants"

export const LEVEL_01: LevelData = {
    name: 'Level 01',
    levelWidth: 1200,
    levelHeight: 800,
    nextLevel: 'level-02',
    playerStart: { x: 100, y: 400 },
    walls: [
        { x: 0, y: 750, width: 1200, height: 50, color: '#333' },
        { x: 300, y: 600, width: 200, height: 30, color: '#333' },
    ],
    pickups: [
        { x: 350, y: 550, type: 'coin' },
        { x: 400, y: 550, type: 'coin' },
    ],
}
```

### Entity Pattern with Collision

```typescript
// entities/player.ts
import { PhysBall } from "../../../engine/physicsObjects/PhysBall"
import { Physics } from "matter-js"
import { TouchKnob } from "../../../engine/controls/TouchKnob"

export class Player extends PhysBall {
    radius = 20
    color = '#4CAF50'
    speed = 5
    
    moveKnob?: TouchKnob  // Set by level
    
    bodyOptions = {
        label: 'player',
        restitution: 0.2,
        friction: 0.1,
    }
    
    options = {
        tags: { player: true }
    }
    
    // Collision callbacks
    collisionStartFn = (other: any) => {
        const ref = other.plugin.basedRef()
        if (ref?.options?.tags?.hazard) {
            this.die()
        }
        if (ref?.options?.tags?.pickup) {
            this.collect(ref)
        }
    }
    
    update(): void {
        this.handleInput()
    }
    
    handleInput(): void {
        let moveX = 0
        let moveY = 0
        
        // Keyboard
        const keys = this.gameRef.pressedKeys
        if (keys['KeyW'] || keys['ArrowUp']) moveY -= this.speed
        if (keys['KeyS'] || keys['ArrowDown']) moveY += this.speed
        if (keys['KeyA'] || keys['ArrowLeft']) moveX -= this.speed
        if (keys['KeyD'] || keys['ArrowRight']) moveX += this.speed
        
        // Touch joystick
        if (this.moveKnob?.knobActive) {
            moveX += (this.moveKnob.knobCoord.x / this.moveKnob.maxOffset) * this.speed
            moveY += (this.moveKnob.knobCoord.y / this.moveKnob.maxOffset) * this.speed
        }
        
        Physics.Body.setVelocity(this.body, { x: moveX, y: moveY })
    }
}
```

---

## Alternative Patterns

### Grid-Based Games (dice-grid pattern)

For games without physics that use tile/grid systems:

```typescript
// Use BasedObject instead of physics objects
export class GridTile extends BasedObject {
    gridX = 0
    gridY = 0
    tileSize = 64
    
    get x() { return this.gridX * this.tileSize }
    get y() { return this.gridY * this.tileSize }
}

// Store tiles in a dictionary by coordinate
this.tiles: Record<string, GridTile> = {}
const key = `${gridX},${gridY}`
this.tiles[key] = new GridTile(...)

// Grid-based movement
moveTo(gridX: number, gridY: number) {
    this.gridX = gridX
    this.gridY = gridY
}
```

### Sprite/Tilemap Games (vimjam2 pattern)

For games with sprite-based rendering and tilemaps:

```typescript
import { createSprite, drawImage } from "../../../engine/libs/drawHelpers"

// Load sprites in preload
async preload(): Promise<void> {
    this.playerSprite = await createSprite('/assets/player.png')
    this.tilesheet = await createSprite('/assets/tiles.png')
}

// Draw sprite
drawImage({
    c: this.gameRef.ctx,
    x: this.x,
    y: this.y,
    img: this.playerSprite,
    cameraPos: this.gameRef.cameraPos,
    zoom: this.gameRef.cameraZoom,
})

// Tilemap rendering with source rectangle
drawImage({
    c: this.gameRef.ctx,
    x: tileX * tileSize,
    y: tileY * tileSize,
    img: this.tilesheet,
    sourceX: tileId * tileSize,
    sourceY: 0,
    sourceWidth: tileSize,
    sourceHeight: tileSize,
    width: tileSize,
    height: tileSize,
    cameraPos: this.gameRef.cameraPos,
    zoom: this.gameRef.cameraZoom,
})
```

---

## Level Editor

The engine includes a visual level editor system in `src/engine/tools/levelEditor/`.

### Using the Level Editor

1. **Extend BaseLevelEditor** for your game:

```typescript
import { BaseLevelEditor } from "../../../engine/tools/levelEditor/BaseLevelEditor"
import { EditorConfig, ObjectDefinition } from "../../../engine/tools/levelEditor/EditorTypes"

export class MyGameEditor extends BaseLevelEditor {
    protected getEditorConfig(): EditorConfig {
        return {
            storageKey: 'my-game-levels',
            currentLevelKey: 'my-game-current-level',
            objectRegistry: MY_OBJECT_REGISTRY,
            objectRegistryOrder: ['wall', 'platform', 'spawn', 'exit'],
            levelKeys: {
                editor: 'level-editor',
                test: 'test-level',
                menu: 'start-screen',
            },
            defaultLevelSettings: {
                levelWidth: 1200,
                levelHeight: 800,
                nextLevel: 'start-screen',
            },
        }
    }
}
```

2. **Define an object registry**:

```typescript
export const MY_OBJECT_REGISTRY: Record<string, ObjectDefinition> = {
    wall: {
        primitive: 'box',
        toolLabel: 'Wall',
        creationMode: 'single-click',
        arrayKey: 'walls',
        zIndex: 0,
        defaults: { width: 100, height: 50, color: '#333' },
        properties: [
            { key: 'x', label: 'X', type: 'number' },
            { key: 'y', label: 'Y', type: 'number' },
            { key: 'width', label: 'Width', type: 'number', min: 10 },
            { key: 'height', label: 'Height', type: 'number', min: 10 },
            { key: 'color', label: 'Color', type: 'color' },
        ],
        colorKey: 'color',
    },
    spawn: {
        primitive: 'point',
        toolLabel: 'Spawn Point',
        creationMode: 'single-click',
        arrayKey: 'spawnPoints',
        zIndex: 10,
        defaults: { type: 'player' },
        fixedColor: '#00ff00',
        properties: [
            { key: 'x', label: 'X', type: 'number' },
            { key: 'y', label: 'Y', type: 'number' },
        ],
    },
}
```

3. **Register editor as a level** in startGame.ts

See `src/games/the-squeeze/editor/` for a complete example of a game-specific editor implementation.

---

## Quick Reference

### Level Lifecycle
`preload()` → `initialize()` → `update()`/`draw()` loop → `tearDown()`

### Physics Setup
```typescript
this.gameRef.initializePhysics()
entity.initialize()
this.gameRef.addToWorld(entity.body)
```

### Camera Setup
```typescript
this.followCam = new FollowCam({ key: 'cam', gameRef: this.gameRef })
this.followCam.levelWidth = this.levelWidth
this.followCam.levelHeight = this.levelHeight
this.followCam.initialize()
// In update: this.followCam.setTarget(pos); this.followCam.update()
```

### Level Transition
```typescript
this.gameRef.loadLevel('level-02')
```

### Collision Tags
```typescript
// On entity: options = { tags: { player: true } }
// In collision: otherBody.plugin.basedRef()?.options?.tags?.enemy
```
