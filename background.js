chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "authorize") {
    // Redirect to GitHub OAuth page
    const CLIENT_ID = 'your-client-id';
    const REDIRECT_URI = chrome.identity.getRedirectURL();
    
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=repo`;
    
    chrome.identity.launchWebAuthFlow({
      url: authUrl,
      interactive: true
    }, function (redirect_url) {
      if (chrome.runtime.lastError || redirect_url.includes('error')) {
        console.error('Authorization failed');
        return;
      }

      const code = new URL(redirect_url).searchParams.get('code');
      
      // Exchange code for an access token
      // (Normally you would do this on your server to keep the client secret safe)
      // This example assumes you have a backend service to handle the exchange.
      fetch('https://your-backend-server.com/exchange', {
        method: 'POST',
        body: JSON.stringify({ code })
      })
      .then(response => response.json())
      .then(data => {
        const token = data.access_token;
        chrome.storage.local.set({ 'githubToken': token });
        alert('GitHub Authorization successful!');
      });
    });
  }
});

async function fetchStarCount(owner, repo) {
  const { githubToken } = await chrome.storage.local.get('githubToken');
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      'Authorization': `token ${githubToken}`
    }
  });
  const data = await response.json();
  return data.stargazers_count;
}
