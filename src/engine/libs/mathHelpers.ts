export interface XYCoordinateType {
  x:number
  y:number
}

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function relativeMultiplier(v: number = 0) {
  if(v) {
    return Math.abs(v)/v
  }
  return 0
}

export function getClickPosition(e: any) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; //x position within the element.
    const y = e.clientY - rect.top;  //y position within the element.
    return [x, y]
}

export function getTouchPosition(e: any, p: number = 0) {
    const rect = e.target.getBoundingClientRect();
    const x = e.touches[p].clientX - rect.left; //x position within the element.
    const y = e.touches[p].clientY - rect.top;  //y position within the element.
    return [x, y]
}

export function getTouchArray(e: any) {
    const rect = e.target.getBoundingClientRect();
    const ret: any = []
    for(let i = 0; i < e.touches.length; i++ ) {
      ret.push({
        x: e.touches[i].clientX - rect.left,
        y: e.touches[i].clientY - rect.top,
        id: e.touches[i].identifier
      })
    }
    return ret
}

export function distanceBetween(p1:XYCoordinateType, p2:XYCoordinateType) {
  const a = p1.x - p2.x;
  const b = p1.y - p2.y;
  const c = Math.sqrt( a*a + b*b );
  return c
}

export function angleBetween(p1:XYCoordinateType,p2:XYCoordinateType, deg:boolean = false) {
  return deg ? Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI : Math.atan2(p2.y - p1.y, p2.x - p1.x)
}

export function pointOnCircle(pointAngleInRadians: number, radius: number){
  return {
    x: Math.cos(pointAngleInRadians) * radius,
    y: Math.sin(pointAngleInRadians) * radius
  }
}

export function radToDeg(rads:number) {
  return rads * (180/Math.PI);
}

export function degToRad(deg:number) {
  return deg * (Math.PI/180);
}


export function addVectors(v1: XYCoordinateType, v2: XYCoordinateType) {
  return {
    x: v1.x + v2.x,
    y: v1.y + v2.y
  }
}

export function subtractVectors(v1: XYCoordinateType, v2: XYCoordinateType) {
  return {
    x: v1.x - v2.x,
    y: v1.y - v2.y
  }
}

export function normalizeVector(v: XYCoordinateType, m: number = 1) {
  const length = v.x && v.y ? Math.sqrt(v.x*v.x+v.y*v.y) : Math.abs(Math.abs(v.x) > Math.abs(v.y) ? v.x : v.y); //calculating length
  return {
    x: v.x/length * m,
    y: v.y/length * m
  }
}

/**
 * Rotate a point around the origin (0, 0) by an angle in degrees.
 */
export function rotatePoint(point: XYCoordinateType, angleDeg: number): XYCoordinateType {
  const angleRad = degToRad(angleDeg)
  const cosA = Math.cos(angleRad)
  const sinA = Math.sin(angleRad)
  return {
    x: point.x * cosA - point.y * sinA,
    y: point.x * sinA + point.y * cosA
  }
}

/**
 * Rotate a point around an arbitrary center point by an angle in degrees.
 */
export function rotatePointAround(
  point: XYCoordinateType, 
  center: XYCoordinateType, 
  angleDeg: number
): XYCoordinateType {
  const dx = point.x - center.x
  const dy = point.y - center.y
  const rotated = rotatePoint({ x: dx, y: dy }, angleDeg)
  return {
    x: center.x + rotated.x,
    y: center.y + rotated.y
  }
}
