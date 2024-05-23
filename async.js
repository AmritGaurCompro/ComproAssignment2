function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a random book
function generateRandomBook(bookId) {
  const genres = [
    "Fiction",
    "Non-Fiction",
    "Science Fiction",
    "Mystery",
    "Thriller",
    "Fantasy",
  ];
  const randomGenre = genres[getRandomNumber(0, genres.length - 1)];
  const price = getRandomNumber(10, 100);
  return { bookId, genre: randomGenre, price };
}

// Function to generate an array of random books
function generateRandomBooks(numBooks) {
  const books = [];
  for (let i = 1; i <= numBooks; i++) {
    books.push(generateRandomBook(i));
  }
  return books;
}

// Function to write books to local storage
function writeBooksToLocalStorage(books) {
  try {
    localStorage.setItem("books", JSON.stringify(books));
    console.log("Books written to local storage successfully!");
  } catch (err) {
    console.error("Error writing books to local storage:", err);
  }
}

// Function to load books from local storage
function loadBooksFromLocalStorage() {
  try {
    const booksString = localStorage.getItem("books");
    if (booksString) {
      return JSON.parse(booksString);
    } else {
      console.log("No books found in local storage.");
      return [];
    }
  } catch (err) {
    console.error("Error loading books from local storage:", err);
    return [];
  }
}

// Function to search books by bookId, genre, or price
function searchBooks(books, searchCriteria) {
  return new Promise((resolve, reject) => {
    const filteredBooks = books.filter(
      (book) =>
        book.bookId === parseInt(searchCriteria.bookId) ||
        book.genre.toLowerCase() === searchCriteria.genre?.toLowerCase() ||
        book.price === parseInt(searchCriteria?.price)
    );

    resolve(filteredBooks);
  });
}

// Function to sort books by price
function sortBooksByPrice(books, order = "asc") {
  return new Promise((resolve, reject) => {
    books.sort((a, b) => {
      if (order === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
    resolve(books);
  });
}

// Function to display list of books in a table
function displayBooks(books, tableId) {
  const table = document.getElementById(tableId);
  const tbody = table.querySelector("tbody");
  tbody.innerHTML = ""; // Clear previous data
  books.forEach((book) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${book.bookId}</td>
            <td>${book.genre}</td>
            <td>${book.price}</td>
            <td><button class="btn btn-primary btn-examine" data-book-id="${book.bookId}">Examine</button></td>
        `;
    tbody.appendChild(tr);
  });
}

function displayExaminedBook(book) {
  const examinedBookContainer = document.querySelector(".div-examined-book");
  const listExaminedBook = examinedBookContainer.querySelector(
    ".list-examined-book"
  );

  listExaminedBook.innerHTML = "";
  const bookIdItem = document.createElement("li");
  bookIdItem.textContent = `Book Id: ${book.bookId}`;
  listExaminedBook.appendChild(bookIdItem);

  const priceItem = document.createElement("li");
  priceItem.textContent = `Price: ${book.price}`;
  listExaminedBook.appendChild(priceItem);

  const genreItem = document.createElement("li");
  genreItem.textContent = `Genre: ${book.genre}`;
  listExaminedBook.appendChild(genreItem);
}

// Load books when the page is loaded
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const books = loadBooksFromLocalStorage();
    displayBooks(books, "table-all-books");
  } catch (err) {
    console.error("Error loading books:", err);
  }
});

// Event listener for searching by bookId

document
  .querySelector(".btn-search-id")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    const searchId = document.querySelector(".input-search-id").value;
    try {
      const books = loadBooksFromLocalStorage();
      const filteredBooks = await searchBooks(books, { bookId: searchId });
      console.log(filteredBooks);
      displayBooks(filteredBooks, "table-similar-books");
    } catch (err) {
      console.error("Error searching books:", err);
    }
  });

// Event listener for searching by genre
document
  .querySelector(".btn-search-genre")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    const searchGenre = document.querySelector(".input-search-genre").value;
    try {
      const books = loadBooksFromLocalStorage();
      const filteredBooks = await searchBooks(books, { genre: searchGenre });
      displayBooks(filteredBooks, "table-similar-books");
    } catch (err) {
      console.error("Error searching books:", err);
    }
  });

// Event listener for searching by price
document
  .querySelector(".btn-search-price")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    const searchPrice = document.querySelector(".input-search-price").value;
    try {
      const books = loadBooksFromLocalStorage();
      const filteredBooks = await searchBooks(books, { price: searchPrice });
      displayBooks(filteredBooks, "table-similar-books");
    } catch (err) {
      console.error("Error searching books:", err);
    }
  });

// Event listener for examining a book
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-examine")) {
    const bookId = parseInt(e.target.dataset.bookId);
    try {
      const books = loadBooksFromLocalStorage();
      const examinedBook = books.find((book) => book.bookId === bookId);
      if (examinedBook) {
        displayExaminedBook(examinedBook);
      } else {
        console.error("Book not found");
      }
    } catch (err) {
      console.error("Error examining book:", err);
    }
  }
});

// Event listener for sorting by price
document.querySelector(".js-div-sort").addEventListener("click", async () => {
  const sortOrder = document.querySelector(".container-js-div-sort").value;
  try {
    const books = loadBooksFromLocalStorage();
    const sortedBooks = await sortBooksByPrice(books, sortOrder);
    displayBooks(sortedBooks, "table-all-books");
  } catch (err) {
    console.error("Error sorting books:", err);
  }
});

// Generate random books and store in local storage
const numBooks = 100;
const books = generateRandomBooks(numBooks);
writeBooksToLocalStorage(books);
