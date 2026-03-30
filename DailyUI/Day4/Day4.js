document.onload = function () {
    function calculate() {
        var firstNumber = parseFloat(document.getElementById("firstNumber").value);
        var secondNumber = parseFloat(document.getElementById("secondNumber").value);
        var operator = document.getElementById("operator").value;
        var result;
        if (operator === "+") {
            result = firstNumber + secondNumber;
        } else if (operator === "-") {
            result = firstNumber - secondNumber;
        } else if (operator === "*") {
            result = firstNumber * secondNumber;
        } else if (operator === "/") {
            result = firstNumber / secondNumber;
        } else {
            result = "Invalid operator";
        }
        document.getElementById("result").innerText = result;
    }
}