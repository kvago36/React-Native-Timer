/**
 * Timer settings
 * @wait Delay between timer start
 * @rest Resting time between rounds
 * @count Rounds count
 * @round One round duration
 */

export type TimerSettings = {
  wait?: number
  rest?: number
  count: number
  round: number
}
