const express = require("express");
const cors = require("cors");
require("./db/config"); // Ensure this file sets up your MongoDB connection
const User = require("./db/User"); // Ensure this is your User model
const Product = require("./db/Product"); // Ensure this is your User model

const Jwt = require("jsonwebtoken");
const jwtKey = "e-comm";
const app = express();

app.use(express.json());
app.use(cors());

// Registration route
app.post("/register", async (req, resp) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password; // Remove the password field from the result
  if (result) {
    Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
      if (err) {
        resp.send({ result: "Something went wrong" });
      } else {
        resp.send({ result, auth: token });
      }
    });
  } else {
    resp.send({ result: "No User Found" }); // Send error message if user is not found
  }
});

// Login route
app.post("/login", async (req, resp) => {
  if (req.body.email && req.body.password) {
    // Find the user by email and password, excluding the password field in the result
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          resp.send({ result: "Something went wrong" });
        } else {
          resp.send({ user, auth: token });
        }
      });
      // resp.send(user); // Send the user object back to the client if found
    } else {
      resp.send({ result: "No User Found" }); // Send error message if user is not found
    }
  } else {
    resp.send({ result: "Please provide necessary credentials" }); // Send error message if email or password is missing
  }
});

//Product Routes

app.post("/add-product", async (req, resp) => {
  let product = new Product(req.body);
  let result = await product.save();
  resp.send(result);
});

app.get("/products", async (req, resp) => {
  let products = await Product.find();
  if (products.length > 0) {
    resp.send(products);
  } else {
    resp.send({ result: "No products found" });
  }
});
// Start the server on port 5000
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
