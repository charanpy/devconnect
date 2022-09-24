function insertUrlParam(key, value) {
  if (history.pushState) {
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.set(key, value);
    let newUrl =
      window.location.protocol +
      '//' +
      window.location.host +
      window.location.pathname +
      '?' +
      searchParams.toString();
    window.history.pushState({ path: newUrl }, '', newUrl);
  }
}

function removeUrlParameter(paramKey) {
  const url = window.location.href;
  const r = new URL(url);
  r.searchParams.delete(paramKey);
  const newUrl = r.href;
  console.log('r.href', newUrl);
  window.history.pushState({ path: newUrl }, '', newUrl);
}

function getUrlParam(paramKey) {
  const url = window.location.href;
  const r = new URL(url);
  return r.searchParams.get(paramKey);
}
const route = (event) => {
  handleLocation(null, event);
};

let currentState = '';

const routes = {
  '/app/': {
    html: '/app/pages/home/home.html',
    script: ['./js/home.js'],
    name: 'home',
  },
  '/app/profile': {
    html: '/app/pages/profile/profile.html',
    name: 'profile',
    script: ['./js/home.js', './js/profile.js'],
  },
  '/app/resource': {
    html: '/app/pages/resource/resource.html',
    name: 'resource',
    script: ['./js/resource.js'],
  },
  '/app/explore': {
    html: '/app/pages/explore/explore.html',
    name: 'explore',
    script: ['./js/home.js'],
  },
};

const handleLocation = async (e, navigateTo = '/app/', id) => {
  const route = routes[navigateTo] || routes['/app/'];

  removeUrlParameter('id');

  if (id) insertUrlParam('id', id);
  if (currentState)
    document
      ?.querySelector?.(`#${routes?.[currentState]?.name}`)
      ?.classList?.remove?.('active-nav');

  if (navigateTo)
    document
      .querySelector(`#${routes?.[navigateTo]?.name}`)
      ?.classList?.add?.('active-nav');
  if (currentState === navigateTo) return;

  if (
    window.innerWidth <= '767' &&
    document?.querySelector?.('.appNav')?.style?.transform !==
      'translateX(-100%)'
  ) {
    document.querySelector('.appNav').style.transform = 'translateX(-100%)';
  }

  document
    .querySelectorAll(`script-${routes[currentState]?.name}`)
    ?.forEach((src) => src.remove());
  currentState = navigateTo;
  const html = await fetch(route.html).then((data) => data.text());
  document.getElementById('main-page').innerHTML = html;

  route?.script?.forEach((scr) => {
    const script = document.createElement('script');
    script.src = scr;
    script.classList.add(`script-${routes[currentState]?.name}`);
    document.body.appendChild(script);
  });
};

document.addEventListener('DOMContentLoaded', (e) => handleLocation(e));

document.querySelector('.search-header').addEventListener('click', (e) => {
  handleLocation(e, '/app/explore');
});

window.route = route;

function formatDate(date) {
  try {
    const newDate = new Date(date);
    const dateFormat = `${newDate.getDay().toString().padStart(2, 0)}/${newDate
      .getMonth()
      .toString()
      .padStart(2, 0)}/${newDate.getFullYear().toString().padStart(2, 0)}`;
    const timeFormat = `${newDate
      .getHours()
      .toString()
      .padStart(2, 0)}:${newDate.getMinutes().toString().padStart(2, 0)}`;

    return `${dateFormat} ${timeFormat}`;
  } catch (error) {
    return '';
  }
}
