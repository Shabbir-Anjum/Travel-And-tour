import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

function Countdown({ startDate }) {
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    const currentDate = new Date();
    const durationInSeconds = Math.floor((startDate - currentDate) / 1000);
    const days = Math.ceil(durationInSeconds / (24 * 3600));

    setDaysRemaining(days);
  }, [startDate]);

  const countdownTextStyle = {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#D1FFA0",
  };

  const countdownCircleSize = 65;

  const calculatePercentage = () => {
    return (daysRemaining / (daysRemaining + 1)) * 100; // +1 to avoid division by zero
  };

  return (
    <>
      <CountdownCircleTimer
        isPlaying
        duration={daysRemaining * 24 * 3600}
        colors={["#B726DC", "#D1FFA0"]}
        size={countdownCircleSize}
        strokeWidth={3}
        rotation="clockwise"
        trailColor="#B726DC"
      >
        {({ remainingTime }) => (
          <Text style={countdownTextStyle}>
            {Math.ceil(remainingTime / 86400)} days
          </Text>
        )}
      </CountdownCircleTimer>
    </>
  );
}

export default Countdown;
