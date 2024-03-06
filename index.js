const express = require('express');
const routes = require('./chargeTimeRoutes');

const app = express();
app.use(express.json());

app.use('/estimate-charging-time', routes);

const port = 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
