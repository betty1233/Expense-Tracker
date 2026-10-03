import { Link } from "react-router-dom"; 

export default function Navbar(){
    return(
        <nav className="flex items-center justify-between p-4 bg-indigo-600 text-white">
            <h2 className="text-xl font-bold">
                Expense Tracker
            </h2>
            <div className="flex gap-6">
                <Link to= "/dashboard"className="hover:text-indigo-200"> Dashboard </Link>
                <Link to= "/transactions" className="hover:text-indigo-200"> Transactions </Link>
                <Link to= "/analytics" className="hover:text-indigo-200"> Analytics </Link>
                <Link to= "/settings" className="hover:text-indigo-200"> Settings </Link>
            </div>
        </nav>
    );
}