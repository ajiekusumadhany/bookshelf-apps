const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}
const daftarBook = [];
const RENDER_EVENT = "render-book";
document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBuku();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
function addBuku() {
  const titleBook = document.getElementById("inputBookTitle").value;
  const authorBook = document.getElementById("inputBookAuthor").value;
  const yearBook = document.getElementById("inputBookYear").value;
  const isCompletedBook = document.getElementById(
    "inputBookIsComplete"
  ).checked;
  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    titleBook,
    authorBook,
    yearBook,
    isCompletedBook
  );
  daftarBook.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function generateId() {
  return +new Date();
}
function generateBookObject(id, titleBook, authorBook, yearBook, isCompleted) {
  return {
    id,
    titleBook,
    authorBook,
    yearBook: parseInt(yearBook),
    isCompleted,
  };
}
document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById(
    "incompleteBookshelfList"
  );
  uncompletedBookList.innerHTML = "";
  const completedBookList = document.getElementById("completeBookshelfList");
  completedBookList.innerHTML = "";

  for (const bookItem of daftarBook) {
    const bookElement = makeBuku(bookItem);
    if (!bookItem.isCompleted) {
      uncompletedBookList.append(bookElement);
    } else {
      completedBookList.append(bookElement);
    }
  }
});
function makeBuku(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.titleBook;
  textTitle.setAttribute("data-testid", "bookItemTitle");

  const textAuthor = document.createElement("p");
  textAuthor.innerText = "Penulis: " + bookObject.authorBook;
  textAuthor.setAttribute("data-testid", "bookItemAuthor");

  const textYear = document.createElement("p");
  textYear.innerText = "Tahun: " + bookObject.yearBook;
  textYear.setAttribute("data-testid", "bookItemYear");

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement("div");
  container.classList.add("book_item");
  container.append(textContainer);
  container.setAttribute("data-bookid", bookObject.id); // Set ID buku
  container.setAttribute("data-testid", "bookItem"); // Set test id buku

  // Tombol selesai dibaca atau belum selesai
  const buttonAction = document.createElement("div");
  buttonAction.classList.add("action");

  if (bookObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("green");
    undoButton.innerText = "Belum Selesai dibaca";
    undoButton.setAttribute("data-testid", "bookItemIsCompleteButton");

    undoButton.addEventListener("click", function () {
      undoBook(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("red");
    trashButton.innerText = "Hapus buku";
    trashButton.setAttribute("data-testid", "bookItemDeleteButton");

    trashButton.addEventListener("click", function () {
      const confirmRemove = document.getElementById("confirm-remove");
      const jadiRemove = document.getElementById("jadi-remove");
      const batalRemove = document.getElementById("batal-remove");

      confirmRemove.style.display = "block";

      jadiRemove.addEventListener("click", () => {
        removeBook(bookObject.id);
        confirmRemove.style.display = "none";
      });

      batalRemove.addEventListener("click", () => {
        confirmRemove.style.display = "none";
      });
    });

    buttonAction.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("green");
    checkButton.innerText = "Selesai dibaca";
    checkButton.setAttribute("data-testid", "bookItemIsCompleteButton");

    checkButton.addEventListener("click", function () {
      addTaskToCompleted(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("red");
    trashButton.innerText = "Hapus buku";
    trashButton.setAttribute("data-testid", "bookItemDeleteButton");

    trashButton.addEventListener("click", function () {
      const confirmRemove = document.getElementById("confirm-remove");
      const jadiRemove = document.getElementById("jadi-remove");
      const batalRemove = document.getElementById("batal-remove");

      confirmRemove.style.display = "block";

      jadiRemove.addEventListener("click", () => {
        removeBook(bookObject.id);
        confirmRemove.style.display = "none";
      });

      batalRemove.addEventListener("click", () => {
        confirmRemove.style.display = "none";
      });
    });

    buttonAction.append(checkButton, trashButton);
  }

  container.append(buttonAction);
  return container;
}

function addTaskToCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function findBook(bookId) {
  for (const bookItem of daftarBook) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}
function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;
  daftarBook.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function undoBook(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function findBookIndex(bookId) {
  for (const index in daftarBook) {
    if (daftarBook[index].id === bookId) {
      return index;
    }
  }
  return -1;
}
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(daftarBook);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}
document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
  if (data !== null) {
    for (const book of data) {
      daftarBook.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}
const formPencarian = document.getElementById("searchBook");
formPencarian.addEventListener("submit", function (event) {
  event.preventDefault();
  const searchInput = document.getElementById("searchBookTitle").value;
  searchBooks(searchInput);
});
function searchBooks(query) {
  const uncompletedBookList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completedBookList = document.getElementById("completeBookshelfList");
  for (const bookItem of daftarBook) {
    const bookElement = document.getElementById(`book-${bookItem.id}`);
    if (bookItem.titleBook.toLowerCase().includes(query.toLowerCase())) {
      bookElement.style.display = "block";
    } else {
      bookElement.style.display = "none";
    }
  }
}
function showAllBooks() {
  const uncompletedBookList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completedBookList = document.getElementById("completeBookshelfList");
  for (const bookItem of daftarBook) {
    const bookElement = document.getElementById(`book-${bookItem.id}`);
    bookElement.style.display = "block";
  }
}
formPencarian.addEventListener("reset", function () {
  showAllBooks();
});
