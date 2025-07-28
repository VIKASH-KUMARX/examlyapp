import React, { useState } from 'react';
import { Button, Toaster, Position } from '@blueprintjs/core';
import Styles from '../Styles/Admin/DatabaseInitialization.module.css'

const AppToaster = Toaster.create({ position: Position.TOP });

export function DatabaseInitialization() {
  const [selectedFiles, setSelectedFiles] = useState([null, null, null, null]);

  const endpoints = [
    { year: "Year 1", url: "/api/yearonestudent/upload" },
    { year: "Year 2", url: "/api/yeartwostudent/upload" },
    { year: "Year 3", url: "/api/yearthreestudent/upload" },
    { year: "Year 4", url: "/api/yearfourstudent/upload" },
    { year: "Time Table", url: "/api/course/upload" }
  ];

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    setSelectedFiles((prev) => {
      const updated = [...prev];
      updated[index] = file;
      return updated;
    });
  };

  const handleUpload = async (index) => {
    const file = selectedFiles[index];
    const { url, year } = endpoints[index];

    if (!file) {
      AppToaster.show({ message: `Please select a file for ${year}`, intent: "warning" });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        AppToaster.show({ message: result.message || `${year} upload success!`, intent: "success" });
      } else {
        const error = await response.json();
        AppToaster.show({ message: `${year} data upload failed, Please try again`, intent: "danger" });
        throw new Error(error.message || `${year} data upload failed`);
      }
    } catch (err) {
      console.error("error in excel post - ", err.message || err);
    }
  };

  return (
    <div className={Styles.uploadContainer}>
      <h2 className='title'>Upload Excel Files</h2>
      {endpoints.map((endpoint, index) => (
        <div key={index} className={Styles.uploadSection}>
          <div className='label-input'>
            <label className='label'><strong>{endpoint.year}</strong></label>
            <input
              type="file"
              accept=".xls,.xlsx"
              onChange={(e) => handleFileChange(e, index)}
              className='input'
            />
          </div>
          <button className='btn btn-primary' onClick={() => handleUpload(index)}>
            Upload
          </button>
        </div>
      ))}
    </div>
  );
}
