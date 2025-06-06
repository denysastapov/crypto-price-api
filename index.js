const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");

const app = express();
const cache = new NodeCache({ stdTTL: 60 });
const PORT = process.env.PORT || 3000;

app.get("/price/:id", async (req, res) => {
  const id = req.params.id;

  const cachedData = cache.get(id);
  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    const url = `https://api.coingecko.com/api/v3/coins/${id}`;
    const response = await axios.get(url);
    const data = response.data;

    const result = {
      name: data.name,
      symbol: data.symbol.toUpperCase(),
      price: data.market_data.current_price.usd,
    };

    cache.set(id, result);

    res.json(result);
  } catch (error) {
    res.status(404).json({ error: "Cryptocurrency not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Crypto Price API listening on port ${PORT}`);
});
