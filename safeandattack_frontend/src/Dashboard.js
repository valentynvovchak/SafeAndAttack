import React, { useState, useEffect } from 'react';
import axios from './api';
import ReCAPTCHA from 'react-google-recaptcha';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [ads, setAds] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Електроніка',
    captcha: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get('ads/');
        setAds(response.data);
      } catch (error) {
        console.error('Помилка під час отримання оголошень', error);
      }
    };
    fetchAds();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCaptcha = (token) => {
    setFormData({ ...formData, captcha: token });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('ads/create/', formData);
      setMessage('Оголошення успішно створено!');
      setAds([...ads, response.data]);
      setFormData({ title: '', description: '', price: '', category: 'Електроніка', captcha: '' });
    } catch (error) {
      setMessage('Помилка: ' + (error.response?.data?.error || 'Спробуйте ще раз.'));
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`ads/${id}/`);
      setAds(ads.filter((ad) => ad.id !== id));
    } catch (error) {
      console.error('Помилка під час видалення оголошення', error);
    }
  };

  return (
    <div>
      <div className="container my-5">
        <div className="row">
          <div className="col-md-6">
            <div className="card p-4 shadow-sm">
              <h2>Створення оголошення</h2>
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
                  <select
                    className="form-control"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="Електроніка">Електроніка</option>
                    <option value="Нерухомість">Нерухомість</option>
                    <option value="Авто">Авто</option>
                    <option value="Робота">Робота</option>
                    <option value="Послуги">Послуги</option>
                    <option value="Одяг та мода">Одяг та мода</option>
                    <option value="Дім та сад">Дім та сад</option>
                    <option value="Спорт і відпочинок">Спорт і відпочинок</option>
                    <option value="Дитячі товари">Дитячі товари</option>
                    <option value="Тварини">Тварини</option>
                  </select>
                </div>
                <div className="mb-3">
                  <ReCAPTCHA
                    sitekey="6LfSSIUqAAAAAKmylPmp1DsQ21QZiH4ZmjmLFX1N"
                    onChange={handleCaptcha}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Створити</button>
              </form>
            </div>
          </div>
          <div className="col-md-6">
            <h2>Ваші оголошення</h2>
            <div className="list-group">
              {ads.map((ad) => (
                <div className="list-group-item d-flex justify-content-between align-items-center" key={ad.id}>
                  <div>
                    <h5>{ad.title}</h5>
                    <p>{ad.description}</p>
                    <p><strong>Ціна:</strong> {ad.price} грн</p>
                    <p><strong>Категорія:</strong> {ad.category}</p>
                    <p><strong>Створено:</strong> {new Date(ad.created_at).toLocaleString()}</p>
                  </div>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(ad.id)}
                  >
                    Видалити
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
