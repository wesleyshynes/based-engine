// GENERATES pad shapes
export const generatePad = (width: number = 520, height: number = 50, chamfer: number = 30) => {
  return [
    {x: 0, y: 0},
    {x: width, y: 0},
    {x: width, y: height/2},
    {x: width - chamfer, y: height},
    {x: chamfer, y: height},
    {x: 0, y: height/2},
  ]
}
