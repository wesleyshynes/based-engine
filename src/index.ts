import './assets/style.scss';
// import { startGame } from './games/walk-the-human/startGame';
// import { startGame } from './games/blasty-man/startGame';
// import { startGame } from './games/vimjam2/startGame';
// import { startGame } from './games/physbo/startGame';
// import { startGame } from './games/netmo/startGame';
// import { startGame } from './games/dice-grid/startGame';
import { startGame } from './games/lead-cub/startGame';

const startBtn = document.getElementById('start-game')
const gameDesc = document.getElementById('game-description')
const audioP: any = document.getElementById('audio-b')
// const fakeSound = new Audio()
// const fakeSound = new Audio('https://www.someaudio.com/something.mp3')
if(startBtn && audioP && audioP) {
  startBtn.addEventListener('click', () => {
    // fakeSound.muted = false
    // fakeSound.play()
    gameDesc.remove()
    audioP.play()
    startGame()
    startBtn.remove()
    setTimeout(() => {
      audioP.remove()
    }, 500)
    // audioP.remove()
  })

}
