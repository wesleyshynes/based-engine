declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext
  }
}

export class BasedSounds {
  audioContext: AudioContext;
  buffer: AudioBuffer;
  channelData: Float32Array;
  primaryGainControl: GainNode;
  enabled: boolean = true;

  constructor() {
    const audioC = window.AudioContext || window.webkitAudioContext
    // this.audioContext = new AudioContext()
    this.audioContext = new audioC()
    this.buffer = this.audioContext.createBuffer(
      1,
      this.audioContext.sampleRate * 1,
      this.audioContext.sampleRate
    )
    this.channelData = this.buffer.getChannelData(0)

    this.primaryGainControl = this.audioContext.createGain()
    this.primaryGainControl.gain.setValueAtTime(0.5, 0)
    this.primaryGainControl.connect(this.audioContext.destination)
  }

  initialize() {
    // for (let i = 0; i < this.channelData.length; i++) {
    //   this.channelData[i] = Math.random() * 2 - 1
    // }
  }

  // play(){
  //   const whiteNoiseSource = this.audioContext.createBufferSource()
  //   whiteNoiseSource.buffer = this.buffer
  //   whiteNoiseSource.connect(this.primaryGainControl)
  //   whiteNoiseSource.start()
  // }

  playNote(soundFrequency: number = 150, length: number = .2, soundType: 'sawtooth' | 'sine' | 'triangle' | 'square' | '' = '') {
    if(!this.enabled) {
      return
    }
    const kickSound = this.audioContext.createOscillator()
    if(soundType) {
      kickSound.type = soundType
    }// else {
      // kickSound.frequency.exponentialRampToValueAtTime(
      //   0.001,
      //   this.audioContext.currentTime + length
      // )
    //}
    // kickSound.frequency.setValueAtTime(soundFrequency, 0)
    kickSound.frequency.setValueAtTime(soundFrequency, this.audioContext.currentTime)

    const kickGain = this.audioContext.createGain()
    kickGain.gain.setValueAtTime(1, this.audioContext.currentTime)
    kickGain.gain.linearRampToValueAtTime(0.01, this.audioContext.currentTime + length)
    // kickGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + length)

    kickSound.connect(kickGain)
    kickGain.connect(this.primaryGainControl)
    // kickSound.connect(this.primaryGainControl)
    kickSound.start()
    kickSound.stop(this.audioContext.currentTime + length)
  }

  playCustomSound(
    frequencyChart: {f: number, t: number}[],
    soundType: 'sawtooth' | 'sine' | 'triangle' | 'square' | '' = '',
    endedCallback?: () => void ) {
    if(!this.enabled) {
      return
    }
    const customSound = this.audioContext.createOscillator()
    if(soundType) {
      customSound.type = soundType
    }
    let length = 0

    frequencyChart.forEach(x => {
      customSound.frequency.setValueAtTime(x.f, this.audioContext.currentTime + length + x.t)
      length += x.t
    })

    const soundGain = this.audioContext.createGain()
    soundGain.gain.setValueAtTime(1, this.audioContext.currentTime)
    soundGain.gain.linearRampToValueAtTime(0.01, this.audioContext.currentTime + length)
    customSound.connect(soundGain)
    soundGain.connect(this.primaryGainControl)

    if(endedCallback) {
      customSound.onended = endedCallback
    }

    customSound.start()
    customSound.stop(this.audioContext.currentTime + length)

    return customSound
  }

  playCustomSoundNoFall(
    frequencyChart: {f: number, t: number}[],
    soundType: 'sawtooth' | 'sine' | 'triangle' | 'square' | '' = '',
    endedCallback?: () => void ) {
    if(!this.enabled) {
      return
    }
    const customSound = this.audioContext.createOscillator()
    if(soundType) {
      customSound.type = soundType
    }
    let length = 0

    frequencyChart.forEach(x => {
      customSound.frequency.setValueAtTime(x.f, this.audioContext.currentTime + length + x.t)
      length += x.t
    })

    const soundGain = this.audioContext.createGain()
    soundGain.gain.setValueAtTime(1, this.audioContext.currentTime)
    // soundGain.gain.linearRampToValueAtTime(0.01, this.audioContext.currentTime + length)
    customSound.connect(soundGain)
    soundGain.connect(this.primaryGainControl)

    if(endedCallback) {
      customSound.onended = endedCallback
    }

    customSound.start()
    customSound.stop(this.audioContext.currentTime + length)

    return customSound
  }

  async loadSound(soundUrl: string = 'https://raw.githubusercontent.com/TinaSoltanian/Patatap/master/sounds/bubbles.mp3') {
    if(!this.enabled) {
      return
    }
    const rawSound = await fetch(soundUrl)
    const soundBuffer = await rawSound.arrayBuffer()
    const decodedBuffer = await this.audioContext.decodeAudioData(soundBuffer)

    const newBuffer = this.audioContext.createBufferSource()
    newBuffer.buffer = decodedBuffer

    const soundGain = this.audioContext.createGain()
    soundGain.gain.setValueAtTime(1, this.audioContext.currentTime)

    newBuffer.connect(soundGain)
    soundGain.connect(this.primaryGainControl)

    // newBuffer.connect(this.primaryGainControl)
    newBuffer.start()
  }

}
