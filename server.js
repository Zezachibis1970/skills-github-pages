const express = require('express');
const path = require('path');
const app = express();
const port = 80;

// ������ ��� �������
let data = {
  oilTemp: 0,
  oilLevel: 0, // ������� ����� � ��������� (0-100)
  indicators: {
    pump: 'off',
    heater: 'off',
    nozzle: 'off',
    spark: 'off',
    flame: 'off',
  },
};

// Middleware ��� ��������� JSON
app.use(express.json());

// ������� ����������� ������ �� ����� public
app.use(express.static(path.join(__dirname, 'public')));

// ���������� ������ �� ESP8266
app.get('/update', (req, res) => {
  data.oilTemp = parseFloat(req.query.oilTemp);
  data.indicators.pump = req.query.pump === 'on' ? 'on' : 'off';
  data.indicators.heater = req.query.heater === 'on' ? 'on' : 'off';
  data.indicators.nozzle = req.query.nozzle === 'on' ? 'on' : 'off';
  data.indicators.spark = req.query.spark === 'on' ? 'on' : 'off';
  data.indicators.flame = req.query.flame === 'on' ? 'on' : 'off';

  // ������ ��������� ������ �����
  if (data.indicators.pump === 'on') {
    data.oilLevel += 5; // ���������� ���� (5% � �������)
  }
  if (data.indicators.nozzle === 'on') {
    data.oilLevel -= 1; // ����������� ���� (1% � �������)
  }

  // ����������� ������ ����� � �������� 0-100%
  data.oilLevel = Math.max(0, Math.min(100, data.oilLevel));

  res.send('OK');
});

// ��������� ������ ��� ���-����������
app.get('/data', (req, res) => {
  res.json(data);
});

// ������ �������
app.listen(port, () => {
  console.log(`������ ������� �� http://localhost:${port}`);
});