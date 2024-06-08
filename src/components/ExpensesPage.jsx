import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import back from '../assets/back.svg';

function ExpensesPage({ theme, toggleTheme }) {
    const { monthYear } = useParams(); // Get the selected month-year from the route parameters
    const navigate = useNavigate(); // Hook to navigate to different routes
    const [expenses, setExpenses] = useState(() => {
        // Load saved expenses from localStorage when the component is first rendered
        const savedExpenses = localStorage.getItem(`expenses-${monthYear}`);
        return savedExpenses ? JSON.parse(savedExpenses) : [];
    });
    const [expense, setExpense] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [totalAmount, setTotalAmount] = useState(() => {
        // Calculate the initial total amount from saved expenses
        const savedExpenses = localStorage.getItem(`expenses-${monthYear}`);
        return savedExpenses ? JSON.parse(savedExpenses).reduce((sum, exp) => sum + parseFloat(exp.amount), 0) : 0;
    });

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    useEffect(() => {
        // Save expenses to localStorage whenever they change
        localStorage.setItem(`expenses-${monthYear}`, JSON.stringify(expenses));
    }, [expenses, monthYear]);

    const handleAddExpense = () => {
        if (expense && amount && selectedDate) {
            const newExpense = { expense, amount: parseFloat(amount), date: selectedDate };
            setExpenses((prevExpenses) => [...prevExpenses, newExpense]); // Add new expense to the list
            setTotalAmount((prevTotal) => prevTotal + newExpense.amount); // Update total amount
            setExpense(''); // Clear the input field
            setAmount(''); // Clear the amount field
            setSelectedDate(''); // Clear the selected date
        }
    };

    const handleDeleteExpense = (index) => {
        const amountToDeduct = expenses[index].amount;
        setExpenses((prevExpenses) => prevExpenses.filter((_, i) => i !== index));
        setTotalAmount((prevTotal) => prevTotal - amountToDeduct); // Update total amount
    };

    const handleEditExpense = (index) => {
        const expenseToEdit = expenses[index];
        setExpense(expenseToEdit.expense);
        setAmount(expenseToEdit.amount);
        setSelectedDate(expenseToEdit.date);
        handleDeleteExpense(index);
    };

    return (
        <div className={theme} style={{ height: '100vh' }}> {/* Apply the current theme */}
            <nav className="bg-violet-500 flex w-screen justify-between px-7 h-16 items-center z-50">
                <div className='flex h-fit gap-5'>
                    <div className='w-10'><img src="/wallet.png" alt="#" /></div>
                    <h1 className='text-3xl hidden sm:block font-semibold'>BUDGETbook</h1>
                </div>
                {/* Theme toggle switch */}
                <label className="switch">
                    <input type="checkbox" onChange={toggleTheme} checked={theme === 'dark'} />
                    <span className="slider round"></span>
                </label>
            </nav>
            <section className="w-[95vw] m-auto sm:w-[65vw] mt-3">
                <button onClick={() => navigate(-1)}><img src={back} alt="back-button" className='h-9' /></button> {/* Navigate back to the previous page */}
                <h2 className='text-center font-semibold text-xl mx-5 mb-5 lg:text-3xl lg:mb-8'>Note down your Expenses - <br /><span className='bg-violet-500 text-white px-2 rounded-lg'>{monthYear}</span></h2>

                {/* Inner-Box */}
                <div className="innerContent lg:w-fit lg:m-auto">
                    <div className="userInput flex flex-col gap-2 lg:flex-row">
                        <div className="flex w-fit gap-3 m-auto md:gap-2">
                            <input
                                className='text-black border-2 w-60 h-9 rounded-md border-violet-500'
                                type="text"
                                value={expense}
                                onChange={(e) => setExpense(e.target.value)}
                                placeholder="Add expense"
                            />
                            <input
                                type="number"
                                className='w-20 h-9 rounded-md border-2 border-violet-500 text-black lg:w-32'
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Amount"
                            />
                        </div>
                        <div className="flex w-fit gap-2 m-auto">
                            <select className='text-white w-32 h-9 bg-violet-500 rounded-md' id="date" name="date" value={selectedDate} onChange={handleDateChange}>
                                <option value="">Select a date</option>
                                {[...Array(31)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                    </option>
                                ))}
                            </select>
                            <button className='w-36 border-[3px] border-violet-500 rounded-md font-medium text-lg lg:w-20' onClick={handleAddExpense}>Save</button>
                        </div>
                    </div>
                    <div className="container mt-7">
                        <ul className='list h-[48vh] lg:h-[52vh] lg:w-4/5 m-auto overflow-y-scroll'>
                            {expenses.map((exp, index) => (
                                <li className='h-fit border-2 rounded-md mb-1 border-violet-500 p-2 flex flex-col' key={index}>
                                    <span>
                                        <span className='text-white bg-violet-400 font-medium py-1 px-2 rounded-md text-lg'>{exp.date}</span>
                                        <span className='ml-2 text-lg font-medium'>{exp.expense}</span>
                                        <span className='font-semibold text-lg ml-2 text-red-500'>₹{exp.amount}</span>
                                    </span>
                                    <div className="flex justify-start mt-2">
                                        <button className='mr-2 w-20 text-white bg-violet-500 rounded' onClick={() => handleEditExpense(index)}>Edit</button>
                                        <button className='w-20 border-2 border-violet-500 rounded' onClick={() => handleDeleteExpense(index)}>Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="totalAmount p-2 mt-2 text-lg font-bold text-center">
                            Your Monthly Expense: <span className='text-red-500'>₹{totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ExpensesPage;
