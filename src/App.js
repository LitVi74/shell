import {useCallback, useState} from "react";
import Notification from "./Notification/Notification";

function App() {
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({
    status: "success",
    label: "Успешно",
    text: "Изменения успешно сохранены",
  })

  const simulateServer = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (Math.random() > 0.5) {
        return resolve();
      }
      const t = setTimeout(() => {
        reject();
        return clearTimeout(t);
      }, 1000);
    });
  }, []);

  const handleButtonClick = useCallback(() => {
    simulateServer()
      .then(() => {
        setShowNotification(false);
      })
      .then(() => {
        setNotification({
          status: "success",
          label: "Успешно",
          text: "Изменения успешно сохранены",
        })
      })
      .catch(() => {
        setNotification({
          status: "error",
          label: "Изменения не сохранены",
          text: "Потеря интернет соединения",
        })
      })
      .finally(() => {
        setShowNotification(true);
      })
  }, [])

  return (
    <main>
      <button onClick={handleButtonClick}>Сохранить</button>
      {showNotification && (<Notification
        status={notification.status}
        label={notification.label}
        text={notification.text}
        setShow={setShowNotification}
      />)}
    </main>
  );
}

export default App;
