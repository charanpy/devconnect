(() => {
  const languageContainer = document.querySelector('.language-container');
  const resourceContainer = document.querySelector('.resource-wrapper');
  const resourceTemplate = document.querySelector('.resourceTemplate');
  const languageSelect = document.querySelector('.resource-language');

  const renderResource = async (languageId) => {
    try {
      resourceContainer.innerHTML = '';
      const resource = await request(`/resource/${languageId}`, 'GET');

      if (!resource || !resource?.length)
        return (resourceContainer.innerHTML = 'No Resource Found');

      resource?.forEach((project) => {
        const clone = resourceTemplate.content.cloneNode(true);

        const image_url = getLocImage(project?.Resource?.media);
        clone.querySelector('.photo img').src = image_url;

        clone.querySelector('.like').addEventListener('click', async () => {
          try {
            await request(`/resource/vote/${project?.Resource?.ROWID}`, 'POST');
            const count = document.querySelector(
              `.like-${project?.Resource?.ROWID}`
            ).textContent;
            document.querySelector(
              `.like-${project?.Resource?.ROWID}`
            ).textContent = +count + 1;
          } catch (error) {
            console.log(error);
          }
        });
        clone.querySelector('.like-count').textContent =
          +project?.Resource?.likes || '';
        clone
          .querySelector('.like-count')
          .classList.add(`like-${project?.Resource?.ROWID}`);
        clone.querySelector('.description').innerHTML =
          project?.Resource?.description;
        clone.querySelector('.title').innerHTML = project?.Resource?.title;
        clone.querySelector('.website').href =
          project?.Resource?.website || '#';
        clone.querySelector('.github').href = project?.Resource?.github || '#';

        resourceContainer.appendChild(clone);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const selectedLanguage = (function () {
    let selected = '';

    function setState(lang) {
      if (lang) selected = lang;
      return selected;
    }

    return setState;
  })();

  const fetchLanguage = async () => {
    try {
      const languages = await request('/resource/language', 'GET');

      if (!languages || !languages?.length)
        return (languageContainer.innerHTML = 'No languages Found');

      languages?.forEach((language, index) => {
        const languageDiv = document.createElement('div');
        languageDiv.id = language?.Language?.name;
        languageDiv.classList.add('language');
        languageDiv.textContent = language?.Language?.name;

        languageDiv.addEventListener('click', () => {
          const selected = selectedLanguage();

          if (selected)
            document.querySelector(`#${selected}`).classList.remove('active');

          languageDiv.classList.add('active');
          selectedLanguage(language?.Language?.name);

          renderResource(language?.Language?.ROWID);
        });
        const option = document.createElement('option');
        option.value = language?.Language?.ROWID;
        option.textContent = language?.Language?.name;
        languageSelect.appendChild(option);

        languageContainer.appendChild(languageDiv);
      });
    } catch (error) {
      console.log(error);
    }
  };

  fetchLanguage();

  document.querySelector('.add-resource-btn').addEventListener('click', () => {
    document.querySelector('.add-resource').style.transform = 'scale(1)';
  });

  document
    .querySelector('.close-add-resource')
    .addEventListener('click', () => {
      document.querySelector('.add-resource').style.transform = 'scale(0)';
    });

  document
    .querySelector('.add-resource-form')
    .addEventListener('submit', async (e) => {
      e?.preventDefault();

      try {
        const title = document.querySelector('.resource-title').value;
        const language = document.querySelector('.resource-language').value;
        const description = document.querySelector(
          '.resource-description'
        ).value;
        const github = document.querySelector('.resource-github').value;
        const website = document.querySelector('.resource-website').value;
        const image = document.querySelector('.resource-image').files[0];

        if (
          !title ||
          !language ||
          !description ||
          !github ||
          !website ||
          !image
        )
          return showToaster('Please fill all fields');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('language', language);
        formData.append('github', github);
        formData.append('website', website);
        formData.append('image', image);

        await request('/resource', 'POST', formData, true);
        showToaster('Added Resource', true);
        resourceContainer.innerHTML = '';
        if (selectedLanguage()) {
          document
            .querySelector(`#${selectedLanguage()}`)
            .classList.remove('active');
          selectedLanguage('');
        }
      } catch (error) {
        console.log(error);
      }
    });
})();
