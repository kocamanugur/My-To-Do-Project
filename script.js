let input = document.querySelector("input");
let form = document.querySelector("form");
let list = document.querySelector("ul");
let p = document.createElement("p");
let deleteBtn = document.getElementById("btnDelete");
let addBtn = document.getElementById("btnAddNewTask");
let taskBox = document.querySelector(".taskBox");
let items;
let itemIndex = [];
let charNumIndex = document.getElementById("charNumIndex");
let charNum = document.querySelector(".charNum");
let karakterSiniri = 40;
let darkModeLS;
let darkModeBtn = document.querySelector(".dark-mode");
let body = document.querySelector("body");

eventListenters();
getDarkModeLS();
warnMessage();

function eventListenters() {
    //görev ekle
    form.addEventListener("submit", addTask);
    list.addEventListener("click", deleteTask);
    list.addEventListener("click", checkTask);
    deleteBtn.addEventListener("click", deleteAllTask);
    body.addEventListener("click", darkMode);
    input.addEventListener("keyup", karakterKontrol);
    input.addEventListener("keydown", karakterKontrol);
}

loadItemsFromLS();
getIndexFromLS()

function karakterKontrol() {
   // let mesajUzunluk = input.value.length;

    if (karakterSiniri >= input.value.length) {
        var kalan = karakterSiniri - input.value.length;
        charNumIndex.innerHTML = kalan;
    }
    else {
        charNumIndex.innerHTML = "Giriş hakkı kalmadı!";
    }
}

function getItemsFromLS() {
    if (localStorage.getItem("items") === null) {
        items = [];
    }
    else {
        items = JSON.parse(localStorage.getItem("items"));
    }
    return items;
}

function setItemtoLS(text) {
    items = getItemsFromLS();
    items.push(text);
    localStorage.setItem("items", JSON.stringify(items));
}

function setIndexToLS(item) {
    localStorage.setItem("itemIndex", JSON.stringify(item));
}

function getIndexFromLS() {
    let itemIndexLS = JSON.parse(localStorage.getItem("itemIndex"));

    if (itemIndexLS != null && itemIndexLS.length >= 0) {
        itemIndex.forEach(function (item, index) {
            if (itemIndexLS.indexOf(index) > -1) {
                item.classList.add("checked");
            }
        });
    }
}

function loadItemsFromLS() {

    items = getItemsFromLS();
    items.forEach(function (item) {
        createItem(item);
    });
    if (list.innerHTML == "") {

    }
    else {
        p.remove();
    }
}

function deleteItemFromLS(text) {
    items = getItemsFromLS();
    items.forEach(function (item, index) {
        if (item === text) {
            items.splice(index, 1);
        }
    });
    localStorage.setItem("items", JSON.stringify(items));

    if (list.innerHTML == "") {
        localStorage.clear();
    }
}

function createItem(text) {
    let li = document.createElement("li");
    li.className = "taskList-item";
    let removeSpace = text.trim();
    li.innerHTML = removeSpace;
    charNumIndex.innerHTML = "40";
    let a = document.createElement("a");
    a.setAttribute("href", "#");
    a.setAttribute("class", "close-btn");
    a.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    li.appendChild(a);
    //list.appendChild(li);
    itemIndex.push(li);
    list.insertBefore(li, list.childNodes[0]);

}

function addTask(e) {

    let removeSpace = input.value.trim();

    if (input.value.length > 40) {
        alert("Karakter Sayısı Çok Fazla");
        charNumIndex.innerHTML = "40";
        input.value = "";
        return;
    }

    if (removeSpace == "") {
        alert("Bir Görev Girin.");
        input.value = "";
        charNumIndex.innerHTML = "40";
    }

    else {
        createItem(input.value);
        setItemtoLS(input.value);
        e.preventDefault();
        charNumIndex.innerHTML = "40";
        input.value = "";
        p.remove();
    }
}

function checkTask(e) {
    if (e.target.nodeName == "LI") {
        e.target.classList.toggle("checked");
    }
    let doneJob = document.querySelectorAll(".taskList-item.checked");
    let doneJobArr = [];
    doneJob.forEach(function (job) {
        doneJobArr.push(job);
    });
    let doneJobIndex = doneJobArr.map(function (job) {
        return itemIndex.indexOf(job);
    });
    setIndexToLS(doneJobIndex);
}

function deleteTask(e) {
    if (e.target.nodeName == "I") {
        if (confirm("Emin Misiniz?")) {
            e.target.parentElement.parentElement.remove();
            deleteItemFromLS(e.target.parentElement.parentElement.textContent);
            
            itemIndex.forEach(function (item, index) {
                if (item == e.target.parentElement.parentElement) {
                    itemIndex.splice(index, 1);
                }
            });
        }
    }
    if (list.innerHTML == "") {
        warnMessage();
    }
}

function deleteAllTask() {
    if (list.innerHTML == "") {
        alert("Silinecek Görev Bulunmamaktadır.");
        charNumIndex.innerHTML = "40";
        input.value = "";
    }
    else {
        if (confirm("Emin Misiniz?")) {
            list.innerHTML = "";
            charNumIndex.innerHTML = "40";
            input.value = "";
            localStorage.removeItem("items");
            itemIndex = [];
            warnMessage();
        }
    }
}

function warnMessage() {
    p.innerHTML = "Göreviniz Bulunmamaktadır..";
    taskBox.appendChild(p);
}

function darkMode(e) {
    if (e.target.className == "fa-solid fa-circle-half-stroke") {
        body.classList.toggle("dark");
        addBtn.classList.toggle("buttonsDark");
        deleteBtn.classList.toggle("buttonsDark");
        darkModeBtn.classList.toggle("btnDark");
        p.classList.toggle("warnMessage");
        charNum.classList.toggle("warnMessage");
    }

    if (darkModeBtn.classList.contains("btnDark")) {
        darkModeLS = true;
        localStorage.setItem("darkModeLS", JSON.stringify(darkModeLS));
    }

    else {
        darkModeLS = false;
        localStorage.setItem("darkModeLS", JSON.stringify(darkModeLS));
    }
}

function getDarkModeLS() {
    darkModeLS = JSON.parse(localStorage.getItem("darkModeLS"));
    if (darkModeLS === true) {
        body.classList.add("dark");
        addBtn.classList.add("buttonsDark");
        deleteBtn.classList.add("buttonsDark");
        darkModeBtn.classList.add("btnDark");
        p.classList.toggle("warnMessage");
        charNum.classList.toggle("warnMessage");
    }
}
