// public/firebase-messaging-sw.js
/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAIn6goAO6xiBXfi-DCYGTaV_nhrb5KNxk",
  authDomain: "tarshula-e3a32.firebaseapp.com",
  projectId: "tarshula-e3a32",
  storageBucket: "tarshula-e3a32.firebasestorage.app",
  messagingSenderId: "70257379047",
  appId: "1:70257379047:web:35c1426c969737c0244442"
});

const messaging = firebase.messaging();

// استقبال الرسائل في الخلفية (عندما يكون التطبيق مغلق)
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] تم استلام رسالة في الخلفية: ', payload);
  
  // تخصيص الإشعار الذي سيظهر للمستخدم
  const notificationTitle = payload.notification.title || 'إشعار جديد';
  const notificationOptions = {
    body: payload.notification.body || 'لديك رسالة جديدة',
    icon: '/logo192.png',
    // يمكنك إضافة المزيد من الخيارات:
    // badge: '/badge-icon.png',
    // image: '/notification-image.jpg',
    data: payload.data,
    // actions: [
    //   { action: 'open', title: 'فتح' },
    //   { action: 'close', title: 'إغلاق' },
    // ],
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// التعامل مع النقر على الإشعار
self.addEventListener('notificationclick', function(event) {
  console.log('تم النقر على الإشعار', event);
  
  event.notification.close();
  
  // افتح نافذة أو صفحة معينة عند النقر على الإشعار
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({type: 'window'}).then(windowClients => {
      // تحقق إذا كانت النافذة مفتوحة بالفعل
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.indexOf(urlToOpen) !== -1 && 'focus' in client) {
          return client.focus();
        }
      }
      
      // إذا لم تكن النافذة مفتوحة، افتح نافذة جديدة
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});