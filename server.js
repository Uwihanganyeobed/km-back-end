import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Database successfylly connected"))
  .catch((err) => console.log(err));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const bookSchema = new mongoose.Schema({
  id: String,
  title: String,
  pages: Number,
  author: String,
});
const Book = mongoose.model("books", bookSchema);

//Health check

app.get("/", async (req, res) => {
  res.send("🩺 Server is running");
});
//CRUD operations on books

app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.log(error);
  }
});

//POST

app.post("/books", async (req, res) => {
  try {
    const { title, pages, author } = req.body;
    const newBook = new Book({ title, pages, author });
    await newBook.save();
    res.json("New Book Created", newBook);
  } catch (error) {
    console.log(error);
  }
});

//GET by id
app.get("/books/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const newBook = await Book.findById(id);
    res.json(newBook);
  } catch (error) {
    console.log(error);
  }
});

app.put("/books/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { title, pages, author } = req.body;
    const newBook = await Book.findByIdAndUpdate(id, { title, pages, author });
    res.status(202).json(newBook);
  } catch (error) {
    res.status(400).json("Cannot get book",error);
  }
});


app.delete('/books/:id', async(req,res)=>{
    try {
        const id = req.params.id;
        const deletedBook = await Book.findByIdAndDelete(id);
        res.status(202).json("Successfully deleted book",deletedBook);
    } catch (error) {
        res.status(400).json("Cannot delete",error);
    }
})

app.listen(4000, () => console.log("Server running on port 4000"));
