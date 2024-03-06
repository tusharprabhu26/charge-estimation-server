const express = require('express');
const router = express.Router();

function isInputMissing(connectorPower, batteryCapacity, soc) {
  return !connectorPower || !batteryCapacity || soc === undefined;
}

function isSocOutOfRange(soc) {
  return soc < 0 || soc > 100;
}

router.post('/', (req, res) => {
  const {connectorPower, batteryCapacity, soc} = req.body;

  if (isInputMissing(connectorPower, batteryCapacity, soc)) {
    return res.status(400).json({error: 'Missing required parameters'});
  }

  if (isSocOutOfRange(soc)) {
    return res.status(400).json({error: 'SoC must be between 0 and 100'});
  }

  const remainingCapacity = batteryCapacity * ((100 - soc) / 100);

  const chargingTime = remainingCapacity / connectorPower;

  res.json({chargingTime});
});

module.exports = router;
