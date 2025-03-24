document.addEventListener('DOMContentLoaded', function() {
  const startButton = document.getElementById('startPlayback');
  const stopButton = document.getElementById('stopPlayback');
  const statusText = document.getElementById('statusText');
  
  // Initially disable the stop button
  stopButton.disabled = true;
  
  startButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const tab = tabs[0];
      
      // Check if the current page is Instagram
      if (!tab.url.includes('instagram.com')) {
        statusText.textContent = 'Please navigate to Instagram first!';
        return;
      }
      
      // Send a message to the content script to start playback
      chrome.tabs.sendMessage(tab.id, {action: 'startPlayback'}, function(response) {
        if (response && response.status === 'started') {
          statusText.textContent = 'Playback started. Videos will play one after another.';
          startButton.disabled = true;
          stopButton.disabled = false;
        } else {
          statusText.textContent = 'Error starting playback. Make sure you\'re on Instagram liked posts page.';
        }
      });
    });
  });
  
  stopButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const tab = tabs[0];
      
      // Send a message to the content script to stop playback
      chrome.tabs.sendMessage(tab.id, {action: 'stopPlayback'}, function(response) {
        if (response && response.status === 'stopped') {
          statusText.textContent = 'Playback stopped.';
          startButton.disabled = false;
          stopButton.disabled = true;
        }
      });
    });
  });
}); 