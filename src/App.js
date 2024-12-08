import React, { useState } from 'react';
import moment from 'moment-hijri';
import './App.css';

function App() {
  const [isArabic, setIsArabic] = useState(true);
  const [dateType, setDateType] = useState('gregorian');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [result, setResult] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  // الترجمات
  const translations = {
    ar: {
      title: 'محول التاريخ الهجري والميلادي',
      gregorian: 'ميلادي',
      hijri: 'هجري',
      day: 'اليوم',
      month: 'الشهر',
      year: 'السنة',
      convert: 'تحويل',
      copy: 'نسخ',
      result: 'النتيجة:',
      gregorianDate: 'التاريخ الميلادي',
      hijriDate: 'التاريخ الهجري',
      error: 'خطأ',
      invalidDate: 'الرجاء إدخال تاريخ صحيح',
      language: 'English'
    },
    en: {
      title: 'Hijri-Gregorian Date Converter',
      gregorian: 'Gregorian',
      hijri: 'Hijri',
      day: 'Day',
      month: 'Month',
      year: 'Year',
      convert: 'Convert',
      copy: 'Copy',
      result: 'Result:',
      gregorianDate: 'Gregorian Date',
      hijriDate: 'Hijri Date',
      error: 'Error',
      invalidDate: 'Please enter a valid date',
      language: 'عربي'
    }
  };

  const t = translations[isArabic ? 'ar' : 'en'];

  const validateDate = (d, m, y) => {
    const day = parseInt(d);
    const month = parseInt(m);
    const year = parseInt(y);

    return (
      !isNaN(day) && !isNaN(month) && !isNaN(year) &&
      day >= 1 && day <= 31 &&
      month >= 1 && month <= 12 &&
      year > 0
    );
  };

  const convertDate = () => {
    if (!validateDate(day, month, year)) {
      alert(t.invalidDate);
      return;
    }

    try {
      if (dateType === 'gregorian') {
        // تحويل من ميلادي إلى هجري
        const m = moment(`${year}-${month}-${day}`, 'YYYY-MM-DD');
        setResult(`${m.iDate()}/${m.iMonth() + 1}/${m.iYear()}`);
      } else {
        // تحويل من هجري إلى ميلادي
        const m = moment(`${year}-${month}-${day}`, 'iYYYY-iMM-iDD');
        setResult(`${m.date()}/${m.month() + 1}/${m.year()}`);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const toggleLanguage = () => {
    setIsArabic(!isArabic);
    document.dir = isArabic ? 'ltr' : 'rtl';
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopySuccess(isArabic ? 'تم النسخ!' : 'Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setCopySuccess(isArabic ? 'فشل النسخ' : 'Failed to copy');
    }
  };

  return (
    <div className="App" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="container">
        <button
          className="language-button"
          onClick={toggleLanguage}
        >
          {t.language}
        </button>

        <h1 className="title">{t.title}</h1>

        <div className="radio-container">
          <label className={`radio-button ${dateType === 'gregorian' ? 'active' : ''}`}>
            <input
              type="radio"
              checked={dateType === 'gregorian'}
              onChange={() => {
                setDateType('gregorian');
                setDay('');
                setMonth('');
                setYear('');
                setResult('');
              }}
            />
            {t.gregorian}
          </label>
          <label className={`radio-button ${dateType === 'hijri' ? 'active' : ''}`}>
            <input
              type="radio"
              checked={dateType === 'hijri'}
              onChange={() => {
                setDateType('hijri');
                setDay('');
                setMonth('');
                setYear('');
                setResult('');
              }}
            />
            {t.hijri}
          </label>
        </div>

        <div className="input-container">
          <div className="input-group">
            <label>{t.day}</label>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
            >
              <option value="">{t.day}</option>
              {[...Array(31)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>{t.month}</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="">{t.month}</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>{t.year}</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">{t.year}</option>
              {[...Array(100)].map((_, i) => {
                const yearValue = dateType === 'gregorian' ? 2024 - i : 1445 - i;
                return (
                  <option key={yearValue} value={yearValue}>
                    {yearValue}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <button
          className="convert-button"
          onClick={convertDate}
        >
          {t.convert}
        </button>

        {result && (
          <div className="result-container">
            <div className="result-label">
              {dateType === 'gregorian' ? t.hijriDate : t.gregorianDate}:
            </div>
            <div className="result-content">
              <div className="result-text" onClick={copyToClipboard}>
                {result}
              </div>
              <button className="copy-button" onClick={copyToClipboard}>
                {t.copy}
              </button>
              {copySuccess && <div className="copy-message">{copySuccess}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
