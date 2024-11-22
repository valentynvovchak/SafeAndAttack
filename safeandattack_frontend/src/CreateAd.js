import React, { useState } from 'react';
import axios from './api';
import { Turnstile } from 'react-turnstile'; // Імпортуємо Turnstile компонент
import { Link } from 'react-router-dom';
function Dashboard() {
    return (
      <div className="container my-5">
        <h1>Dashboard</h1>
        <Link to="/sandbox" className="btn btn-warning mt-3">
          Перейти до пісочниці атак
        </Link>
        {/* Інший код сторінки */}
      </div>
    );
  }
function CreateAd() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    captchaResponse: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCaptcha = (token) => {
    setFormData({ ...formData, captchaResponse: token }); // Зберігаємо токен CAPTCHA
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('ads/create/', formData);
      setMessage('Оголошення успішно створено!');
    } catch (error) {
      setMessage('Помилка: ' + (error.response?.data?.error || 'Спробуйте ще раз.'));
    }
  };

  return (
    <div className="container">
      <h1>Створення оголошення</h1>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Назва</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Опис</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Ціна</label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Категорія</label>
          <input
            type="text"
            className="form-control"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <div className="form-label">Підтвердження</div>
          <Turnstile
            sitekey="0x4AAAAAAA0gYwVMNIEhXouM   " // Замініть на ваш Site Key
            onSuccess={handleCaptcha} // Викликається після успішного проходження CAPTCHA
          />
        </div>
        <button type="submit" className="btn btn-primary">Створити</button>
      </form>
    </div>
    
  );
}

export default CreateAd;
