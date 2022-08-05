import PhysBox from "../../../engine/physicsObjects/PhysBox";
// import Physics from 'matter-js';

export default class PickUp extends PhysBox {
    x: number = 0
    y: number = 0

    width: number = 30
    height: number = 30

    active: boolean = true

    color: string = 'yellow'

    options = {
        tags: {
            pickUp: true
        }
    }

    bodyOptions = {
        label: 'pickUp',
        inertia: Infinity,
    }
    
    pickUpFn: (o: any) => void = (o) => {}

    collisionStartFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            if (otherBody.options.tags.player) {
                // launch up
                this.handlePickup(otherBody)
            }
        }
    }

    collisionEndFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            if (otherBody.options.tags.player) {
                // dunno
            }
        }
    }

    async preload() { }
    initialize() {
        this.initializeBody()
        this.setCenter()
    }
    update() { }
    draw() {
        if(this.active) {
            this.drawPhysicsBody()
        }
    }
    tearDown() { }

    handlePickup(otherBody: any) {
        this.pickUpFn(otherBody)
        this.gameRef.removeFromWorld(this.body)
        this.active = false
    }


}