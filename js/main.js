
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('form');
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const role = document.getElementById('role').value;
      let redirectUrl = '';
      switch (role) {
        case 'Admin':
          redirectUrl = 'admin/dashboard.html';
          break;
        case 'Company':
          redirectUrl = 'company/dashboard.html';
          break;
        case 'Student':
          redirectUrl = 'student/dashboard.html';
          break;
      }
      if(redirectUrl) {
        window.location.href = redirectUrl;
      }
    });
  }
});
