import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Мок CartContext для прикладу
const useCart = () => {
  return {
    clearCart: () => console.log('Кошик очищено! (мок)'),
  };
};

export default function OrderCheckoutPage() {
  const { clearCart } = useCart();

  const [isLoggedIn, setIsLoggedIn] = useState(false); // Локальний стан для UI, джерело - sessionStorage
  const [profileData, setProfileData] = useState({ name: '', phone: '', addresses: [] });
  
  const [orderData, setOrderData] = useState({
    name: '',
    phone: '',
    address: '',
    deliveryTime: '', // Буде у форматі HH:MM
  });

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
          ...prev, // Зберігаємо попередні значення, якщо вони є (напр. час, якщо введено до завантаження профілю)
          name: parsedData.name || '',
          phone: parsedData.phone || '',
          address: hasAddresses ? parsedData.addresses[0] : '',
        }));
      } else {
        // Неузгоджений стан: прапорець входу true, але даних користувача немає.
        // Вважаємо користувача неавторизованим для безпеки.
        setIsLoggedIn(false);
        sessionStorage.setItem('isUserLoggedIn', 'false'); // Виправляємо sessionStorage
        setProfileData({ name: '', phone: '', addresses: [] });
        setOrderData({ name: '', phone: '', address: '', deliveryTime: '' }); // Скидаємо дані замовлення
        setUseExistingAddress(false);
      }
    } else {
      // Користувач не залогінений або вийшов з системи
      setProfileData({ name: '', phone: '', addresses: [] });
      // Скидаємо поля, які могли бути заповнені з профілю
      setOrderData(prev => ({
        name: '', // Очистити ім'я
        phone: '', // Очистити телефон
        address: '', // Очистити адресу
        deliveryTime: prev.deliveryTime, // Зберігаємо час, якщо користувач його вже ввів
      }));
      setUseExistingAddress(false);
    }
  }, []); // Запускається один раз

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectedAddressChange = (e) => {
    setOrderData(prev => ({ ...prev, address: e.target.value }));
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!orderData.name.trim() || !orderData.phone.trim() || !orderData.address.trim() || !orderData.deliveryTime.trim()) {
      alert('Будь ласка, заповніть всі обов\'язкові поля для замовлення.');
      return;
    }
    console.log('Дані замовлення:', orderData);
    clearCart();
    setIsOrderConfirmed(true);
  };

  if (isOrderConfirmed) {
    return (
      <div style={styles.container}>
        <h1>Замовлення підтверджено!</h1>
        <p>Дякуємо за ваше замовлення. Ми зв’яжемося з вами найближчим часом для уточнення деталей.</p>
        <p>
          <Link to="/" style={styles.link}>Повернутись до меню</Link>
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1>Оформлення замовлення</h1>
      <form onSubmit={handleOrderSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="name" style={styles.label}>Ім'я:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={orderData.name}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="phone" style={styles.label}>Телефон:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={orderData.phone}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="address" style={styles.label}>Адреса доставки:</label>
          {isLoggedIn && profileData.addresses && profileData.addresses.length > 0 ? (
            <>
              <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="addressOption"
                    checked={useExistingAddress}
                    onChange={() => {
                      setUseExistingAddress(true);
                      if (profileData.addresses && profileData.addresses.length > 0) {
                        setOrderData(prev => ({ ...prev, address: profileData.addresses[0] }));
                      }
                    }}
                  />
                  Вибрати збережену адресу
                </label>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="addressOption"
                    checked={!useExistingAddress}
                    onChange={() => {
                      setUseExistingAddress(false);
                      setOrderData(prev => ({ ...prev, address: '' }));
                    }}
                  />
                  Ввести нову адресу
                </label>
              </div>

              {useExistingAddress ? (
                <select
                  name="address"
                  value={orderData.address}
                  onChange={handleSelectedAddressChange}
                  style={styles.input}
                >
                  {profileData.addresses.map((addr, index) => (
                    <option key={index} value={addr}>{addr}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  name="address"
                  placeholder="Введіть нову адресу"
                  value={orderData.address}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              )}
            </>
          ) : (
            <input
              type="text"
              id="current_address" // Змінив id, щоб уникнути конфлікту, якщо б label посилався на "address"
              name="address"
              placeholder="Введіть адресу доставки"
              value={orderData.address}
              onChange={handleChange}
              style={styles.input}
              required
            />
          )}
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="deliveryTime" style={styles.label}>Бажаний час доставки:</label>
          <input
            type="time" // <--- ЗМІНЕНО ТИП ПОЛЯ
            id="deliveryTime"
            name="deliveryTime"
            value={orderData.deliveryTime} // Формат буде "HH:mm"
            onChange={handleChange}
            style={styles.input}
            required
            // Для деяких браузерів може знадобитися step="any" або вказання min/max
            // step="900" // крок 15 хвилин (900 секунд)
            // min="09:00" max="22:00" // Приклад обмеження часу
          />
        </div>

        <button type="submit" style={styles.button}>Підтвердити замовлення</button>
      </form>
      <p style={{ marginTop: '20px' }}>
        <Link to="/" style={styles.link}>Повернутись до меню</Link>
      </p>
    </div>
  );
}

// Стилі залишаються ті ж самі
const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
  },
  radioGroup: {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontWeight: 'normal',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  }
};