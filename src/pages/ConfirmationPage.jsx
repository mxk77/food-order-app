import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/ConfirmationPage.css';

export default function ConfirmationPage() {
  const { clearCart } = useCart();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', phone: '', addresses: [] });
  
  const [orderData, setOrderData] = useState({
    name: '',
    phone: '',
    address: '',
    deliveryTime: '',
  });

  const [formErrors, setFormErrors] = useState({}); // Стан для помилок валідації
  const [useExistingAddress, setUseExistingAddress] = useState(true);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);

  useEffect(() => {
    const userIsExplicitlyLoggedIn = sessionStorage.getItem('isUserLoggedIn') === 'true';
    setIsLoggedIn(userIsExplicitlyLoggedIn);

    if (userIsExplicitlyLoggedIn) {
      const storedUserData = sessionStorage.getItem('userData');
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData);
        setProfileData(parsedData);
        const hasAddresses = parsedData.addresses && parsedData.addresses.length > 0;
        setUseExistingAddress(hasAddresses);
        setOrderData(prev => ({
          ...prev,
          name: parsedData.name || '',
          phone: parsedData.phone || '',
          address: hasAddresses ? parsedData.addresses[0] : '',
        }));
      } else {
        setIsLoggedIn(false);
        sessionStorage.setItem('isUserLoggedIn', 'false');
        setProfileData({ name: '', phone: '', addresses: [] });
        setOrderData({ name: '', phone: '', address: '', deliveryTime: '' });
        setUseExistingAddress(false);
      }
    } else {
      setProfileData({ name: '', phone: '', addresses: [] });
      setOrderData(prev => ({
        name: '', phone: '', address: '',
        deliveryTime: prev.deliveryTime, // Зберігаємо час, якщо він був введений
      }));
      setUseExistingAddress(false);
    }
  }, []);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) error = "Ім'я є обов'язковим полем.";
        else if (value.trim().length < 2) error = "Ім'я має містити щонайменше 2 символи.";
        else if (!/^[a-zA-Zа-яА-ЯіІїЇєЄґҐ'-\s]+$/.test(value)) error = "Ім'я може містити лише літери, пробіли, дефіс та апостроф.";
        break;
      case 'phone':
        const cleanedPhone = value.replace(/[^\d+]/g, ''); // Видаляємо все, крім цифр та '+'
        if (!cleanedPhone) error = "Телефон є обов'язковим полем.";
        else if (!/^(?:\+380\d{9}|0\d{9})$/.test(cleanedPhone)) {
          error = 'Введіть дійсний український номер (+380ХХХХХХХХХ або 0ХХХХХХХХХ).';
        }
        break;
      case 'address':
        if (!value.trim()) error = "Адреса є обов'язковим полем.";
        else if (value.trim().length < 5) error = "Адреса має містити щонайменше 5 символів.";
        break;
      case 'deliveryTime':
        if (!value.trim()) error = "Час доставки є обов'язковим полем.";
        break;
      default:
        break;
    }
    return error;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Очищаємо помилку для поточного поля при зміні
    setFormErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    
    setOrderData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setFormErrors(prevErrors => ({ ...prevErrors, [name]: error }));
  };


  const handleOrderSubmit = (e) => {
    e.preventDefault();
    const currentErrors = {};
    let formIsValid = true;

    // Валідація всіх полів перед відправкою
    Object.keys(orderData).forEach(key => {
      const error = validateField(key, orderData[key]);
      if (error) {
        currentErrors[key] = error;
        formIsValid = false;
      }
    });
    setFormErrors(currentErrors);

    if (!formIsValid) {
      const firstErrorFieldKey = Object.keys(currentErrors).find(key => currentErrors[key]);
      if (firstErrorFieldKey) {
        const firstErrorElement = document.getElementById(firstErrorFieldKey);
        if (firstErrorElement) {
          firstErrorElement.focus();
        }
      }
      return;
    }
    
    console.log('Дані замовлення:', orderData);
    clearCart();
    setIsOrderConfirmed(true);
  };

  if (isOrderConfirmed) {
    return (
      <div className="confirmation-page-container order-confirmed-container">
        <h1 className="confirmation-page-title">Замовлення успішно оформлено!</h1>
        <p className="confirmation-page-message">Дякуємо за ваше замовлення. Ми зв’яжемося з вами найближчим часом для уточнення деталей.</p>
        <div className="confirmation-page__back-link-container">
          <Link to="/" className="confirmation-page__back-link">← Повернутись до меню</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation-page-container">
      <h1 className="confirmation-page-title">Оформлення замовлення</h1>
      <form onSubmit={handleOrderSubmit} className="confirmation-form" noValidate>
        <div className="form-group">
          <label htmlFor="name" className="form-label">Ім'я:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={orderData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${formErrors.name ? 'form-input--error' : ''}`}
            aria-invalid={!!formErrors.name}
            aria-describedby="nameError"
            required
          />
          {formErrors.name && <span id="nameError" className="form-error-message" aria-live="polite">{formErrors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone" className="form-label">Телефон:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="+380 XX XXX XX XX"
            value={orderData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${formErrors.phone ? 'form-input--error' : ''}`}
            aria-invalid={!!formErrors.phone}
            aria-describedby="phoneError"
            required
          />
          {formErrors.phone && <span id="phoneError" className="form-error-message" aria-live="polite">{formErrors.phone}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="address" className="form-label">Адреса доставки:</label>
          {isLoggedIn && profileData.addresses && profileData.addresses.length > 0 ? (
            <>
              <div className="form-radio-group">
                <label className="form-radio-label">
                  <input
                    type="radio"
                    name="addressOption"
                    value="existing"
                    checked={useExistingAddress}
                    onChange={() => {
                      setUseExistingAddress(true);
                      if (profileData.addresses && profileData.addresses.length > 0) {
                        setOrderData(prev => ({ ...prev, address: profileData.addresses[0] }));
                        setFormErrors(prev => ({ ...prev, address: '' })); // Clear error
                      }
                    }}
                  />
                  Вибрати збережену адресу
                </label>
                <label className="form-radio-label">
                  <input
                    type="radio"
                    name="addressOption"
                    value="new"
                    checked={!useExistingAddress}
                    onChange={() => {
                      setUseExistingAddress(false);
                      setOrderData(prev => ({ ...prev, address: '' }));
                      setFormErrors(prev => ({ ...prev, address: '' })); // Clear error
                    }}
                  />
                  Ввести нову адресу
                </label>
              </div>

              {useExistingAddress ? (
                <select
                  id="address" // id for label
                  name="address"
                  value={orderData.address}
                  onChange={(e) => {
                     setOrderData(prev => ({ ...prev, address: e.target.value }));
                     setFormErrors(prev => ({ ...prev, address: '' })); // Clear error
                  }}
                  onBlur={handleBlur} // Add onBlur for select as well
                  className={`form-select ${formErrors.address ? 'form-input--error' : ''}`}
                  aria-invalid={!!formErrors.address}
                  aria-describedby="addressError"
                >
                  {profileData.addresses.map((addr, index) => (
                    <option key={index} value={addr}>{addr}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  id="address" // id for label
                  name="address"
                  placeholder="Введіть нову адресу"
                  value={orderData.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${formErrors.address ? 'form-input--error' : ''}`}
                  aria-invalid={!!formErrors.address}
                  aria-describedby="addressError"
                  required
                />
              )}
            </>
          ) : (
            <input
              type="text"
              id="address" // id for label
              name="address"
              placeholder="Введіть адресу доставки"
              value={orderData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${formErrors.address ? 'form-input--error' : ''}`}
              aria-invalid={!!formErrors.address}
              aria-describedby="addressError"
              required
            />
          )}
          {formErrors.address && <span id="addressError" className="form-error-message" aria-live="polite">{formErrors.address}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="deliveryTime" className="form-label">Бажаний час доставки:</label>
          <input
            type="time"
            id="deliveryTime"
            name="deliveryTime"
            value={orderData.deliveryTime}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${formErrors.deliveryTime ? 'form-input--error' : ''}`}
            aria-invalid={!!formErrors.deliveryTime}
            aria-describedby="deliveryTimeError"
            required
          />
          {formErrors.deliveryTime && <span id="deliveryTimeError" className="form-error-message" aria-live="polite">{formErrors.deliveryTime}</span>}
        </div>

        <button type="submit" className="btn btn--primary confirmation-form__submit-button">
          Підтвердити замовлення
        </button>
      </form>
      <div className="confirmation-page__back-link-container">
        <Link to="/cart" className="confirmation-page__back-link">← Повернутись до кошика</Link>
      </div>
    </div>
  );
}