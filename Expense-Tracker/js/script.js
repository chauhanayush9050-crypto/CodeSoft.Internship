const form = document.querySelector(".transaction-form");

const title = document.querySelector(".text");

const amount = document.querySelector(".amount");

const type = document.querySelector(".type");

const balanceBox = document.querySelector(".balance");

const incomeBox = document.querySelector(".income");

const expenseBox = document.querySelector(".expense");

const list = document.querySelector(".list");
const search = document.querySelector(".search");
const filter = document.querySelector(".filter");
const submitBtn = document.querySelector(".submit-btn");

let history = getData();
let editId = null;

form.addEventListener("submit", addTransaction);
search.addEventListener("input", showData);
filter.addEventListener("change", showData);

function addTransaction(e) {
  e.preventDefault();

  const itemTitle = title.value.trim();

  const itemAmount = Number(amount.value);

  const itemType = type.value;

  if (itemTitle === "" || itemAmount <= 0) {
    alert("Please enter valid details");

    return;
  }

  const transaction = {
    id: Date.now(),

    title: itemTitle,

    amount: itemAmount,

    type: itemType,
    date: new Date().toLocaleDateString(),
  };

  if (editId !== null) {
    const item = history.find((item) => item.id === editId);
    item.title = itemTitle;
    item.amount = itemAmount;
    item.type = itemType;

    editId = null;
  } else {
    history.push(transaction);
  }

  showData();

  updateBalance();
  saveData(history);

  title.value = "";

  amount.value = "";

  type.value = "income";

  submitBtn.innerHTML = `
    <i class="fa-solid fa-plus"></i>
    Add Transaction
`;
}

function showData() {
  list.innerHTML = "";

  if (history.length === 0) {
    list.innerHTML = `
            <li class="empty">
                No transactions yet
            </li>
        `;

    return;
  }

  const word = search.value.toLowerCase().trim();

  const selected = filter.value;

  const data = history.filter((item) => {
    const matchWord = item.title.toLowerCase().includes(word);

    const matchType = selected === "all" || item.type === selected;

    return matchWord && matchType;
  });

  if (data.length === 0) {
    list.innerHTML = `
            <li class="empty">
                No transactions found
            </li>
        `;

    return;
  }

  data.forEach((item) => {
    const li = document.createElement("li");

    const income = item.type === "income";

    const sign = income ? "+" : "-";

    const className = income ? "income-text" : "expense-text";

    li.innerHTML = `

            <div>

                <h4>${item.title}</h4>

                <span>
                    ${item.type} • ${item.date || "No date"}
                </span>

            </div>


            <div class="actions">

                <p class="amount-text ${className}">
                    ${sign} ${formatMoney(item.amount)}
                </p>


                <button
                    class="edit-btn"
                    onclick="editItem(${item.id})"
                >
                    <i class="fa-solid fa-pen"></i>
                </button>


                <button
                    class="delete-btn"
                    onclick="deleteItem(${item.id})"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>

            </div>

        `;

    list.appendChild(li);
  });
}

function updateBalance() {
  let income = 0;

  let expense = 0;

  history.forEach((item) => {
    if (item.type === "income") {
      income += item.amount;
    } else {
      expense += item.amount;
    }
  });

  const balance = income - expense;

  balanceBox.textContent = formatMoney(balance);
  

  incomeBox.textContent = formatMoney(balance)

  expenseBox.textContent = formatMoney(balance)
}


function deleteItem(id) {
  history = history.filter((item) => item.id !== id);
  saveData(history);

  showData();

  updateBalance();
}
function editItem(id) {
  const item = history.find((item) => item.id === id);
  if (!item) {
    return;
  }
  editId = id;
  title.value = item.title;
  amount.value = item.amount;
  type.value = item.type;

  submitBtn.innerHTML = `
   <i class="fa-solid fa-pen"></i>
    Update Transaction
  `;
}

showData();

updateBalance();
