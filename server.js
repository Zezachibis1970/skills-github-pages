const express = require('express');
const path = require('path');
const app = express();
const port = 80;

// Данные для системы
let data = {
  oilTemp: 0,
  oilLevel: 0, // Уровень масла в процентах (0-100)
  indicators: {
    pump: 'off',
    heater: 'off',
    nozzle: 'off',
    spark: 'off',
    flame: 'off',
  },
};

// Middleware для обработки JSON
app.use(express.json());

// Раздача статических файлов из папки public
app.use(express.static(path.join(__dirname, 'public')));

// Обновление данных от ESP8266
app.get('/update', (req, res) => {
  data.oilTemp = parseFloat(req.query.oilTemp);
  data.indicators.pump = req.query.pump === 'on' ? 'on' : 'off';
  data.indicators.heater = req.query.heater === 'on' ? 'on' : 'off';
  data.indicators.nozzle = req.query.nozzle === 'on' ? 'on' : 'off';
  data.indicators.spark = req.query.spark === 'on' ? 'on' : 'off';
  data.indicators.flame = req.query.flame === 'on' ? 'on' : 'off';

  // Логика изменения уровня масла
  if (data.indicators.pump === 'on') {
    data.oilLevel += 5; // Наполнение бака (5% в секунду)
  }
  if (data.indicators.nozzle === 'on') {
    data.oilLevel -= 1; // Опустошение бака (1% в секунду)
  }

  // Ограничение уровня масла в пределах 0-100%
  data.oilLevel = Math.max(0, Math.min(100, data.oilLevel));

  res.send('OK');
});

// Получение данных для веб-интерфейса
app.get('/data', (req, res) => {
  res.json(data);
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});