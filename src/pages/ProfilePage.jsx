import React, { useState, useEffect } from 'react';

async function hashPasswordValue(password) {
  if (!password || typeof password !== 'string' || password.trim() === '') {
    // Повертаємо null або кидаємо помилку, якщо пароль порожній або невалідний,
    // щоб уникнути хешування порожніх рядків, якщо це не бажано.
    // Для логіки "не змінювати пароль, якщо поле порожнє" це буде оброблятися вище.
    return null;
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // Перетворення буфера на масив байтів
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // Перетворення байтів на шістнадцятковий рядок
  return hashHex;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '', // Це поле використовується ТІЛЬКИ для введення нового/зміненого пароля в формі
    addresses: [],
    // hashedPassword: '' // Не зберігаємо хеш тут, він буде в sessionStorage
  });
  const [newAddress, setNewAddress] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [loginCredentials, setLoginCredentials] = useState({
    phone: '',
    password: '',
  });

  useEffect(() => {
    const loggedInStatus = sessionStorage.getItem('isUserLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);

    if (loggedInStatus) {
      const storedUserDataJSON = sessionStorage.getItem('userData');
      if (storedUserDataJSON) {
        const parsedData = JSON.parse(storedUserDataJSON); // Має містити hashedPassword
        setUserData(prev => ({ ...prev, ...parsedData, password: '' })); // Завантажуємо дані, поле пароля в формі порожнє
      } else {
        sessionStorage.setItem('isUserLoggedIn', 'false');
        setIsLoggedIn(false);
      }
      setShowLogin(false);
    } else {
      setShowLogin(true);
    }
  }, []);

  // Оновлена функція для збереження даних користувача
  const persistUserData = async (currentDataFromState) => {
    let dataToStore = { ...currentDataFromState }; // Копіюємо поточні дані зі стану

    // Якщо є новий пароль для встановлення/зміни (тобто, поле password у формі не порожнє)
    if (currentDataFromState.password && currentDataFromState.password.trim() !== '') {
      const hashedPassword = await hashPasswordValue(currentDataFromState.password.trim());
      dataToStore.hashedPassword = hashedPassword; // Зберігаємо хеш
    }
    // Видаляємо тимчасове поле plain text password з об'єкта, що зберігається в sessionStorage
    delete dataToStore.password;

    // Оновлюємо стан React: зберігаємо всі дані, крім plain text password (очищуємо поле форми)
    setUserData(prev => ({ ...prev, ...dataToStore, password: '' }));
    sessionStorage.setItem('userData', JSON.stringify(dataToStore));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async () => { // Функція стала асинхронною
    if (!userData.name.trim() || !userData.phone.trim() || !userData.password.trim()) {
      alert("Будь ласка, заповніть обов'язкові поля: Ім'я, Телефон та Пароль.");
      return;
    }
    if (!/^\d{5,}$/.test(userData.phone.trim())) {
        alert("Телефон повинен містити щонайменше 5 цифр.");
        return;
    }
    if (userData.password.trim().length < 4) {
        alert("Пароль повинен містити щонайменше 4 символи.");
        return;
    }
    if (userData.email.trim() && !/\S+@\S+\.\S+/.test(userData.email.trim())) {
        alert("Будь ласка, введіть дійсну адресу електронної пошти.");
        return;
    }

    await persistUserData(userData); // Чекаємо на хешування та збереження
    sessionStorage.setItem('isUserLoggedIn', 'true');
    setIsLoggedIn(true);
    setShowLogin(false);
    // setUserData(prev => ({ ...prev, password: '' })); // persistUserData вже очищує пароль у стані
    alert('Реєстрація успішна! Вас автоматично авторизовано.');
  };

  // ОСНОВНА ЗМІНЕНА ФУНКЦІЯ
  const handleLogin = async () => { // Функція стала асинхронною
    if (!loginCredentials.phone.trim() || !loginCredentials.password.trim()) {
      alert('Будь ласка, введіть телефон та пароль.');
      return;
    }

    const storedUserDataJSON = sessionStorage.getItem('userData');
    if (storedUserDataJSON) {
      const parsedStoredData = JSON.parse(storedUserDataJSON); // Має містити hashedPassword

      if (!parsedStoredData.hashedPassword) {
        alert('Помилка: дані користувача пошкоджені (відсутній хеш пароля). Будь ласка, зареєструйтесь знову.');
        // Можливо, варто очистити sessionStorage тут або запропонувати скидання
        sessionStorage.removeItem('userData');
        sessionStorage.setItem('isUserLoggedIn', 'false');
        setIsLoggedIn(false);
        setShowLogin(true);
        return;
      }

      // Хешуємо пароль, введений у формі входу
      const hashedPasswordAttempt = await hashPasswordValue(loginCredentials.password.trim());

      if (
        parsedStoredData.phone === loginCredentials.phone.trim() &&
        parsedStoredData.hashedPassword === hashedPasswordAttempt
      ) {
        // ВАЖЛИВО: `parsedStoredData` не містить plain text password, що добре.
        // Очищаємо поле `password` у стані `userData` для будь-яких форм.
        setUserData({ ...parsedStoredData, password: '' }); 
        sessionStorage.setItem('isUserLoggedIn', 'true');
        setIsLoggedIn(true);
        setShowLogin(false);
        setLoginCredentials({ phone: '', password: '' }); // Очищуємо форму входу
      } else {
        alert('Неправильний телефон або пароль.');
      }
    } else {
      alert('Користувача не знайдено. Будь ласка, зареєструйтесь.');
    }
  };

  const handleProfileSave = async () => { // Функція стала асинхронною
    if (!userData.name.trim() || !userData.phone.trim()) {
        alert("Ім'я та Телефон не можуть бути порожніми при оновленні профілю.");
        return;
    }
    if (!/^\d{5,}$/.test(userData.phone.trim())) {
        alert("Телефон повинен містити щонайменше 5 цифр.");
        return;
    }
    if (userData.email.trim() && !/\S+@\S+\.\S+/.test(userData.email.trim())) {
        alert("Будь ласка, введіть дійсну адресу електронної пошти для профілю.");
        return;
    }
    // Якщо userData.password не порожній, persistUserData його захешує і збереже.
    // Якщо порожній, persistUserData проігнорує поле password для хешування,
    // і старий hashedPassword залишиться в sessionStorage, якщо він там був.
    if (userData.password && userData.password.trim() !== '' && userData.password.trim().length < 4) {
      alert("Новий пароль повинен містити щонайменше 4 символи.");
      return;
    }

    await persistUserData(userData);
    setIsEditing(false);
    // setUserData(prev => ({ ...prev, password: '' })); // persistUserData вже очищує пароль у стані
    alert('Профіль оновлено.');
  };

  const toggleEditAndSave = () => {
    if (isEditing) {
      handleProfileSave(); // Тепер асинхронна, але тут можна не чекати, якщо UI реагує оптимістично
    } else {
      // При переході в режим редагування, переконуємося, що поле пароля порожнє
      setUserData(prev => ({ ...prev, password: '' }));
      setIsEditing(true);
    }
  };

  const saveAddress = async () => { // Функція стала асинхронною
    if (newAddress.trim() !== '') {
      const updatedAddresses = [...(userData.addresses || []), newAddress.trim()];
      const updatedUserData = { ...userData, addresses: updatedAddresses };
      // persistUserData оновить стан userData та sessionStorage
      await persistUserData(updatedUserData); 
      setNewAddress('');
    } else {
      alert('Адреса не може бути порожньою.');
    }
  };

  const handleLogout = () => {
    sessionStorage.setItem('isUserLoggedIn', 'false');
    setIsLoggedIn(false);
    setShowLogin(true);
    setUserData({ name: '', phone: '', email: '', password: '', addresses: [] });
    setLoginCredentials({ phone: '', password: '' });
  };

  // JSX для рендеру форм залишається таким самим, як у попередньому прикладі,
  // оскільки логіка змінилася лише у функціях обробниках.
  // Важливо, щоб поле для введення пароля в формі редагування профілю мало name="password"
  // і оновлювало userData.password.

  const renderRegistrationForm = () => (
    <div>
      <h2>Створити обліковий запис</h2>
      <input type="text" name="name" value={userData.name} onChange={handleChange} placeholder="Ім'я*" required />
      <input type="tel" name="phone" value={userData.phone} onChange={handleChange} placeholder="Телефон* (наприклад, 09XXXXXXXX)" required />
      <input type="email" name="email" value={userData.email} onChange={handleChange} placeholder="Email (не обов'язково)" />
      <input type="password" name="password" value={userData.password} onChange={handleChange} placeholder="Пароль* (мін. 4 символи)" required />
      <button onClick={handleRegister}>Зареєструватися</button>
      <p> Вже маєте акаунт?{' '} <button type="button" onClick={() => setShowLogin(true)} style={{all: 'unset', color: 'blue', cursor: 'pointer', textDecoration: 'underline'}}> Увійти </button> </p>
    </div>
  );

  const renderLoginForm = () => (
    <div>
      <h2>Увійти</h2>
      <input type="tel" name="phone" value={loginCredentials.phone} onChange={handleLoginChange} placeholder="Телефон*" required />
      <input type="password" name="password" value={loginCredentials.password} onChange={handleLoginChange} placeholder="Пароль*" required />
      <button onClick={handleLogin}>Увійти</button>
      <p> Немає акаунту?{' '} <button type="button" onClick={() => setShowLogin(false)} style={{all: 'unset', color: 'blue', cursor: 'pointer', textDecoration: 'underline'}}> Зареєструватися </button> </p>
    </div>
  );

  const renderProfileForm = () => (
    <div>
      <h1>Профіль користувача</h1>
      <p> Ім’я:{' '} {isEditing ? (<input type="text" name="name" value={userData.name} onChange={handleChange} />) : (userData.name)} </p>
      <p> Телефон:{' '} {isEditing ? (<input type="tel" name="phone" value={userData.phone} onChange={handleChange} />) : (userData.phone)} </p>
      <p> Email:{' '} {isEditing ? (<input type="email" name="email" value={userData.email} onChange={handleChange} />) : (userData.email || 'Не вказано')} </p>
      {isEditing && (
        <p> Пароль (залиште порожнім, щоб не змінювати):{' '}
          <input type="password" name="password" value={userData.password} onChange={handleChange} placeholder="Новий пароль (мін. 4 символи)"/>
        </p>
      )}
      <button onClick={toggleEditAndSave}> {isEditing ? 'Зберегти зміни' : 'Редагувати профіль'} </button>
      {isEditing && <button type="button" onClick={() => { 
          setIsEditing(false); 
          const stored = sessionStorage.getItem('userData'); 
          if (stored) setUserData(prev => ({ ...prev, ...JSON.parse(stored), password: ''}));
        }}>Скасувати</button>}
      <h2>Адреси</h2>
      {(userData.addresses && userData.addresses.length > 0) ? ( // Перевірка на userData.addresses
        <select defaultValue={userData.addresses[0] || ""} onChange={(e) => console.log("Selected address:", e.target.value)} >
          {userData.addresses.map((address, index) => ( <option key={index} value={address}> {address} </option> ))}
        </select>
      ) : <p>У вас ще немає збережених адрес.</p>}
      <div>
        <input type="text" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} placeholder="Введіть нову адресу" />
        <button onClick={saveAddress}>Додати адресу</button>
      </div>
      <hr style={{margin: '20px 0'}} />
      <button onClick={handleLogout}>Вийти</button>
    </div>
  );

  if (isLoggedIn) {
    return renderProfileForm();
  } else {
    return showLogin ? renderLoginForm() : renderRegistrationForm();
  }
}