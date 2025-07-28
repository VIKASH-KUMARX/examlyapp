import React, { useEffect, useState } from 'react';

export function FullCourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/course')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        return response.json();
      })
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch courses - ', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{alignContent:'center'}}>Loading courses...</p>;

return (
  <div className='table-container'>
    {courses && courses.length > 0 ? (
    <>
      <h2 className='title'>Course List</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Date</th>
            <th>Session</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{course.coursecode}</td>
              <td>{course.coursename}</td>
              <td>{course.date || "—"}</td>
              <td>{course.session || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
    ) : (
      <h1 className='no-data-available'>No Courses Added</h1>
    )}
  </div>
);
}
