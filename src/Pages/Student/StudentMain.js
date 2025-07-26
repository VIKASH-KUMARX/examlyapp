import { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { H1, H4 } from '@blueprintjs/core';

export function StudentMain() {

  const [studentData, setStudentData] = useState([]);
  const [examData, setExamData] = useState([]);
  const [filteredExamData, setFilteredExamData] = useState([]);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const API = queryParams.get('API');

  useEffect(() => {
    fetch(API)
      .then((response) => response.json())
      .then((data) => setStudentData(data))
      .catch((error) => console.error("Error in student data Fetch! - ", error));
  }, [API]);
  
  const Year = String(studentData.regnum || "").substring(4, 6);
  const Batch = `20${Year} - 20${parseInt(Year) + 4}`;

  useEffect(() => {
    fetch("/api/course")
      .then((response) => response.json())
      .then((json) => setExamData(json))
      .catch((error) => console.error("Error in courses Fetch! - ", error));
  }, []);  

  // useEffect(() => {
  //   if (studentData.courses && examData.length > 0) {
  //     const studentCourses = Array.isArray(studentData.courses)
  //       ? studentData.courses
  //       : JSON.parse(studentData.courses);

  //     const orderedFiltered = studentCourses.map((code) => 
  //       examData.find((exam) => 
  //         exam.coursecode === code ))
  //           .filter(Boolean); // remove undefined if any course code doesn't match

  //     setFilteredExamData(orderedFiltered);
  //   }
  // }, [studentData, examData]);

  useEffect(() => {
  if (studentData.courses && examData.length > 0) {
    const studentCourses = Array.isArray(studentData.courses)
      ? studentData.courses
      : studentData.courses.split(',');

    const filtered = examData.filter(exam =>
      studentCourses.includes(exam.coursecode)
    );

    const sorted = filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA - dateB !== 0) return dateA - dateB;
      return a.session === 'FN'
        ? -1
        : 1;
    });

    setFilteredExamData(sorted);
  }
}, [studentData, examData]);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '30px', color: '#111' }}>
      
      <h2 style={{ marginBottom: '20px' }}>Dashboard</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
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
        <span>👤</span>
        </div>
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

      <div style={{ marginTop: '40px' }}>
        <h2 style={{ marginBottom: '40px' }}>Seating Allotment</h2>
          <div style={{display : 'flex' ,marginBottom:'30px',gap:'10px'}}>
            <H4 style={{ width: '50px', margin: 0 }}>S.No</H4>
            <H4 style={{ width: '150px', margin: 0 }}>Course Code</H4>
            <H4 style={{ width: '250px', margin: 0 }}>Course Title</H4>
            <H4 style={{ width: '150px', margin: 0 }}>Exam Date</H4>
            <H4 style={{ width: '100px', margin: 0 }}>Session</H4>
            <H4 style={{ width: '150px', margin: 0 }}>Hall Number</H4>
          </div>
          <div>
            {filteredExamData.map((data, index) => {
              const roomList = studentData.roomno ? studentData.roomno.split(',').map(r => r.trim()) : [];
              const currentRoom = roomList[index] || "Not Allocated";

              return (
                <div key={index} style={{ display: 'flex', marginBottom: '20px', gap: '10px' }}>
                  <p style={{ width: '50px', margin: 0 }}>{index + 1}</p>
                  <p style={{ width: '150px', margin: 0 }}>{data.coursecode}</p>
                  <p style={{ width: '250px', margin: 0 }}>{data.coursename}</p>
                  <p style={{ width: '150px', margin: 0 }}>{data.date}</p>
                  <p style={{ width: '100px', margin: 0 }}>{data.session}</p>
                  <p style={{ width: '100px', margin: 0 }}>{currentRoom}</p>
                </div>
              );
            })}
          </div>
      </div>
    </div>
  );
}
