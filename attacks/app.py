from flask import Flask, request, render_template, redirect
import sqlite3

app = Flask(__name__)

DB_PATH = 'db.sqlite3'

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL
    );
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL
    );
    """)

init_db()

@app.route('/')
def index():
    return redirect('/login')

@app.route('/login', methods=['GET', 'POST'])
def login():
    error_message = None
    success_message = None

    if request.method == 'POST':
        email = request.form.get('email', '')
        password = request.form.get('password', '')
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        query = f"SELECT * FROM users WHERE email = '{email}' AND password = '{password}'"
        cursor.execute(query)
        user = cursor.fetchone()
        conn.close()
        if user:
            success_message = "Авторизація успішна!"
            return render_template('ads.html', success_message=success_message)
        else:
            error_message = "Помилка авторизації. Неправильний email або пароль."
    
    return render_template('login.html', error_message=error_message)


@app.route('/ads', methods=['GET', 'POST'])
def ads():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    if request.method == 'POST':
        title = request.form.get('title', '')
        description = request.form.get('description', '')
        query = f"INSERT INTO ads (title, description) VALUES (?, ?)"
        cursor.execute(query, (title, description))
        conn.commit()
    cursor.execute("SELECT * FROM ads")
    ads = cursor.fetchall()
    conn.close()
    return render_template('ads.html', ads=ads)


if __name__ == '__main__':
    app.run(debug=False)
