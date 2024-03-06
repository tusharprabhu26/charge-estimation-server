const request = require('supertest');
const chai = require('chai');
const app = require('../index');

const {expect} = chai;

async function postEstimateChargingTime(data) {
  return await request(app).post('/estimate-charging-time').send(data);
}

function checkResponse(
    httpResponse,
    expectedStatusCode,
    expectedChargingTime,
    expectedErrorMessage,
) {
  expect(httpResponse.statusCode).to.equal(expectedStatusCode);
  if (expectedChargingTime !== undefined) {
    expect(httpResponse.body).to.have.property('chargingTime');
    expect(httpResponse.body.chargingTime).to.equal(expectedChargingTime);
  }
  if (expectedErrorMessage !== undefined) {
    expect(httpResponse.body).to.have.property('error');
    expect(httpResponse.body.error).to.equal(expectedErrorMessage);
  }
}

describe('POST /estimate-charging-time', () => {
  it('should calculate the charging time correctly', async () => {
    const chargingTimeResponse = await postEstimateChargingTime({
      connectorPower: 10,
      batteryCapacity: 40,
      soc: 50,
    });

    checkResponse(chargingTimeResponse, 200, 2);
  });

  it('should return 400 if parameters are missing', async () => {
    const missingParamsResponse = await postEstimateChargingTime({
      connectorPower: 10,
      soc: 50,
    });

    checkResponse(
        missingParamsResponse,
        400,
        undefined,
        'Missing required parameters',
    );
  });

  it('should return 400 if soc is not between 0 and 100', async () => {
    const invalidSocResponse = await postEstimateChargingTime({
      connectorPower: 10,
      batteryCapacity: 40,
      soc: 150,
    });

    checkResponse(
        invalidSocResponse,
        400,
        undefined,
        'SoC must be between 0 and 100',
    );
  });

  it('should return 400 if connectorPower is missing', async () => {
    const missingPowerResponse = await postEstimateChargingTime({
      batteryCapacity: 40,
      soc: 50,
    });

    checkResponse(
        missingPowerResponse,
        400,
        undefined,
        'Missing required parameters',
    );
  });

  it('should return 400 if batteryCapacity is missing', async () => {
    const missingCapacityResponse = await postEstimateChargingTime({
      connectorPower: 10,
      soc: 50,
    });

    checkResponse(
        missingCapacityResponse,
        400,
        undefined,
        'Missing required parameters',
    );
  });

  it('should return 400 if soc is missing', async () => {
    const missingSocResponse = await postEstimateChargingTime({
      connectorPower: 10,
      batteryCapacity: 40,
    });

    checkResponse(
        missingSocResponse,
        400,
        undefined,
        'Missing required parameters',
    );
  });

  it('should return 400 if soc is less than 0', async () => {
    const negativeSocResponse = await postEstimateChargingTime({
      connectorPower: 10,
      batteryCapacity: 40,
      soc: -1,
    });

    checkResponse(
        negativeSocResponse,
        400,
        undefined,
        'SoC must be between 0 and 100',
    );
  });

  it('should return 400 if soc is greater than 100', async () => {
    const overchargedSocResponse = await postEstimateChargingTime({
      connectorPower: 10,
      batteryCapacity: 40,
      soc: 101,
    });

    checkResponse(
        overchargedSocResponse,
        400,
        undefined,
        'SoC must be between 0 and 100',
    );
  });

  it('should calculate the charging time correctly when soc is 0', async () => {
    const zeroSocResponse = await postEstimateChargingTime({
      connectorPower: 10,
      batteryCapacity: 40,
      soc: 0,
    });

    checkResponse(zeroSocResponse, 200, 4);
  });

  it('should calculate the charging time correctly when soc is 100', async () => {
    const fullSocResponse = await postEstimateChargingTime({
      connectorPower: 10,
      batteryCapacity: 40,
      soc: 100,
    });

    checkResponse(fullSocResponse, 200, 0);
  });
});
