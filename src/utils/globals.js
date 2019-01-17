
export const Globals = {
  key: {
    braytech: process.env.REACT_APP_BRAYTECH_API_KEY,
    bungie: process.env.REACT_APP_BUNGIE_API_KEY
  },
  url: {
    braytech: "https://api.braytech.org",
    bungie: "https://www.bungie.net"
  },
  routes: {
    standard: ['character-select', 'pride', 'credits', 'settings', 'tools'],
    badboys: ['vendors']
  }
}

export const isProfileRoute = (pathname, hasProfileData = false) => {
  let view = pathname.split('/')[1];
  if (pathname !== '/' && !Globals.routes.standard.includes(view) && !Globals.routes.badboys.includes(view)) {
    return true;
  } else if (Globals.routes.badboys.includes(view) && hasProfileData) {
    return true;
  } else {
    return false;
  }
}

export default Globals;