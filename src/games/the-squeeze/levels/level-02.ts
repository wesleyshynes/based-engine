import { LEVEL_02_BOUNDARIES, LEVEL_02_EXIT_DOORS, LEVEL_02_PUSH_BOXES, LEVEL_02_WALLS, LEVEL_02_WIDTH, LEVEL_02_HEIGHT } from "../constants/level02Constants";
import { SqueezeBaseLevel } from "./SqueezeBaseLevel";
import BGMusic from '../../../assets/the-squeeze/tunetank.com_5230_day-party_by_cloudsystem__2.mp3'

export class Level02 extends SqueezeBaseLevel {

    levelWidth: number = LEVEL_02_WIDTH
    levelHeight: number = LEVEL_02_HEIGHT

    nextLevel: string = 'level-03'

    playerStartPosition: any = { x: 64, y: 535 }

    levelWalls: any[] = []
    _levelBoundaries: any[] = LEVEL_02_BOUNDARIES
    _levelWalls: any[] = LEVEL_02_WALLS
    pushBoxes: any[] = []
    _pushBoxes: any[] = LEVEL_02_PUSH_BOXES
    exitDoors: any[] = []
    _exitDoors: any[] = LEVEL_02_EXIT_DOORS

    bgMusicTrack: any = BGMusic
  
} 