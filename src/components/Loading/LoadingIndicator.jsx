import { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const LoadingIndicator = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval); 
          return 100;
        }
        return prevProgress + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center my-[10rem]">
      <div className="relative w-[150px] h-[150px]" >
        <CircularProgressbar
          value={progress}
          text={`${progress}%`}
          styles={buildStyles({
            pathColor: 'primary',
            textColor: '#000',
            trailColor: '#e5e7eb',
            strokeLinecap: 'round',
          })}
        />
      </div>
    </div>
  );
};

export default LoadingIndicator;
