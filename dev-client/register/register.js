(() => {
  const registerForm = document.querySelector('#signupForm');
  const login = document.querySelector('.login');
  const closeBtn = document.querySelector('.close');

  registerForm.addEventListener('submit', async (e) => {
    e?.preventDefault();

    const email = document.querySelector('#email')?.value;
    const username = document.querySelector('#username')?.value;

    if (!email || !username) return showToaster('Please fill all fields');

    try {
      await request('/auth/register', 'POST', { email, username });
      showToaster('Verification Link sent to email', true);
    } catch (error) {
      console.log(error);
    }
  });

  login.addEventListener('click', () => {
    const popup = document.querySelector('.popup');
    if (!popup) return;
    popup.style.transform = 'scale(1)';

    catalyst.auth.signIn('login');
  });

  closeBtn.addEventListener('click', () => {
    const popup = document.querySelector('.popup');
    if (!popup) return;
    popup.style.transform = 'scale(0)';
  });
})();
