from flask import Flask, render_template, request, redirect, session, jsonify
import hashlib
import pyodbc

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Khóa bí mật để quản lý session

# Kết nối SQL Server
try:
    conn = pyodbc.connect(
        'DRIVER={ODBC Driver 17 for SQL Server};'
        'SERVER=DESKTOP-LJK736C\\SQLEXPRESS;'  
        'DATABASE=SensorData;'  
        'Trusted_Connection=yes;'
    )
    cursor = conn.cursor()
    print("Kết nối thành công với SQL Server")
except Exception as e:
    print(f"Lỗi kết nối với SQL Server: {e}")
    exit()

# Mã hóa mật khẩu bằng MD5
def encrypt_password(password):
    return hashlib.md5(password.encode()).hexdigest()

# Trang chủ - kiểm tra đăng nhập
@app.route('/')
def index():
    if 'logged_in' in session:  # Nếu đã đăng nhập
        return redirect('/dashboard')  # Chuyển đến trang dashboard
    return redirect('/login')  # Nếu chưa đăng nhập, chuyển đến trang đăng nhập

# Trang dashboard sau khi đăng nhập thành công
@app.route('/dashboard')
def dashboard():
    if 'logged_in' in session:  # Kiểm tra session đăng nhập
        return render_template('index.html')
    else:
        return redirect('/login')

# Trang đăng nhập
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = encrypt_password(request.form['password'])  # Mã hóa mật khẩu người dùng nhập

        # Truy vấn cơ sở dữ liệu để kiểm tra thông tin đăng nhập
        cursor.execute('SELECT * FROM users WHERE username = ? AND password = ?', (username, password))
        user = cursor.fetchone()

        if user:
            # Nếu thông tin hợp lệ, lưu vào session và chuyển đến trang dashboard
            session['logged_in'] = True
            session['username'] = username
            return redirect('/dashboard')
        else:
            return "Sai tên người dùng hoặc mật khẩu", 401  # Trả về lỗi nếu sai thông tin

    return render_template('login.html')  # Hiển thị form đăng nhập

# Đăng xuất
@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    session.pop('username', None)
    return redirect('/login')

# Trang dự đoán sản lượng
@app.route('/dudoan')
def dudoan():
    if 'logged_in' in session:  # Kiểm tra nếu người dùng đã đăng nhập
        return render_template('dudoan.html')  # Trả về trang dudoan
    else:
        return redirect('/login')  # Nếu chưa đăng nhập, chuyển đến trang login

if __name__ == '__main__':
    app.run(debug=True)
