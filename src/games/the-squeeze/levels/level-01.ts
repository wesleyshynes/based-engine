import { LEVEL_01_BOUNDARIES, LEVEL_01_EXIT_DOORS, LEVEL_01_PUSH_BOXES, LEVEL_01_WALLS, LEVEL_01_WIDTH, LEVEL_01_HEIGHT, LEVEL_01_NEXT_LEVEL } from "../constants/level01Constants";
import { SqueezeBaseLevel } from "./SqueezeBaseLevel";
import BGMusic from '../../../assets/the-squeeze/tunetank.com_5630_ready-to-play_by_alexey-anisimov__1.mp3'

export class Level01 extends SqueezeBaseLevel {

    levelWidth: number = LEVEL_01_WIDTH
    levelHeight: number = LEVEL_01_HEIGHT

    nextLevel: string = LEVEL_01_NEXT_LEVEL

    playerStartPosition: any = { x: 100, y: 100 }

    levelWalls: any[] = []
    _levelBoundaries: any[] = LEVEL_01_BOUNDARIES
    _levelWalls: any[] = LEVEL_01_WALLS
    pushBoxes: any[] = []
    _pushBoxes: any[] = LEVEL_01_PUSH_BOXES
    exitDoors: any[] = []
    _exitDoors: any[] = LEVEL_01_EXIT_DOORS

    bgMusicTrack: any = BGMusic

} 