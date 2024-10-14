document.getElementById('oauthButton').addEventListener('click', function() {
  chrome.tabs.create({url: 'https://github.com/settings/tokens/new?scopes=repo&description=GitHub Star Counter Extension'});
  tokenInput.style.display = 'block';
  saveTokenButton.style.display = 'block';
});

document.getElementById('saveTokenButton').addEventListener('click', () => {
  const token = document.getElementById('tokenInput').value;
  chrome.storage.local.set({ 'githubToken': token }, () => {
    alert('Token saved!');
  });
});
