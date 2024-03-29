import AsyncStorage from "@react-native-async-storage/async-storage";

import { stringUnionToArray, TimerOptions, TimerSettings } from "../types";

export const getTimerData = async () => {
  try {
    let stringArray = stringUnionToArray<TimerOptions>()('round', 'count', 'wait', 'rest');
    const jsonValue = await AsyncStorage.multiGet(stringArray)

    return jsonValue.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
  } catch (error) {
    console.log(error)
  }
}

export const saveTimerData = async (data: Partial<TimerSettings>) => {
  const keyValuePair: [string, string][] = []

  for (let p in data) {
    const value = data[p as keyof TimerSettings]!
    keyValuePair.push([p, value.toString()])
  }

  try {
    await AsyncStorage.multiSet(keyValuePair)
  } catch (error) {
    console.log(error)
  }
}