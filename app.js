const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// MongoDB Connection
mongoose
  .connect(process.env.mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("MongoDB Connected...");
  })
  .catch((error) => {
    console.error(error);
  });

// Defining Express Server port to Listen on
const PORT = process.env.PORT || 5000;

// Listening to Port
app.listen(PORT, () => {
  console.log(`Server is listening at Port ${PORT}`);
});
