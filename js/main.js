// ! Edit Mode Variables
let editMode = false;
let editItem;
let editItemId;

// ! Calling elements from HTML
const form = document.querySelector(".form-wrapper");
const input = document.querySelector("#input");
const itemList = document.querySelector(".item-list");
const alert = document.querySelector(".alert");
const addButton = document.querySelector(".submit-btn");
const clearButton = document.querySelector(".clear-btn");

// console.log(form, input);

// Functions
const addItem = (e) => {
  e.preventDefault();
  const value = input.value;
  if (input.value !== "" && !editMode) {
    // Silme işlemleri için benzersiz değere ihtiyacımız var bunun için id yi getTime ile yapıldı
    const id = new Date().getTime().toString();
    console.log(id);
    createElement(id, value);
    setToDefault();
    showAlert("Eleman Eklendi", "success");
    addToLocalStorage(id, value);
  } else if (value !== "" && editMode) {
    editItem.innerHTML = value;
    updateLocalStorage(editItemId, value);
    setToDefault();
    showAlert("Eleman Düzenlendi", "success");
  }
};

// Warning function
const showAlert = (text, action) => {
  // alert elemanının içeriğini değiştir
  alert.textContent = `${text}`;
  // alert elemanının alert classını ekle
  alert.classList.add(`alert-${action}`);
  // alert elemanının 2 saniye sonra silinmesini sağla
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 2000);
};

// Elemanları silen fonksiyon
const deleteItem = (e) => {
  // console.log(e.target.parentElement.parentElement.parentElement);
  // silmek istenen elamana eriş
  const element = e.target.parentElement.parentElement.parentElement;
  const id = element.dataset.id;
  // bu elemanı kaldır
  itemList.removeChild(element);
  removeFromLocalStorage(id);
  showAlert("Eleman Silindi", "danger");

  // eğer hiç elemen yoksa sıfırlama butonu kaldır
  if (!itemList.children.length) {
    clearButton.style.display = "none";
  }
};

// function to edit elements
const editItems = (e) => {
  const element = e.target.parentElement.parentElement.parentElement;
  editItem = e.target.parentElement.parentElement.previousElementSibling;
  input.value = editItem.innerText;
  editMode = true;
  editItemId = element.dataset.id;
  addButton.textContent = "Düzenle";
};

// Function that returns default values
const setToDefault = () => {
  input.value = "";
  editMode = false;
  editItem = "";
  addButton.textContent = "Ekle";

  if (!itemList.children.length) {
    clearButton.style.display = "none";
  } else {
    clearButton.style.display = "";
  }
};

//Function to render elements when the page is loaded
const renderItems = () => {
  let items = getFromLocalStorage();
  console.log("items");
  if (items.length > 0) {
    items.forEach((item) => {
      createElement(item.id, item.value);
    });
  }
};

// Function that creates elements
const createElement = (id, value) => {
  // yeni bir div oluştur
  const newDiv = document.createElement("div");
  // bu div e attribute ekle
  newDiv.setAttribute("data-id", id);
  //Bu div e class ekle
  newDiv.classList.add("items-list-item");

  //Bu divin html içeriğini belirle
  newDiv.innerHTML = `
            <p class="item-name">${value}</p>
            <div class="btn-container">
              <button class="edit-btn">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="delete-btn">
                <i class="fa-solid fa-trash"></i>
              </button>
  `;
  // delete buttona eriş
  const deleteBtn = newDiv.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);

  // edit buttona eriş
  const editBtn = newDiv.querySelector(".edit-btn");
  // console.log(editBtn);
  editBtn.addEventListener("click", editItems);

  itemList.appendChild(newDiv);
  showAlert("Eleman Eklendi", "success");
};

// Clear function
const clearItems = () => {
  const items = document.querySelectorAll(".items-list-item");
  if (items.length > 0) {
    items.forEach((item) => {
      itemList.removeChild(item);
    });
    showAlert("Liste Boş", "danger");
    clearButton.style.display = "none";
    localStorage.removeItem("items");
  }
};

// Function that saves to localstorage
const addToLocalStorage = (id, value) => {
  const item = { id, value };
  let items = getFromLocalStorage();
  items.push(item);
  localStorage.setItem("items", JSON.stringify(items));
};

//Function that gets data from localstorage
const getFromLocalStorage = () => {
  return localStorage.getItem("items")
    ? JSON.parse(localStorage.getItem("items"))
    : [];
};

//Function that deletes data in localstorage
const removeFromLocalStorage = (id) => {
  let items = getFromLocalStorage();
  items = items.filter((item) => item.id !== id);
  localStorage.setItem("items", JSON.stringify(items));
};

//Function that updates localstorage
const updateLocalStorage = (id, newValue) => {
  let items = getFromLocalStorage();
  items = items.map((item) => {
    if (item.id === id) {
      return { ...item, value: newValue };
    }
    return item;
  });
  localStorage.setItem("items", JSON.stringify(items));
};

// Event Listeners
// Formun gönderildiğin anı yakala
form.addEventListener("submit", addItem);
// Sayfanın yüklendiği anı yakala
window.addEventListener("DOMContentLoaded", renderItems);
// Clear Button a tıklanınca elemanları sıfırlama
clearButton.addEventListener("click", clearItems);
