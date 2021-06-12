import { BasedGame } from "./engine/BasedEngine";
import './assets/style.scss';
// import { BlastyStart } from "./games/blasty-man/levels/startBlasty";
// import { BlastyLevelOne } from "./games/blasty-man/levels/blastyOne";
import { WalkTheHumanStart } from "./games/walk-the-human/levels/startWalk";
import { WalkOne } from "./games/walk-the-human/levels/walkOne";

function startGame() {
  const newGame = new BasedGame({
    canvasElementId: 'game-container',
    // width: window.innerWidth,
    width: window.innerWidth > 400 ? 400: window.innerWidth,
    // width: 400,
    // height: window.innerHeight,
    height: window.innerHeight > 400 ? 400 : window.innerHeight,
    // height: 600,
    levels: [
      // Feeshy
      // { key: 'start-level', level: StartLevel },
      // { key: 'new-level-1', level: OtherLevel },
      // { key: 'level-one', level: LevelOneBase },

      // Troopas
      // { key: 'start-screen', level: TroopaStart },
      // { key: 'troopa1-1', level: TroopasLevel1 },

      // Blasty man
      // { key: 'start-screen', level: BlastyStart },
      // { key: 'blasty-1', level: BlastyLevelOne },

      // Walk the human
      { key: 'start-screen', level: WalkTheHumanStart },
      { key: 'walk-1', level: WalkOne },

    ]
  })
  newGame.enableMouse()
  newGame.enableKeyboard()
  newGame.start()
}

const startBtn = document.getElementById('start-game')
const audioP: any = document.getElementById('audio-b')
// const fakeSound = new Audio()
// const fakeSound = new Audio('https://www.dizzisternberg.co.uk/music/Picts.mp3')
if(startBtn && audioP && audioP) {
  startBtn.addEventListener('click', () => {
    // fakeSound.muted = false
    // fakeSound.play()
    audioP.play()
    startGame()
    startBtn.remove()
    setTimeout(() => {
      audioP.remove()
    }, 500)
    // audioP.remove()
  })

}
