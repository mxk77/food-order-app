import React, { useState, useEffect } from 'react';
import '../styles/ProfilePage.css'; // Імпортуємо стилі

// Функція хешування пароля (залишається без змін)
async function hashPasswordValue(password) {
  if (!password || typeof password !== 'string' || password.trim() === '') {
    return null;
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: '', phone: '', email: '', password: '', addresses: [], hashedPassword: '' // Додаємо hashedPassword для зберігання
  });
  const [newAddress, setNewAddress] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [loginCredentials, setLoginCredentials] = useState({ phone: '', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const [authMessage, setAuthMessage] = useState({ type: '', text: '' }); // Для повідомлень про успіх/невдачу входу/реєстрації

  useEffect(() => {
    const loggedInStatus = sessionStorage.getItem('isUserLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);
    if (loggedInStatus) {
      const storedUserDataJSON = sessionStorage.getItem('userData');
      if (storedUserDataJSON) {
        const parsedData = JSON.parse(storedUserDataJSON);
        setUserData(prev => ({ ...prev, ...parsedData, password: '' }));
      } else {
        sessionStorage.setItem('isUserLoggedIn', 'false');
        setIsLoggedIn(false);
      }
      setShowLogin(false);
    } else {
      setShowLogin(true);
    }
  }, []);

  const persistUserData = async (currentData) => {
    let dataToStore = { ...currentData };
    if (currentData.password && currentData.password.trim() !== '') {
      const hashedPassword = await hashPasswordValue(currentData.password.trim());
      dataToStore.hashedPassword = hashedPassword;
    }
    delete dataToStore.password; // Видаляємо текстовий пароль перед збереженням
    setUserData(prev => ({ ...prev, ...dataToStore, password: '' })); // Очищуємо поле пароля в формі
    sessionStorage.setItem('userData', JSON.stringify(dataToStore));
  };

  const validateField = (name, value, currentPassword = '') => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) error = "Ім'я є обов'язковим.";
        else if (value.trim().length < 2) error = "Ім'я має містити принаймні 2 символи.";
        else if (!/^[a-zA-Zа-яА-ЯіІїЇєЄґҐ'-\s]+$/.test(value)) error = "Некоректні символи в імені.";
        break;
      case 'phone':
        const cleanedPhone = value.replace(/[^\d+]/g, '');
        if (!cleanedPhone) error = "Телефон є обов'язковим.";
        else if (!/^(?:\+380\d{9}|0\d{9})$/.test(cleanedPhone)) error = 'Некоректний формат телефону (+380XXXYYZZZZ або 0XXXYYZZZZ).';
        break;
      case 'email':
        if (value.trim() && !/\S+@\S+\.\S+/.test(value.trim())) error = "Некоректний формат email.";
        break;
      case 'password': // Для реєстрації, входу, зміни пароля
        if (!value.trim()) error = "Пароль є обов'язковим.";
        else if (value.trim().length < 4) error = "Пароль має містити принаймні 4 символи.";
        break;
      case 'newAddress':
        if (!value.trim()) error = "Адреса не може бути порожньою.";
        else if (value.trim().length < 5) error = "Адреса має бути довшою.";
        break;
      default: break;
    }
    return error;
  };

  const createChangeHandler = (setter, formPrefix = '') => (e) => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: value }));
    const errorKey = formPrefix ? `${formPrefix}.${name}` : name;
    if (formErrors[errorKey]) {
      setFormErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
    setAuthMessage({ type: '', text: '' }); // Очищаємо повідомлення при зміні
  };
  
  const createBlurHandler = (dataSource, formPrefix = '') => (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value, dataSource.password);
    const errorKey = formPrefix ? `${formPrefix}.${name}` : name;
    setFormErrors(prev => ({ ...prev, [errorKey]: error }));
  };

  const handleChangeUserData = createChangeHandler(setUserData, 'userData');
  const handleBlurUserData = createBlurHandler(userData, 'userData');
  const handleChangeLogin = createChangeHandler(setLoginCredentials, 'login');
  const handleBlurLogin = createBlurHandler(loginCredentials, 'login');

  const handleChangeNewAddress = (e) => {
    setNewAddress(e.target.value);
    if (formErrors.newAddress) setFormErrors(prev => ({ ...prev, newAddress: '' }));
  };
  const handleBlurNewAddress = () => {
    setFormErrors(prev => ({ ...prev, newAddress: validateField('newAddress', newAddress) }));
  };

  const runValidation = (fields, data, prefix = '') => {
    const errors = {};
    let isValid = true;
    fields.forEach(field => {
      const error = validateField(field, data[field] || '', data.password);
      if (error) {
        errors[prefix ? `${prefix}.${field}` : field] = error;
        isValid = false;
      }
    });
    setFormErrors(prev => ({ ...prev, ...errors }));
    return isValid;
  };

  const handleRegister = async () => {
    setAuthMessage({ type: '', text: '' });
    const fields = ['name', 'phone', 'password'];
    if (userData.email.trim()) fields.push('email'); // Валідуємо email, якщо він не порожній

    if (!runValidation(fields, userData, 'userData')) return;
    
    await persistUserData(userData);
    sessionStorage.setItem('isUserLoggedIn', 'true');
    setIsLoggedIn(true);
    setShowLogin(false);
    setAuthMessage({ type: 'success', text: 'Реєстрація успішна! Вас автоматично авторизовано.' });
  };

  const handleLogin = async () => {
    setAuthMessage({ type: '', text: '' });
    if (!runValidation(['phone', 'password'], loginCredentials, 'login')) return;

    const storedUserDataJSON = sessionStorage.getItem('userData');
    if (storedUserDataJSON) {
      const parsedStoredData = JSON.parse(storedUserDataJSON);
      if (!parsedStoredData.hashedPassword) {
        setAuthMessage({ type: 'error', text: 'Помилка даних. Будь ласка, зареєструйтесь знову.' });
        return;
      }
      const hashedPasswordAttempt = await hashPasswordValue(loginCredentials.password.trim());
      if (parsedStoredData.phone === loginCredentials.phone.trim() && parsedStoredData.hashedPassword === hashedPasswordAttempt) {
        setUserData({ ...parsedStoredData, password: '' });
        sessionStorage.setItem('isUserLoggedIn', 'true');
        setIsLoggedIn(true);
        setShowLogin(false);
        setLoginCredentials({ phone: '', password: '' });
        setFormErrors({});
      } else {
        setAuthMessage({ type: 'error', text: 'Неправильний телефон або пароль.' });
      }
    } else {
      setAuthMessage({ type: 'error', text: 'Користувача не знайдено. Будь ласка, зареєструйтесь.' });
    }
  };

  const handleProfileSave = async () => {
    setAuthMessage({ type: '', text: '' });
    const fieldsToValidate = ['name', 'phone'];
    if (userData.email.trim()) fieldsToValidate.push('email');
    if (userData.password && userData.password.trim()) fieldsToValidate.push('password');

    if (!runValidation(fieldsToValidate, userData, 'userData')) return;

    await persistUserData(userData);
    setIsEditing(false);
    setAuthMessage({ type: 'success', text: 'Профіль успішно оновлено.' });
  };

  const toggleEditAndSave = () => {
    setAuthMessage({ type: '', text: '' });
    if (isEditing) {
      handleProfileSave();
    } else {
      setUserData(prev => ({ ...prev, password: '' })); // Очищаємо поле пароля при переході в режим редагування
      setIsEditing(true);
    }
  };

  const saveAddress = async () => {
    setAuthMessage({ type: '', text: '' });
    if (!runValidation(['newAddress'], { newAddress })) return;
    
    const updatedAddresses = [...(userData.addresses || []), newAddress.trim()];
    await persistUserData({ ...userData, addresses: updatedAddresses });
    setNewAddress('');
    setFormErrors(prev => ({ ...prev, newAddress: '' }));
    setAuthMessage({ type: 'success', text: 'Адресу додано.' });
  };

  const handleLogout = () => {
    sessionStorage.setItem('isUserLoggedIn', 'false');
    sessionStorage.removeItem('userData'); // Також видаляємо дані користувача
    setIsLoggedIn(false);
    setShowLogin(true);
    setUserData({ name: '', phone: '', email: '', password: '', addresses: [], hashedPassword: '' });
    setLoginCredentials({ phone: '', password: '' });
    setFormErrors({});
    setAuthMessage({ type: '', text: '' });
  };

  const renderAuthMessage = () => {
    if (!authMessage.text) return null;
    return (
      <div className={`auth-message auth-message--${authMessage.type}`} role="alert">
        {authMessage.text}
      </div>
    );
  };

  const renderRegistrationForm = () => (
    <div className="form-section">
      <h2 className="form-section__title">Створити обліковий запис</h2>
      {renderAuthMessage()}
      <div className="form-group">
        <label htmlFor="reg-name" className="form-label">Ім'я*</label>
        <input type="text" id="reg-name" name="name" value={userData.name} onChange={handleChangeUserData} onBlur={handleBlurUserData} className={`form-input ${formErrors['userData.name'] ? 'form-input--error' : ''}`} placeholder="Ваше ім'я" required />
        {formErrors['userData.name'] && <span className="form-error-message">{formErrors['userData.name']}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="reg-phone" className="form-label">Телефон*</label>
        <input type="tel" id="reg-phone" name="phone" value={userData.phone} onChange={handleChangeUserData} onBlur={handleBlurUserData} className={`form-input ${formErrors['userData.phone'] ? 'form-input--error' : ''}`} placeholder="+380XXXYYYZZZ" required />
        {formErrors['userData.phone'] && <span className="form-error-message">{formErrors['userData.phone']}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="reg-email" className="form-label">Email (не обов'язково)</label>
        <input type="email" id="reg-email" name="email" value={userData.email} onChange={handleChangeUserData} onBlur={handleBlurUserData} className={`form-input ${formErrors['userData.email'] ? 'form-input--error' : ''}`} placeholder="example@mail.com" />
        {formErrors['userData.email'] && <span className="form-error-message">{formErrors['userData.email']}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="reg-password" className="form-label">Пароль*</label>
        <input type="password" id="reg-password" name="password" value={userData.password} onChange={handleChangeUserData} onBlur={handleBlurUserData} className={`form-input ${formErrors['userData.password'] ? 'form-input--error' : ''}`} placeholder="Мін. 4 символи" required />
        {formErrors['userData.password'] && <span className="form-error-message">{formErrors['userData.password']}</span>}
      </div>
      <button type="button" onClick={handleRegister} className="btn btn--primary form-section__button">Зареєструватися</button>
      <p className="form-section__toggle-text">Вже маєте акаунт? <button type="button" onClick={() => {setShowLogin(true); setFormErrors({}); setAuthMessage({type:'', text:''});}} className="form-link-button">Увійти</button></p>
    </div>
  );

  const renderLoginForm = () => (
    <div className="form-section">
      <h2 className="form-section__title">Увійти</h2>
      {renderAuthMessage()}
      <div className="form-group">
        <label htmlFor="login-phone" className="form-label">Телефон*</label>
        <input type="tel" id="login-phone" name="phone" value={loginCredentials.phone} onChange={handleChangeLogin} onBlur={handleBlurLogin} className={`form-input ${formErrors['login.phone'] ? 'form-input--error' : ''}`} placeholder="+380XXXYYYZZZ" required />
        {formErrors['login.phone'] && <span className="form-error-message">{formErrors['login.phone']}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="login-password" className="form-label">Пароль*</label>
        <input type="password" id="login-password" name="password" value={loginCredentials.password} onChange={handleChangeLogin} onBlur={handleBlurLogin} className={`form-input ${formErrors['login.password'] ? 'form-input--error' : ''}`} placeholder="Ваш пароль" required />
        {formErrors['login.password'] && <span className="form-error-message">{formErrors['login.password']}</span>}
      </div>
      {formErrors.loginFormError && <p className="form-error-message form-error-message--general">{formErrors.loginFormError}</p>}
      <button type="button" onClick={handleLogin} className="btn btn--primary form-section__button">Увійти</button>
      <p className="form-section__toggle-text">Немає акаунту? <button type="button" onClick={() => {setShowLogin(false); setFormErrors({}); setAuthMessage({type:'', text:''});}} className="form-link-button">Зареєструватися</button></p>
    </div>
  );

  const renderProfileForm = () => (
    <div className="form-section">
      <h1 className="profile-page-title">Профіль користувача</h1>
      {renderAuthMessage()}
      <div className="profile-info-group">
        <p className="profile-info-item">
          <span className="profile-info-label">Ім’я:</span>
          {isEditing ? <input type="text" id="profile-name" name="name" value={userData.name} onChange={handleChangeUserData} onBlur={handleBlurUserData} className={`form-input form-input--inline ${formErrors['userData.name'] ? 'form-input--error' : ''}`} /> : <span className="profile-info-value">{userData.name}</span>}
          {isEditing && formErrors['userData.name'] && <span className="form-error-message form-error-message--inline">{formErrors['userData.name']}</span>}
        </p>
        <p className="profile-info-item">
          <span className="profile-info-label">Телефон:</span>
          {isEditing ? <input type="tel" id="profile-phone" name="phone" value={userData.phone} onChange={handleChangeUserData} onBlur={handleBlurUserData} className={`form-input form-input--inline ${formErrors['userData.phone'] ? 'form-input--error' : ''}`} /> : <span className="profile-info-value">{userData.phone}</span>}
          {isEditing && formErrors['userData.phone'] && <span className="form-error-message form-error-message--inline">{formErrors['userData.phone']}</span>}
        </p>
        <p className="profile-info-item">
          <span className="profile-info-label">Email:</span>
          {isEditing ? <input type="email" id="profile-email" name="email" value={userData.email} onChange={handleChangeUserData} onBlur={handleBlurUserData} className={`form-input form-input--inline ${formErrors['userData.email'] ? 'form-input--error' : ''}`} /> : <span className="profile-info-value">{userData.email || 'Не вказано'}</span>}
          {isEditing && formErrors['userData.email'] && <span className="form-error-message form-error-message--inline">{formErrors['userData.email']}</span>}
        </p>
        {isEditing && (
          <p className="profile-info-item">
            <span className="profile-info-label">Новий пароль:</span>
            <input type="password" id="profile-password" name="password" value={userData.password} onChange={handleChangeUserData} onBlur={handleBlurUserData} className={`form-input form-input--inline ${formErrors['userData.password'] ? 'form-input--error' : ''}`} placeholder="Залиште порожнім, щоб не змінювати"/>
            {formErrors['userData.password'] && <span className="form-error-message form-error-message--inline">{formErrors['userData.password']}</span>}
          </p>
        )}
      </div>
      <div className="profile-actions">
        <button type="button" onClick={toggleEditAndSave} className="btn btn--primary">
          {isEditing ? 'Зберегти зміни' : 'Редагувати профіль'}
        </button>
        {isEditing && <button type="button" onClick={() => { setIsEditing(false); const stored = sessionStorage.getItem('userData'); if (stored) setUserData(prev => ({ ...prev, ...JSON.parse(stored), password: ''})); setFormErrors({}); setAuthMessage({type:'', text:''}); }} className="btn btn--secondary">Скасувати</button>}
      </div>

      <h2 className="form-section__title profile_addresses-title">Адреси</h2>
      <div className="address-list">
        {(userData.addresses && userData.addresses.length > 0) ? (
          <ul className="address-list__items">
            {userData.addresses.map((address, index) => ( <li key={index} className="address-list__item">{address}</li> ))}
          </ul>
        ) : <p className="address-list__no-items">У вас ще немає збережених адрес.</p>}
      </div>
      
      <div className="form-group add-address-form">
        <label htmlFor="newAddress" className="form-label">Додати нову адресу:</label>
        <input type="text" id="newAddress" value={newAddress} onChange={handleChangeNewAddress} onBlur={handleBlurNewAddress} className={`form-input ${formErrors.newAddress ? 'form-input--error' : ''}`} placeholder="Введіть нову адресу" />
        {formErrors.newAddress && <span className="form-error-message">{formErrors.newAddress}</span>}
        <button type="button" onClick={saveAddress} className="btn btn--secondary add-address-form__button">Додати адресу</button>
      </div>
      
      <hr className="profile-separator" />
      <button type="button" onClick={handleLogout} className="btn btn--danger profile-logout-button">Вийти</button>
    </div>
  );
  
  return (
    <div className="profile-page-container">
      {isLoggedIn ? renderProfileForm() : (showLogin ? renderLoginForm() : renderRegistrationForm())}
    </div>
  );
}