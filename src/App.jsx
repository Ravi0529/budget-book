import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ExpensesPage from './components/ExpensesPage';

function MainPage({ theme, toggleTheme }) {
  const [inputColor, setInputColor] = useState('white'); // State to manage the input color
  const [selectedMonths, setSelectedMonths] = useState(() => {
    // Load saved selected months from localStorage when the component is first rendered
    const savedMonths = localStorage.getItem('selectedMonths');
    return savedMonths ? JSON.parse(savedMonths) : [];
  });
  const [sectionHeight, setSectionHeight] = useState('0vh'); // State to manage the section height

  useEffect(() => {
    // Save selected months to localStorage whenever they change
    localStorage.setItem('selectedMonths', JSON.stringify(selectedMonths));
  }, [selectedMonths]);

  const handleChange = (event) => {
    const selectedMonthYear = event.target.value; // Get the selected month-year
    if (selectedMonthYear) {
      if (selectedMonths.includes(selectedMonthYear)) {
        alert('This month-year is already selected!'); // Alert if the month-year is already selected
      } else {
        setInputColor('black'); // Change the input color
        setSelectedMonths((prevSelectedMonths) => [...prevSelectedMonths, selectedMonthYear]); // Add the new month-year to the list
      }
    } else {
      setInputColor('white'); // Reset the input color if no month-year is selected
    }
  };

  const handleDelete = (monthYear) => {
    if (window.confirm(`Are you sure you want to delete ${monthYear}?`)) {
      // Delete the selected month-year and remove associated expenses from localStorage
      setSelectedMonths(selectedMonths.filter((month) => month !== monthYear));
      localStorage.removeItem(`expenses-${monthYear}`);
    }
  };

  return (
    <main className={theme}> {/* Apply the current theme */}
      <nav className="theme-switcher bg-violet-500 flex w-screen justify-between px-7 h-16 items-center z-50">
        <div className=' flex h-fit gap-5'>
          <div className='w-10'><img src="/wallet.png" alt="logo" /></div>
          <h1 className='text-3xl hidden sm:block font-semibold'>BUDGETbook</h1>
        </div>
        {/* Theme toggle switch */}
        <label className="switch">
          <input type="checkbox" onChange={toggleTheme} checked={theme === 'dark'} />
          <span className="slider round"></span>
        </label>
      </nav>
      <motion.div
        className="upperContent"
        initial={{ opacity: 0, y: 0 }} // Initial animation state
        animate={{ opacity: 1, y: selectedMonths.length ? -200 : 0 }} // Animation state based on selected months
        transition={{ type: 'spring', stiffness: 50 }}
        onAnimationComplete={() => {
          if (selectedMonths.length > 0) {
            setSectionHeight('60vh'); // Adjust section height if there are selected months
          }
        }}
      >
        <h1 className='text-4xl mb-[3%] text-center'>Prepare Your <span className='font-bold text-violet-500'>BUDGETbook</span> </h1>
        <h1 className='text-center text-xl'>Pick Month-Year</h1>
        <div className="container text-center">
          <motion.input
            className='border-2 border-black'
            type="month"
            id="month"
            onChange={handleChange}
            style={{ color: inputColor }} // Set the input color
            animate={{ color: inputColor }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>
      {/* box of boxes */}
      <section style={{ height: sectionHeight, position: 'absolute', bottom: 0, width: '100vw' }}>
        <div className="boxes">
          {selectedMonths.map((monthYear, index) => (
            // boxes are here
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                backgroundColor: '#8b5cf6',
                borderRadius: '10px',
                padding: '4px',
                marginTop: '20px',
                position: 'relative',
              }}
            >
              <div className="box flex flex-col justify-center items-center" >
                <Link to={`/expenses/${monthYear}`}>
                  <p className='font-semibold h-16 w-24 text-center text-xl flex justify-center items-center'>{monthYear}</p>
                </Link>
                <motion.button
                  className='bg-red-500 text-white font-medium px-2 rounded-md'
                  onClick={() => handleDelete(monthYear)}
                  whileTap={{ scale: 0.95 }} // Slightly reduce the button size when active
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}

function App() {
  const [theme, setTheme] = useState(() => {
    // Load saved theme from localStorage when the component is first rendered
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'light'; // Default to 'light' theme if no saved theme
  });

  useEffect(() => {
    // Save theme to localStorage whenever it changes
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    // Toggle between 'light' and 'dark' themes
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <Router>
      <Routes>
        {/* The main page where users select month-year */}
        <Route path="/" element={<MainPage theme={theme} toggleTheme={toggleTheme} />} />
        {/* The expenses page for the selected month-year */}
        <Route path="/expenses/:monthYear" element={<ExpensesPage theme={theme} toggleTheme={toggleTheme} />} />
      </Routes>
    </Router>
  );
}

export default App;