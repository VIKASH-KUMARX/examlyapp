import { useState } from 'react';
import { Toaster, Position } from '@blueprintjs/core';
import Styles from '../Styles/Admin/DatabaseInitialization.module.css';

const AppToaster = Toaster.create({ position: Position.TOP });

export function DatabaseInitialization() {
  const endpoints = [
    { year: "Year 1", url: `/api/yearonestudent/upload` },
    { year: "Year 2", url: `/api/yeartwostudent/upload` },
    { year: "Year 3", url: `/api/yearthreestudent/upload` },
    { year: "Year 4", url: `/api/yearfourstudent/upload` },
    { year: "Time Table", url: `/api/course/upload` }
  ];

  const [selectedFiles, setSelectedFiles] = useState(new Array(endpoints.length).fill(null));
  const [btnLoading, setBtnLoading] = useState(new Array(endpoints.length).fill(false));

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    const updated = [...selectedFiles];
    updated[index] = file;
    setSelectedFiles(updated);
  };

  const handleUpload = async (index) => {
    const updatedLoading = [...btnLoading];
    updatedLoading[index] = true;
    setBtnLoading(updatedLoading);

    const file = selectedFiles[index];
    const { url, year } = endpoints[index];

    if (!file) {
      AppToaster.show({ message: `Please select a file for ${year}`, intent: "warning" });
      updatedLoading[index] = false;
      setBtnLoading(updatedLoading);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        AppToaster.show({ message: result.message || `${year} upload success!`, intent: "success" });
      } else {
        AppToaster.show({ message: `${year} data upload failed`, intent: "danger" });
      }
    } catch (err) {
      console.error("Upload error:", err);
      AppToaster.show({ message: `Upload failed. Try again.`, intent: "danger" });
    } finally {
      updatedLoading[index] = false;
      setBtnLoading([...updatedLoading]);
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
          <button
            className="btn btn-primary"
            onClick={() => handleUpload(index)}
            disabled={btnLoading[index]}
          >
            {btnLoading[index] ? <span className="button-spinner" /> : "Upload"}
          </button>
        </div>
      ))}
    </div>
  );
}