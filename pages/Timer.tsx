import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useRef, useMemo } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { config } from "@gluestack-ui/config";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { Asset } from "expo-asset";
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Box,
  Button,
  HStack,
  Text,
  ButtonIcon,
} from "@gluestack-ui/themed";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { FontAwesome } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedStyle,
  interpolateColor,
  withRepeat,
  cancelAnimation,
} from "react-native-reanimated";

import SettingsModal from "../view/SettingModal";
import TimerModal from "../view/TimerModal";
import CircularProgress from "../components/CircularProgress";
import PlayerButton from "../components/PlayerButton";
import { Timer } from "../components/Timer";

import { TimerSettings } from "../types";
import { getSplittedTime } from "../utils";
import { TIMER_SETTINGS } from '../constants'

export default function TimerPage() {
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [rounds, setRounds] = useState(1);

  const { width } = useWindowDimensions();

  const [showActionsheet, setShowActionsheet] = useState(false);

  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const [playingTime, setPlayingTime] = useState(0);

  const [settings, setSettings] = useState<TimerSettings>();

  const timer = useRef<Timer>();

  const [isNeedConfirm, setIsNeedConfirm] = useState(false);

  const modal = useRef(false);
  const roundsRef = useRef(0);

  const timeToStart = useRef(0);
  const timeMark = useRef(0);

  const vibrationRef = useRef<ReturnType<typeof setInterval>>()

  const [isOpen, setIsOpen] = useState(false);

  const [sound, setSound] = useState<Audio.Sound>();

  async function playSound() {
    console.log("Loading Sound");
    try {
      const [asset] = await Asset.loadAsync(
        require("../assets/062864_ese-24142.mp3")
      );

      const { sound } = await Audio.Sound.createAsync(asset);
      await sound.setVolumeAsync(1)
      await sound.setIsLoopingAsync(true)

      setSound(sound);

      console.log("Playing Sound");
      await sound.playAsync();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const loadData = async () => {
      const saved = await getData() as TimerSettings

      for (let p in saved) {
        saved[p as keyof TimerSettings] = +saved[p as keyof TimerSettings]
      }

      if (saved.round) {
        setPlayingTime(saved.round)
      }

      setSettings(saved)
    }

    loadData()
  }, [])

  useEffect(() => {
    if (settings) {
      timer.current = new Timer(onFinish, setRounds, setPlayingTime, settings);
      timer.current.state = "loaded";
    }

    return () => {
      if (timer.current) {
        timer.current.close();
      }
    };
  }, [settings]);

  useEffect(() => {
    roundsRef.current = rounds;
  }, [rounds]);

  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      interruptionModeIOS: InterruptionModeIOS.DuckOthers,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: true,
    });
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.multiGet(TIMER_SETTINGS)

      return jsonValue.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
    } catch (error) {
      console.log(error)
    }
  }

  const saveData = async (data: Partial<TimerSettings>) => {
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

  const onSubmit = (settings: TimerSettings) => {
    saveData(settings)
    // setPlayingTime(settings.round);
    setSettings(settings);
    setIsOpen(false);
  };

  const setMinutes = (minutes: number) => {
    const secondsInCurrentTime = playingTime % 60;
    const minutesInCurrentTime = playingTime / 60;

    if (minutesInCurrentTime > 1) {
      setPlayingTime(secondsInCurrentTime + minutes * 60);
    } else {
      setPlayingTime((value) => value + minutes * 60);
    }
  };

  const setSeconds = (seconds: number) => {
    const minutesInCurrentTime = Math.floor(playingTime / 60);

    setPlayingTime(60 * minutesInCurrentTime + seconds);
  };

  const onPause = () => {
    if (timer.current) {
      timer.current.pause();
    }

    timeToStart.current = Date.now() - timeMark.current;

    setPaused(true);
  };

  const onStop = () => {
    if (settings) {
      setPlayingTime(settings?.round);
    }

    if (timer.current) {
      timer.current.stop();
    }

    timeToStart.current = 0;
    timeMark.current = 0;

    setStarted(false);
    setPaused(false);
  };

  const onConfirm = () => {
    setPlayingTime(settings?.round!);
    setIsNeedConfirm(false);

    cancelAnimation(grown);
    cancelAnimation(progress);

    if (sound) {
      sound.stopAsync();
    }

    clearInterval(vibrationRef.current)

    grown.value = withTiming(1, { duration: 200 });
    progress.value = withTiming(0, { duration: 200 });

    deactivateKeepAwake();
  };

  const onPlayingStart = () => {
    activateKeepAwakeAsync();

    if (settings) {
      const { round, wait } = settings;
      let countdown = wait ? wait : round;

      setPlayingTime(wait ? wait : round);
      setStarted(true);

      timeMark.current = Date.now();

      if (timer.current) {
        timer.current.state = settings.wait ? "waiting" : "playing";
        timer.current.rounds = wait ? 1 : settings.count;
        timer.current.start(countdown);
      }
    }
  };

  const onContinue = () => {
    let countdown = 0;

    if (settings) {
      const { round } = settings;

      countdown = round - Math.floor(timeToStart.current / 1000);
    }

    setPaused(false);

    if (timer.current) {
      timer.current.start(countdown);
    }
  };

  const onFinish = () => {
    if (settings && timer.current && timer.current.state === "waiting") {
      timer.current.rounds = rounds;
      timer.current.state = "playing";
      timer.current.start(settings.round);
    } else {
      if (isSoundEnabled) {
        playSound();
      }

      if (isSoundEnabled) {
        vibrate()
      }

      setStarted(false);
      setIsNeedConfirm(true);

      timeToStart.current = 0;
      timeMark.current = 0;

      progress.value = withRepeat(
        withTiming(1 - progress.value, { duration: 600 }),
        -1,
        true
      );
      grown.value = withRepeat(
        withTiming(1.6, { easing: Easing.bounce, duration: 250 }),
        -1,
        true
      );
    }
  };

  const onClose = () => {
    saveData({ round: playingTime })
    setSettings({ ...settings!, round: playingTime });
    setShowActionsheet(false);
  };

  const vibrate = () => {
    vibrationRef.current = setInterval(() => {
      Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Heavy
      )
    }, 350)
  }

  // const reset = () => {
  //   if (timer.current) {
  //     timer.current.reset();
  //   }

  //   setPlayingTime(0);
  //   setStarted(false);
  //   setPaused(false);
  //   setRounds(1);
  // };

  const DISPLAY_SIZE = useMemo(() => width * 0.8, [width]);

  const { minutes, seconds } = getSplittedTime(playingTime);

  const progress = useSharedValue(0);
  const grown = useSharedValue(1);

  const animatedSizeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: grown.value }],
  }));

  const animatedColorStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [config.tokens.colors.backgroundDark900, config.tokens.colors.red700]
      ),
    };
  });

  const backgroundColor = started
    ? config.tokens.colors.green600
    : config.tokens.colors.backgroundDark900;

  return (
    <Animated.View
      style={[styles.container, animatedColorStyle, { backgroundColor }]}
    >
      <SettingsModal
        isOpen={isOpen}
        settings={settings}
        onClose={() => setIsOpen(false)}
        onSubmit={onSubmit}
      />

      <Box style={styles.open}>
        <Button variant="link" ref={modal} onPress={() => setIsOpen(true)}>
          <ButtonIcon color="grey" size={32} name="gear" as={FontAwesome} />
        </Button>
      </Box>

      <Box style={styles.sound}>
        <Button
          variant="link"
          onPress={() => setIsSoundEnabled(!isSoundEnabled)}
        >
          <ButtonIcon
            color="grey"
            size={32}
            marginRight={isSoundEnabled ? undefined : "$4"}
            name={isSoundEnabled ? "volume-up" : "volume-off"}
            as={FontAwesome}
          />
        </Button>
      </Box>

      <Text
        position="absolute"
        top="$16"
        color="#fff"
        paddingBottom={10}
        size="5xl"
      >
        {settings?.count ? `Round: ${rounds} / ${settings.count}` : `Round: 1`}
      </Text>

      <CircularProgress
        size={DISPLAY_SIZE}
        strokeWidth={18}
        maxValue={settings?.round}
        currentValue={playingTime}
      />

      <HStack
        position="absolute"
        bottom="$12"
        marginTop="$32"
        space="lg"
        reversed={false}
      >
        {(!started || paused) && (
          <PlayerButton
            name="play"
            isDisabled={playingTime === 0}
            iconStyle={{ marginLeft: "$1.5" }}
            onPress={paused ? onContinue : onPlayingStart}
          />
        )}
        {isNeedConfirm && (
          <Animated.View style={[styles.box, animatedSizeStyle]}>
            <PlayerButton name="check" onPress={onConfirm} />
          </Animated.View>
        )}
        {!started && !isNeedConfirm && (
          <PlayerButton
            name="external-link-square"
            iconStyle={{ marginLeft: "$0.1" }}
            onPress={() => setShowActionsheet(!showActionsheet)}
          />
        )}
        {started && !paused && <PlayerButton name="pause" onPress={onPause} />}
        {started && <PlayerButton name="stop" onPress={onStop} />}
      </HStack>

      <TimerModal
        isOpen={showActionsheet}
        onClose={onClose}
        minutes={minutes}
        seconds={seconds}
        onSecondsChange={setSeconds}
        onMinutesChange={setMinutes}
      />

      <StatusBar style="auto" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  debug: {
    top: 15,
    left: 95,
    display: "flex",
    position: "absolute",
  },
  open: {
    top: 15,
    left: 15,
    position: "absolute",
  },
  sound: {
    top: 15,
    right: 15,
    position: "absolute",
  },
  title: {
    fontSize: 24,
  },
  box: {
    position: "absolute",
    borderRadius: 500,
    width: config.tokens.space[16],
    height: config.tokens.space[16],
    backgroundColor: config.tokens.colors["indigo600"],
  },
});
