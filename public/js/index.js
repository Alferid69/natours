import '@babel/polyfill';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';

// DOM Element
const loginForm = document.querySelector('.form--login');
const updateDataForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-password');
const logoutButton = document.querySelector('.nav__el-logout');

// Delegation
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (updateDataForm) {
  updateDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.querySelector('.newName').value);
    form.append('email', document.querySelector('.newEmail').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', async (e) => {
    const btn_save = document.querySelector('.btn--save-password');
    btn_save.textContent = 'Updating...';
    e.preventDefault();
    const password = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const newPasswordConfirm =
      document.getElementById('password-confirm').value;

    await updateSettings(
      { password, newPassword, newPasswordConfirm },
      'password',
    );
    btn_save.textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

logoutButton.addEventListener('click', logout);
