const express = require("express");
const mongoose = require("mongoose");
const app = express();
const connectDB = async () => {
  mongoose.connect("mongodb://localhost:27017/admin");
  const productSchema = new mongoose.Schema({});
  const productModel = mongoose.model("product", productSchema);

  const data = await productModel.find();

  console.log("Data is", data);
};

app.listen(5000);
