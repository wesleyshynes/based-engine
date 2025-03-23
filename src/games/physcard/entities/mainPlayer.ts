import { drawCircle } from "../../../engine/libs/drawHelpers";
import { distanceBetween, normalizeVector, radToDeg, XYCoordinateType } from "../../../engine/libs/mathHelpers";
import PhysBall from "../../../engine/physicsObjects/PhysBall";
import Physics from 'matter-js'

export class MainPlayer extends PhysBall {
    x: number = 100
    y: number = 100

    color: string = 'white'

    radius: number = 50

    baseSpeed: number = 8

    options = {
        tags: {
            player: true,
        }
    }

    // sensor stuff
    sensor: any;
    sensorRadius: number = 100

    sensorOptions = {
        tags: {
            sensor: true,
            playerSensor: true,
        }
    }

    // composite stuff 
    compositeRef: any;
    collisionGroup: any = Physics.Body.nextGroup(true)

    bodyOptions = {
        label: 'player',
        inertia: Infinity,
        collisionFilter: { group: this.collisionGroup },
        // friction: 0,
    }

    targetPosition: XYCoordinateType = {
        x: 0,
        y: 0
    }
    targetThreshold: number = 5

    // mouseSprite: any

    playerInRadius: boolean = false

    collisionStartFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            // console.log('collision start', otherBody)
            if (otherBody.options.tags.wall) {
                console.log('wall collision')
            }
            // this.gameRef.shakeCamera(5 * (this.radius / this.originalRadius))

        }
    }

    collisionEndFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            if (otherBody.options.tags.wall) {
                console.log('wall collision end')
            }
        }
    }

    sensorCollisionStartFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            if (otherBody.options.tags.playerSensor) {
                this.playerInRadius = true
            }
        }
    }

    sensorCollisionEndFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            if (otherBody.options.tags.playerSensor) {
                this.playerInRadius = false
            }
        }
    }

    async preload() { }

    initialize() {
        // setup sensor
        this.sensor = Physics.Bodies.circle(this.x, this.y, this.sensorRadius, {
            label: `sensor-${this.objectKey}`,
            isSensor: true,
            collisionFilter: { group: this.collisionGroup },
            density: 0.0000000001,
            // restitution: 0,
            plugin: {
                collisionStart: (x: any) => {
                    // console.log('sensor collision start', x
                    this.sensorCollisionStartFn(x)
                },
                collisionEnd: (x: any) => {
                    // console.log('sensor collision end', x)
                    this.sensorCollisionEndFn(x)
                },
                basedRef: () => ({
                    options: this.sensorOptions
                }),
            }
        });

        this.initializeBody()
        // this.setCenter()

        this.compositeRef = Physics.Composite.create({ label: `player-composite-${this.objectKey}` })
        Physics.Composite.add(this.compositeRef, this.body)
        Physics.Composite.add(this.compositeRef, this.sensor)

        const sensorMount = Physics.Constraint.create({
            bodyB: this.body,
            pointB: { x: 0, y: 0 },
            // pointB: { x: wheelBOffset, y: wheelYOffset },
            bodyA: this.sensor,
            stiffness: 1,
            length: 0
        })

        Physics.Composite.add(this.compositeRef, sensorMount)


    }

    update() {
        // this.handleKeys()
        // this.validatePosition()
        this.moveTowardsTarget()
    }

    setTargetPosition(target: XYCoordinateType) {
        this.targetPosition = target
    }

    moveTowardsTarget() {
        const distanceToTarget = distanceBetween(this.body.position, this.targetPosition)
        if (distanceToTarget < this.targetThreshold) {
            Physics.Body.setVelocity(this.body, {
                x: 0,
                y: 0
            })
            return
        }
        const moveX = this.targetPosition.x - this.body.position.x
        const moveY = this.targetPosition.y - this.body.position.y
        const activeSpeed = this.baseSpeed

        if (moveX !== 0 || moveY !== 0) {
            Physics.Body.setVelocity(this.body, normalizeVector({
                y: moveY,
                x: moveX
            }, activeSpeed))
        } else {
            Physics.Body.setVelocity(this.body, {
                x: 0,
                y: 0
            })
        }
    }

    handleKeys() {
        const pressedKeys = this.gameRef.pressedKeys
        let moveX = 0
        let moveY = 0

        const activeSpeed = this.baseSpeed

        if (pressedKeys['KeyA'] || pressedKeys['ArrowLeft']) {
            moveX -= activeSpeed
        }
        if (pressedKeys['KeyD'] || pressedKeys['ArrowRight']) {
            moveX += activeSpeed
        }
        if (pressedKeys['KeyW'] || pressedKeys['ArrowUp']) {
            moveY -= activeSpeed
        }
        if (pressedKeys['KeyS'] || pressedKeys['ArrowDown']) {
            moveY += activeSpeed
        }


        if (moveX !== 0 || moveY !== 0) {
            Physics.Body.setVelocity(this.body, normalizeVector({
                y: moveY,
                x: moveX
            }, activeSpeed))
        } else {
            Physics.Body.setVelocity(this.body, {
                x: 0,
                y: 0
            })
        }
    }

    drawSensor() {
        this.cameraDraw(() => {
            drawCircle({
                c: this.gameRef.ctx,
                x: this.bodyCenter.x,
                y: this.bodyCenter.y,
                radius: this.sensorRadius,
                fillColor: 'rgba(233, 124, 0, 0.5)',
                // fillColor: 'red',
                zoom: this.gameRef.cameraZoom
            })
        })
    }

    draw() {
        this.drawSensor()
        this.drawShadows()
        this.drawPhysicsBody()
    }
}