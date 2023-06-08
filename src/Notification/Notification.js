import React, {useCallback, useEffect, useRef, useState} from 'react';
import successIcon from '../assets/success.svg';
import errorIcon from '../assets/error.svg';

import './notification.css';

const Notification = ({status, label, text, setShow}) => {
  const [progressState, setProgressState] = useState(100);
  let refProgressStateTimer = useRef(null);
  let refShowTimer = useRef(null);

  const createPausableTimer = (cb, timeout, ...args) => {
    let lastStart = Date.now();
    let paused = false;
    let timerID = setTimeout(cb, timeout, ...args);
    let remainingTime = timeout;
    return {
      pause() {
        if(paused) { return; }
        clearTimeout(timerID);
        paused = true;
        remainingTime -= Date.now() - lastStart;
      },
      resume() {
        if(!paused || remainingTime < 0) { return; }
        lastStart = Date.now();
        paused = false;
        timerID = setTimeout(cb, remainingTime, ...args);
      },
      clear() {
        clearTimeout(timerID);
      }
    };
  };

  let progressStateTimer = useCallback((progressState) => createPausableTimer(
    function tick(progressState) {
      setProgressState(progressState - 5.5);
      refProgressStateTimer.current = createPausableTimer(tick, 150, progressState - 5.5);
    },
    150,
    progressState
  ), []);

  const showTimer = useCallback(() => createPausableTimer(
    () => {
        setShow(false);
      },
    3000,
  ), []);

  useEffect( () => {
    refShowTimer.current = showTimer();
    refProgressStateTimer.current = progressStateTimer(progressState);

    return function cleanup () {
      refShowTimer?.current.clear();
      refProgressStateTimer.current.clear();
    }
  }, [])

  const handleNotificationMouseOver = useCallback(() => {
    refShowTimer?.current.pause();
    refProgressStateTimer?.current.pause()
  }, [])

  const handleNotificationMouseOut = useCallback(() => {
    refShowTimer?.current.resume();
    refProgressStateTimer.current.resume()
  }, [])

  return (
    <div
      className="notification"
      onMouseOver={handleNotificationMouseOver}
      onMouseOut={handleNotificationMouseOut}
    >
      <img
        src={status === 'success' ? successIcon : errorIcon}
        alt={`notification ${status} icon`}
        className="notification__icon"
      />
      <h3 className="notification__title">
        {label}
      </h3>
      <span className="notification__message">
        {text}
      </span>
      <div className="notification__progress--bg">
        <div
          className="notification__progress--bar"
          style={{width: `${progressState}%`}}
        ></div>
      </div>
    </div>
  );
};

export default Notification;