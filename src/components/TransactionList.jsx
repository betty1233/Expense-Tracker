export default function TransactionList({ transactions }) {
  return (
    <div>
      <h2>Recent Transactions</h2>

      {transactions.map((item) => (
        <div key={item.id}>
          <p>{item.title}</p>
          <p>{item.amount}</p>
        </div>
      ))}
    </div>
  );
}