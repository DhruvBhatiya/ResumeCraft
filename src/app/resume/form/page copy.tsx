'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Skill = {
  skill: string;
};

type Project = {
  project: string;
  tools_used: string[];
  description: string;
  roles_and_responsibilities: string[]; // added roles_and_responsibilities
};

type ResumeForm = {
  name: string;
  email: string;
  phone: string;
  selectedSummaries: boolean[];
  customSummary: string;
  selectedSkill: boolean[];
  selectedProjects: boolean[];
};

export default function ResumeFormPage() {
  const [data, setData] = useState<{
    name: string;
    email: string;
    phone: string;
    profile_summary: string[];
    skill: string[]; // skill is array of strings
    project_details: Project[];
  } | null>(null);

  const [form, setForm] = useState<ResumeForm>({
    name: '',
    email: '',
    phone: '',
    selectedSummaries: [],
    customSummary: '',
    selectedSkill: [],
    selectedProjects: [],
  });

  const router = useRouter();

  useEffect(() => {
    fetch('/resume.json')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setForm({
          name: json.name,
          email: json.email,
          phone: json.phone,
          selectedSummaries: json.profile_summary.map(() => true),
          customSummary: '',
          selectedSkill: json.skill.map(() => true),
          selectedProjects: json.project_details.map(() => true),
        });
      });
  }, []);

  const handleSummaryCheckboxChange = (index: number) => {
    const updated = [...form.selectedSummaries];
    updated[index] = !updated[index];
    setForm({ ...form, selectedSummaries: updated });
  };

  const handleSkillCheckboxChange = (index: number) => {
    const updated = [...form.selectedSkill];
    updated[index] = !updated[index];
    setForm({ ...form, selectedSkill: updated });
  };

  const handleProjectCheckboxChange = (index: number) => {
    const updated = [...form.selectedProjects];
    updated[index] = !updated[index];
    setForm({ ...form, selectedProjects: updated });
  };

  const handleSubmit = () => {
    if (!data) return;

    const selectedSummaryTexts = data.profile_summary.filter((_, idx) => form.selectedSummaries[idx]);
    const finalSummary = [...selectedSummaryTexts, form.customSummary].filter(Boolean).join(' ');

    const selectedSkills = data.skill.filter((_, idx) => form.selectedSkill[idx]);
    const selectedProjects = data.project_details.filter((_, idx) => form.selectedProjects[idx]);

    const resumeForm = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      summary: finalSummary,
      skills: selectedSkills,
      projects: selectedProjects,
    };

    localStorage.setItem('resume_form', JSON.stringify(resumeForm));
    router.push('/resume/preview');
  };

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white text-black">
      <h1 className="text-2xl font-bold mb-6">Customize Your Resume</h1>

      {/* Name Input */}
      <label className="block mb-2 font-bold" style={{fontSize: '16px', color: '#A82324' }}>Name:</label>
      <input
        type="text"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border p-2 w-full mb-4"
      />

      <label className="block mb-2 font-bold" style={{fontSize: '16px', color: '#A82324'}}>Email:</label>
      <input
        type="text"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="border p-2 w-full mb-4"
      />

      <label className="block mb-2 font-bold" style={{fontSize: '16px', color: '#A82324'}}>Phone:</label>
      <input
        type="text"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="border p-2 w-full mb-6"
      />

      {/* Summary Section */}
      <h2 className="text-xl font-semibold mb-2" style={{fontSize: '16px', color: '#A82324'}}>Select Summary Points:</h2>
      {data.profile_summary.map((summary, index) => (
        <div key={index} className="mb-2 pl-3">
          <label className="flex items-start" style={{fontSize: '14px'}}>
            <input
              type="checkbox"
              checked={form.selectedSummaries[index]}
              onChange={() => handleSummaryCheckboxChange(index)}
              className="mr-2 mt-1"
            />
            {summary}
          </label>
        </div>
      ))}

      {/* Custom Summary */}
      <label className="block mt-4 mb-2 font-bold" style={{fontSize: '16px', color: '#A82324'}}>Add Custom Summary:</label>
      <textarea
        value={form.customSummary}
        onChange={(e) => setForm({ ...form, customSummary: e.target.value })}
        className="border p-2 w-full mb-6"
      />

      {/* Skill Section */}
      <h2 className="text-xl font-semibold mb-2" style={{fontSize: '16px', color: '#A82324'}}>Select Skills:</h2>
      {data.skill.map((skill, index) => (
        <div key={index} className="mb-2 pl-3">
          <label className="flex items-center" style={{fontSize: '12px'}}>
            <input
              type="checkbox"
              checked={form.selectedSkill[index]}
              onChange={() => handleSkillCheckboxChange(index)}
              className="mr-2"
            />
            {skill}
          </label>
        </div>
      ))}

      {/* Projects Section */}
      <h2 className="text-xl font-semibold mt-8 mb-2" style={{fontSize: '16px', color: '#A82324'}}>Select Projects:</h2>
      {data.project_details.map((project, index) => (
        <div key={index} className="mb-2 pl-3">
          <label className="flex items-center cursor-pointer text-sm" >
            <input
              type="checkbox"
              checked={form.selectedProjects[index]}
              onChange={() => handleProjectCheckboxChange(index)}
              className="mr-2"
            />
            <strong>{project.project}</strong>
          </label>
          {/* <div className="mt-2">
            <strong>Tools Used:</strong>
            <ul className="list-disc pl-6">
              {project.tools_used.map((tool, idx) => (
                <li key={idx}>{tool}</li>
              ))}
            </ul>
          </div>
          <div className="mt-2">
            <strong>Description:</strong>
            <p className="text-gray-600 mt-1">{project.description}</p>
          </div>

          <div className="mt-2">
            <strong>Roles and Responsibilities:</strong>
            <ul className="list-disc pl-6">
              {project.roles_and_responsibilities.map((role, idx) => (
                <li key={idx}>{role}</li>
              ))}
            </ul>
          </div> */}
        </div>
      ))}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer"
      >
        Preview Resume
      </button>
    </div>
  );
}
