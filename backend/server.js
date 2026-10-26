
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const books = [
  { id: 1, title: 'Atomic Habits', author: 'James Clear', category: 'Self-Help', price: 450, emoji: '📘' },
  { id: 2, title: 'The Silent Patient', author: 'Alex Michaelides', category: 'Mystery', price: 399, emoji: '📕' },
  { id: 3, title: 'Clean Code', author: 'Robert C. Martin', category: 'Technology', price: 650, emoji: '💻' },
  { id: 4, title: 'Harry Potter', author: 'J.K. Rowling', category: 'Fantasy', price: 550, emoji: '🪄' },
  { id: 5, title: 'The Alchemist', author: 'Paulo Coelho', category: 'Fiction', price: 299, emoji: '📙' },
  { id: 6, title: 'Deep Work', author: 'Cal Newport', category: 'Self-Help', price: 420, emoji: '🧠' },
  { id: 7, title: 'It Ends with Us', author: 'Colleen Hoover', category: 'Romance', price: 350, emoji: '💕' },
  { id: 8, title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Romance', price: 280, emoji: '🌹' },
  { id: 9, title: 'Dune', author: 'Frank Herbert', category: 'Science Fiction', price: 499, emoji: '🚀' },
  { id: 10, title: 'The Hobbit', author: 'J.R.R. Tolkien', category: 'Fantasy', price: 399, emoji: '🐉' },
  { id: 11, title: 'Sapiens', author: 'Yuval Noah Harari', category: 'History', price: 599, emoji: '🌍' },
  { id: 12, title: 'Wings of Fire', author: 'A.P.J. Abdul Kalam', category: 'Biography', price: 320, emoji: '🔥' },
  { id: 13, title: 'The Psychology of Money', author: 'Morgan Housel', category: 'Finance', price: 380, emoji: '💰' },
  { id: 14, title: 'Think and Grow Rich', author: 'Napoleon Hill', category: 'Business', price: 299, emoji: '📈' },
  { id: 15, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'Education', price: 899, emoji: '📚' },
  { id: 16, title: 'The Selfish Gene', author: 'Richard Dawkins', category: 'Science', price: 520, emoji: '🔬' },
  { id: 17, title: 'Sherlock Holmes', author: 'Arthur Conan Doyle', category: 'Mystery', price: 340, emoji: '🔎' },
  { id: 18, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', price: 250, emoji: '🎭' },
  { id: 19, title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', category: 'Finance', price: 360, emoji: '💵' },
  { id: 20, title: 'The Power of Now', author: 'Eckhart Tolle', category: 'Self-Help', price: 410, emoji: '✨' },
  { id: 21, title: 'The Martian', author: 'Andy Weir', category: 'Science Fiction', price: 430, emoji: '🪐' },
  { id: 22, title: 'Steve Jobs', author: 'Walter Isaacson', category: 'Biography', price: 700, emoji: '👤' },
  { id: 23, title: 'Ikigai', author: 'Hector Garcia', category: 'Self-Help', price: 280, emoji: '🌱' },
  { id: 24, title: 'The Lean Startup', author: 'Eric Ries', category: 'Business', price: 450, emoji: '🚀' }
];

app.get('/', (req, res) => {
  res.send('PageTurner Book Store API is running!');
});

app.get('/api/books', (req, res) => {
  res.json(books);
});

app.get('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === Number(req.params.id));

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  res.json(book);
});

app.get('/api/categories', (req, res) => {
  res.json(['All', ...new Set(books.map(book => book.category))]);
});

app.get('/api/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase();

  res.json(books.filter(book =>
    book.title.toLowerCase().includes(q) ||
    book.author.toLowerCase().includes(q) ||
    book.category.toLowerCase().includes(q)
  ));
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      message: 'Please fill in all fields.'
    });
  }

  res.json({
    message: `Thank you, ${name}! Your message was received.`
  });
});

app.listen(PORT, () => {
  console.log(`PageTurner API running at http://localhost:${PORT}`);
});
