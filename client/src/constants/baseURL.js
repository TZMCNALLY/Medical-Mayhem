// SWITCHES THE AXIOS INSTANCE BASE URL AND SOCKET CONNECTIONS BETWEEN PRODUCTION AND DEVELOPMENT

const rootDomain = window.location.href.includes('heroku') ? 'https://medical-mayhem-c0832c3f548e.herokuapp.com': `http://localhost:4000`

export default rootDomain