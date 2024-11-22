import React, { useState } from 'react';
import axios from './api'; // Налаштований інтерфейс для запитів

function Sandbox() {
  const [attackType, setAttackType] = useState('');
  const [inputData, setInputData] = useState('');
  const [result, setResult] = useState('');

  const handleAttack = async () => {
    try {
      let response;
      switch (attackType) {
        case 'brute-force':
          response = await axios.post('sandbox/brute-force/', { username: inputData });
          break;
        case 'sql-injection':
          response = await axios.post('sandbox/sql-injection/', { query: inputData });
          break;
        case 'xss':
          response = await axios.post('sandbox/xss/', { input: inputData });
          break;
        case 'csrf':
          response = await axios.post('sandbox/csrf/', { action: inputData });
          break;
        case 'ddos':
          response = await axios.post('sandbox/ddos/', { count: inputData });
          break;
        case 'data-leak':
          response = await axios.get(`sandbox/data-leak/${inputData}/`);
          break;
        default:
          throw new Error('Невідомий тип атаки');
      }
      setResult(response.data.result);
    } catch (error) {
      setResult('Помилка: ' + (error.response?.data?.detail || 'Спробуйте ще раз.'));
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center">Пісочниця для атак</h1>
      <div className="card p-4 shadow-sm">
        <div className="mb-3">
          <label htmlFor="attackType" className="form-label">Тип атаки</label>
          <select
            className="form-control"
            id="attackType"
            value={attackType}
            onChange={(e) => setAttackType(e.target.value)}
          >
            <option value="">Виберіть атаку</option>
            <option value="brute-force">Brute-force</option>
            <option value="sql-injection">SQL Injection</option>
            <option value="xss">XSS</option>
            <option value="csrf">CSRF</option>
            <option value="ddos">DDoS</option>
            <option value="data-leak">Витік даних</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="inputData" className="form-label">Дані для атаки</label>
          <textarea
            className="form-control"
            id="inputData"
            rows="3"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
          ></textarea>
        </div>
        <button className="btn btn-danger" onClick={handleAttack}>Виконати атаку</button>
      </div>
      <div className="mt-4">
        <h3>Результат атаки:</h3>
        <pre className="bg-light p-3">{result}</pre>
      </div>
    </div>
  );
}

export default Sandbox;
