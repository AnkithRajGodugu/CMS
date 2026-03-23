import { useEffect, useState } from "react";
import { getCustomersThisMonth } from "../../services/reportService";

const [monthlyCustomers, setMonthlyCustomers] = useState(0);

useEffect(() => {
  loadReport();
}, []);

const loadReport = async () => {
  try {
    const res = await getCustomersThisMonth("banking");
    setMonthlyCustomers(res.data);
  } catch (err) {
    console.error("Failed to load report", err);
  }
};
