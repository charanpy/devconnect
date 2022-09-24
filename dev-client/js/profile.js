(() => {
  const updateProfileDOM = (profile) => {
    document.querySelector('.edit-name').value = profile?.username || '';
    document.querySelector('.edit-title').value = profile?.title || '';
    document.querySelector('.edit-description').value =
      profile?.description || '';
    document.querySelector('.edit-skill').value = profile?.skills || '';
    document.querySelector('.edit-country').value = profile?.country || '';

    document.querySelector('.edit-github').value = profile?.github || '';
    document.querySelector('.edit-website').value = profile?.website || '';
  };

  const updateProfile = (profile) => {
    document.querySelector('.profile-img').src = getLocImage(profile?.media);
    document.querySelector('.appHeader__profile').src = getLocImage(
      profile?.media
    );

    document.querySelector('.github').href =
      profile?.github || 'https://github.com';
    document.querySelector('.website').href =
      profile?.website || 'https://github.com';

    document.querySelector('.name').textContent = profile?.username
      ? `Name: ${profile?.username}`
      : '';

    document.querySelector('.title').textContent = profile?.title
      ? `Title: ${profile?.title}`
      : '';

    document.querySelector('.description').textContent = profile?.description
      ? `Description: ${profile?.bio}`
      : '';
    document.querySelector('.skill').textContent = profile?.skills
      ? `Skills: ${profile?.skills}`
      : '';
    document.querySelector('.email').textContent = profile?.email
      ? `Email: ${profile?.email}`
      : '';
    document.querySelector('.country').textContent = profile?.country
      ? `Country: ${profile?.country}`
      : '';
  };

  const setUserDetail = async () => {
    try {
      const id = getUrlParam('id');
      let profile;

      if (id) {
        profile = await request(`/profile/${id}`, 'GET');
      } else {
        profile = getUser()?.Profile;
        document.querySelector('.edit').style.display = 'inline-block';
      }

      updateProfile(profile);
      updateProfileDOM(profile);
    } catch (error) {
      console.log(error);
    }
  };

  setUserDetail();

  document.querySelector('.edit').addEventListener('click', () => {
    document.querySelector('.edit-profile').style.transform = 'scale(1)';
  });
  document.querySelector('.close-edit').addEventListener('click', () => {
    document.querySelector('.edit-profile').style.transform = 'scale(0)';
  });

  document.querySelector('.edit-form').addEventListener('submit', async (e) => {
    e?.preventDefault();

    try {
      const username = document.querySelector('.edit-name').value;

      const title = document.querySelector('.edit-title').value;

      const description = document.querySelector('.edit-description').value;

      const skills = document.querySelector('.edit-skill').value;

      const country = document.querySelector('.edit-country').value;

      const github = document.querySelector('.edit-github').value;
      const website = document.querySelector('.edit-website').value;

      const image = document.querySelector('.edit-image')?.files[0];

      console.log(
        username,
        title,
        description,
        skills,
        country,
        github,
        website,
        image
      );
      const formData = new FormData();
      if (username) formData.append('username', username);
      if (title) formData.append('title', title);
      if (description) formData.append('bio', description);
      if (skills) formData.append('skills', skills);
      if (country) formData.append('country', country);
      if (github) formData.append('github', github);
      if (website) formData.append('website', website);
      if (image) formData.append('image', image);

      if (!Array.from(formData.keys()).length)
        return showToaster('Please fill all fields');

      const profile = await request('/profile', 'PATCH', formData, true);
      console.log(profile);
      showToaster('Profile Updated', true);
      updateProfile(profile);
      updateProfileDOM(profile);
    } catch (error) {
      console.log(error);
    }
  });
})();
