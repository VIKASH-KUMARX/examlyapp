import { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { H1, H4 } from '@blueprintjs/core';

export function StudentMain() {

  const [studentData, setStudentData] = useState([]);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const API = queryParams.get('API');

  useEffect(() => {
    fetch(API)
      .then((response) => response.json())
      .then((data) => setStudentData(data))
      .catch((error) => console.error("Error in Fetch!", error));
  }, [API]);
  
  const Year = String(studentData.regnum || "").substring(4, 6);
  const Batch = `20${Year} - 20${parseInt(Year) + 4}`;

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '30px', color: '#111' }}>
      
      <h2 style={{ marginBottom: '20px' }}>Dashboard</h2>

      {/* Profile Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
        {/* Profile Icon */}
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          border: '2px solid #000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '50px'
        }}>
          {/* Simple person icon */}
          <span>👤</span>
        </div>

        {/* Name and Details */}
        <div>
          <H1 style={{ margin: 0 }}>Hey {studentData.name && studentData.name.toUpperCase()}</H1>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
            <H4 style={{ margin: 0 }}>Register number :</H4>
            <p style={{
              backgroundColor: '#e0e0e0',
              padding: '5px 10px',
              borderRadius: '5px',
              margin: 0
            }}>{studentData.regnum}</p>

            <H4 style={{ margin: '0 0 0 20px' }}>Degree :</H4>
            <p style={{
              backgroundColor: '#e0e0e0',
              padding: '5px 10px',
              borderRadius: '5px',
              margin: 0
            }}>BE-ECE</p>

            <H4 style={{ margin: '0 0 0 20px' }}>Batch :</H4>
            <p style={{
              backgroundColor: '#e0e0e0',
              padding: '5px 10px',
              borderRadius: '5px',
              margin: 0
            }}>{Batch}</p>
          </div>
        </div>
      </div>

      {/* Seating Allotment Section */}
      <div style={{ marginTop: '30px' }}>
        <h2 style={{ marginBottom: '20px' }}>Seating Allotment</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <H4 style={{ width: '200px', margin: 0 }}>Course Title :</H4>
            <p style={{ fontWeight: 'bold', margin: 0 }}> </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <H4 style={{ width: '200px', margin: 0 }}>Course Code :</H4>
            <p style={{ fontWeight: 'bold', margin: 0 }}> </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <H4 style={{ width: '200px', margin: 0 }}>Exam Date :</H4>
            <p style={{ fontWeight: 'bold', margin: 0 }}> </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <H4 style={{ width: '200px', margin: 0 }}>Session :</H4>
            <p style={{ fontWeight: 'bold', margin: 0 }}> </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <H4 style={{ width: '200px', margin: 0 }}>Hall Number :</H4>
            <p style={{ fontWeight: 'bold', margin: 0 }}>
              {studentData.roomno && studentData.roomno.length > 0 ? studentData.roomno : 'Not Allocated'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
