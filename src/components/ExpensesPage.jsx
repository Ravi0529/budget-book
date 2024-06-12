import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    const [editIndex, setEditIndex] = useState(null); // Track the index of the expense being edited
    const [sortMethod, setSortMethod] = useState('date'); // Default sorting method
    const [showWalletInput, setShowWalletInput] = useState(false); // Show/Hide wallet amount input
    const [walletAmount, setWalletAmount] = useState(() => {
        // Load saved wallet amount from localStorage
        const savedWalletAmount = localStorage.getItem(`wallet-${monthYear}`);
        return savedWalletAmount ? parseFloat(savedWalletAmount) : 0;
    });
    const [inputWalletAmount, setInputWalletAmount] = useState('');

    useEffect(() => {
        // Save expenses to localStorage whenever they change
        localStorage.setItem(`expenses-${monthYear}`, JSON.stringify(expenses));
    }, [expenses, monthYear]);

    useEffect(() => {
        // Save wallet amount to localStorage whenever it changes
        localStorage.setItem(`wallet-${monthYear}`, walletAmount);
    }, [walletAmount, monthYear]);

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const handleAddExpense = () => {
        if (expense && amount && selectedDate) {
            const newExpense = { expense, amount: parseFloat(amount), date: selectedDate };
            if (editIndex !== null) {
                // If editing, update the existing expense
                const updatedExpenses = [...expenses];
                const oldAmount = updatedExpenses[editIndex].amount;
                updatedExpenses[editIndex] = newExpense;
                setExpenses(updatedExpenses);
                setTotalAmount((prevTotal) => prevTotal - oldAmount + newExpense.amount); // Update total amount correctly
                setEditIndex(null); // Clear the edit index
            } else {
                // If not editing, add new expense to the list
                setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
                setTotalAmount((prevTotal) => prevTotal + newExpense.amount); // Update total amount
            }
            setExpense(''); // Clear the input field
            setAmount(''); // Clear the amount field
            setSelectedDate(''); // Clear the selected date
        }
    };

    const handleEditExpense = (index) => {
        if (editIndex !== null && editIndex !== index) {
            alert('Please save your current edit before editing another expense.');
            return;
        }
        const expenseToEdit = expenses[index];
        setExpense(expenseToEdit.expense);
        setAmount(expenseToEdit.amount);
        setSelectedDate(expenseToEdit.date);
        setEditIndex(index); // Set the index of the expense being edited
    };


    const confirmDeleteExpense = (index) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            handleDeleteExpense(index);
        }
    };

    const handleDeleteExpense = (index) => {
        const amountToDeduct = expenses[index].amount;
        setExpenses((prevExpenses) => prevExpenses.filter((_, i) => i !== index));
        setTotalAmount((prevTotal) => prevTotal - amountToDeduct); // Update total amount
    };

    const handleAddWalletAmount = () => {
        setWalletAmount(parseFloat(inputWalletAmount));
        setShowWalletInput(false);
    };

    const remainingAmount = walletAmount - totalAmount;

    // Function to format numbers according to the Indian numbering system
    const formatNumberToIndianSystem = (num) => {
        const [integerPart, decimalPart] = num.toString().split('.');
        let lastThreeDigits = integerPart.slice(-3);
        const otherDigits = integerPart.slice(0, -3);
        const formattedNumber = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + (otherDigits ? ',' : '') + lastThreeDigits;
        return decimalPart ? `${formattedNumber}.${decimalPart}` : formattedNumber;
    };

    // Sort expenses based on the selected method
    const sortedExpenses = [...expenses].sort((a, b) => {
        if (sortMethod === 'date') {
            return new Date(a.date) - new Date(b.date);
        } else if (sortMethod === 'amount') {
            return b.amount - a.amount;
        }
        return 0;
    });

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
                <h2 className='text-center font-semibold text-xl mx-5 mb-2 lg:text-3xl lg:mb-8'>Note down your Expenses - <br /><span className='bg-violet-500 text-white px-2 rounded-lg'>{monthYear}</span></h2>

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
                            <motion.button
                                className='w-36 border-[3px] border-violet-500 rounded-md font-medium text-lg lg:w-20'
                                onClick={handleAddExpense}
                                whileTap={{ scale: 0.95 }} // Slightly reduce the button size when active
                            >
                                Save
                            </motion.button>
                        </div>
                    </div>
                    <div className="container mt-2">
                        <div className="flex justify-center mb-2">
                            <select
                                className="text-black border-2 border-violet-500 rounded-md px-2 py-1"
                                value={sortMethod}
                                onChange={(e) => setSortMethod(e.target.value)}
                            >
                                <option value="date">Sort by Date</option>
                                <option value="amount">Sort by Amount</option>
                            </select>
                            <motion.button
                                className="ml-2 bg-violet-500 text-white px-8 py-1 rounded-md"
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowWalletInput(true)}
                            >
                                Your Wallet
                            </motion.button>
                        </div>
                        {showWalletInput && (
                            <div className="absolute top-80 w-[94vw] lg:w-[40vw] flex flex-col items-center bg-gray-100 shadow-2xl border-4 border-violet-500 rounded-lg p-4">
                                <input
                                    type="number"
                                    className='w-40 h-9 rounded-md border-2 border-violet-500 text-black'
                                    value={inputWalletAmount}
                                    onChange={(e) => setInputWalletAmount(e.target.value)}
                                    placeholder="Enter wallet amount"
                                />
                                <motion.button
                                    className='mt-2 bg-violet-500 text-white px-4 py-1 rounded-md'
                                    onClick={handleAddWalletAmount}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Save
                                </motion.button>
                            </div>
                        )}
                        <ul className='list h-[46vh] lg:h-[50vh] lg:w-4/5 m-auto overflow-y-scroll'>
                            {sortedExpenses.map((exp, index) => (
                                <li className='h-fit border-2 rounded-md mb-1 border-violet-500 p-2 flex flex-col' key={index}>
                                    <span>
                                        <span className='text-white bg-violet-400 font-medium py-1 px-2 rounded-md text-lg'>{exp.date}</span>
                                        <span className='ml-2 text-lg font-medium'>{exp.expense}</span>
                                        <span className='font-semibold text-lg ml-2 text-red-500'>₹{formatNumberToIndianSystem(exp.amount)}</span>
                                    </span>
                                    <div className="flex justify-start mt-2">
                                        <motion.button
                                            className='mr-2 w-20 text-white bg-violet-500 rounded'
                                            whileTap={{ scale: 0.95 }} // Slightly reduce the button size when active
                                            onClick={() => handleEditExpense(index)}
                                        >
                                            Edit
                                        </motion.button>
                                        <motion.button
                                            className='w-20 border-2 border-violet-500 rounded'
                                            whileTap={{ scale: 0.95 }} // Slightly reduce the button size when active
                                            onClick={() => confirmDeleteExpense(index)}
                                        >
                                            Delete
                                        </motion.button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="totalAmount text-lg font-bold text-center">
                            Monthly Spending: <span className='text-red-500'>₹{formatNumberToIndianSystem(totalAmount.toFixed(2))}</span>
                        </div>
                        <div className="walletAmount text-lg font-bold text-center">
                            Leftover Wallet Balance:
                            <span className='text-green-500'>
                                {walletAmount ? ` ₹${formatNumberToIndianSystem(remainingAmount.toFixed(2))}` : ' -'}
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ExpensesPage;