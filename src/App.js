import React, { useState, useEffect } from "react";
//import logo from './logo.svg';
import "./App.css";
import ExpenseList from "./components/ExpenseList";
import ExpenseFrom from "./components/ExpenseFrom";
import Alert from "./components/Alert";
import { v4 as uuid } from "uuid";
// const initialExpenses = [
//   { id: uuid(), charge: "rent", amount: 1600 },
//   { id: uuid(), charge: "Car Payment", amount: 400 },
//   { id: uuid(), charge: "Credit card", amount: 800 },
// ];
const initialExpenses = localStorage.getItem("expenses")
  ? JSON.parse(localStorage.getItem("expenses"))
  : [];
// import useState()
// function returns [] with two values
// the actual value of the state
// function for updates/control
//default value
function App() {
  // class based component
  // state = {initialExpenses}
  // this.setstate({})
  //   ******************* state values  ****************
  // all expenses, add expenses
  const [expenses, setExpenses] = useState(initialExpenses);
  // single expense
  const [charge, setCharge] = useState("");

  // edit
  const [edit, setEdit] = useState(false);
  // edit Item

  const [id, setId] = useState(0);
  // alert
  const [alert, setAlert] = useState({ show: false });
  // single amount
  const [amount, setAmount] = useState("");
  //   ******************* functionality  ****************

  //   ******************* useEffect  ****************

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const handleCharge = (e) => {
    //console.log(`charge : ${e.target.value}`);
    setCharge(e.target.value);
  };
  const handleAmount = (e) => {
    //console.log(`amount : ${e.target.value}`);
    setAmount(e.target.value);
  };
  // handle alert

  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text });
    setTimeout(() => {
      setAlert({ show: false });
    }, 3000);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (charge !== "" && amount > 0) {
      if (edit) {
        let tempExpenses = expenses.map((item) => {
          return item.id === id ? { ...item, charge, amount } : item;
        });
        setExpenses(tempExpenses);
        setEdit(false);
        handleAlert({ type: "success", text: "item Edited" });
      } else {
        const singleExpense = { id: uuid(), charge, amount };
        setExpenses([...expenses, singleExpense]);
        handleAlert({ type: "success", text: "item added" });
      }

      setCharge("");
      setAmount("");
    } else {
      // handle alert called
      handleAlert({
        type: "danger",
        text: "charge cannot be empty value has to be bigger than zero",
      });
    }
  };

  // clear items
  const clearItems = () => {
    setExpenses([]);
    handleAlert({ type: "danger", text: "All items deleted" });
  };

  // handle delete
  const handleDelete = (id) => {
    let tempExpenses = expenses.filter((item) => item.id !== id);
    setExpenses(tempExpenses);
    handleAlert({ type: "danger", text: "item deleted" });
  };
  // handle edit
  const handleEdit = (id) => {
    let expense = expenses.find((item) => item.id === id);
    let { charge, amount } = expense;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
  };
  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} />}
      <Alert />
      <h1>Budget Calculator</h1>
      <main className="App">
        <ExpenseFrom
          charge={charge}
          amount={amount}
          handleAmount={handleAmount}
          handleCharge={handleCharge}
          handleSubmit={handleSubmit}
          edit={edit}
        />
        <ExpenseList
          expenses={expenses}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          clearItems={clearItems}
        />
      </main>
      <h1>
        Total Spending:{" "}
        <span className="total">
          $
          {expenses.reduce((acc, curr) => {
            return (acc += parseInt(curr.amount));
          }, 0)}
        </span>
      </h1>
    </>
  );
}

export default App;
