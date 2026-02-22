import { LEVEL_04 } from "../constants/level04Constants";
import { SqueezeBaseLevel } from "./SqueezeBaseLevel";
import BGMusic from '../../../assets/the-squeeze/tunetank.com_6404_beats-of-fury_by_pineapplemusic__4.mp3'

export class Level04 extends SqueezeBaseLevel {

    levelWidth: number = LEVEL_04.levelWidth
    levelHeight: number = LEVEL_04.levelHeight

    nextLevel: string = LEVEL_04.nextLevel
    
    playerStartPosition: any = LEVEL_04.playerStart
    levelWalls: any[] = []
    _levelBoundaries: any[] = LEVEL_04.boundaries
    _levelWalls: any[] = LEVEL_04.walls
    pushBoxes: any[] = []
    _pushBoxes: any[] = LEVEL_04.pushBoxes
    movingPlatforms: any[] = []
    _movingPlatforms: any[] = LEVEL_04.movingPlatforms
    exitDoors: any[] = []
    _exitDoors: any[] = LEVEL_04.exitDoors

    _collectibles: any[] = LEVEL_04.collectibles || []

    bgMusicTrack: any = BGMusic

} 