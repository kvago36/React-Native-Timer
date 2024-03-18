type Statuses = 'init' | 'loaded' | 'waiting' | 'resting' | 'playing'

import { TimerSettings } from "../types";

export class Timer {
  public rounds: number = 2;
  public state: Statuses = 'init';
  private current: number = 1
  private countdown: number = 0
  private timerId: ReturnType<typeof setTimeout>;
  private intervalId: ReturnType<typeof setInterval>;
  private settings: TimerSettings
  private startTime: number = 0

  private onFinish: () => void
  private onRoundEnd: (value: number) => void
  private onPlaying: (value: number) => void

  constructor(
    onFinish: () => void,
    onRoundEnd: (value: number) => void,
    onPlaying: (value: number) => void,
    settings: TimerSettings
  ) {
    this.onFinish = onFinish
    this.onRoundEnd = onRoundEnd
    this.onPlaying = onPlaying
    this.settings = settings
  }

  start(countdown: number) {
    this.countdown = countdown
    this.startTime = Date.now()

    // this.onPlaying(countdown)

    this.intervalId = setInterval(() => {
      this.onPlaying(this.countdown -= 1)
    }, 1000)

    this.timerId = setTimeout(this.pauseTimer, countdown * 1000)
  }

  pause() {
    // this.countdown = this.settings.round - (Date.now() - this.startTime) / 1000

    // console.log(this.countdown)

    this.clearTimers()
    // return this.countdown
  }

  stop() {
    this.current = 1
    this.state = 'loaded'
    this.clearTimers()
  }

  reset() {
    this.countdown = this.settings.round
    this.current = 1
  }

  close() {
    clearTimeout(this.timerId)
    clearInterval(this.intervalId)
  }

  private clearTimers = () => {
    clearTimeout(this.timerId)
    clearInterval(this.intervalId)
  }

  private pauseTimer = () => {
    this.current += 1

    clearInterval(this.intervalId)
    this.onPlaying(0)

    // console.log(this.current, this.rounds, 'rounds')

    if (this.current <= this.rounds) {
      let countdown = this.settings.round

      if (this.settings.rest) {

        if (this.state === 'playing') {
          countdown = this.settings.rest
        }

        this.state = this.state === 'resting' ? 'playing' : 'resting'
      }

      setTimeout(() => {
        console.log('start new round')
        this.start(countdown)
      }, 100)

      this.onRoundEnd(this.current)
    } else {
      this.onFinish()
    }
  }
}