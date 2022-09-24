const getLocImage = (url) => {
  if (!url) return './assets/images/profile.jpg';
  const [file, folder] = url?.split(' ');
  if (!file || !folder) return './assets/images/profile.jpg';

  return `/baas/v1/project/9044000000003013/folder/${file}/file/${folder}/download`;
};
const getUser = (function () {
  let user = '';

  function get_user(value) {
    if (value) user = value;
    return user;
  }

  return get_user;
})();

getUser();

const checkAuth = async () => {
  try {
    await catalyst.auth.isUserAuthenticated();

    const profile = await request('/profile/me', 'GET');

    if (profile?.length) {
      console.log('Hey');
      getUser(profile?.[0]);
      document.querySelector('.appHeader__profile').src = getLocImage(
        profile?.[0]?.Profile?.media
      );
    }
  } catch (error) {
    console.log(error);
    window.location.href = '/app/register/index.html';
  }
};
