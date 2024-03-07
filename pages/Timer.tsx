import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef } from 'react';
import { StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { Audio } from 'expo-av';
import { Asset } from 'expo-asset';
import { Box, Center, HStack, Heading, Text, View } from "@gluestack-ui/themed"
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';

import Button from '../components/Button'
import Count from '../components/Count'
import TimePicker from '../components/TimePicker';
import TimerModal from '../view/TimerModal';

export type TimerSettings = {
  wait?: number
  rest?: number
  round: number
}

export default function Timer() {
  const [started, setStarted] = useState(false)
  const [paused, setPaused] = useState(false)
  const [rounds, setRounds] = useState(1)

  // const [roundTime, setRoundTime] = useState(0)
  const [playingTime, setPlayingTime] = useState(0)
  // const [endTime, setEndTime] = useState(0)

  const [settings, setSettings] = useState<TimerSettings>()

  const [isNeedConfirm, setIsNeedConfirm] = useState(false)

  const [isWaiting, setIsWaiting] = useState(false)

  const inRef = useRef(0)
  const timeRef = useRef(0)
  const modal = useRef(false)

  const [isOpen, setIsOpen] = useState(false)

  const [sound, setSound] = useState();

  async function playSound() {
    console.log('Loading Sound');
    try {
      const [{ localUri }] = await Asset.loadAsync(require('../assets/062864_ese-24142.mp3'));
  
      const { sound } = await Audio.Sound.createAsync(localUri);
      setSound(sound);
  
      console.log('Playing Sound');
      await sound.playAsync();
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const pauseTimer = () => {
    const round = rounds - 1

    setRounds(round)

    console.log(round, rounds)

    if (settings) {
      if (round > 0) {
        if (settings.rest) {
          setTimeout(() => {
            setPlayingTime(settings.rest as number)
            onStart()
          }, settings.rest)
        } else {
          setPlayingTime(settings.round)
          onStart()
        }
      } else {
        setIsNeedConfirm(true)
        setStarted(false)
        setPlayingTime(settings.round)
        deactivateKeepAwake()
        clearInterval(inRef.current)
      }
    }
    
    console.log('stop')
  }

  const onWait = () => {
    if (settings) {
      setPlayingTime(settings.wait as number)
      // setEndTime(settings.wait as number)
      setIsWaiting(true)
  
      inRef.current = window.setInterval(() => setPlayingTime(time => time - 150), 150)
      timeRef.current = window.setTimeout(() => {
        setPlayingTime(0)
        setIsWaiting(false)
        clearInterval(inRef.current)
        setTimeout(() => {
          onStart()
        }, 100)
      }, settings.wait)
    }
  }

  const onStart = () => {
    if (settings) {
      setStarted(true)
      setPlayingTime(settings.round)
      // setEndTime(roundTime)
      activateKeepAwakeAsync()
  
      console.log('Start', settings.round)
  
      inRef.current = window.setInterval(() => setPlayingTime(time => time - 150), 150)
      timeRef.current = window.setTimeout(pauseTimer, settings.round)
    }
  }

  const onContinue = (pause: number) => {
    if (settings) {

      setPaused(false)

      inRef.current = window.setInterval(() => setPlayingTime(time => time - 150), 150)
      timeRef.current = window.setTimeout(pauseTimer, settings.round - pause)
    }
  }

  const onPause = () => {
    setPaused(true)
    clearTimeout(timeRef.current)
    clearInterval(inRef.current)
  }

  const onStop = () => {
    setPlayingTime(0)
    setStarted(false)
    clearTimeout(timeRef.current)
    clearInterval(inRef.current)
  }

  const formatTime = (number: number) => {
    if (number > 9) {
      return number.toString()
    }

    return `0${number}`
  }

  const onSubmit = (settings: TimerSettings) => {
    setPlayingTime(settings.round)
    setSettings(settings)
    setIsOpen(false)
  }

  const formatText = () => {
    const seconds = Math.floor(playingTime / 1000) % 60
    const minutes = Math.floor(playingTime / 1000 / 60) % 60

    return `${formatTime(minutes)}:${formatTime(seconds)}`
  }

  return (
    <View style={styles.container}>
      <TimerModal isOpen={isOpen} settings={settings} onClose={() => setIsOpen(false)} onSubmit={onSubmit}/>

      <Box style={styles.open}>
        <Button ref={modal} onPress={() => setIsOpen(true)} />
      </Box>

      <Center>
        <Text>Rounds</Text>
        <Count min={1} onChange={setRounds} />
      </Center>

      <Box style={styles.sound}>
        <Button title="Play Sound" onPress={playSound} />
      </Box>

      <Text paddingBottom={10} size="2xl">Round: {rounds}</Text>

      <Box paddingBottom={20}>
        <Progress.Circle
          showsText
          size={280}
          direction="counter-clockwise"
          textStyle={{ fontSize: 90 }}
          thickness={isWaiting ? 0 : 9}
          formatText={formatText}
          progress={settings ? playingTime / settings.round : 0}
        />
      </Box>

      <HStack space="lg" reversed={false}>
        {!started && !isNeedConfirm && <Button isDisabled={!settings} title="Start" onPress={settings?.wait ? onWait : onStart} />}
        {started && !paused && <Button title="Pause" onPress={onPause} />}
        {started && paused && <Button title="Continue" onPress={() => onContinue(playingTime)} />}
        {started && <Button title="Stop" onPress={onStop} />}
        {isNeedConfirm && <Button title="OK" onPress={() => setIsNeedConfirm(false)} />}
      </HStack>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  open: {
    top: 15,
    left: 15,
    position: 'absolute'
  },
  sound: {
    top: 15,
    right: 15,
    position: 'absolute'
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
  },
});
