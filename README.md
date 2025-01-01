# WebDevelopment
- Cài đặt các node module (npm) :
    1. Dùng terminal (command line) và `cd` đến thư mục chứa thư mục src.
    2. Chạy `npm init`
    3. Cài các module sau: bcryptjs (2.4.3), bootstrap (5.3.3), boxicons (2.1.4), cookie-parser (1.4.7), crypto (1.0.1), csv-parser (3.0.0) ejs (3.1.10), express-session (1.18.1), express (4.21.2), method-override (3.0.0), mongodb (6.10.0), mongoose (8.8.4), nodemailer (6.9.16), passport-local (1.0.0), passport (0.7.0), pdfkit (0.16.0) \
Có thể dùng câu lệnh sau để cài đặt nhanh: `npm i bcryptjs bootstrap boxicons cookie-parser crypto csv-parser ejs express-session express method-override mongodb mongoose nodemailer passport-local passport pdfkit`
- Cơ sở dữ liệu :
Mã nguồn đã kết nối với cơ sở dữ liệu hiện có được host online. \
Để xem cơ sở dữ liệu, có thể dùng MongoDB Compass [https://www.mongodb.com/products/tools/compass](https://www.mongodb.com/products/tools/compass), chọn add new connection và nhập connection URI `mongodb+srv://tri:123@webdevelopmentdb.g0uza.mongodb.net/?retryWrites=true&w=majority&appName=WebDevelopmentDB`
Hoặc có thể tạo cơ sở dữ liệu mới như trong db.zip và thay đổi connection URI cho hàm `connectDB` của file connectDB.js trong thư mục db (trong src)
- Chạy server :
Trong thư mục cha của thư mục src, chạy lệnh `node ./src/server.js` để mở server. \
Hoặc thêm script `"start" : "node ./src/server.js"` trong phần scripts ở file package.json do npm tạo ra, sau đó chạy lệnh `npm run start`. \
Địa chỉ và port server sẽ được hiển thị trong console khi server bắt đầu chạy.
