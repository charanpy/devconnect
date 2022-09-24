const showToaster = (message, success = false) => {
  let toaster = document.querySelector('.toaster');
  if (!toaster) {
    toaster = document.createElement('div');
    toaster.classList.add('toaster');
  }
  toaster.textContent = message;
  toaster.style.background = !success ? '#e64d3c' : '#07BC0C';
  toaster.style.top = '15px';

  document.body.appendChild(toaster);

  setTimeout(removeToaster, 10000);
};

const removeToaster = () => {
  const toaster = document.querySelector('.toaster');

  if (!toaster) return;

  toaster.style.top = '-50px';
};
