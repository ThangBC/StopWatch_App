import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {converTime} from '../components/validation';

let unsubcribe = null;

const HomeScreen = props => {
  const [start, setStart] = useState(0);
  const [now, setNow] = useState(0);
  const [lap, setLap] = useState([]);
  const [isStart, setIsStart] = useState(false);
  const [isStop, setIsStop] = useState(false);

  const timer = now - start;

  const finishedLaps = lap.slice(1);
  let min = Number.MAX_SAFE_INTEGER;
  let max = Number.MIN_SAFE_INTEGER;
  if (finishedLaps.length >= 2) {
    finishedLaps.forEach(lap => {
      if (lap < min) {
        min = lap;
      }
      if (lap > max) {
        max = lap;
      }
    });
  }

  const startTime = () => {
    const now = new Date().getTime();
    setStart(now);
    setNow(now);
    setLap([0]);
    unsubcribe = setInterval(() => {
      setNow(new Date().getTime());
    }, 100);
    setIsStart(true);
  };

  const lapTime = () => {
    const timestamp = new Date().getTime();
    const [firstLap, ...other] = lap;
    setLap([0, firstLap + now - start, ...other]);
    setStart(timestamp);
    setNow(timestamp);
  };

  const stopTime = () => {
    clearInterval(unsubcribe);
    const [firstLap, ...other] = lap;
    setLap([firstLap + now - start, ...other]);
    setStart(0);
    setNow(0);
    setIsStop(true);
    setIsStart(false);
  };

  const reset = () => {
    setLap([]);
    setNow(0);
    setStart(0);
    setIsStart(false);
    setIsStop(false);
  };

  const resume = () => {
    const now = new Date().getTime();
    setStart(now);
    setNow(now);
    unsubcribe = setInterval(() => {
      setNow(new Date().getTime());
    }, 100);
    setIsStop(false);
    setIsStart(true);
  };

  return (
    <View style={styles.container}>
      {/*HEADER*/}
      <View style={styles.header}>
        <Text style={styles.headerText}>Bấm giờ</Text>
      </View>
      {/*TIMER*/}
      <View style={styles.timerView}>
        <Text style={styles.timerText}>
          {converTime(lap.reduce((total, curr) => total + curr, 0) + timer)}
        </Text>
      </View>
      {/*BUTTON*/}
      <View style={styles.btnView}>
        <TouchableOpacity
          disabled={isStart || isStop ? false : true}
          onPress={isStart ? lapTime : isStop ? reset : null}
          activeOpacity={0.7}
          style={[
            {
              backgroundColor:
                isStart || isStop ? 'rgba(61,61,61,1)' : 'rgba(21,21,21,1)',
            },
            styles.button,
          ]}>
          <View style={styles.borderButton}>
            <Text
              style={[
                {color: isStart || isStop ? 'white' : 'rgba(142,141,146,1)'},
                styles.title,
              ]}>
              {isStop ? 'Đặt lại' : 'Vòng'}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={isStart ? stopTime : isStop ? resume : startTime}
          activeOpacity={0.7}
          style={[
            {
              backgroundColor: isStart
                ? 'rgba(61,21,19,1)'
                : 'rgba(26,54,31,1)',
            },
            styles.button,
          ]}>
          <View style={styles.borderButton}>
            <Text
              style={[
                {color: isStart ? 'rgba(233,63,61,1)' : 'rgba(82,209,107,1)'},
                styles.title,
              ]}>
              {isStart ? 'Dừng' : 'Bắt đầu'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {/*LIST*/}
      <ScrollView style={styles.scrollLap}>
        {lap.map((item, index) => {
          return (
            <View key={lap.length - index} style={styles.lapView}>
              <Text
                style={[
                  {
                    color:
                      item === min
                        ? 'rgba(82,209,107,1)'
                        : item === max
                        ? 'rgba(234,66,58,1)'
                        : 'white',
                  },
                  styles.lapText,
                ]}>
                Vòng {lap.length - index}
              </Text>
              <Text
                style={[
                  {
                    color:
                      item === min
                        ? 'rgba(82,209,107,1)'
                        : item === max
                        ? 'rgba(234,66,58,1)'
                        : 'white',
                  },
                  ,
                  styles.lapText,
                ]}>
                {index == 0 ? converTime(timer + item) : converTime(item)}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    backgroundColor: 'rgba(24,24,24,1)',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
  },
  timerView: {
    marginTop: 90,
    alignItems: 'center',
  },
  timerText: {
    color: 'white',
    fontSize: 90,
    fontWeight: '200',
  },
  btnView: {
    marginTop: 90,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  button: {
    height: 100,
    width: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
  },
  borderButton: {
    height: 95,
    width: 95,
    borderRadius: 50,
    borderColor: 'black',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollLap: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  lapView: {
    borderTopColor: 'rgba(49,49,49,1)',
    borderTopWidth: 1,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lapText: {
    fontSize: 17,
  },
});

export default HomeScreen;
