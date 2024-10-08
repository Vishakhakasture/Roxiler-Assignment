// backend/utils/fetchData.js

const axios = require("axios");

// Function to fetch data from the third-party API
const fetchData = async () => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data from API:", error);
    throw new Error("Failed to fetch data");
  }
};

module.exports = fetchData;
