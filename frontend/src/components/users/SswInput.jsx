import React, { useState, useEffect } from 'react';

const SswInput = ({ value, onChange }) => {
  const options = [
    '農業',
    '漁業',
    '飲食料品製造業',
    '産業機械製造業',
    '建設業',
    '宿泊業・飲食サービス業',
    'ビルクリーニング',
    '自動車整備業',
    '電子・電気機器関連産業',
    '金属加工業',
    '繊維・衣服関連産業',
    '介護',
    '外食業',
    '産業用機械製造業',
    'その他',
  ];

  const [isOther, setIsOther] = useState(false);

  // Cek saat props value berubah, apakah masuk opsi atau tidak
  useEffect(() => {
    if (value && !options.includes(value)) {
      setIsOther(true);
    } else {
      setIsOther(false);
    }
  }, [value]);

  const handleSelectChange = (e) => {
    const val = e.target.value;
    if (val === 'その他') {
      setIsOther(true);
      onChange(''); // Kosongkan input custom
    } else {
      setIsOther(false);
      onChange(val);
    }
  };

  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <label htmlFor="sswDimiliki" className="font-semibold text-gray-700 block mb-1">
        SSW/Senmonkyuu yang Dimiliki
      </label>
      <select
        id="sswDimilikiSelect"
        onChange={handleSelectChange}
        value={isOther ? 'その他' : value}
        className="input-style mb-2"
      >
        <option value="">-- Pilih SSW --</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>

      {isOther && (
        <input
          id="sswDimiliki"
          type="text"
          name="sswDimiliki"
          value={value}
          onChange={handleInputChange}
          placeholder="Tulis SSW/Senmonkyuu lainnya"
          className="input-style"
        />
      )}
    </div>
  );
};

export default SswInput;
