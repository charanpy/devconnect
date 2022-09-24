(() => {
  document.querySelector('.explore-btn').addEventListener('click', async () => {
    try {
      const title = document.querySelector('.explore-title').value || '';
      const tags = document.querySelector('.explore-tags').value || '';

      if (!(title || tags)) return showToaster('Title or tag required');

      const projects = await request(
        `/project/search?title=${title}&tags=${tags}`,
        'GET'
      );
    } catch (error) {
      console.log(error);
    }
  });
})();
