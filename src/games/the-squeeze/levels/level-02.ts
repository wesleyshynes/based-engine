import { LEVEL_02 } from "../constants/level02Constants";
import { SqueezeBaseLevel } from "./SqueezeBaseLevel";
import BGMusic from '../../../assets/the-squeeze/tunetank.com_5230_day-party_by_cloudsystem__2.mp3'

export class Level02 extends SqueezeBaseLevel {

    levelWidth: number = LEVEL_02.levelWidth
    levelHeight: number = LEVEL_02.levelHeight

    nextLevel: string = LEVEL_02.nextLevel

    playerStartPosition: any = LEVEL_02.playerStart

    levelWalls: any[] = []
    _levelBoundaries: any[] = LEVEL_02.boundaries
    _levelWalls: any[] = LEVEL_02.walls
    pushBoxes: any[] = []
    _pushBoxes: any[] = LEVEL_02.pushBoxes
    movingPlatforms: any[] = []
    _movingPlatforms: any[] = LEVEL_02.movingPlatforms
    exitDoors: any[] = []
    _exitDoors: any[] = LEVEL_02.exitDoors

    bgMusicTrack: any = BGMusic
  
} 