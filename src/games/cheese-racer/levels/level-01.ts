import BGMusic from '../../../assets/the-squeeze/tunetank.com_5630_ready-to-play_by_alexey-anisimov__1.mp3'
import { BasedLevel } from "../../../engine/BasedLevel";
import { FollowCam } from '../../../engine/cameras/FollowCam';
import { createSprite, drawBox, drawImage, drawSVG, rotateDraw } from '../../../engine/libs/drawHelpers';
import PhysBox from '../../../engine/physicsObjects/PhysBox';
import { DARK_COLOR, LIGHT_COLOR, PRIMARY_COLOR, SECONDARY_COLOR } from '../constants/gameColors';
import { MainPlayer } from '../entities/mainPlayer';
import CheesePiece from '../../../assets/cheese-racer/cheese-piece.svg'

export class Level01 extends BasedLevel {

    physics: any

    levelWidth: number = 800
    levelHeight: number = 600

    nextLevel: string = 'credits-screen'

    playerStartPosition: any = { x: 100, y: 100 }

    bgMusicTrack: any = BGMusic

    // Camera related stuff
    miniMapActive: boolean = true
    followCam: any;

    mainPlayer: any

    littleBox: any
    cheeseX: number = 400
    cheeseY: number = 400

    cheesePiece: any

    async preload() {
        this.cheesePiece = await createSprite({
            c: this.gameRef.ctx,
            sprite: CheesePiece,
            // img: CheesePiece,
            sx: 0,
            sy: 0,
            sWidth: 100,
            sHeight: 100,
            dx: 0,
            dy: 0,
            dWidth: 100,
            dHeight: 100,
            frame: 0,
            lastUpdate: 0,
            updateDiff: 1000 / 60 * 10
        })

        console.log('cheesePiece', this.cheesePiece)

    }
    initialize() {
        this.gameRef.initializePhysics()
        this.gameRef.physics.world.gravity.y = 0

        this.followCam = new FollowCam({ key: 'followCam', gameRef: this.gameRef })
        this.followCam.levelWidth = this.levelWidth
        this.followCam.levelHeight = this.levelHeight
        this.followCam.zoomSetting = this.gameRef.touchMode ? 0.7 : 1.0
        this.followCam.cameraZoomSpeed = .03
        this.followCam.cameraSpeed = 50
        this.followCam.initialize()


        // setup level and players
        this.mainPlayer = new MainPlayer({
            key: 'mainPlayer',
            gameRef: this.gameRef,
        })
        this.mainPlayer.x = this.playerStartPosition.x
        this.mainPlayer.y = this.playerStartPosition.y
        this.mainPlayer.color = PRIMARY_COLOR
        this.mainPlayer.radius = 25
        this.mainPlayer.initialize()
        this.gameRef.addToWorld(this.mainPlayer.body)

        // 
        this.littleBox = new PhysBox({
            key: 'littleBox',
            gameRef: this.gameRef,
        })
        this.littleBox.x = 300
        this.littleBox.y = 300
        this.littleBox.width = 50
        this.littleBox.height = 50
        this.littleBox.color = SECONDARY_COLOR
        this.littleBox.bodyOptions = {
            label: `pushBox`,
            inertia: Infinity,
            density: 5,
            friction: 0.9
        }
        this.littleBox.initialize()
        this.gameRef.addToWorld(this.littleBox.body)

    }
    update() {
        this.handlePhysics()
    }

    handlePhysics() {
        if (this.gameRef.updatePhysics()) {
            this.onPhysicsUpdate()
        }
    }
    onPhysicsUpdate() {
        // do something on physics tick
        this.updateCamera()
        // this.movingPlatforms.forEach((plat: any) => {
        //     plat.update()
        // })
        this.mainPlayer.update()
        this.littleBox.update()
    }


    updateCamera() {
        this.followCam.setTarget({
            x: this.levelWidth / 2,
            y: this.levelHeight / 2,
        })

        const activeTarget: any = this.mainPlayer.body.position
        if (activeTarget) {
            this.followCam.setTarget(activeTarget)
        }

        this.followCam.setFullScreen(this.miniMapActive)
        this.followCam.update()
        this.gameRef.handleCameraShake()
    }


    draw(): void {
        this.gameRef.ctx.beginPath();
        this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight);
        this.gameRef.ctx.fillStyle = DARK_COLOR;
        this.gameRef.ctx.fill();


        // draw the level
        // level bg
        drawBox({
            c: this.gameRef.ctx,
            x: 0,
            y: 0 ,
            width: this.levelWidth,
            height: this.levelHeight,
            fillColor: LIGHT_COLOR,
            cameraPos: this.gameRef.cameraPos,
            zoom: this.gameRef.cameraZoom
        })

        // draw the player
        this.mainPlayer.draw()

        // draw the little box
        this.littleBox.draw()


        rotateDraw({
            c: this.gameRef.ctx,
            x: (this.cheeseX - this.cheesePiece.sWidth / 2),
            y: (this.cheeseY - this.cheesePiece.sHeight / 2),
            a: 0,
            cameraPos: this.gameRef.cameraPos,
            zoom: this.gameRef.cameraZoom
        }, () => {
            // this.sprite.flipX = this.velocity.x < 0
            drawSVG(this.cheesePiece, { zoom: this.gameRef.cameraZoom })
        })




        // Add any additional drawing logic here
    }
    onResize() { }
    tearDown() { }
}