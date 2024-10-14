// Find all GitHub repo links on the page
function getGitHubLinks() {
  const anchors = document.querySelectorAll('a[href*="github.com"]');
  const repoLinks = [];

  anchors.forEach(anchor => {
    const urlParts = anchor.href.split('/');
    if (urlParts.length >= 5) {
      const owner = urlParts[3];
      const repo = urlParts[4];
      repoLinks.push({ anchor, owner, repo });
    }
  });

  return repoLinks;
}

// Fetch and display star counts
async function displayStars() {
  const links = getGitHubLinks();
  
  chrome.storage.local.get('githubToken', async ({ githubToken }) => {
    if (!githubToken) {
      console.error('No GitHub token found!');
      return;
    }
    
    for (const { anchor, owner, repo } of links) {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          'Authorization': `token ${githubToken}`
        }
      });
      const data = await response.json();
      if (data.stargazers_count !== undefined) {
        const starBadge = document.createElement('span');
        starBadge.className = 'github-star-badge';
        starBadge.textContent = `⭐ ${data.stargazers_count}`;
        anchor.parentNode.insertBefore(starBadge, anchor.nextSibling);
      }
    }
  });
}

displayStars();
