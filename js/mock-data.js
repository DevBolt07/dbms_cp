
// Mock Data for Internship Management Portal

const mockData = {
  students: [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      department: 'Computer Science',
      batch: 2025,
      cgpa: 8.5,
      enrollmentDate: '2021-08-01',
      status: 'Active',
      mentor: {
        name: 'Dr. Jane Smith',
        email: 'j.smith@example.com'
      }
    }
  ],
  companies: [
    { id: 1, name: 'Tech Solutions Inc.', industry: 'IT', status: 'Verified' },
    { id: 2, name: 'Innovatech', industry: 'Software', status: 'Verified' },
    { id: 3, name: 'Data Insights LLC', industry: 'Analytics', status: 'Pending' }
  ],
  internships: [
    {
      id: 1,
      companyId: 1,
      title: 'Frontend Developer Intern',
      description: 'Work on exciting new features for our web application.',
      requirements: 'HTML, CSS, JavaScript, React',
      duration: '12 Weeks',
      location: 'Remote'
    },
    {
      id: 2,
      companyId: 2,
      title: 'Data Science Intern',
      description: 'Analyze user data to derive actionable insights.',
      requirements: 'Python, SQL, Pandas',
      duration: '10 Weeks',
      location: 'New York, NY'
    },
    {
      id: 3,
      companyId: 1,
      title: 'Backend Developer Intern',
      description: 'Help build and maintain our server-side infrastructure.',
      requirements: 'Node.js, Express, MongoDB',
      duration: '12 Weeks',
      location: 'Remote'
    }
  ],
  applications: [
    { studentId: 1, internshipId: 1, status: 'Under Review', dateApplied: '2024-10-26' },
    { studentId: 1, internshipId: 2, status: 'Applied', dateApplied: '2024-10-25' }
  ],
  notifications: [
    { userId: 1, message: 'New internship from Google posted.' },
    { userId: 1, message: 'Your application for Microsoft was viewed.' }
  ]
};

// Make it accessible in browser scripts
window.mockData = mockData;
