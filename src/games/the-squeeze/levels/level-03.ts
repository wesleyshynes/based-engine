import { LEVEL_03 } from "../constants/level03Constants";
import { SqueezeBaseLevel } from "./SqueezeBaseLevel";
import BGMusic from '../../../assets/the-squeeze/tunetank.com_5379_coupe_by_cloudsystem__3.mp3'

export class Level03 extends SqueezeBaseLevel {

    levelWidth: number = LEVEL_03.levelWidth
    levelHeight: number = LEVEL_03.levelHeight

    nextLevel: string = LEVEL_03.nextLevel

    playerStartPosition: any = LEVEL_03.playerStart

    levelWalls: any[] = []
    _levelBoundaries: any[] = LEVEL_03.boundaries
    _levelWalls: any[] = LEVEL_03.walls
    pushBoxes: any[] = []
    _pushBoxes: any[] = LEVEL_03.pushBoxes
    movingPlatforms: any[] = []
    _movingPlatforms: any[] = LEVEL_03.movingPlatforms
    exitDoors: any[] = []
    _exitDoors: any[] = LEVEL_03.exitDoors

    bgMusicTrack: any = BGMusic
  
} 