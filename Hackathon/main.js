// TODO API REQUESTS
let API = "http://localhost:8003/students"

// TODO CRUD
let firstName = document.querySelector(".inp");
let lastName = document.querySelector("#name");
let phoneNumber = document.querySelector("#phone");
let weeklyKPI = document.querySelector("#weekly-kpi");
let monthlyKPI = document.querySelector("#monthly-kpi");
let btnAdd = document.querySelector("#btn-add");
let AddStudent = document.querySelector("#add-student");

// TODO Modals input
let rewriteFirstName = document.querySelector("#rewrite-firstname");
let rewriteName = document.querySelector("#rewrite-name");
let rewritePhoneNumber = document.querySelector("#rewrite-phone");
let rewriteWeeklyKPI = document.querySelector("#rewrite-weekly-kpi");
let rewriteMounthlyKPI = document.querySelector("#rewrite-mounthly-kpi");
let rewriteBtn = document.querySelector("#btn-save-rewrite");
let exampleModal = document.querySelector("#exampleModal")

// TODO PAGINATION
let currentPage = 1;
let pageTotalCount = 1;
let paginationList = document.querySelector(".pagination-list");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");

// TODO SEARCH
let searchInp = document.querySelector("#search");
let searchVal = "";

//! 
let list = document.querySelector("#students-list");

// TODO ADD STUDENTS
btnAdd.addEventListener("click", async function() {
    let obj = {
        firstName: firstName.value,
        lastName: lastName.value,
        phoneNumber: phoneNumber.value,
        weeklyKPI: weeklyKPI.value,
        monthlyKPI: monthlyKPI.value,
    };

    if (
        !obj.firstName.trim() ||
        !obj.lastName.trim() ||
        !obj.phoneNumber.trim() ||
        !obj.weeklyKPI.trim() ||
        !obj.monthlyKPI.trim()
    ) {
        alert("Заполните все поля");
        return;
    };

await fetch(API, {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
        "Content-type": "application/json"
    }
});

firstName.value = "";
lastName.value = "";
phoneNumber.value = "";
weeklyKPI.value = "";
monthlyKPI.value = "";

render();
});

// TODO DISPLAY JSON-SERVER
async function render() {
    let students = await fetch(`${API}?q=${searchVal}&_page=${currentPage}&_limit=4`)
    .then((res) => res.json())
    .catch((err) => console.log(err));
    drawPaginationButtons();
    
    list.innerHTML = "";

    students.forEach((element) => {
        let newElem = document.createElement("div");
        newElem.id = element.id
        newElem.innerHTML = `
        <div class="card m-5" style="width: 500px;">
            <div class="card-body">
                <h5 class="card-first-name">${element.firstName}</h5>
                <h5 class="card-name">${element.lastName}</h5>
                <span>Номер телефона</span>
                <p class="card-text">${element.phoneNumber}</p>
                <span>Недельный KPI</span>
                <div class="progress">
                  <div class="progress-bar" role="progressbar" data-progress="50%" aria-label="Example with label" style="background: linear-gradient(to bottom right, #ff6600 25%, #ffffff 116%); color:black; width: ${element.weeklyKPI}%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">${element.weeklyKPI}%
                  </div>
                </div>
                <span>Ежемесячный KPI</span>
                <div class="progress">
                  <div class="progress-bar" role="progressbar" data-progress="50%" aria-label="Example with label" style="background: linear-gradient(to bottom right, #ff6600 25%, #ffffff 116%); color:black; width: ${element.monthlyKPI}%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">${element.monthlyKPI}%
                  </div>
                </div>
                <a href="#" id=${element.id} class="btn btn-danger btn-delete mt-2" style="background: linear-gradient(to top left, #ff6600 52%, #ffffff 108%);">DELETE</a>
                <a href="#" data-bs-toggle="modal" data-bs-target="#exampleModal" id=${element.id} class="btn btn-dark btn-rewrite mt-2" style="background-color: black">EDIT</a>
            </div>
        </div>`;
        
        list.append(newElem);
    });
};

render();

// TODO DELETE
document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-delete")) {
      let id = e.target.id;
      await fetch(`${API}/${id}`, {
        method: "DELETE",
      });
      render();
    };
  });
  


// TODO REWRITE STUDENTS
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-rewrite")) {
      let id = e.target.id;
      fetch(`${API}/${id}`)
        .then((res) => res.json())
        .then((data) => {
            rewriteFirstName.value = data.firstName
            rewriteName.value = data.lastName
            rewritePhoneNumber.value = data.phoneNumber
            rewriteWeeklyKPI.value = data.weeklyKPI
            rewriteMounthlyKPI.value = data.monthlyKPI

            rewriteBtn.setAttribute("id", data.id);
        });
    };
});

rewriteBtn.addEventListener("click", function() {
    let id = this.id
    let firstName = rewriteFirstName.value
    let lastName = rewriteName.value
    let phoneNumber = rewritePhoneNumber.value
    let weeklyKPI = rewriteWeeklyKPI.value
    let monthlyKPI = rewriteMounthlyKPI.value

    if (!firstName || !lastName || !phoneNumber || !weeklyKPI || !monthlyKPI) {
        return;
    };
    
    let rewriteStudents = {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        weeklyKPI: weeklyKPI,
        monthlyKPI: monthlyKPI,
    };

    saveRewrite(rewriteStudents, id);
});

// TODO SAVE QUERY FUNCTION
function saveRewrite(rewriteStudents, id) {
    fetch(`${API}/${id}`, {
        method: "PATCH", 
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(rewriteStudents)
    }).then(() => {
        render();
    });
    let modal = bootstrap.Modal.getInstance(exampleModal);
    modal.hide();
};


// TODO PAGINATION
function drawPaginationButtons() {
    fetch(`${API}?q=${searchVal}`)
    .then((res) => res.json())
    .then((data) => {
        pageTotalCount = Math.ceil(data.length/4);
        paginationList.innerHTML = "";
        for(let i = 1; i <= pageTotalCount; i++) {
            if (currentPage == i) {
                let page1 = document.createElement("li");
                page1.innerHTML = `<li class="page-item active" style="color: black;">
                <a class="page-list page_number" href="#">${i}</a>
            </li>`
            paginationList.append(page1);
            } else {
                let page2 = document.createElement("li");
                page2.innerHTML = `<li class="page item">
                <a class-'page_number" href="#">${i}</a>
            </li>`
            paginationList.append(page2);
            };
        };

        if (currentPage == 1) {
            prev.classList.add("disabled")
        } else {
            prev.classList.remove("disabled")
        };

        if (currentPage == pageTotalCount) {
            next.classList.add("disabled")
        } else {
            next.classList.remove("disabled")
        };
    });
};

prev.addEventListener("click", () => {
    if (currentPage <= 1) {
        return;
    }
    currentPage --;
    render();
});

next.addEventListener("click", () => {
    if (currentPage >= pageTotalCount) {
        return;
    }
    currentPage ++;
    render();
});

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("page_number")) {
        currentPage = e.target.innerText;
        render();
    }
});

// TODO SEARCH
searchInp.addEventListener("input", () => {
    searchVal = searchInp.value;
    currentPage = 1;
    render();
});