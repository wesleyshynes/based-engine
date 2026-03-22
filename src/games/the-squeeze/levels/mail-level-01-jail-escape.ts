import { JAIL_ESCAPE } from "../constants/mainLevel01JailEscapeConstants";
import { SqueezeBaseLevel } from "./SqueezeBaseLevel";

export class JailEscape extends SqueezeBaseLevel {

    levelWidth: number = JAIL_ESCAPE.levelWidth
    levelHeight: number = JAIL_ESCAPE.levelHeight

    nextLevel: string = JAIL_ESCAPE.nextLevel

    playerStartPosition: any = JAIL_ESCAPE.playerStart
    levelWalls: any[] = []
    _levelBoundaries: any[] = JAIL_ESCAPE.boundaries
    _levelWalls: any[] = JAIL_ESCAPE.walls
    levelPolygons: any[] = []
    _levelPolygons: any[] = JAIL_ESCAPE.polygons || []
    pushBoxes: any[] = []
    _pushBoxes: any[] = JAIL_ESCAPE.pushBoxes
    bounceBalls: any[] = []
    _bounceBalls: any[] = JAIL_ESCAPE.bounceBalls || []
    movingPlatforms: any[] = []
    _movingPlatforms: any[] = JAIL_ESCAPE.movingPlatforms
    exitDoors: any[] = []
    _exitDoors: any[] = JAIL_ESCAPE.exitDoors

    hazardBlocks: any[] = []
    _hazardBlocks: any[] = JAIL_ESCAPE.hazardBlocks

    hazardPolys: any[] = []
    _hazardPolys: any[] = JAIL_ESCAPE.hazardPolys || []

    hazardBalls: any[] = []
    _hazardBalls: any[] = JAIL_ESCAPE.hazardBalls || []

    levelTexts: any[] = []
    _levelTexts: any[] = JAIL_ESCAPE.levelTexts || []

    levelSensors: any[] = []
    _levelSensors: any[] = JAIL_ESCAPE.levelSensors || []

    conditionalWalls: any[] = []
    _conditionalWalls: any[] = JAIL_ESCAPE.conditionalWalls || []

    collectibles: any[] = []
    _collectibles: any[] = JAIL_ESCAPE.collectibles || []

}
