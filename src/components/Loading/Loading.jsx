import { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css'; // استيراد الأنماط الخاصة بالمكتبة

const LoadingIndicator = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // محاكاة تحميل البيانات
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
    <div className="flex justify-center items-center min-h-screen">
      <div className="relative">
        {/* دائرة التقدم */}
        <CircularProgressbar
          value={progress}
          text={`${progress}%`}
          styles={buildStyles({
            // تخصيص ألوان التقدم
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
