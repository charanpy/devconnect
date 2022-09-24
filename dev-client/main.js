(() => {
  const logout = document.querySelector('.logout');
  const postForm = document.querySelector('.post-form');
  const projectForm = document.querySelector('.project-form');
  const addProjectChip = document.querySelector('.add-project-chip');
  const addPostChip = document.querySelector('.add-post-chip');
  const closeBtn = document.querySelector('.close-add');
  const appAdd = document.querySelector('.app-add');

  logout.addEventListener('click', async () => {
    try {
      await catalyst.auth.signOut('/app/register/index.html');
    } catch (error) {}
  });

  const hamburger = document.querySelector('.appHeader h1');
  const closeNavBtn = document.querySelector('.close-nav');
  const toggleNavBar = (transform) => {
    document.querySelector(
      '.appNav'
    ).style.transform = `translateX(${transform}%)`;
  };

  hamburger.addEventListener('click', () => toggleNavBar(0));
  closeNavBtn.addEventListener('click', () => toggleNavBar(-100));

  document.querySelector('.add-btn').addEventListener('click', () => {
    document.querySelector('.app-add').style.transform = 'scale(1)';
  });

  addPostChip.addEventListener('click', () => {
    addPostChip.classList.add('active');
    addProjectChip.classList.remove('active');
    projectForm.style.display = 'none';
    postForm.style.display = 'flex';
  });

  addProjectChip.addEventListener('click', () => {
    addPostChip.classList.remove('active');
    addProjectChip.classList.add('active');
    projectForm.style.display = 'flex';
    postForm.style.display = 'none';
  });

  closeBtn.addEventListener('click', () => {
    appAdd.style.transform = 'scale(0)';
  });

  postForm.addEventListener('submit', (e) => {
    e?.preventDefault();
    const description = document.querySelector('.post-description')?.value;
    const tags = document.querySelector('.post-tags')?.value;
    const image = document.querySelector('.post-image')?.files[0];

    if (!description || !tags || !image)
      return showToaster('Please fill all fields');

    const formData = new FormData();
    formData.append('description', description);
    formData.append('tags', tags);
    formData.append('image', image);

    fetch(
      'https://devconnector-789506444.development.catalystserverless.com/server/polls_function/api/v1/post',
      {
        method: 'POST',
        body: formData,
      }
    )
      .then((res) => {
        console.log(res);
        showToaster('Added Post', true);
        document.querySelector('.fetchProject')?.click();
        localStorage.setItem('posts', JSON.stringify([]));
      })
      .catch((e) => {
        showToaster(e?.message);
      });
  });

  projectForm.addEventListener('submit', (e) => {
    e?.preventDefault();
    // tags, description, project_title, website, github
    const description = document.querySelector('.project-description')?.value;
    const project_title = document.querySelector('.project-title')?.value;
    const tags = document.querySelector('.project-tags')?.value;
    const website = document.querySelector('.project-website')?.value;
    const github = document.querySelector('.project-github')?.value;
    const image = document.querySelector('.project-image')?.files[0];

    console.log(description, project_title, tags, website, github, image);
    if (
      !description ||
      !project_title ||
      !tags ||
      !website ||
      !github ||
      !image
    ) {
      return showToaster('Please fill all fields');
    }
    const formData = new FormData();
    formData.append('description', description);
    formData.append('project_title', project_title);
    formData.append('tags', tags);
    formData.append('website', website);
    formData.append('github', github);
    formData.append('image', image);

    fetch(
      'https://devconnector-789506444.development.catalystserverless.com/server/polls_function/api/v1/project',
      {
        method: 'POST',
        body: formData,
      }
    )
      .then((res) => {
        console.log(res);
        showToaster('Added Project', true);
        document.querySelector('.fetchProject')?.click();
        localStorage.setItem('projects', JSON.stringify([]));
      })
      .catch((e) => {
        showToaster(e?.message);
      });
  });
})();
