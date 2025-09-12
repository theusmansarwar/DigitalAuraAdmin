import React, { useEffect, useState } from 'react';
import './ViewApplications.css';
import { fetchSingleApplication } from '../../DAL/fetch';
import { useParams } from 'react-router-dom';
import { formatDate } from '../../Utils/Formatedate';
import { fileUrl } from '../../Config/Config';

const ViewApplication = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetchSingleApplication(id);
    setData(response.application);
  };

  if (!data) {
    return <p>Loading...</p>;
  }

  const file = `${fileUrl}${data.resume}`; // Replace with your actual base URL
  const extension = data.resume?.split('.').pop().toLowerCase();

  const isPDF = extension === 'pdf';
  const isDOCX = extension === 'docx' || extension === 'doc';

  const renderFilePreview = () => {
    if (isPDF) {
      return (
        <iframe
          src={file}
          title="PDF Preview"
          style={{ width: '100%', height: '500px', marginTop: '8px' }}
        />
      );
    }

    if (isDOCX) {
      const googleDocUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
        fileUrl
      )}&embedded=true`;

      return (
        <iframe
          src={googleDocUrl}
          title="DOCX Preview"
          style={{ width: '100%', height: '500px', marginTop: '8px' }}
        />
      );
    }

    return <p>Unsupported file type for preview.</p>;
  };

  return (
    <div className="email-container">
      <div className="email-header">
        <h2>New Application</h2>
        <p className="email-date">Received on: {formatDate(data.createdAt)}</p>
      </div>

      <div className="email-body">
        <p><strong>Name:</strong> {data.name}</p>
        <p><strong>Email:</strong> <a href={`mailto:${data.email}`}>{data.email}</a></p>
        <p><strong>Phone:</strong> <a href={`tel:${data.phone}`}>{data.phone}</a></p>
        <p><strong>Job Title:</strong> {data.jobTitle}</p>

        <div className="file-preview">
          <h3>Resume Preview</h3>
          {renderFilePreview()}
        </div>

        <a
          href={file}
          target="_blank"
          rel="noopener noreferrer"
          className="download-link"
        >
          Download Resume
        </a>
      </div>
    </div>
  );
};

export default ViewApplication;
