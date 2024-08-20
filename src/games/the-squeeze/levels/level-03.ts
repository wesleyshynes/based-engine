import { LEVEL_03_BOUNDARIES, LEVEL_03_EXIT_DOORS, LEVEL_03_PUSH_BOXES, LEVEL_03_WALLS } from "../constants/level03Constants";
import { SqueezeBaseLevel } from "./SqueezeBaseLevel";
import BGMusic from '../../../assets/the-squeeze/tunetank.com_5379_coupe_by_cloudsystem__3.mp3'
export class Level03 extends SqueezeBaseLevel {

    levelWidth: number = 800
    levelHeight: number = 600

    nextLevel: string = 'level-04'

    playerStartPosition: any = { x: 70, y: 520 }

    levelWalls: any[] = []
    _levelBoundaries: any[] = LEVEL_03_BOUNDARIES
    _levelWalls: any[] = LEVEL_03_WALLS
    pushBoxes: any[] = []
    _pushBoxes: any[] = LEVEL_03_PUSH_BOXES
    exitDoors: any[] = []
    _exitDoors: any[] = LEVEL_03_EXIT_DOORS

    bgMusicTrack: any = BGMusic
  
} 