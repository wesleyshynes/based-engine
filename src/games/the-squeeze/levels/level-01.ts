import { LEVEL_01 } from "../constants/level01Constants";
import { SqueezeBaseLevel } from "./SqueezeBaseLevel";
import BGMusic from '../../../assets/the-squeeze/tunetank.com_5630_ready-to-play_by_alexey-anisimov__1.mp3'

export class Level01 extends SqueezeBaseLevel {

    levelWidth: number = LEVEL_01.levelWidth
    levelHeight: number = LEVEL_01.levelHeight

    nextLevel: string = LEVEL_01.nextLevel

    playerStartPosition: any = LEVEL_01.playerStart

    levelWalls: any[] = []
    _levelBoundaries: any[] = LEVEL_01.boundaries
    _levelWalls: any[] = LEVEL_01.walls
    levelPolygons: any[] = []
    _levelPolygons: any[] = LEVEL_01.polygons || []
    pushBoxes: any[] = []
    _pushBoxes: any[] = LEVEL_01.pushBoxes
    movingPlatforms: any[] = []
    _movingPlatforms: any[] = LEVEL_01.movingPlatforms
    exitDoors: any[] = []
    _exitDoors: any[] = LEVEL_01.exitDoors
    hazardBlocks: any[] = []
    _hazardBlocks: any[] = LEVEL_01.hazardBlocks

    bgMusicTrack: any = BGMusic

} 