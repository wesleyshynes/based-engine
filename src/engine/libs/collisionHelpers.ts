import { XYCoordinateType, degToRad, distanceBetween } from "./mathHelpers"

export function boxCollision(
  a: { x: number, y: number, w: number, h: number },
  b: { x: number, y: number, w: number, h: number }
) {
  return !(
    ((a.y + a.h) < (b.y)) ||
    (a.y > (b.y + b.h)) ||
    ((a.x + a.w) < b.x) ||
    (a.x > (b.x + b.w))
  );
}

/**
 * Check if a point is inside an axis-aligned rectangle.
 * Rectangle is defined by center position and dimensions.
 */
export function pointInRect(
  point: XYCoordinateType,
  rect: { x: number, y: number, width: number, height: number }
): boolean {
  const halfW = rect.width / 2
  const halfH = rect.height / 2
  return point.x >= rect.x - halfW && 
         point.x <= rect.x + halfW && 
         point.y >= rect.y - halfH && 
         point.y <= rect.y + halfH
}

/**
 * Check if a point is inside a rotated rectangle.
 * Rectangle is defined by center position, dimensions, and rotation angle in degrees.
 */
export function pointInRotatedRect(
  point: XYCoordinateType,
  center: XYCoordinateType,
  width: number,
  height: number,
  angleDeg: number = 0
): boolean {
  const halfW = width / 2
  const halfH = height / 2

  if (angleDeg === 0) {
    return point.x >= center.x - halfW && 
           point.x <= center.x + halfW && 
           point.y >= center.y - halfH && 
           point.y <= center.y + halfH
  }

  // Transform point to local (unrotated) space
  const angleRad = degToRad(-angleDeg)
  const cosA = Math.cos(angleRad)
  const sinA = Math.sin(angleRad)
  const dx = point.x - center.x
  const dy = point.y - center.y
  const localX = dx * cosA - dy * sinA
  const localY = dx * sinA + dy * cosA

  return localX >= -halfW && localX <= halfW && localY >= -halfH && localY <= halfH
}

/**
 * Check if a point is inside a circle.
 */
export function pointInCircle(
  point: XYCoordinateType,
  center: XYCoordinateType,
  radius: number
): boolean {
  return distanceBetween(point, center) <= radius
}

/**
 * Check if a point is inside a polygon using ray casting algorithm.
 * Vertices should be in local space (relative to polygon center).
 * Point should also be transformed to local space before calling.
 */
export function pointInPolygon(
  localPoint: XYCoordinateType,
  vertices: XYCoordinateType[]
): boolean {
  let inside = false
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const xi = vertices[i].x, yi = vertices[i].y
    const xj = vertices[j].x, yj = vertices[j].y
    if (((yi > localPoint.y) !== (yj > localPoint.y)) &&
        (localPoint.x < (xj - xi) * (localPoint.y - yi) / (yj - yi) + xi)) {
      inside = !inside
    }
  }
  return inside
}

/**
 * Check if a point is inside a rotated polygon.
 * Handles the rotation transformation internally.
 */
export function pointInRotatedPolygon(
  point: XYCoordinateType,
  center: XYCoordinateType,
  vertices: XYCoordinateType[],
  angleDeg: number = 0
): boolean {
  // Transform point to local (unrotated) space
  const angleRad = degToRad(-angleDeg)
  const cosA = Math.cos(angleRad)
  const sinA = Math.sin(angleRad)
  const dx = point.x - center.x
  const dy = point.y - center.y
  const localPoint = {
    x: dx * cosA - dy * sinA,
    y: dx * sinA + dy * cosA
  }

  return pointInPolygon(localPoint, vertices)
}

/**
 * Check if two points are within a threshold distance.
 * Useful for handle detection.
 */
export function isNearPoint(
  p1: XYCoordinateType,
  p2: XYCoordinateType,
  threshold: number
): boolean {
  return Math.abs(p1.x - p2.x) < threshold && Math.abs(p1.y - p2.y) < threshold
}
