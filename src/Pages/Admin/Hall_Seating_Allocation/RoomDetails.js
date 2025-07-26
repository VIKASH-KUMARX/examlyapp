import axios from 'axios';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export function RoomDetails() {
  const [roomDatas, setRoomDatas] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSession, setSelectedSession] = useState('FN');
  const [selectedRoom, setSelectedRoom] = useState('');
  const printRef = useRef();

  useEffect(()=>{
      axios('/api/room/getAllRooms')
      .then((res)=>{
        setRoomDatas(res.data)
      })
      .catch((err)=>console.error("Error in RoomDatas Fetch! : ",err));
  },[])

  // Grouping data by date -> session -> room
  useEffect(() => {
    const data = {};
    for (const entry of roomDatas) {
      const { date, session, room, students } = entry;
      const studentsList = typeof students === 'string' 
        ? students.replace(/[\[\]]/g, '').split(',').map(x=>x.trim()).filter(Boolean) : [];
      if (!data[date]) data[date] = {};
      if (!data[date][session]) data[date][session] = {};
      if (!data[date][session][room]) data[date][session][room] = [];
      data[date][session][room].push(...studentsList);
    }
    setGroupedData(data);

    const firstDate = Object.keys(data)[0];
    setSelectedDate(firstDate);
    setSelectedRoom('');
  }, [roomDatas]);

  // Auto-select first room on session change
  useEffect(() => {
    const rooms = Object.keys(groupedData?.[selectedDate]?.[selectedSession] || {});
    if (rooms.length > 0) {
      setSelectedRoom(rooms[0]);
    } else {
      setSelectedRoom('');
    }
  }, [selectedSession, selectedDate, groupedData]);

  const handlePrint = () => {
  const printContents = printRef.current.cloneNode(true);

  // Remove the print button if present
  const printButton = printContents.querySelector('button');
  if (printButton) printButton.remove();

  const win = window.open('', '', 'height=800,width=1200');
  win.document.write(`
    <html>
      <head>
        <title>${selectedDate}-${selectedSession}-${selectedRoom}</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 1cm;
          }

          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }

          table {
            width: 100%;
          }

          td {
            border: 1px solid #000;
            padding: 12px 8px;
            text-align: center;
            vertical-align: middle;
            width: 20%;
          }
          
          th {
            background-color: #808080;
            font-weight: bold;
          }

          h3, p {
            margin: 12px 0;
          }
        </style>
      </head>
      <body>${printContents.innerHTML}</body>
    </html>
  `);
  win.document.close();
  win.focus();
  win.print();
  win.close();
};


  const sessionData = groupedData?.[selectedDate]?.[selectedSession] || {};
  const roomNumbers = Object.keys(sessionData);
  const students = selectedRoom ? sessionData[selectedRoom] : [];

  // inside RoomDetails component...
  const seatingGrid = useMemo(() => {
    if (!students || students.length === 0) return [];

    const setMap = {}; // To split students into two sets based on regnum[4]+regnum[5]
    for (const reg of students) {
      const key = reg.slice(4, 6); // e.g., "23", "24"
      if (!setMap[key]) setMap[key] = [];
      setMap[key].push(reg);
    }

    const sets = Object.values(setMap);
    if (sets.length === 1) {
      // Only one set of students — fallback to normal seating
      const all = sets[0];
      const grid = [];
      for (let i = 0; i < all.length; i += 5) {
        grid.push(all.slice(i, i + 5));
      }
      return grid;
    }

    // Otherwise: arrange 2 sets alternately per bench
    const [set1, set2] = sets;
    const paired = [];
    const maxLength = Math.max(set1.length, set2.length);
    for (let i = 0; i < maxLength; i++) {
      if (i < set1.length || i < set2.length) {
        const row = [];
        for (let j = 0; j < 5; j++) {
          const index = i*5+j;
          const a = set1[index] || '';
          const b = set2[index] || '';
          row.push([a, b].filter(Boolean).join(', '));
        }
        if (row.some(x => x)) paired.push(row);
      }
    }
    return paired;
  }, [students]);

  return (
    <>
    {roomDatas && roomDatas.length>0 ?
      (<div>
        <h2>Select Date:</h2>
        <div>
          {Object.keys(groupedData).map(date => (
            <button
              key={date}
              onClick={() => {
                setSelectedDate(date);
                setSelectedSession('FN');
              }}
            >
              {date}
            </button>
          ))}
        </div>

        <h2>Select Session:</h2>
        <div>
          {['FN', 'AN'].map(session => (
            <button
              key={session}
              onClick={() => setSelectedSession(session)}
            >
              {session}
            </button>
          ))}
        </div>

        {roomNumbers.length === 0 ? (
          <p>No rooms available for this session.</p>
        ) : (
          <>
            <h3>Select Room:</h3>
            <div>
              {roomNumbers.map(room => (
                <button key={room} onClick={() => setSelectedRoom(room)}>
                  {room}
                </button>
              ))}
            </div>

            {selectedRoom && (
              <div ref={printRef}>
                <div style={{display:'flex',justifyContent:'start',gap:'20px'}}>
                  <h4><b>Date:</b> {selectedDate}</h4>
                  <h4><b>Session:</b> {selectedSession}</h4>
                  <h4><b>Room No:</b> {selectedRoom}</h4>
                </div>
                <table border="1" cellPadding="10">
                  <thead>
                    <th>A</th>
                    <th>B</th>
                    <th>C</th>
                    <th>D</th>
                    <th>E</th>
                  </thead>
                  <tbody>
                    {seatingGrid.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        {row.map((seat, colIdx) => (
                          <td key={colIdx}>
                            {seat.split(',').map((x,setIdx)=>(
                              <div key={setIdx}>{x}</div>
                            ))}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p><strong>Total Students:</strong> {students.length}</p>
                <button onClick={handlePrint}>Print This Room</button>
              </div>
            )}
          </>
        )}
      </div>)
      :(<h4>No Allocation yet!</h4>)
    }
    </>
  );
}
