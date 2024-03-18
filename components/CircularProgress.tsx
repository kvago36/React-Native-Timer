import { memo, useMemo, useEffect } from 'react'
import { View, Platform } from 'react-native'
import {
  Canvas,
  Path,
  Skia,
  Group,
  useComputedValue,
  mix,
  useValue,
  matchFont,
  Text,
  vec,
  SweepGradient,
  useClockValue,
  useValueEffect,
  useFont, 
} from '@shopify/react-native-skia'

import { getSplittedTime } from '../utils'

const fontSize = 98
const fontFamily = Platform.select({ android: "sans-serif", ios: "Helvetica", default: "serif" });
const fontStyle = {
  fontFamily,
  fontSize,
  fontWeight: "bold",
};
const systemFont = matchFont(fontStyle)

interface CircularProgressProps {
  size?: number
  strokeWidth?: number
  maxValue: number
  currentValue: number
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  size = 194,
  strokeWidth = 12,
  maxValue = 100,
  currentValue = 0,
}) => {
  const radius = size / 2 - strokeWidth

  const digital = useFont(require('../assets/fonts/digital-7/digital-7.ttf'), fontSize);

  const path = useMemo(() => {
    const p = Skia.Path.Make()
    p.addCircle(strokeWidth + radius, strokeWidth + radius, radius)
    return p
  }, [radius, strokeWidth])

  const progressValue = useValue(currentValue / maxValue)
  const animatedProgress = useValue(progressValue.current)

  useEffect(() => {
    progressValue.current = currentValue / maxValue
  }, [currentValue, maxValue])

  const clock = useClockValue()

  useValueEffect(clock, () => {
    const progressDifference = progressValue.current - animatedProgress.current
    const animationSpeed = 0.05

    if (Math.abs(progressDifference) > 0.001) {
      animatedProgress.current += progressDifference * animationSpeed
    }
  })

  const formatTime = (minutes: number, seconds: number): string => {
    return `${minutes > 9 ? minutes : `0${minutes}`}:${seconds > 9 ? seconds : `0${seconds}` }`
  }

  const { minutes, seconds } = getSplittedTime(Math.ceil(currentValue))
  const timeString = formatTime(minutes, seconds)

  const x = useComputedValue(() => mix(animatedProgress.current, 0, 180), [animatedProgress])
  const progress = useComputedValue(() => x.current / 180, [x])

  return (
    <View 
      style={{ 
        width: size,
        height: size,
        // transform: [{ rotate: `-90deg` }],
      }} 
    >
      <Canvas style={{ flex: 1 }}>

      <Text
        x={60}
        y={194}
        color="#fff"
        text={timeString}
        font={digital ?? systemFont}
      />

        <Group>
          <Path
            path={path}
            style='stroke'
            strokeWidth={strokeWidth}
            color='#6A5ACD19'
            end={1}
            strokeCap='round'
          />
          <Group>
            <SweepGradient c={vec(size, size)} colors={['rgb(75, 0, 130)', '#6A5ACD']} />
            <Path
              path={path}
              style='stroke'
              strokeWidth={strokeWidth}
              end={progress}
              strokeCap='round'
            />
          </Group>
        </Group>
      </Canvas>
    </View>
  )
}

export default memo(CircularProgress)