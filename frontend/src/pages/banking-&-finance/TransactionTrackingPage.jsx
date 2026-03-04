import { useEffect, useState } from "react";
import { getTransactions } from "../../services/transactionService";

const [transactions, setTransactions] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadTransactions();
}, []);

const loadTransactions = async () => {
  try {
    const res = await getTransactions(0, 10);
    setTransactions(res.data.content || res.data);
  } catch (err) {
    console.error("Failed to load transactions", err);
  } finally {
    setLoading(false);
  }
};