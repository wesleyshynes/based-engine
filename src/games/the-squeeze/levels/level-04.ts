import { LEVEL_04_BOUNDARIES, LEVEL_04_EXIT_DOORS, LEVEL_04_MOVING_PLATFORMS, LEVEL_04_PUSH_BOXES, LEVEL_04_WALLS } from "../constants/level04Constants";
import { SqueezeBaseLevel } from "./SqueezeBaseLevel";

export class Level04 extends SqueezeBaseLevel {

    levelWidth: number = 1200
    levelHeight: number = 900

    nextLevel: string = 'standard-level'
    
    playerStartPosition: any = { x: 100, y: 740 }
    levelWalls: any[] = []
    _levelBoundaries: any[] = LEVEL_04_BOUNDARIES
    _levelWalls: any[] = LEVEL_04_WALLS
    pushBoxes: any[] = []
    _pushBoxes: any[] = LEVEL_04_PUSH_BOXES
    movingPlatforms: any[] = []
    _movingPlatforms: any[] = LEVEL_04_MOVING_PLATFORMS
    exitDoors: any[] = []
    _exitDoors: any[] = LEVEL_04_EXIT_DOORS


} 