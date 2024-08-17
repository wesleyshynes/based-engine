import PhysBox from "../../../engine/physicsObjects/PhysBox";

export class ExitDoor extends PhysBox {
    x: number = 0
    y: number = 0

    width: number = 100
    height: number = 100

    color: string = 'yellow'

    doorPath: string = 'start-screen'

    options = {
        tags: {}
    }

    body: any;

    bodyOptions = {
        label: 'exitDoor',
        isStatic: true,
        isSensor: true
    }

    collisionStartFn = (o: any) => {
        const otherBody = o.plugin.basedRef()
        if (otherBody && otherBody.options && otherBody.options.tags) {
            this.gameRef.loadLevel(this.doorPath)           
        }
    }

    collisionEndFn = (o: any) => {}

    async preload() { }
    initialize() {
        this.initializeBody()
        this.setCenter()
    }
    update() {}
    draw() {
        this.drawPhysicsBody()
    }
    tearDown() { }

}