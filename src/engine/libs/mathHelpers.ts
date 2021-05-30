export interface XYCoordinateType {
  x:number
  y:number
}

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function getClickPosition(e: any) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; //x position within the element.
    const y = e.clientY - rect.top;  //y position within the element.
    return [x, y]
}

export function getTouchPosition(e: any) {
    const rect = e.target.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left; //x position within the element.
    const y = e.touches[0].clientY - rect.top;  //y position within the element.
    return [x, y]
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
