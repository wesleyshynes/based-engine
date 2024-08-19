import { LEVEL_02_BOUNDARIES, LEVEL_02_EXIT_DOORS, LEVEL_02_PUSH_BOXES, LEVEL_02_WALLS } from "../constants/level02Constants";
import { SqueezeBaseLevel } from "./SqueezeBaseLevel";

export class Level02 extends SqueezeBaseLevel {

    levelWidth: number = 800
    levelHeight: number = 600

    nextLevel: string = 'level-03'

    playerStartPosition: any = { x: 64, y: 535 }

    levelWalls: any[] = []
    _levelBoundaries: any[] = LEVEL_02_BOUNDARIES
    _levelWalls: any[] = LEVEL_02_WALLS
    pushBoxes: any[] = []
    _pushBoxes: any[] = LEVEL_02_PUSH_BOXES
    exitDoors: any[] = []
    _exitDoors: any[] = LEVEL_02_EXIT_DOORS
  
} 