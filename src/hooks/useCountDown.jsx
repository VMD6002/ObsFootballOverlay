import { useState, useEffect } from "react";

// const TIMEOUTS = {
//     timeouts: [],
//     setTimeout: function (fn, delay) {
//       const id = setTimeout(fn, delay);
//       this.timeouts.push(id);
//     },
//     clearAllTimeouts: function () {
//       while (this.timeouts.length) {
//         clearTimeout(this.timeouts.pop());
//       }
//     },
//   };

export default function useCountDown(IntervalTime) {
  const [time, setTime] = useState({ start: 0, stop: 0 });
  const [counter, setCountDown] = useState(Number(time.start) * 60);
  const [extra, setExtra] = useState(0);
  const [startCountDown, setStartCountDown] = useState(false);
  const start = () => {
    setStartCountDown(true);
  };
  const pause = () => {
    setStartCountDown(false);
  };
  const reset = (e) => {
    setStartCountDown(false);
    setCountDown(e * 60);
    setExtra(0);
  };
  useEffect(() => {
    let interval = null;
    if (startCountDown) {
      interval = setInterval(() => {
        if (counter < Number(time.stop) * 60) {
          setCountDown((counter) => counter + 1);
        } else {
          setExtra((extra) => extra + 1);
        }
      }, IntervalTime);
    } else if (!startCountDown && counter !== Number(start) * 60) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [startCountDown, counter, time, start]);

  return {
    counter,
    setCountDown,
    setExtra,
    setTime,
    start,
    pause,
    reset,
    extra,
  };
}
