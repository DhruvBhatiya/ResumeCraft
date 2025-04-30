'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { MdEmail, MdPhone } from "react-icons/md";

type Project = {
  project: string;
  tools_used: string[];
  description: string;
  roles_and_responsibilities: string[];
};

type ResumeData = {
  name: string;
  email: string;
  phone: string;
  summary: string;
  skills: string[];
  projects: Project[];
};

export default function ResumePreviewPage() {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const handlePrint = () => {
    if (ref.current) {
      const content = ref.current.cloneNode(true) as HTMLElement;
      const printWindow = window.open('', '_blank');

      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Resume</title>
              <style>
                @media print {
                  @page {
                    margin: 20mm;
                  }
                  body {
                    margin: 0;
                    font-family: Arial, sans-serif;
                  }
                  .no-print {
                    display: none;
                  }
                }
              </style>
            </head>
            <body>
              ${content.outerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    }
  };

  useEffect(() => {
    const formData = localStorage.getItem('resume_form');
    if (formData) {
      const parsed = JSON.parse(formData);
      setResume({
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
        summary: parsed.summary,
        skills: parsed.skills,
        projects: parsed.projects,
      });
    } else {
      console.error('Form data not found in localStorage');
    }
  }, []);

  if (!resume) return <div style={{ padding: '24px' }}>Loading...</div>;

  return (
    <div style={{ padding: '24px', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      {/* Buttons */}
      <div className="no-print" style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <button
          onClick={() => router.back()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6b7280',
            color: '#fff',
            borderRadius: '8px',
            cursor: 'pointer',
            border: 'none',
          }}
        >
          Back
        </button>
        <button
          onClick={handlePrint}
          style={{
            padding: '8px 16px',
            backgroundColor: '#A82324',
            color: '#fff',
            borderRadius: '8px',
            cursor: 'pointer',
            border: 'none',
          }}
        >
          Print Resume
        </button>
      </div>

      {/* Resume */}
      <div
        style={{
          backgroundColor: '#fff',
          color: '#000',
          padding: '32px',
          // borderRadius: '8px',
          maxWidth: '800px',
          margin: '0 auto',
          // boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        }}
      >
        <div
          ref={ref}
          style={{
            // backgroundColor: '#fff',
            color: '#000',
            // padding: '32px',
            // borderRadius: '8px',
            maxWidth: '768px',
            margin: '0 auto',
            // boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{resume.name}</h1>
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                {resume.email && (
                  <div style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', color: '#374151' }}>
                    <MdEmail style={{ color: '#A82324' }} />
                    <p style={{ margin: 0 }}>{resume.email}</p>
                  </div>
                )}
                {resume.phone && (
                  <div style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', color: '#374151' }}>
                    <MdPhone style={{ color: '#A82324' }} />
                    <p style={{ margin: 0 }}>{resume.phone}</p>
                  </div>
                )}
              </div>
            </div>
            <img src="https://innovagecloud.com/images/logo/logo.svg" alt="Logo" width={'170px'} height={'auto'} />
          </div>

          {/* Summary */}
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginTop: '24px', marginBottom: '8px', color: '#A82324' }}>Profile Summary</h2>
          <ul style={{ listStyleType: 'disc', paddingLeft: '24px', fontSize: '13px' }}>
            {resume.summary
              .split(/(?<=[.!?])\s+/)
              .filter((line) => line.trim() !== '')
              .map((line, idx) => (
                <li key={idx}>{line.trim()}</li>
              ))}
          </ul>

          {/* Skills */}
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginTop: '24px', marginBottom: '8px', color: '#A82324' }}>Skills</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', paddingLeft: '24px' }}>
            {resume.skills.map((skill, idx) => (
              <span
                key={idx}
                style={{
                  padding: '4px 12px',
                  backgroundColor: '#000000',
                  color: '#fff',
                  fontSize: '0.875rem',
                  borderRadius: '9999px',
                  display: 'inline-block',
                  marginRight: '8px',
                  marginBottom: '8px',
                  WebkitPrintColorAdjust: 'exact', // <-- Ensures color is printed in some browsers
                  printColorAdjust: 'exact', // <-- For broader support
                }}
              >
                {skill}
              </span>

            ))}
          </div>

          {/* Projects */}
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginTop: '24px', marginBottom: '8px', color: '#A82324' }}>Projects Details</h2>
          {resume.projects.map((project, idx) => (
            <div key={idx} style={{ marginBottom: '24px', paddingLeft: '24px', paddingBottom: '12px' }}>
              <h3 style={{ fontWeight: 'bold', textDecoration: 'underline', fontSize: '14px' }}>
                Project: {project.project}
              </h3>

              <div style={{ paddingLeft: '16px' }}>
                <div style={{ marginTop: '8px' }}>
                  <p style={{ fontSize: '13px', color: 'black' }}>
                    <strong>Tools Used: </strong>
                    {project.tools_used.map((tool, idx) => (
                      <span key={idx}>{tool}{idx < project.tools_used.length - 1 ? ', ' : ''}</span>
                    ))}
                  </p>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <p style={{ fontSize: '13px', color: 'black' }}>
                    <strong>Description: </strong>{project.description}
                  </p>
                </div>

                {project.roles_and_responsibilities && project.roles_and_responsibilities.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <strong style={{ fontSize: '13px' }}>Roles and Responsibilities:</strong>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '24px', fontSize: '13px' }}>
                      {project.roles_and_responsibilities.map((role, idx) => (
                        <li key={idx}>{role}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
