'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation'; // <-- Import router
import { useEffect, useRef, useState } from 'react';

type Project = {
  project: string;
  tools_used: string[];
  description: string;
  roles_and_responsibilities: string[]; // New field for roles and responsibilities
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
  const router = useRouter(); // <-- Initialize router

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

  if (!resume) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Top Action Buttons (hidden when printing) */}

      {/* Top Action Buttons (hidden when printing) */}
      <div className="flex space-x-4 no-print mb-6">
        <button
          onClick={() => router.back()} // <-- Back button
          className="px-4 py-2 bg-gray-500 text-white rounded cursor-pointer"
        >
          Back
        </button>

        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
        >
          Print Resume
        </button>
      </div>


      {/* Resume Content */}
      <div ref={ref} className="bg-white text-black p-8 rounded shadow max-w-3xl mx-auto">

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="text-3xl font-bold ">{resume.name}</h1>
            <div className='flex gap-5 items-center mt-2'>
              {resume.email && <p className="text-gray-700" style={{ fontSize: '13px' }}>{resume.email}</p>}
              {resume.phone && <p className="text-gray-700" style={{ fontSize: '13px' }}>{resume.phone}</p>}
            </div>
          </div>
          <Image src="https://innovagecloud.com/images/logo/logo.svg" alt="Logo" width={170} height={100} />
        </div>

        {/* Profile Summary */}
        <h2 className="text-xl font-semibold mt-6 mb-2" style={{ fontSize: '16px', color: '#A82324' }}>Profile Summary</h2>
        <ul className="list-disc pl-6 " style={{ fontSize: '13px' }}>
          {resume.summary
            .split(/(?<=[.!?])\s+/)
            .filter((line) => line.trim() !== '')
            .map((line, idx) => (
              <li key={idx}>{line.trim()}</li>
            ))}
        </ul>

        {/* Skills */}
        <h2 className="text-xl font-semibold mt-6 mb-2" style={{ fontSize: '16px', color: '#A82324' }}>Skills</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {resume.skills.map((skill, idx) => (
            <span
              key={idx}
              style={{
                padding: '4px 12px',
                backgroundColor: '#DBEAFE',
                border: '1px solid #1E40AF',
                color: '#1E40AF',
                fontSize: '0.875rem',
                borderRadius: '9999px',
                display: 'inline-block',
                marginRight: '8px',
                marginBottom: '8px',
              }}
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Projects */}
        <h2 className="text-xl font-semibold mt-6 mb-2" style={{ fontSize: '16px', color: '#A82324' }}>Projects Details</h2>
        {resume.projects.map((project, idx) => (
          <div key={idx} className="mb-6 pl-6 pb-3">
            <h3 className="font-bold" style={{ fontSize: '14px' }}>Project: {project.project}</h3>

            <div className="mt-2">
              <p className="" style={{ fontSize: '13px', color: 'black' }}>
                <strong>Tools Used: </strong>
                {project.tools_used.map((tool, idx) => (
                  <span style={{ fontSize: '13px' }} key={idx}>{tool}, </span>
                ))}
              </p>
            </div>
            <div className="mt-2">

              <p className=" mt-1" style={{ fontSize: '13px', color: 'black' }}><strong style={{ fontSize: '13px' }}>Description: </strong>{project.description}</p>
            </div>

            {/* Roles and Responsibilities */}
            {project.roles_and_responsibilities && project.roles_and_responsibilities.length > 0 && (
              <div className="mt-2">
                <strong style={{ fontSize: '13px' }}>Roles and Responsibilities:</strong>
                <ul className="list-disc pl-6" style={{ fontSize: '13px' }}>
                  {project.roles_and_responsibilities.map((role, idx) => (
                    <li key={idx}>{role}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
