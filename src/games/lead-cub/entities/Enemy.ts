import PhysBox from "../../../engine/physicsObjects/PhysBox";
import Physics from 'matter-js';
import { drawCircle, rotateDraw } from "../../../engine/libs/drawHelpers";
import { radToDeg } from "../../../engine/libs/mathHelpers";

export class Enemy extends PhysBox {

    width: number = 70
    height: number = 70
    color: string = 'pink'
    colorPool: string[] = ['red', 'green', 'blue', 'yellow', 'pink', 'purple', 'orange', 'cyan', 'magenta', 'lime', 'teal', 'indigo', 'violet', 'brown', 'olive', 'maroon', 'navy', 'turquoise', 'silver', 'gray']
    health: number = 5

    speed: number = 3

    options = {
        tags: {
            enemy: true,
        }
    }

    active: boolean = true

    collisionGroup: any = Physics.Body.nextGroup(true)

    bodyOptions = {
        label: 'enemyBody',
        inertia: Infinity,
        collisionFilter: { group: this.collisionGroup },
        // restitution: 0,
    }

    // sensor stuff
    sensor: any;
    sensorRadius: number = 200

    rightSensor: any;
    rightGroundCount: number = 0
    movementSensorSize: number = 20

    // composite stuff 
    compositeRef: any;

    collisionStartFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            if (otherBody.options.tags.death) {
                this.active = false
                this.gameRef.removeFromWorld(this.compositeRef)
            }

            if (otherBody.options.tags.bullet) {
                this.health--
                if(this.health <= 0) {
                    this.active = false
                    this.gameRef.removeFromWorld(this.compositeRef)
                }
            }
        }
    }

    collisionEndFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            // if (otherBody.options.tags.ground) {}
        }
    }

    async preload() { }

    initialize() {

        this.health = this.colorPool.length - 1

        // setup sensor
        this.sensor = Physics.Bodies.circle(this.x, this.y, this.sensorRadius, {
            label: 'enemySensor',
            isSensor: true,
            collisionFilter: { group: this.collisionGroup },
            density: 0.0000000001,
            // restitution: 0,
            plugin: {
                collisionStart: (x: any) => {
                    console.log('sensor collision start', x)
                    const otherBody = x.plugin.basedRef()
                    if (otherBody && otherBody.options && otherBody.options.tags) {
                        if (otherBody.options.tags.death) {
                            Physics.Body.setVelocity(this.body, {
                                x: 50,
                                y: this.body.velocity.y
                            })
                        }
                    }
                },
                collisionEnd: (x: any) => {
                    console.log('sensor collision end', x)
                },
                basedRef: () => ({
                    options: {
                        tags: {
                            sensor: true,
                        }
                    },
                }),
            }
        });

        this.rightSensor = Physics.Bodies.circle(this.x, this.y, this.movementSensorSize, {
            label: 'enemyRightSensor',
            isSensor: true,
            collisionFilter: { group: this.collisionGroup },
            density: 0.0000000001,
            // restitution: 0,
            plugin: {
                collisionStart: (x: any) => {
                    console.log('right sensor collision start', x)
                    const otherBody = x.plugin.basedRef()
                    if (otherBody && otherBody.options && otherBody.options.tags) {
                        if (otherBody.options.tags.ground) {
                            this.rightGroundCount++
                        }
                    }
                },
                collisionEnd: (x: any) => {
                    console.log('right sensor collision end', x)
                    const otherBody = x.plugin.basedRef()
                    if (otherBody && otherBody.options && otherBody.options.tags) {
                        if (otherBody.options.tags.ground) {
                            this.rightGroundCount--
                            if(this.rightGroundCount <= 0) {
                                // move left
                                this.speed = -3
                            }
                        }                        
                    }
                },
                basedRef: () => ({
                    options: {
                        tags: {
                            sensor: true,
                        }
                    },
                }),
            }
        });



        this.initializeBody()

        this.body.allowGravity = false
        // this.setCenter()


        // setup composite
        this.compositeRef = Physics.Composite.create({ label: 'enemyComposite' })
        Physics.Composite.add(this.compositeRef, this.body)
        Physics.Composite.add(this.compositeRef, this.sensor)
        Physics.Composite.add(this.compositeRef, this.rightSensor)

        const sensorMount = Physics.Constraint.create({
            bodyB: this.body,
            pointB: { x: 0, y: 0 },
            // pointB: { x: wheelBOffset, y: wheelYOffset },
            bodyA: this.sensor,
            stiffness: 1,
            length: 0
        })

        Physics.Composite.add(this.compositeRef, sensorMount)

        const rightSensorMount = Physics.Constraint.create({
            bodyB: this.body,
            pointB: { x:this.width/2 + 5 , y: this.height/2 + 5 },
            bodyA: this.rightSensor,
            stiffness: 1,
            length: 0
        })
        Physics.Composite.add(this.compositeRef, rightSensorMount)

        console.log(this.compositeRef)
        console.log(this.sensor)
        console.log(this.body)

    }

    update() {
        // fixes stuck bounce pad
        Physics.Body.setVelocity(this.body, {
            x: this.speed,
            y: this.body.velocity.y
        })
    }

    draw() {
        // this.color = this.groundCount > 0 ? 'blue' : 'red'

        if(this.health > 0) {
            this.color = this.colorPool[this.health]
        }

        if (!this.active) return

        rotateDraw({
            c: this.gameRef.ctx,
            x: this.sensor.position.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
            y: this.sensor.position.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
            a: radToDeg(this.sensor.angle)
        }, () => {

            drawCircle({
                c: this.gameRef.ctx,
                x: this.bodyCenter.x,
                y: this.bodyCenter.y,
                radius: this.sensorRadius * this.gameRef.cameraZoom,
                fillColor: 'rgba(100,100,100,0.5)',
                // fillColor: 'red',
            })
        })

        rotateDraw({
            c: this.gameRef.ctx,
            x: this.rightSensor.position.x * this.gameRef.cameraZoom + this.gameRef.cameraPos.x,
            y: this.rightSensor.position.y * this.gameRef.cameraZoom + this.gameRef.cameraPos.y,
            a: radToDeg(this.sensor.angle)
        }, () => {

            drawCircle({
                c: this.gameRef.ctx,
                x: this.bodyCenter.x,
                y: this.bodyCenter.y,
                radius: this.movementSensorSize * this.gameRef.cameraZoom,
                fillColor: 'rgba(100,100,100,0.5)',
                // fillColor: 'red',
            })
        })

        this.drawPhysicsBody()
    }

    tearDown() { }

}