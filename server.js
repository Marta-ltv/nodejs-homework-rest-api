const app = require('./app')

app.listen(3000, () => {
  console.log("Server running. Use our API on port: 3000")
})

const mongoose = require("mongoose");

const DB_HOST =
  "mongodb+srv://Martina:QZsC7odZNnlYOYDA@cluster0.fcknohc.mongodb.net/db-contacts?retryWrites=true&w=majority";

mongoose.set('strictQuery', true);
mongoose.connect(DB_HOST)
  .then(() => console.log("Database connection successful"))
  .catch((error) => console.log(error.message));
