// export const getSplittedTime = (time: number) => ({ seconds: time % 60, minutes: Math.floor(time / 60) })

// export const getFormatedTime = (minutes: number, seconds: number): string => {
//   return `${minutes > 9 ? minutes : `0${minutes}`}:${seconds > 9 ? seconds : `0${seconds}` }`
// }

// export const getFullTime = (minutes: number, seconds: number) => minutes * 60 + seconds

export * from "./storage";
export * from "./time";
