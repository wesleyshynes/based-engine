import './assets/style.scss';
import { startGame } from './games/blasty-man/startGame';

const startBtn = document.getElementById('start-game')
const gameDesc = document.getElementById('game-description')
const audioP: any = document.getElementById('audio-b')
// const fakeSound = new Audio()
// const fakeSound = new Audio('https://www.dizzisternberg.co.uk/music/Picts.mp3')
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
