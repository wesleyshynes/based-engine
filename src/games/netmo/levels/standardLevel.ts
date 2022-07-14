import { io } from "socket.io-client";
import { BasedLevel } from "../../../engine/BasedLevel";
import { XYCoordinateType } from "../../../engine/libs/mathHelpers";
import { NetmoPlayer } from "../entities/NetmoPlayer";

const SERVER_URL = 'http://10.0.0.95:3000'

export class StandardLevel extends BasedLevel {
    levelWidth: number = 2000
    levelHeight: number = 2000

    player: any;

    socketRef: any;
    roomId: string = 'room1'
    lastMessage: number = 0
    messageDelay: number = 300

    receivedMessages: any[] = []

    otherPlayers: { [key: string]: any } = {}

    async preload() {
        this.gameRef.drawLoading('Connecting', .1)
        // connect to game server
        this.socketRef = await new Promise((resolve, reject) => {
            const socket = io(SERVER_URL);
            socket.on('connect', () => {
                // socketIo = socket;
                console.log('Socket-io connected');
                console.log(socket)
                this.socketRef = socket;
                // Connect to the room
                // connectToRm(socket.id);
                // setupSendMsgListener(socket.id)
                // receiveMessage(socket);
                resolve(socket)
            });
        })

        // Connect to room
        const connectRoomRes = await fetch(`${SERVER_URL}/api/chat/connect-socket-room/${this.socketRef.id}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json()).catch(err => err)
        console.log(connectRoomRes)
        console.log('connected to room')

        this.socketRef.on('remove-player', (playerId: string) => {
            delete this.otherPlayers[playerId]
        })


        // Setup message listener
        this.socketRef.on('emit-msg', (msg: any) => {
            console.log('message in')
            console.log(msg)
            const {
                content,
                senderName,
                // timestamp,
            } = msg
            this.receivedMessages.push(msg)
            if (!this.otherPlayers[senderName]) {
                this.otherPlayers[senderName] = new NetmoPlayer({
                    key: senderName,
                    gameRef: this.gameRef,
                })
                this.otherPlayers[senderName].playerName = senderName
                this.otherPlayers[senderName].color = 'red'
                this.otherPlayers[senderName].x = content.position.x
                this.otherPlayers[senderName].y = content.position.y
                this.otherPlayers[senderName].initialize()
                this.sendMessage(this.player.target)
            }
            this.otherPlayers[senderName].setTarget({
                x: content.target.x,
                y: content.target.y,
            })

        });
    }

    sendMessage(message: XYCoordinateType) {
        if (this.socketRef && this.gameRef.lastUpdate - this.messageDelay > this.lastMessage) {
            console.log(message)
            this.lastMessage = this.gameRef.lastUpdate
            fetch(`${SERVER_URL}/api/chat/emit-message`, {
                method: 'POST',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    socketId: this.socketRef.id,
                    message: {
                        target: {
                            x: message.x,
                            y: message.y,
                        },
                        position: {
                            x: this.player.x,
                            y: this.player.y,
                        }
                    }
                })
            }).then(res => res.json).then((res) => {
                this.receivedMessages.push(res)
            }).catch(err => {
                console.log(err)
            })
        }
    }

    initialize(): void {
        this.player = new NetmoPlayer({
            key: 'player',
            gameRef: this.gameRef,
        })
        this.player.playerName = 'YOU'
        this.player.initialize()

        this.socketRef.emit('created-char', {
            target: {
                x: this.player.target.x,
                y: this.player.target.y,
            },
            position: {
                x: this.player.x,
                y: this.player.y,

            }
        })
    }

    handleInput() {
        if (this.gameRef.mouseInfo.mouseDown) {
            this.player.setTarget({
                x: this.gameRef.mouseInfo.x,
                y: this.gameRef.mouseInfo.y,
            })
            this.sendMessage(this.player.target)
        }
    }

    update(): void {
        this.handleInput()
        Object.keys(this.otherPlayers).forEach(key => {
            this.otherPlayers[key].update()
        })
        this.player.update()
    }

    draw(): void {
        this.gameRef.ctx.beginPath()
        this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
        this.gameRef.ctx.fillStyle = '#222'
        this.gameRef.ctx.fill()

        Object.keys(this.otherPlayers).forEach(key => {
            this.otherPlayers[key].draw()
        })

        this.player.draw()
    }

    tearDown(): void { }
} 