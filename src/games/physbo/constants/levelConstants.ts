import { generatePad } from "../generators/generators"

// BALL LAYOUTS
export const Ball_Layout_15 = [
  {x: 0, y: 0, type: 'stripe', color: 'purple', number: 12},
  {x: 1, y: 0, type: 'solid', color: 'red', number: 3},
  {x: 2, y: 0, type: 'stripe', color: 'orange', number: 13},
  {x: 3, y: 0, type: 'stripe', color: 'brown', number: 15},
  {x: 4, y: 0, type: 'solid', color: 'green', number: 9},
  {x: 0, y: 1, type: 'solid', color: 'purple', number: 4},
  {x: 1, y: 1, type: 'stripe', color: 'green', number: 14},
  {x: 2, y: 1, type: 'solid', color: 'brown', number: 7},
  {x: 3, y: 1, type: 'stripe', color: 'yellow', number: 6},
  {x: 1, y: 2, type: 'stripe', color: 'blue', number: 10},
  {x: 2, y: 2, type: 'solid', color: 'black', number: 8},
  {x: 3, y: 2, type: 'solid', color: 'blue', number: 2},
  {x: 1, y: 3, type: 'solid', color: 'orange', number: 5},
  {x: 2, y: 3, type: 'stripe', color: 'red', number: 11},
  {x: 2, y: 4, type: 'solid', color: 'yellow', number: 1},
]
export const Ball_Layout_9 = [
  {x: 2, y: 0, type: 'stripe', color: 'orange', number: 13},
  {x: 1, y: 1, type: 'stripe', color: 'green', number: 14},
  {x: 2, y: 1, type: 'solid', color: 'brown', number: 7},
  {x: 1, y: 2, type: 'stripe', color: 'blue', number: 10},
  {x: 2, y: 2, type: 'solid', color: 'black', number: 8},
  {x: 3, y: 2, type: 'solid', color: 'blue', number: 2},
  {x: 1, y: 3, type: 'solid', color: 'orange', number: 5},
  {x: 2, y: 3, type: 'stripe', color: 'red', number: 11},
  {x: 2, y: 4, type: 'solid', color: 'yellow', number: 1},
]

export const Standard_Pockets = [
  { x: 110, y: 110 },
  { x: 690, y: 110 },
  { x: 100, y: 500 },
  { x: 700, y: 500 },
  { x: 110, y: 890 },
  { x: 690, y: 890 },
]
export const Standard_Level = [
  // {x: 0, y: 380, w: 400, h: 160, c: 'red', o: { label: 'ground', isStatic: true}},
  {x: 400, y: 0, w: 960, h: 160,  o: { label: 'wallTop', isStatic: true}},
  {x: 0, y: 500, w: 160, h: 1000, o: { label: 'wallLeft', isStatic: true}},
  {x: 800, y: 500, w: 160, h: 1000, o: { label: 'wallRight', isStatic: true}},
  {x: 400, y: 1000, w: 960, h: 160, o: { label: 'wallBottom', isStatic: true}},
  // {x: 400, y: 380, w: 400, h: 60, c: 'white', o: { label: 'sensorSample', isStatic: true, isSensor: true}},
]

export const Standard_Bounce_Pads = [
  {
    x: 140,
    y: 80,
    a: 0,
    v: generatePad(520, 50, 30)
  },
  {
    x: 660,
    y: 920,
    a: 180,
    v: generatePad(520, 50, 30)
  },
  {
    x: 720,
    y: 140,
    a: 90,
    v: generatePad(330, 50, 20)
  },
  {
    x: 720,
    y: 530,
    a: 90,
    v: generatePad(330, 50, 20)
  },
  {
    x: 80,
    y: 470,
    a: 270,
    v: generatePad(330, 50, 20)
  },
  {
    x: 80,
    y: 860,
    a: 270,
    v: generatePad(330, 50, 20)
  }
]
