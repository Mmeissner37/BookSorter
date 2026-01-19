import { useState, useMemo } from 'react'
import './App.css'

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [sortBy, setSortBy] = useState('none');
  const [selectedRandomBook, setSelectedRandomBook] = useState(null);

  const addBook = () => {
    if (title && author) {
      setBooks([...books, { id: Date.now(), title, author, status: 'To Be Read' }]);
      setTitle('');
      setAuthor('');
    }
  };

  const deleteBook = (id) => {
    setBooks(books.filter(book => book.id !== id));
  };

  const updateStatus = (id, status) => {
    setBooks(books.map(book => book.id === id ? { ...book, status } : book));
  };

  const randomSort = () => {
    const shuffled = [...books].sort(() => Math.random() - 0.5);
    setBooks(shuffled);
    if (shuffled.length > 0) {
      const randomIndex = Math.floor(Math.random() * shuffled.length);
      setSelectedRandomBook(shuffled[randomIndex]);
    }
  };

  const sortedBooks = useMemo(() => {
    let sorted = [...books];
    if (sortBy === 'title-asc') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'title-desc') {
      sorted.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === 'author-asc') {
      sorted.sort((a, b) => a.author.localeCompare(b.author));
    } else if (sortBy === 'author-desc') {
      sorted.sort((a, b) => b.author.localeCompare(a.author));
    }
    return sorted;
  }, [books, sortBy]);

  return (
    <div className="app-container">
      <div className="left-column">
        <h1>Book Sorter</h1>
        <div className="add-book">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
          />
          <input
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="Author"
            type="text"
          />
          <button onClick={addBook}>Add Book</button>
        </div>
        <button onClick={randomSort} className="sort-btn">Random Sort</button>
        <div className="sort-options">
          <label>Sort by: </label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="none">No Sort</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="author-asc">Author A-Z</option>
            <option value="author-desc">Author Z-A</option>
          </select>
        </div>
        <h2>My Books</h2>
        <ul className="book-list">
          {sortedBooks.map(book => (
            <li key={book.id} className="book-item">
              <span>{book.title} by {book.author}</span>
              <select
                value={book.status}
                onChange={e => updateStatus(book.id, e.target.value)}
              >
                <option>To Be Read</option>
                <option>Reading</option>
                <option>Finished</option>
              </select>
              <button onClick={() => deleteBook(book.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="right-column">
        {selectedRandomBook && (
          <div>
            <h2>Random Book</h2>
            <p>{selectedRandomBook.title} by {selectedRandomBook.author}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
