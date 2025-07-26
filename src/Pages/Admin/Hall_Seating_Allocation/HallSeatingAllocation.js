import { useState, useEffect } from 'react';
import { Button, Position, Toaster } from "@blueprintjs/core";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { RoomDetails } from './RoomDetails';

const AppToaster = Toaster.create({ position: Position.TOP });

export function HallSeatingAllocation() {
  const [selectedYears, setSelectedYears] = useState([]);
  const [roomInput, setRoomInput] = useState('');
  const [capacity, setCapacity] = useState('');
  const [disabledYears, setDisabledYears] = useState([]);
  const [history, setHistory] = useState([]);
  const [roomAllocationData, setRoomAllocationData] = useState([]);
  const navigate = useNavigate();

  const yearOptions = ["year 1", "year 2", "year 3", "year 4"];
  const yearApiMap = {
    "year 1": "/api/room/yearOne",
    "year 2": "/api/room/yearTwo",
    "year 3": "/api/room/yearThree",
    "year 4": "/api/room/yearFour",
  };

  useEffect(() => {
    setDisabledYears(JSON.parse(localStorage.getItem("disabledYears") || "[]"));
    setHistory(JSON.parse(localStorage.getItem("allocationHistory") || "[]"));
  }, []);

  const handleAllocate = async () => {
    const rooms = roomInput.split(',').map(r => r.trim()).filter(Boolean);
    const payload = { roomlist: rooms, roomsize: parseInt(capacity, 10) };

    if (!selectedYears.length) return AppToaster.show({ message: 'Select at least any one year students!', intent: 'warning', timeout: 2000 });
    if (!rooms.length ) return AppToaster.show({ message: 'Please Enter Available Rooms!', intent: 'warning', timeout: 2000 });
    if (!capacity) return AppToaster.show({ message: 'Please Enter Availabe Benches!', intent: 'warning', timeout: 2000 });
    if (!(capacity>0 && capacity<=34)) return AppToaster.show({ message: 'Maximum Room Capacity is 34!', intent: 'danger', timeout: 2000 });

    try {
      for (const year of selectedYears) {
        await axios.put(yearApiMap[year],payload)
        .then((res)=>{
          setRoomAllocationData(res.data);
        })
      }

      const newDisabled = [...new Set([...disabledYears, ...selectedYears])];
      setDisabledYears(newDisabled);
      localStorage.setItem("disabledYears", JSON.stringify(newDisabled));

      const entry = {
        years: selectedYears.join(" & "),
        roomno: rooms.join(", "),
        capacity: payload.roomsize,
        timestamp: new Date().toLocaleString()
      };
      const newHist = [...history, entry];
      setHistory(newHist);
      localStorage.setItem("allocationHistory", JSON.stringify(newHist));

      setSelectedYears([]);
      setRoomInput('');
      setCapacity('');

      AppToaster.show({
        message: 'Room Allocated Successfully',
        intent:'success',
        timeout:2000
      })

    } catch (err) {
      console.error("Allocation failed:", err);
      AppToaster.show({ message: 'Allocation failed', intent: 'danger', timeout: 3000 });
    }
  };

  const handleResetAll = () => {
    axios.put("api/room/reset/yearAll")
    axios.delete("api/room/deleteAllRooms")
    .then(
      setSelectedYears([]),
      setRoomInput(''),
      setCapacity(''),
      setDisabledYears([]),
      setHistory([]),
      localStorage.removeItem("disabledYears"),
      localStorage.removeItem("allocationHistory"),
      AppToaster.show({ message: 'Everything was Reseted', intent: 'success', timeout: 2000 })
    )
    .catch((err)=>{
      console.error(`Reset All Year failed:`, err);
      AppToaster.show({ message: 'Failed to reset All Year', intent: 'danger', timeout: 2000 });
    })
  };

  const resetYear = async (yearWord) => {
    try {
      await fetch(`/api/room/reset/year${yearWord}`, { method: "PUT" });
      const map = { One: "year 1", Two: "year 2", Three: "year 3", Four: "year 4" };
      const resetKey = map[yearWord];
      const updated = disabledYears.filter(y => y !== resetKey);
      console.log(updated);
      setDisabledYears(updated);
      localStorage.setItem("disabledYears", JSON.stringify(updated));

      AppToaster.show({ message: `Year ${yearWord} reseted`, intent: 'success', timeout: 2000 });
    } catch (err) {
      console.error(`Reset Year ${yearWord} failed:`, err);
      AppToaster.show({ message: `Failed to reset Year ${yearWord}`, intent: 'danger', timeout: 2000 });
    }
  };

  const handleNavigate=()=>{
    navigate('/roomDetails');
  }
  
  return (
    <div style={{ padding: 24 }}>
      <h2>Hall Seating Allocation</h2>

      {/* Year selection */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        {yearOptions.map(year => {
          const isDisabled = disabledYears.includes(year);
          const isSelected = selectedYears.includes(year);
          return (
            <button
              key={year}
              disabled={isDisabled}
              onClick={() => {
                if (isSelected) {
                  setSelectedYears(prev => prev.filter(y => y !== year));
                } else {
                  setSelectedYears(prev => prev.length < 2 ? [...prev, year] : [prev[0], year]);
                }
              }}
              style={{
                padding: '6px 12px',
                borderRadius: 20,
                border: '1px solid #ccc',
                backgroundColor: isSelected ? '#106ba3' : isDisabled ? '#eee' : '#fff',
                color: isSelected ? '#fff' : isDisabled ? '#888' : '#000',
                cursor: isDisabled ? 'not-allowed' : 'pointer'
              }}
            >
              {year}
            </button>
          );
        })}
      </div>

      {/* Inputs */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        <div>
          <label>Available Rooms</label><br />
          <input value={roomInput} onChange={e => setRoomInput(e.target.value)} 
            placeholder="eg : A301, A302" />
        </div>
        <div>
          <label>Availabe Benches<span style={{fontSize:'10px'}}>(max 34)</span></label><br />
          <input type="number" value={capacity} onChange={e => {const val = e.target.value;
              if(/^\d*$/.test(val)) setCapacity(e.target.value);}}
            placeholder="eg : 30" min="1" step="1"
            style={{ width: 80 }} 
          />
        </div>
      </div>

      <Button intent="primary" onClick={handleAllocate}>Allocate Seat</Button>

      {/* History */}
      <h3 style={{ marginTop: 30 }}>Allocation History</h3>
      {history.length === 0 ? (
        <p>No allocations yet.</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {["Years", "Rooms", "Capacity", "Timestamp"].map(h => (
                  <th key={h} style={{ border: '1px solid #ccc', padding: 6, background: '#f5f8fa' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i}>
                  {["years", "roomno", "capacity", "timestamp"].map(k => (
                    <td key={k} style={{ border: '1px solid #ccc', padding: 6 }}>{h[k]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <Button intent="danger" onClick={handleResetAll} style={{ marginTop: 15 }}>
            Reset All
          </Button>
        </>
      )}

      {/* Year-specific reset */}
      <div style={{ display: 'flex', gap: 20, marginTop: 30 }}>
        {["One", "Two", "Three", "Four"].map(y => (
          <Button key={y} intent="warning" onClick={() => resetYear(y)}>
            Reset Year {y}
          </Button>
        ))}
      </div>
      <div>
          {/* <RoomDetails refresh={history}/> */}
          <Button intent='primary' onClick={handleNavigate}> View Allocation </Button>
      </div>
    </div>
  );
}
