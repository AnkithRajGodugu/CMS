import { getCustomers } from "../../services/customerService";

const [customers, setCustomers] = useState([]);

useEffect(() => {
  loadCustomers();
}, []);

const loadCustomers = async () => {
  try {
    const res = await getCustomers();
    setCustomers(res.data.content);
  } catch (err) {
    console.error("Failed to load customers", err);
  }
};