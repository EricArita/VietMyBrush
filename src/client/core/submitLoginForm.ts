export const submitLoginForm = (idToken: string, uid: string) => {
  const form = document.getElementById('loginForm');
  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'token';
  input.value = idToken;
  form!.appendChild(input);
  const userId = document.createElement('input');
  userId.type = 'text';
  userId.name = 'uid';
  userId.value = uid;
  form!.appendChild(userId);

  (form as any).submit();
};
