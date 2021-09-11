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
