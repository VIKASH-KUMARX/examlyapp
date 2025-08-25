import { useState, useEffect } from 'react';
import { YearOneStudents } from './Database_Modification/YearOneStudents';
import { YearTwoStudents } from './Database_Modification/YearTwoStudents';
import { YearThreeStudents } from './Database_Modification/YearThreeStudents';
import { YearFourStudents } from './Database_Modification/YearFourStudents';
import { FullCourseList } from './Database_Modification/FullCourseList';
import { StudentLoginDB } from './Database_Modification/StudentLoginDB';
import { AdminLoginDB } from './Database_Modification/AdminLoginDB';
import { DatabaseInitialization } from './DatabaseInitialization';
import { HallSeatingAllocation } from './Hall_Seating_Allocation/HallSeatingAllocation';
import { AdminStatus } from './AdminStatus';
import './../../Pages/Styles/Admin/AdminMainStyle.css';

export function AdminMain() {
  const [selectedPage, setSelectedPage] = useState('status');

  useEffect(() => {
    const savedPage = localStorage.getItem('selectedAdminPage');
    if (savedPage) {
      setSelectedPage(savedPage);
    }
  }, []);

  const handleDropdownChange = (e) => {
    const value = e.target.value;
    setSelectedPage(value);
    localStorage.setItem('selectedAdminPage', value);
  };

  const handleButtonClick = (page) => {
    setSelectedPage(page);
    localStorage.setItem('selectedAdminPage', page);
  };

  const renderSelectedPage = () => {
    switch (selectedPage) {
      case 'year1': return <YearOneStudents />;
      case 'year2': return <YearTwoStudents />;
      case 'year3': return <YearThreeStudents />;
      case 'year4': return <YearFourStudents />;
      case 'courses': return <FullCourseList />;
      case 'studentLoginDB': return <StudentLoginDB />;
      case 'adminLoginDB': return <AdminLoginDB />;
      case 'init': return <DatabaseInitialization />;
      case 'seating': return <HallSeatingAllocation />;
      case 'status': return <AdminStatus />;
      default: return <p>Select a function from the left panel or dropdown menu.</p>;
    }
  };

  return (
    <div className="admin-container">
      <div className="sidebar">
        <h1>Admin Panel</h1>

        <div className="dropdown-container">
          <label htmlFor="studentActions"><strong>Database Modification:</strong></label><br />
          <select 
            id="studentActions" 
            onChange={handleDropdownChange} 
            value={selectedPage || ''} 
            className="dropdown"
          >
            <option value="">Choose Options</option>
            <option value="year1">Year 1 Students</option>
            <option value="year2">Year 2 Students</option>
            <option value="year3">Year 3 Students</option>
            <option value="year4">Year 4 Students</option>
            <option value="courses">Course Time Table</option>
            <option value="studentLoginDB">Student Login DB</option>
            <option value="adminLoginDB">Admin Login DB</option>
          </select>
        </div>

        <div className="button-group">
          <button onClick={() => handleButtonClick('init')}>Database Initialization</button>
          <button onClick={() => handleButtonClick('seating')}>Hall Seating Allocation</button>
          <button onClick={() => handleButtonClick('status')}>Admin Status</button>
        </div>
      </div>

      <div className="content-area">
        {renderSelectedPage()}
      </div>
    </div>
  );
}
