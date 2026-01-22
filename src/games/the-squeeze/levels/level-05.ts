import { LEVEL_05 } from "../constants/level05Constants";
import { SqueezeBaseLevel } from "./SqueezeBaseLevel";
import BGMusic from '../../../assets/the-squeeze/tunetank.com_6408_rich-slide_by_cloudsystem_5.mp3'

export class Level05 extends SqueezeBaseLevel {

    levelWidth: number = LEVEL_05.levelWidth
    levelHeight: number = LEVEL_05.levelHeight

    nextLevel: string = LEVEL_05.nextLevel
    
    playerStartPosition: any = LEVEL_05.playerStart
    levelWalls: any[] = []
    _levelBoundaries: any[] = LEVEL_05.boundaries
    _levelWalls: any[] = LEVEL_05.walls
    pushBoxes: any[] = []
    _pushBoxes: any[] = LEVEL_05.pushBoxes
    movingPlatforms: any[] = []
    _movingPlatforms: any[] = LEVEL_05.movingPlatforms
    exitDoors: any[] = []
    _exitDoors: any[] = LEVEL_05.exitDoors

    bgMusicTrack: any = BGMusic

} 