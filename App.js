import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BackgroundJob from "react-native-background-actions";
import moment from "moment";

const sleep = (time) =>
  new Promise((resolve) => setTimeout(() => resolve(), time));

BackgroundJob.on("expiration", () => {
  console.log("iOS: I am being closed!");
});

const taskRandom = async (taskData) => {
  console.log("taskData>>>", taskData);
  // if (Platform.OS === "ios") {
  //   console.warn(
  //     "This task will not keep your app alive in the background by itself, use other library like react-native-track-player that use audio,",
  //     "geolocalization, etc. to keep your app alive in the background while you excute the JS from this library."
  //   );
  // }
  await new Promise(async (resolve) => {
    // For loop with a delay
    // const scheduledTime = moment()
    //   .add(1, "d")
    //   .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    // const currentTime = moment();
    // const delay = scheduledTime.diff(currentTime);
    const { delay } = taskData;
    console.log("delay in bg>>", BackgroundJob.isRunning(), delay);
    for (let i = 0; BackgroundJob.isRunning(); i++) {
      console.log("Runned -> ", i);
      await BackgroundJob.updateNotification({ taskDesc: "Runned -> " + i });
      await sleep(delay);
    }
  });
};

const options = {
  taskName: "demo-app",
  taskTitle: "title",
  taskDesc: "cron job",
  taskIcon: {
    name: "ic_launcher",
    type: "mipmap",
  },
  color: "#ff00ff",
  // linkingURI: "https://www.npmjs.com/package/react-native-background-actions",
  parameters: {
    delay: 2000,
  },
};
// function handleOpenURL(evt) {
//   console.log(evt.url);
// }
export default function App() {
  const usingHermes =
    typeof HermesInternal === "object" && HermesInternal !== null;
  console.log("🚀 ~ App ~ usingHermes:", usingHermes);

  let playing = BackgroundJob.isRunning();

  const startBackgroundService = useCallback(async () => {
    try {
      console.log("Trying to start background service");
      let res = await BackgroundJob.start(taskRandom, options);
      console.log("🚀 ~ toggleBackground ~ res:", res);
      console.log("Successful start!");
    } catch (e) {
      console.log("Error", e);
    }
  }, []);

  useEffect(() => {
    // Start background service immediately
    startBackgroundService();

    // Set up interval to call toggleBackground every 2 minutes
    const intervalId = setInterval(() => {
      toggleBackground();
    }, 60000);
    console.log("🚀 ~ intervalId ~ intervalId:", intervalId);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, [startBackgroundService]);

  const toggleBackground = async () => {
    playing = !playing;
    if (playing) {
      try {
        console.log("Trying to start background service");
        let res = await BackgroundJob.start(taskRandom, options);
        console.log("🚀 ~ toggleBackground ~ res:", res);
        console.log("Successful start!");
      } catch (e) {
        console.log("Error", e);
      }
    } else {
      console.log("Stop background service");
      await BackgroundJob.stop();
    }
  };
  return (
    <View style={styles.container}>
      {!usingHermes ? null : (
        <View style={styles.engine}>
          <Text style={styles.footer}>Engine: Hermes</Text>
        </View>
      )}
      {/* <TouchableOpacity style={styles.box} onPress={toggleBackground}>
        <Text>Cron job start</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: 100,
    height: 100,
  },
});
