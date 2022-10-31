const STORAGE_KEY = "Aplikasi_Buku_Mandiri";

let buku = []; //penyimpanan buku

function isStorageExist() {
    if (typeof(Storage) === undefined) {
        alert("Browser kamu tidak mendukung local storage"); //akan muncul pesan
        return false
    }
    return true;
}

function penyimpananData() {
    const parsed = JSON.stringify(buku);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event("ondatasaved"));
}

function loadDataFromStorage(search = "") {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if (data !== null) {
        if (search) {
            buku = data.filter((a) => {
                for (let b of a.title.split(" ")) {
                    if (b === search) {
                        return b;
                    }
                }
            });

            console.log(search);
        } else {
            buku = data;
        }
    }


    document.dispatchEvent(new Event("ondataloaded"));
}

function perbaruiDataPenyimpanan() {
    if (isStorageExist())
        penyimpananData();
}

function composeTodoObject(title, author, year, isCompleted) {
    return {
        id: +new Date(),
        title,
        author,
        year,
        isCompleted
    };
}

function findTodo(todoId) {
    for (todo of buku) {
        if (todo.id === todoId)
            return todo;
    }
    return null;
}


function findTodoIndex(todoId) {
    let index = 0
    for (todo of buku) {
        if (todo.id === todoId)
            return index;

        index++;
    }

    return -1;
}


function refreshDataFromTodos() {
    let listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    let listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);

    listUncompleted.innerHTML = "";
    listCompleted.innerHTML = "";


    for (book of buku) {
        const newBook = makeTodo(book.title, book.author, book.year, book.isCompleted);
        newBook[BOOK_ITEMID] = book.id;


        if (book.isCompleted) {
            listCompleted.append(newBook);
        } else {
            listUncompleted.append(newBook);
        }
    }
}

// Manipulasi DOM 

const UNCOMPLETED_LIST_BOOK_ID = "incompleteBookshelfList";
const COMPLETED_LIST_BOOK_ID = "completeBookshelfList";
const BOOK_ITEMID = "itemId";

const checkbox = document.getElementById("inputBookIsComplete");
checkbox.addEventListener("click", function() {
    button = document.querySelector("#bookSubmit span");
    if (checkbox.checked) {
        button.innerText = "selesai dibaca";
    } else {
        button.innerText = "Belum selesai dibaca";
    }

});

function addTodo() {
    const uncompletedBOOKList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);

    const BookTitle = document.getElementById("inputBookTitle").value;
    const BookAuthor = document.getElementById("inputBookAuthor").value;
    const BookYear = document.getElementById("inputBookYear").value;
    const BookIsComplete = document.getElementById("inputBookIsComplete").checked;

    var book = makeTodo(BookTitle, BookAuthor, BookYear, BookIsComplete);
    var bookObject = composeTodoObject(BookTitle, BookAuthor, BookYear, BookIsComplete);

    book[BOOK_ITEMID] = bookObject.id;
    buku.push(bookObject);

    if (BookIsComplete) {
        listCompleted.append(book);
    } else {
        uncompletedBOOKList.append(book);
    }

    perbaruiDataPenyimpanan();

}

function makeTodo(title, author, year, isComplete) {

    const textTitle = document.createElement("h3");
    textTitle.innerText = title;

    const textAuthor = document.createElement("p");
    textAuthor.innerText = author;

    const textYear = document.createElement("p");
    textYear.innerText = year;

    const container = document.createElement("article");
    container.classList.add("book_item")
    container.append(textTitle, textAuthor, textYear);


    const containerAction = document.createElement('div');
    containerAction.classList.add('action');

    if (isComplete) {
        containerAction.append(createUndoButton(), createTrashButton());
    } else {
        containerAction.append(createCheckButton(), createTrashButton());
    }

    container.append(containerAction);

    return container;
}

function createCheckButton() {
    return createButton("Selesai dibaca", "green", function(event) {
        addBookToCompleted(event.target.parentElement.parentElement);
    });
}

function createTrashButton() {
    return createButton("Hapus buku", "red", function(event) {
        removeBookFromUncompleted(event.target.parentElement.parentElement);
    });
}

function createUndoButton() {
    return createButton("Belum selesai di Baca", "green", function(event) {
        undoBookFromCompleted(event.target.parentElement.parentElement);
    });
}

function createButton(buttonText, buttonTypeClass, eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.innerText = buttonText;
    button.addEventListener("click", function(event) {
        eventListener(event);
    });

    return button;
}

function addBookToCompleted(bookElement) {
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
    const BookTitle = bookElement.querySelector(".book_item > h3").innerText;
    const BookAuthor = bookElement.querySelectorAll(".book_item > p")[0].innerText;
    const BookYear = bookElement.querySelectorAll(".book_item > p")[1].innerText;
    const BookIsComplete = true;


    const newBook = makeTodo(BookTitle, BookAuthor, BookYear, BookIsComplete);
    const book = findTodo(bookElement[BOOK_ITEMID]);

    todo.isCompleted = true;
    newBook[BOOK_ITEMID] = book.id;

    listCompleted.append(newBook);
    bookElement.remove();

    perbaruiDataPenyimpanan();
}


function removeBookFromUncompleted(bookElement) {
    const bookPosition = findTodoIndex(bookElement[BOOK_ITEMID]);
    buku.splice(bookPosition, 1);

    bookElement.remove();
    perbaruiDataPenyimpanan();
}

function undoBookFromCompleted(bookElement) {
    const BookTitle = bookElement.querySelector(".book_item > h3").innerText;
    const BookAuthor = bookElement.querySelectorAll(".book_item > p")[0].innerText;
    const BookYear = bookElement.querySelectorAll(".book_item > p")[1].innerText;
    const BookIsComplete = false;

    const newBook = makeTodo(BookTitle, BookAuthor, BookYear, BookIsComplete);
    const book = findTodo(bookElement[BOOK_ITEMID]);

    todo.isCompleted = false;
    newBook[BOOK_ITEMID] = book.id;

    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    listUncompleted.append(newBook);
    bookElement.remove();

    perbaruiDataPenyimpanan();
}

document.addEventListener("DOMContentLoaded", function() {

    const submitForm = document.getElementById("inputBook");

    submitForm.addEventListener("submit", function(event) {
        event.preventDefault();
        addTodo();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }

    const searchForm = document.getElementById("searchSubmit");
    searchForm.addEventListener('click', function(event) {
        event.preventDefault();

        const title = document.getElementById('searchBookTitle').value;
        loadDataFromStorage(title);
    })
});

document.addEventListener("ondatasaved", () => {
    console.log("Data berhasil disimpan.");
});

document.addEventListener("ondataloaded", () => {
    refreshDataFromTodos();
});