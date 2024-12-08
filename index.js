const net = require('net');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// مسیر فایل ذخیره اطلاعات
const filePath = path.join(__dirname, 'note.txt');

// تابع برای اضافه کردن 3 ساعت و 30 دقیقه به زمان
function addTime(date, hours, minutes) {
    date.setHours(date.getHours() + hours); // اضافه کردن ساعت
    date.setMinutes(date.getMinutes() + minutes); // اضافه کردن دقیقه
    return date;
}

// ایجاد سرور TCP
const server = net.createServer(socket => {
    const connectionId = uuidv4(); // ایجاد شناسه یونیک برای هر اتصال
    let connectTime = new Date(); // زمان اتصال
    connectTime = addTime(connectTime, 3, 30); // اضافه کردن 3 ساعت و 30 دقیقه به زمان اتصال

    // نوشتن اطلاعات اتصال به فایل
    fs.appendFile(filePath, `[${connectTime.toISOString()}] Connection established. ID: ${connectionId}\n`, err => {
        if (err) {
            console.error('Error writing to file:', err);
        }
    });

    console.log(`New connection established. ID: ${connectionId}, Time: ${connectTime.toISOString()}`);

    // دریافت داده از کلاینت
    socket.on('data', data => {
        const message = data.toString();
        let timestamp = new Date(); // زمان دریافت پیام
        timestamp = addTime(timestamp, 3, 30); // اضافه کردن 3 ساعت و 30 دقیقه به زمان دریافت پیام

        // نوشتن شناسه و زمان دریافت پیام به فایل
        fs.appendFile(filePath, `[${timestamp.toISOString()}] [ID: ${connectionId}] : ${message}\n`, err => {
            if (err) {
                console.error('Error writing to file:', err);
            }
        });

        console.log(`[${timestamp.toISOString()}] [ID: ${connectionId}] : ${message}`);
    });

    // مدیریت قطع اتصال کلاینت
    socket.on('end', () => {
        let disconnectTime = new Date(); // زمان قطع اتصال
        disconnectTime = addTime(disconnectTime, 3, 30); // اضافه کردن 3 ساعت و 30 دقیقه به زمان قطع اتصال

        // نوشتن اطلاعات قطع اتصال به فایل
        fs.appendFile(filePath, `[${disconnectTime.toISOString()}] Connection closed. ID: ${connectionId}\n`, err => {
            if (err) {
                console.error('Error writing to file:', err);
            }
        });

        console.log(`Connection closed. ID: ${connectionId}, Time: ${disconnectTime.toISOString()}`);
    });

    // مدیریت خطاها
    socket.on('error', err => {
        console.error('Socket error:', err);
    });
});

// تنظیم سرور برای گوش دادن روی پورت 14200
const PORT = 14200;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
