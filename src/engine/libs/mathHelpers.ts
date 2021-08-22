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

export function normalizeVector(v: XYCoordinateType) {
  const length = Math.sqrt(v.x*v.x+v.y*v.y); //calculating length
  return {
    x: v.x/length,
    y: v.y/length
  }
}
