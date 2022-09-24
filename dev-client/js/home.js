(() => {
  const projectTemplate = document.querySelector('.projectTemplate');
  const feeds = document.querySelector('.feeds');
  const postChip = document.querySelector('.post-chip');
  const projectChip = document.querySelector('.project-chip');

  const setImage = (key, value) => {
    const image = JSON.parse(localStorage.getItem('images') || '{}');
    image[key] = value;
    localStorage.setItem('images', JSON.stringify(image));
  };

  const notFound = (text) => {
    const p = document.createElement('p');
    p.classList.add('txt');
    p.textContent = text;
    return p;
  };

  let currentHomeState = 'project';

  const renderComment = (comments, commentTemplate, commentContainer) => {
    if (!comments || !comments?.length)
      return (commentContainer.innerHTML = 'No Comments Added');

    comments?.forEach((comment) => {
      const clone = commentTemplate.content.cloneNode(true);
      clone.querySelector('.comment-profile img').src = getLocImage(
        comment?.Profile?.media
      );
      clone.querySelector('.comment-info h3').textContent =
        comment?.Profile?.username;
      clone.querySelector('.comment-info small').textContent =
        comment?.Comment?.comment;
      commentContainer.appendChild(clone);
    });
  };

  const fetchComments = async (
    projectId,
    commentContainer,
    commentTemplate,
    input,
    type = 'project'
  ) => {
    try {
      commentContainer.innerHTML = '';

      const data = await request(`/comment/${type}/${projectId}`, 'GET');
      renderComment(data, commentTemplate, commentContainer, type);
    } catch (error) {
      console.log(error);
    }
  };

  const addComment = async (
    projectId,
    commentContainer,
    commentTemplate,
    input,
    type = 'project'
  ) => {
    try {
      const comment = input?.value;
      if (!comment) return showToaster('Comment is required');
      await request(`/comment/${type}/${projectId}`, 'POST', { comment });
      fetchComments(projectId, commentContainer, commentTemplate, input, type);
    } catch (error) {}
  };

  const renderProject = (projects) => {
    projects?.map(async (project) => {
      const clone = projectTemplate.content.cloneNode(true);

      let image_url = getLocImage(project?.Profile?.media);

      clone.querySelector('.profile-pic img').src = image_url;
      clone.querySelector('.info h3').textContent = project?.Profile?.username;
      clone.querySelector('.info small').textContent = formatDate(
        project?.Project?.CREATEDTIME || ''
      );
      const photo_url = getLocImage(project?.Project?.media);
      clone.querySelector('.like-count').textContent =
        +project?.Likes?.ROWID || '';
      clone
        .querySelector('.like-count')
        .classList.add(`like-${project?.Project?.ROWID}`);
      clone.querySelector('.like').addEventListener('click', async () => {
        try {
          const data = await request(
            `/like/project/${project?.Project?.ROWID}`,
            'POST'
          );
          if (data?.project_id) {
            document.querySelector(`.like-${data?.project_id}`).textContent =
              (+document.querySelector(`.like-${data?.project_id}`)
                .textContent || 0) + 1;
          } else {
            document.querySelector(
              `.like-${project?.Project?.ROWID}`
            ).textContent =
              (+document.querySelector(`.like-${project?.Project?.ROWID}`)
                .textContent || 0) - 1;
          }
        } catch (error) {}
      });

      if (project?.Project?.media) setImage(project?.Project?.media, photo_url);
      clone.querySelector('.photo img').src = photo_url;
      clone.querySelector(
        '.description'
      ).innerHTML = `<strong>${project?.Profile?.username}</strong> ${project?.Project?.description}`;

      const trash = clone?.querySelector?.('.trash');
      console.log(getUser()?.Profile?.ROWID, project?.Project?.user_id);
      if (
        trash &&
        currentState === '/app/profile' &&
        getUser()?.Profile?.ROWID === project?.Project?.user_id
      ) {
        trash.style.display = 'inline-block';
        const ref = clone.querySelector('.feed');

        trash.addEventListener('click', async () => {
          try {
            await request(`/project/${project?.Project?.ROWID}`, 'DELETE');
            ref.remove();
            localStorage.setItem('projects', JSON.stringify('[]'));
          } catch (error) {}
        });
      }
      const commentTemplate = clone.querySelector('.commentTemplate');
      const commentContainer = clone.querySelector('.comments-wrapper');
      const popup = clone.querySelector('.popup-g');
      const input = clone.querySelector('.comment-input');
      clone
        .querySelector('.comment-btn')
        .addEventListener('click', async () => {
          popup.style.transform = 'scale(1)';
          await fetchComments(
            project?.Project?.ROWID,
            commentContainer,
            commentTemplate,
            input
          );
        });

      clone
        .querySelector('.info h3')
        .addEventListener('click', (e) =>
          handleLocation(e, '/app/profile', project?.Project?.user_id)
        );

      clone
        .querySelector('.close-comment')
        .addEventListener('click', async () => {
          popup.style.transform = 'scale(0)';
        });
      clone
        .querySelector('.send')
        .addEventListener('click', () =>
          addComment(
            project?.Project?.ROWID,
            commentContainer,
            commentTemplate,
            input
          )
        );
      feeds.appendChild(clone);
    });
  };

  const fetchProjects = async () => {
    try {
      if (currentState === '/app/explore') return;
      let projects;
      document.querySelector('.feeds').innerHTML = '';
      if (currentState !== '/app/profile') {
        projects = JSON.parse(localStorage.getItem('projects') || '[]');
        if (!projects || !projects?.length || projects === '[]')
          projects = await request('/project', 'GET');
      } else {
        const id = getUrlParam('id') || getUser()?.Profile?.ROWID;
        projects = await request(`/project/user/${id}`, 'GET');
      }
      if (!projects?.length) {
        feeds.appendChild(notFound('No Projects Found'));
        return;
      }

      renderProject(projects);
      // localStorage.setItem('projects', JSON.stringify(projects || []));

      // projects?.map(async (project) => {
      //   const clone = projectTemplate.content.cloneNode(true);

      //   let image_url = getLocImage(project?.Profile?.media);

      //   clone.querySelector('.profile-pic img').src = image_url;
      //   clone.querySelector('.info h3').textContent =
      //     project?.Profile?.username;

      //   const photo_url = getLocImage(project?.Project?.media);
      //   clone.querySelector('.like-count').textContent =
      //     +project?.Likes?.ROWID || '';
      //   clone
      //     .querySelector('.like-count')
      //     .classList.add(`like-${project?.Project?.ROWID}`);
      //   clone.querySelector('.like').addEventListener('click', async () => {
      //     try {
      //       const data = await request(
      //         `/like/project/${project?.Project?.ROWID}`,
      //         'POST'
      //       );
      //       if (data?.project_id) {
      //         document.querySelector(`.like-${data?.project_id}`).textContent =
      //           (+document.querySelector(`.like-${data?.project_id}`)
      //             .textContent || 0) + 1;
      //       } else {
      //         document.querySelector(
      //           `.like-${project?.Project?.ROWID}`
      //         ).textContent =
      //           (+document.querySelector(`.like-${project?.Project?.ROWID}`)
      //             .textContent || 0) - 1;
      //       }
      //     } catch (error) {}
      //   });

      //   if (project?.Project?.media)
      //     setImage(project?.Project?.media, photo_url);
      //   clone.querySelector('.photo img').src = photo_url;
      //   clone.querySelector(
      //     '.description'
      //   ).innerHTML = `<strong>${project?.Profile?.username}</strong> ${project?.Project?.description}`;

      //   const trash = clone?.querySelector?.('.trash');
      //   console.log(getUser()?.Profile?.ROWID, project?.Project?.user_id);
      //   if (
      //     trash &&
      //     currentState === '/app/profile' &&
      //     getUser()?.Profile?.ROWID === project?.Project?.user_id
      //   ) {
      //     trash.style.display = 'inline-block';
      //     const ref = clone.querySelector('.feed');

      //     trash.addEventListener('click', async () => {
      //       try {
      //         await request(`/project/${project?.Project?.ROWID}`, 'DELETE');
      //         ref.remove();
      //         localStorage.setItem('projects', JSON.stringify('[]'));
      //       } catch (error) {}
      //     });
      //   }
      //   const commentTemplate = clone.querySelector('.commentTemplate');
      //   const commentContainer = clone.querySelector('.comments-wrapper');
      //   const popup = clone.querySelector('.popup-g');
      //   const input = clone.querySelector('.comment-input');
      //   clone
      //     .querySelector('.comment-btn')
      //     .addEventListener('click', async () => {
      //       popup.style.transform = 'scale(1)';
      //       await fetchComments(
      //         project?.Project?.ROWID,
      //         commentContainer,
      //         commentTemplate,
      //         input
      //       );
      //     });

      //   clone
      //     .querySelector('.info h3')
      //     .addEventListener('click', (e) =>
      //       handleLocation(e, '/app/profile', project?.Project?.user_id)
      //     );

      //   clone
      //     .querySelector('.close-comment')
      //     .addEventListener('click', async () => {
      //       popup.style.transform = 'scale(0)';
      //     });
      //   clone
      //     .querySelector('.send')
      //     .addEventListener('click', () =>
      //       addComment(
      //         project?.Project?.ROWID,
      //         commentContainer,
      //         commentTemplate,
      //         input
      //       )
      //     );
      //   feeds.appendChild(clone);
      // });
      // localStorage.setItem('projects', JSON.stringify(projects || []));
    } catch (error) {}
  };

  fetchProjects();

  const fetchPosts = async () => {
    try {
      let posts;

      if (currentState !== '/app/profile') {
        posts = JSON.parse(localStorage.getItem('posts') || '[]');
        if (!posts || !posts?.length || posts === '[]')
          posts = await request('/post', 'GET');
      } else {
        const id = getUrlParam('id') || getUser()?.Profile?.ROWID;
        posts = await request(`/post/user/${id}`, 'GET');
      }
      if (!posts?.length) {
        feeds.appendChild(notFound('No Posts Found'));
        return;
      }

      // localStorage.setItem('posts', JSON.stringify(posts));

      posts?.map(async (project) => {
        const clone = projectTemplate.content.cloneNode(true);

        const image_url = getLocImage(project?.Profile?.media);

        clone.querySelector('.profile-pic img').src = image_url;
        clone.querySelector('.info h3').textContent =
          project?.Profile?.username;

        clone.querySelector('.info small').textContent = formatDate(
          project?.Post?.CREATEDTIME || ''
        );
        const post_url = getLocImage(project?.Post?.media);

        clone
          .querySelector('.info h3')
          .addEventListener('click', (e) =>
            handleLocation(e, '/app/profile', project?.Post?.user_id)
          );

        clone.querySelector('.photo img').src = post_url;
        clone.querySelector('.like-count').textContent =
          project?.Likes?.ROWID || '';
        clone.querySelector(
          '.description'
        ).innerHTML = `<strong>${project?.Profile?.username}</strong> ${project?.Post?.description}`;
        const trash = clone?.querySelector?.('.trash');

        if (
          trash &&
          currentState === '/app/profile' &&
          getUser()?.Profile?.ROWID === project?.Post?.user_id
        ) {
          trash.style.display = 'inline-block';
          const ref = clone.querySelector('.feed');
          trash.addEventListener('click', async () => {
            try {
              await request(`/post/${project?.Post?.ROWID}`, 'DELETE');
              ref.remove();
              localStorage.setItem('posts', JSON.stringify('[]'));
            } catch (error) {}
          });
        }

        clone.querySelector('.like-count').textContent =
          +project?.Likes?.ROWID || '';
        clone
          .querySelector('.like-count')
          .classList.add(`like-${project?.Post?.ROWID}`);
        clone.querySelector('.like').addEventListener('click', async () => {
          try {
            const data = await request(
              `/like/post/${project?.Post?.ROWID}`,
              'POST'
            );
            if (data?.post_id) {
              document.querySelector(`.like-${data?.post_id}`).textContent =
                (+document.querySelector(`.like-${data?.post_id}`)
                  .textContent || 0) + 1;
            } else {
              const count =
                (+document.querySelector(`.like-${project?.Post?.ROWID}`)
                  .textContent || 0) - 1;
              document.querySelector(
                `.like-${project?.Post?.ROWID}`
              ).textContent = count > 0 ? count : '';
            }
          } catch (error) {}
        });

        const commentTemplate = clone.querySelector('.commentTemplate');
        const commentContainer = clone.querySelector('.comments-wrapper');
        const popup = clone.querySelector('.popup-g');
        const input = clone.querySelector('.comment-input');
        clone
          .querySelector('.comment-btn')
          .addEventListener('click', async () => {
            popup.style.transform = 'scale(1)';
            await fetchComments(
              project?.Post?.ROWID,
              commentContainer,
              commentTemplate,
              input,
              'post'
            );
          });

        clone
          .querySelector('.close-comment')
          .addEventListener('click', async () => {
            popup.style.transform = 'scale(0)';
          });
        clone
          .querySelector('.send')
          .addEventListener('click', () =>
            addComment(
              project?.Post?.ROWID,
              commentContainer,
              commentTemplate,
              input,
              'post'
            )
          );
        feeds.appendChild(clone);
      });
    } catch (error) {
      console.log(error);
    }
  };

  projectChip?.addEventListener?.('click', () => {
    if (currentHomeState === 'project') return;
    currentHomeState = 'project';
    feeds.innerHTML = '';
    postChip.classList.remove('active');
    projectChip.classList.add('active');
    fetchProjects();
  });

  postChip?.addEventListener?.('click', () => {
    if (currentHomeState === 'post') return;
    currentHomeState = 'post';
    feeds.innerHTML = '';

    projectChip.classList.remove('active');
    postChip.classList.add('active');
    fetchPosts();
  });

  document?.querySelector('.fetchProject')?.addEventListener('click', () => {
    currentHomeState = 'project';
    feeds.innerHTML = '';
    postChip.classList.remove('active');
    projectChip.classList.add('active');
    fetchProjects();
  });

  document
    .querySelector('.explore-btn')
    ?.addEventListener?.('click', async () => {
      try {
        document.querySelector('.feeds').innerHTML = '';

        const title = document.querySelector('.explore-title').value || '';
        const tags = document.querySelector('.explore-tags').value || '';

        if (!(title || tags)) return showToaster('Title or tag required');

        const projects = await request(
          `/project/search?title=${title}&tags=${tags}`,
          'GET'
        );
        if (!projects || !projects?.length)
          return (document.querySelector('.feeds').innerHTML =
            'No Projects Found');
        renderProject(projects);
      } catch (error) {
        console.log(error);
      }
    });
})();
