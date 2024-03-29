import { TimerSettings, ProfileData } from '../types'

const defaultProfile: TimerSettings = {
  wait: 0,
  rest: 0,
  count: 3,
  round: 60,
};

const defaultMMA: TimerSettings = {
  wait: 10,
  rest: 160,
  count: 5,
  round: 300,
};

const defaultBox: TimerSettings = {
  wait: 10,
  rest: 60,
  count: 3,
  round: 180,
};

export const PROFILES: ProfileData = {
  mma: defaultMMA,
  box: defaultBox,
  custom: defaultProfile,
};