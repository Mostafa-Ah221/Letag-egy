// notification.js
import { messaging } from "./firebase"; 
import { getToken, onMessage } from "firebase/messaging";

// الحصول على توكن الإشعارات
export const requestForToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const currentToken = await getToken(messaging, {
        vapidKey: "BF0GOuTB8_VGDetnuUhc-cnYaIYz7Qk8y4ClV67IexDLXCnJLhwPcelDklq_sSdu8kqktFVFq1ZBqW5a-3KNJyQ"
      });

      if (currentToken) {
        console.log("FCM Token:", currentToken);
        
        await sendTokenToApi(currentToken);
        return currentToken;
      } else {
        console.log("لا يوجد توكن متاح.");
        return null;
      }
    } else {
      console.log("لم يتم السماح بالإشعارات.");
      return null;
    }
  } catch (err) {
    console.log("خطأ أثناء جلب التوكن:", err);
    return null;
  }
};

// دالة لإرسال الـ Token إلى API
const sendTokenToApi = async (token) => {
  try {
    const api_key="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"
    const response = await fetch('https://tarshulah.com/api/fcm_token/store', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        APP_KEY: api_key,
      },
      body: JSON.stringify({
        fcm_token: token,  
      }),
    });

    const data = await response.json();
    
    if (data.status) {
      console.log(data.message);
    } else {
      console.log(data.message);
    }
  } catch (err) {
    console.error("حدث خطأ أثناء إرسال التوكن إلى الـ API:", err);
  }
};

export const setupMessageListener = () => {
  onMessage(messaging, (payload) => {
    console.log('تم استلام رسالة أثناء تشغيل التطبيق:', payload);
    
    // معالجة الإشعار
    if (payload.notification) {
      const title = payload.notification.title || 'إشعار جديد';
      const options = {
        body: payload.notification.body || 'لديك رسالة جديدة',
        icon: '/logo192.png',
      };
      
      // عرض إشعار للمستخدم
      if ('Notification' in window && Notification.permission === 'granted') {
        navigator.serviceWorker.getRegistration().then(registration => {
          if (registration) {
            registration.showNotification(title, options);
          }
        });
      }
    }
    
    // معالجة البيانات المرسلة
    if (payload.data) {
      console.log('بيانات الرسالة:', payload.data);
      // يمكنك تنفيذ أي عمليات مطلوبة بناء على البيانات المستلمة
    }
  });
};

export const initializeNotifications = async () => {
  const token = await requestForToken();
  setupMessageListener();
  return token;
};