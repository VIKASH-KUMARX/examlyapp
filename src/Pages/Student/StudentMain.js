import { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import Styles from "../Styles/Student/StudentMain.module.css";

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
  
  const studentYear = String(studentData.regnum || "").substring(4, 6);
  const Batch = `20${studentYear} - 20${parseInt(studentYear) + 4}`;

  useEffect(() => {
    fetch("/api/course")
      .then((response) => response.json())
      .then((json) => setExamData(json))
      .catch((error) => console.error("Error in courses Fetch! - ", error));
  }, []);  

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
        return a.session === 'FN' ? -1 : 1;
      });

      setFilteredExamData(sorted);
    }
  }, [studentData, examData]);

  function getDateTimeDiff(d1, d2) {
  let diffMs = Math.abs(d1 - d2) + (2 * 60 * 1000);

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  diffMs -= days * (1000 * 60 * 60 * 24);

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  diffMs -= hours * (1000 * 60 * 60);

  const minutes = Math.floor((diffMs) / (1000 * 60));
  diffMs -= minutes * (1000 * 60);

  return days + "day " + hours + ":" + minutes;
}

  return (
    <div className={Styles.container}>
      
      <h2 className={Styles.title}>Dashboard</h2>

      <div className={Styles.profileContainer}>
        <div className={Styles.profilePic}>
          <span>👤</span>
        </div>
        <div className={Styles.profileDetails}>
          <h1>Hey {studentData.name && studentData.name.toUpperCase()}</h1>

          <div className={Styles.detailRow}>
            <h4>Register number:</h4>
            <p className={Styles.detailValue}>{studentData.regnum}</p>

            <h4>Degree:</h4>
            <p className={Styles.detailValue}>BE-ECE</p>

            <h4>Batch:</h4>
            <p className={Styles.detailValue}>{Batch}</p>
          </div>
        </div>
      </div>

      <div className={Styles.section}>
        <h2 className={Styles.sectionTitle}>Seating Allotment</h2>
        <div className={Styles.tableHeader}>
          <h4>S.No</h4>
          <h4>Course Code</h4>
          <h4>Course Title</h4>
          <h4>Exam Date</h4>
          <h4>Session</h4>
          <h4>Hall Number</h4>
        </div>

        <div>
          {filteredExamData.map((data, index) => {
            const roomList = studentData.roomno ? studentData.roomno.split(',').map(r => r.trim()) : [];
            const currentRoom = roomList[index] || "Not Allocated";

            const examData = new Date(data.date);
            const now = new Date();

            let releaseTime = new Date(examData);
            if(data.session === 'FN') {
              releaseTime.setHours(8, 0, 0, 0);
            } else {
              releaseTime.setHours(12, 30, 0, 0);
            }

            let displayRoom;
            // const pad = (n) => (n < 10 ? "0" + n : n);
            // const formatted =
            //   "Check after: " +
            //   pad(releaseTime.getDate()) + "-" +
            //   pad(releaseTime.getMonth() + 1) + "/" +
            //   pad(releaseTime.getHours()) + ":" +
            //   pad(releaseTime.getMinutes());
            if (releaseTime < now) {
              displayRoom = currentRoom;
            } else {
              displayRoom = "Wait " + getDateTimeDiff(now, releaseTime);
            }

            return (
              <div key={index} className={Styles.tableRow}>
                <p>{index + 1}</p>
                <p>{data.coursecode}</p>
                <p>{data.coursename}</p>
                <p>{data.date}</p>
                <p>{data.session}</p>
                <p>{displayRoom}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}