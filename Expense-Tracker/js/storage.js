function saveData(data){
    localStorage.setItem("expenseData", JSON.stringify(data))
}

function getData(){
    const data = localStorage.getItem("expenseData");
    return data ? JSON.parse(data) : [];
}