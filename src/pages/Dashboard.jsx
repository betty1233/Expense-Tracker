import Frontpage from "../components/Frontpage"

export default function Dashboard({transactions, setTransactions}) {
    return(
       <Frontpage 
            transactions={transactions}
            setTransactions={setTransactions}
        />
    );
}