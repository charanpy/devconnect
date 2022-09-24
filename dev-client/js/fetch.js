const getHeaders = (method, isImage) => {
  const headers = {};

  if (method === 'GET') return headers;

  if (method === 'POST') {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

const apiURL = 'http://localhost:3000/server/polls_function/api/v1';

// const apiURL =
//   'https://devconnector-789506444.development.catalystserverless.com/server/polls_function/api/v1';

const request = async (
  endpoint,
  method,
  body,
  isImage = false,
  isAuth = false,
  showError = true
) => {
  if (
    document?.querySelector?.('.loader-container')?.style?.display === 'none'
  ) {
    document.querySelector('.loader-container').style.display = 'flex';
  }
  const headers = getHeaders(method, isAuth);

  const res =
    method === 'GET'
      ? await fetch(`${apiURL}${endpoint}`, {
          headers,
        })
      : await fetch(`${apiURL}${endpoint}`, {
          headers: isImage ? {} : headers,
          body: isImage ? body : JSON.stringify(body),
          method,
        });

  const data = await res.json();

  if (document?.querySelector?.('.loader-container'))
    document.querySelector('.loader-container').style.display = 'none';

  if (data?.status === 'error' || data?.status === 'fail') {
    if (showError) showToaster(data?.message || 'Something went wrong');
    throw new Error(data?.message || 'Something went wrong');
  }
  return data;
};
