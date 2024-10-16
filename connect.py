import serial
import time
import pyodbc
import re

# Kết nối với Arduino
try:
    arduino = serial.Serial('COM9', 9600, timeout=1)  # Thay đổi 'COM9' theo cổng đúng của bạn
    print("Kết nối thành công với Arduino")
except Exception as e:
    print(f"Lỗi kết nối với Arduino: {e}")
    exit()

# Kết nối với SQL Server
try:
    conn = pyodbc.connect(
        'DRIVER={ODBC Driver 17 for SQL Server};'
        'SERVER=DESKTOP-LJK736C\\SQLEXPRESS;'  # Thay đổi theo server của bạn
        'DATABASE=SensorData;'  # Tên cơ sở dữ liệu
        'Trusted_Connection=yes;'
    )
    cursor = conn.cursor()
    print("Kết nối thành công với SQL Server")
except Exception as e:
    print(f"Lỗi kết nối với SQL Server: {e}")
    exit()

# Tạo bảng csdl_he_thong nếu chưa tồn tại
cursor.execute('''
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='csdl_he_thong' and xtype='U')
CREATE TABLE csdl_he_thong (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Temperature FLOAT,
    Humidity FLOAT,
    MQ2Value INT,
    SoilMoisture INT,
    LightLevel INT,
    Timestamp DATETIME DEFAULT GETDATE()
)
''')
conn.commit()

while True:
    try:
        # Đọc dữ liệu từ Arduino
        data = arduino.readline().decode('utf-8').strip()
        if data:
            print("Dữ liệu từ Arduino:", data)

            # Parse dữ liệu JSON
            sensor_data = re.match(r'{"Temperature":([\d.]+),"Humidity":([\d.]+),"MQ2Value":(\d+),"SoilMoisture":(\d+),"LightLevel":(\d+)}', data)
            
            if sensor_data:
                temperature = float(sensor_data.group(1))
                humidity = float(sensor_data.group(2))
                mq2_value = int(sensor_data.group(3))
                soil_moisture = int(sensor_data.group(4))
                light_level = int(sensor_data.group(5))

                # Lưu dữ liệu vào SQL Server
                cursor.execute('''
                INSERT INTO csdl_he_thong (Temperature, Humidity, MQ2Value, SoilMoisture, LightLevel)
                VALUES (?, ?, ?, ?, ?)
                ''', (temperature, humidity, mq2_value, soil_moisture, light_level))
                conn.commit()

                print(f"Đã lưu vào SQL Server: {temperature}°C, {humidity}%, MQ-2: {mq2_value}, Độ ẩm đất: {soil_moisture}, Ánh sáng: {light_level}")
            else:
                print("Lỗi: Không phân tích được dữ liệu từ Arduino")

        time.sleep(2)

    except Exception as e:
        print(f"Lỗi: {e}")
        time.sleep(2)
