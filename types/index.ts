export type TimerOptions = 'wait' | 'rest' | 'count' | 'round'

/**
 * Timer settings
 * @wait Delay between timer start
 * @rest Resting time between rounds
 * @count Rounds count
 * @round Round duration
 */
export type TimerSettings = Record<TimerOptions, number>

export type ProfileNames = "mma" | "box" | "custom";

export type ProfileData = Record<ProfileNames, TimerSettings>;

type ValueOf<T> = T[keyof T];

type NonEmptyArray<T> = [T, ...T[]]

type MustInclude<T, U extends T[]> = [T] extends [ValueOf<U>] ? U : never;

export function stringUnionToArray<T>() {
  return <U extends NonEmptyArray<T>>(...elements: MustInclude<T, U>) => elements;
}
