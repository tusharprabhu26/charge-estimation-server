const express = require('express');
const router = express.Router();

function isInputMissing(connectorPowerKW, batteryCapacityKWh, socPercentage) {
  return (
    !connectorPowerKW || !batteryCapacityKWh || socPercentage === undefined
  );
}

function isSocOutOfRange(socPercentage) {
  return socPercentage < 0 || socPercentage > 100;
}

router.post('/', (req, res) => {
  const {connectorPowerKW, batteryCapacityKWh, socPercentage} = req.body;

  if (isInputMissing(connectorPowerKW, batteryCapacityKWh, socPercentage)) {
    return res.status(400).json({error: 'Missing required parameters'});
  }

  if (isSocOutOfRange(socPercentage)) {
    return res.status(400).json({error: 'SoC must be between 0 and 100'});
  }

  const remainingCapacityKWh =
    batteryCapacityKWh * ((100 - socPercentage) / 100);

  const chargingTimeHours = remainingCapacityKWh / connectorPowerKW;

  res.json({chargingTimeHours});
});

module.exports = router;
