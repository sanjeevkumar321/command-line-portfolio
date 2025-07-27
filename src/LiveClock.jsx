import React, { useEffect, useState } from "react";

function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup
  }, []);

  return <div>{time.toLocaleString("sv-SE").replace("T", " ")}</div>;
}

export default LiveClock;
