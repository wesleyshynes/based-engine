import { LEVEL_01_BOUNDARIES, LEVEL_01_EXIT_DOORS, LEVEL_01_PUSH_BOXES, LEVEL_01_WALLS } from "../constants/level01Constants";
import { SqueezeBaseLevel } from "./SqueezeBaseLevel";
import BGMusic from '../../../assets/the-squeeze/tunetank.com_5630_ready-to-play_by_alexey-anisimov__1.mp3'

export class Level01 extends SqueezeBaseLevel {

    levelWidth: number = 800
    levelHeight: number = 600

    nextLevel: string = 'level-02'

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