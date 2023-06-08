import React, {useCallback, useMemo, useState} from 'react';
import successIcon from '../assets/success.svg';
import errorIcon from '../assets/error.svg';

import './notification.css';

const Notification = ({status, label, text, setShow}) => {
  const [progressState, setProgressState] = useState(100);

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
      }
    };
  };

  let progressStateTimer = useMemo(() => createPausableTimer(
    function tick(progressState) {
        setProgressState(progressState - 5.5);
        progressStateTimer = createPausableTimer(tick, 150, progressState - 5.5);
    },
    150,
    progressState
  ), []);

  const showTimer = useMemo(() => createPausableTimer(
    () => {
        setShow(false);
      },
    3000,
  ), []);

  const handleNotificationMouseOver = useCallback(() => {
    showTimer.pause();
    progressStateTimer.pause()
  }, [])

  const handleNotificationMouseOut = useCallback(() => {
    showTimer.resume();
    progressStateTimer.resume()
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