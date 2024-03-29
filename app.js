require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();

// Routes Components
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const paymentRoutes = require("./routes/payment");
const addressRoutes = require("./routes/address");

// MongoDB Connection
mongoose
  .connect(process.env.mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("MongoDB Connected...");
  })
  .catch((error) => {
    console.error(error);
  });

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", paymentRoutes);
app.use("/api", addressRoutes);

// For Heroku Deployment
// Serve static assets in Production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("../projfrontend/build"));

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../projfrontend", "build", "index.html")
    )
  );
}

// Defining Express Server port to Listen on
const PORT = process.env.PORT || 5000;

// Listening to Port
app.listen(PORT, () => {
  console.log(`Server is listening at Port ${PORT}`);
});
