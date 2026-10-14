import Frontpage from "../components/Frontpage"

export default function Dashboard({
    transactions,
    setTransactions,
    transactionToEdit,
    setTransactionToEdit,
}) {
    return(
       <Frontpage 
            transactions={transactions}
            setTransactions={setTransactions}
            transactionToEdit={transactionToEdit}
            setTransactionToEdit={setTransactionToEdit}
        />
    );
}