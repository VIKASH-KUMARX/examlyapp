import axios from 'axios';
import { useState, useEffect, useRef, useMemo } from 'react';
import Styles from '../../Styles/Admin/RoomDetails.module.css';

export function RoomDetails() {
  const [roomDatas, setRoomDatas] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSession, setSelectedSession] = useState('FN');
  const [selectedRoom, setSelectedRoom] = useState('');
  const printRef = useRef();

  useEffect(() => {
    axios('/api/room/getAll')
      .then((res) => {
        setRoomDatas(res.data);
      })
      .catch((err) => console.error("Error in RoomDatas Fetch! : ", err));
  }, []);

  useEffect(() => {
    const data = {};
    for (const entry of roomDatas) {
      const { date, session, room, students } = entry;
      const studentsList = typeof students === 'string'
        ? students.replace(/\[|\]/g, '').split(',').map(x => x.trim()).filter(Boolean)
        : [];
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
            padding: 10px 0px;
          }

          .infoRow {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            gap: 40px;
          }

          h3, p {
            margin: 16px 0;
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

  const seatingGrid = useMemo(() => {
    if (!students || students.length === 0) return [];

    const setMap = {};
    for (const reg of students) {
      const key = reg.slice(4, 6);
      if (!setMap[key]) setMap[key] = [];
      setMap[key].push(reg);
    }

    const sets = Object.values(setMap);
    if (sets.length === 1) {
      const all = sets[0];
      const grid = [];
      for (let i = 0; i < all.length; i += 5) {
        grid.push(all.slice(i, i + 5));
      }
      return grid;
    }

    const [set1, set2] = sets;
    const paired = [];
    const maxLength = Math.max(set1.length, set2.length);
    for (let i = 0; i < maxLength; i++) {
      const row = [];
      for (let j = 0; j < 5; j++) {
        const index = i * 5 + j;
        const a = set1[index] || '';
        const b = set2[index] || '';
        row.push([a, b].filter(Boolean).join(', '));
      }
      if (row.some(x => x)) paired.push(row);
    }
    return paired;
  }, [students]);

  return (
    <div className={Styles.RoomDetailscontainer}>
      {roomDatas && roomDatas.length > 0 ? (
        <>
          <h2 className='sub-title'>Select Date:</h2>
          <div className={Styles.buttonGroup}>
            {Object.keys(groupedData).map(date => (
              <button
                key={date}
                className={`${Styles.navButton} ${selectedDate === date ? Styles.active : ''}`}
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedSession('FN');
                }}
              >
                {date}
              </button>
            ))}
          </div>

          <h2 className='sub-title'>Select Session:</h2>
          <div className={Styles.buttonGroup}>
            {['FN', 'AN'].map(session => (
              <button
                key={session}
                className={`${Styles.navButton} ${selectedSession === session ? Styles.active : ''}`}
                onClick={() => setSelectedSession(session)}
              >
                {session}
              </button>
            ))}
          </div>

          {roomNumbers.length === 0 ? (
            <p className='no-data-available'>No rooms available for this session.</p>
          ) : (
            <>
              <h3 className='sub-title'>Select Room:</h3>
              <div className={Styles.buttonGroup}>
                {roomNumbers.map(room => (
                  <button
                    key={room}
                    className={`${Styles.navButton} ${selectedRoom === room ? Styles.active : ''}`}
                    onClick={() => setSelectedRoom(room)}
                  >
                    {room}
                  </button>
                ))}
              </div>

              {selectedRoom && (
                <div ref={printRef} className={Styles.printArea}>
                  <div className={`infoRow ${Styles.infoRow}`}>
                    <h3><b>Date:</b> {selectedDate}</h3>
                    <h3><b>Session:</b> {selectedSession}</h3>
                    <h3><b>Room No:</b> {selectedRoom}</h3>
                  </div>
                  <table className={Styles.table}>
                    <thead>
                      <tr>
                        {['A', 'B', 'C', 'D', 'E'].map(h => <th key={h}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {seatingGrid.map((row, rowIdx) => (
                        <tr key={rowIdx}>
                          {row.map((seat, colIdx) => (
                            <td key={colIdx}>
                              {seat.split(',').map((x, setIdx) => (
                                <div key={setIdx}>{x}</div>
                              ))}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p><strong>Total Students:</strong> {students.length}</p>
                  <button className={Styles.printButton} onClick={handlePrint}>Print This Room</button>
                </div>
              )}
            </>
          )}
        </>
      ) : <h4 className='no-data-available'>No Allocation yet!</h4>}
    </div>
  );
}
