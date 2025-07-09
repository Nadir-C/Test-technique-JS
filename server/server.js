const express = require('express');
const port = process.env.PORT || 8000;
const cors = require('cors');
const yahooFinance = require('yahoo-finance2').default;
const app = express();
app.use(cors());

app.get('/quote/:symbol', async (req, res) => {
  const symbol = req.params.symbol;
  try {
    const data = await yahooFinance.quote(symbol);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.listen(port, () => {
    console.log('Server app listening on port ' + port);
});