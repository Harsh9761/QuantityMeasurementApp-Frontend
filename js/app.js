const BASE_URL = "http://localhost:8080/api/v1";

let selectedType = "LENGTH";

const units = {
    LENGTH: ["FEET", "INCHES", "YARDS", "CENTIMETERS"],
    TEMPERATURE: ["CELSIUS", "FAHRENHEIT"],
    VOLUME: ["LITRE", "MILLILITRE", "GALLON"],
    WEIGHT: ["KILOGRAM", "GRAM", "POUND"]
};

function login() {
    let emailVal = document.getElementById("email").value.trim();
    let passwordVal = document.getElementById("password").value.trim();

    if (!emailVal || !passwordVal) {
        showAuthError("All fields are required");
        return;
    }

    if (!validateEmail(emailVal)) {
        showAuthError("Invalid email format");
        return;
    }

    fetch(BASE_URL + "/users/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            email: emailVal,
            password: passwordVal
        })
    })
    .then(res => res.text())
    .then(token => {
        localStorage.setItem("token", token);
        window.location.href = "index.html";
    })
    .catch(() => showAuthError("Login failed"));
}

function register() {
    let nameVal = document.getElementById("name").value.trim();
    let emailVal = document.getElementById("email").value.trim();
    let passwordVal = document.getElementById("password").value.trim();

    if (!nameVal || !emailVal || !passwordVal) {
        showAuthError("All fields are required");
        return;
    }

    if (!validateEmail(emailVal)) {
        showAuthError("Invalid email format");
        return;
    }

    if (passwordVal.length < 6) {
        showAuthError("Password must be at least 6 characters");
        return;
    }

    fetch(BASE_URL + "/users/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            name: nameVal,
            email: emailVal,
            password: passwordVal
        })
    })
    .then(() => {
        alert("Registered Successfully!");
        window.location.href = "login.html";
    })
    .catch(() => showAuthError("Registration failed"));
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

function selectType(type, el) {
    selectedType = type;

    document.querySelectorAll(".card").forEach(c => c.classList.remove("active"));
    el.classList.add("active");

    loadUnits();
    updateButtons();
}

function loadUnits() {
    let from = document.getElementById("fromUnit");
    let to = document.getElementById("toUnit");

    from.innerHTML = "";
    to.innerHTML = "";

    units[selectedType].forEach(u => {
        from.innerHTML += `<option>${u}</option>`;
        to.innerHTML += `<option>${u}</option>`;
    });
}

function showResult(text) {
    document.getElementById("resultText").innerText = text;
}

function callAPI(operation) {
    let token = localStorage.getItem("token");

    return fetch(BASE_URL + "/quantities/" + operation, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            thisQuantityDTO: {
                value: parseFloat(fromValue.value),
                unit: fromUnit.value,
                measurementType: selectedType
            },
            thatQuantityDTO: {
                value: parseFloat(toValue.value),
                unit: toUnit.value,
                measurementType: selectedType
            }
        })
    }).then(res => res.json());
}

function convert() {
    

    let token = localStorage.getItem("token");

    fetch(BASE_URL + "/quantities/convert", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            thisQuantityDTO: {
                value: parseFloat(fromValue.value),
                unit: fromUnit.value,
                measurementType: selectedType
            },
            thatQuantityDTO: {
                unit: toUnit.value,
                measurementType: selectedType
            }
        })
    })
    .then(res => res.json())
    .then(data => {
        toValue.value = data.resultValue;
        showResult(`✅ Converted: ${data.resultValue} ${data.resultUnit}`);
    })
    .catch(() => showResult("❌ Conversion failed"));
}

function add() {
    
    callAPI("add")
    .then(d => showResult(`➕ Result: ${d.resultValue} ${d.resultUnit}`))
    .catch(() => showResult("❌ Add failed"));
}


function subtract() {
    
    callAPI("subtract")
    .then(d => showResult(`➖ Result: ${d.resultValue} ${d.resultUnit}`))
    .catch(() => showResult("❌ Subtract failed"));
}

function divide() {
    
    callAPI("divide")
    .then(d => showResult(`➗ Result: ${d.resultValue} (Ratio)`))
    .catch(() => showResult("❌ Divide failed"));
}

function compare() {
    callAPI("compare")
    .then(d => {
        if (d.resultValue === 1) {
            showResult("✅ Quantities are Equal");
        } else {
            showResult("❌ Quantities are NOT Equal");
        }
    })
    .catch(() => showResult("❌ Compare failed"));
}



if (document.getElementById("fromUnit")) {
    loadUnits();
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showAuthError(msg) {
    document.getElementById("errorMsg").innerText = msg;
}

function updateButtons() {
    let addBtn = document.getElementById("addBtn");
    let subBtn = document.getElementById("subBtn");
    let divBtn = document.getElementById("divBtn");

    if (selectedType === "TEMPERATURE") {
        addBtn.style.display = "none";
        subBtn.style.display = "none";
        divBtn.style.display = "none";
    } else {
        addBtn.style.display = "inline-block";
        subBtn.style.display = "inline-block";
        divBtn.style.display = "inline-block";
    }
}

if (document.getElementById("fromUnit")) {
    loadUnits();
    updateButtons();
}

function googleLogin() {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
}

window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
        localStorage.setItem("token", token);
        window.history.replaceState({}, document.title, "index.html");
    }
};


function loadHistory() {
    let token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    let operation = document.getElementById("operationSelect").value;

    fetch(BASE_URL + "/quantities/history/operation/" + operation, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data.length === 0) {
            showResult(`No ${operation} history found`);
            return;
        }

        let html = `<b>📜 ${operation} History:</b><br><br>`;

        data.slice(-5).reverse().forEach(item => {
            html += `• ${item.operation}: ${item.resultValue} ${item.resultUnit}<br>`;
        });

        document.getElementById("resultText").innerHTML = html;
    })
    .catch(() => showResult("❌ Failed to load history"));
}

function loadCount() {
    let token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    let operation = document.getElementById("operationSelect").value;

    fetch(BASE_URL + "/quantities/count/" + operation, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    })
    .then(res => res.text())
    .then(count => {
        showResult(`📊 Total ${operation} operations: ${count}`);
    })
    .catch(() => showResult("❌ Failed to load analytics"));
}