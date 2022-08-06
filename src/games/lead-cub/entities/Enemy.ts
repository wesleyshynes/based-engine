import PhysBox from "../../../engine/physicsObjects/PhysBox";
import Physics from 'matter-js';
import { drawCircle, rotateDraw } from "../../../engine/libs/drawHelpers";
import { radToDeg } from "../../../engine/libs/mathHelpers";

export class Enemy extends PhysBox {

    width: number = 70
    height: number = 70
    color: string = 'pink'

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
        collisionFilter: {group: this.collisionGroup},
        // restitution: 0,
    }

    // sensor stuff
    sensor: any;
    sensorRadius: number = 200

    // composite stuff 
    compositeRef: any;

    collisionStartFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        console.log(otherBody)
        if (otherBody && otherBody.options && otherBody.options.tags) {
            if (otherBody.options.tags.death) {
                this.active = false
                this.gameRef.removeFromWorld(this.body)
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

        // setup sensor
        this.sensor = Physics.Bodies.circle(this.x, this.y, this.sensorRadius, {
            label: 'enemySensor',
            isSensor: true,
            collisionFilter: {group: this.collisionGroup},
            density: 0.0000000001,
            // restitution: 0,
            plugin: {
                collisionStart: (x: any) => {
                    console.log('sensor collision start', x)
                    const otherBody = x.plugin.basedRef()
                    if(otherBody && otherBody.options && otherBody.options.tags) {
                        if(otherBody.options.tags.player) {
                            // Physics.Body.setVelocity(this.sensor, {
                            //     x: 0,
                            //     y: -80
                            // })
                        }
                    }
                },
                collisionEnd: (x: any) => {
                    console.log('sensor collision end', x)
                },
                basedRef: () => this,
            }
        });
        this.sensor.allowGravity = false
        this.initializeBody()

        this.body.allowGravity = false
        // this.setCenter()

        
        // setup composite
        this.compositeRef = Physics.Composite.create({ label: 'enemyComposite' })
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

        console.log(this.compositeRef)
        console.log(this.sensor)
        console.log(this.body)

    }

    update() {
        // fixes stuck bounce pad
    }

    draw() {
        // this.color = this.groundCount > 0 ? 'blue' : 'red'

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

        this.drawPhysicsBody()
    }

    tearDown() { }

}