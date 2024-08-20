import { SqueezeBaseLevel } from "./SqueezeBaseLevel";
import BGMusic from '../../../assets/the-squeeze/tunetank.com_6408_rich-slide_by_cloudsystem_5.mp3'
import { LEVEL_05_BOUNDARIES, LEVEL_05_EXIT_DOORS, LEVEL_05_MOVING_PLATFORMS, LEVEL_05_PUSH_BOXES, LEVEL_05_WALLS } from "../constants/level05Constants";

export class Level05 extends SqueezeBaseLevel {

    levelWidth: number = 1600
    levelHeight: number = 1200

    nextLevel: string = 'credits-screen'
    
    playerStartPosition: any = { x: 800, y: 88 }
    levelWalls: any[] = []
    _levelBoundaries: any[] = LEVEL_05_BOUNDARIES
    _levelWalls: any[] = LEVEL_05_WALLS
    pushBoxes: any[] = []
    _pushBoxes: any[] = LEVEL_05_PUSH_BOXES
    movingPlatforms: any[] = []
    _movingPlatforms: any[] = LEVEL_05_MOVING_PLATFORMS
    exitDoors: any[] = []
    _exitDoors: any[] = LEVEL_05_EXIT_DOORS

    bgMusicTrack: any = BGMusic

} 