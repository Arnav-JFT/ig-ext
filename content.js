// Global variables to control playback
let isPlaying = false;
let currentVideoIndex = 0;
let videos = [];
let observer = null;

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'startPlayback') {
    // Only start if we're not already playing
    if (!isPlaying) {
      isPlaying = true;
      startVideoPlayback();
      sendResponse({status: 'started'});
    }
  } else if (request.action === 'stopPlayback') {
    isPlaying = false;
    stopVideoPlayback();
    sendResponse({status: 'stopped'});
  }
  return true; // Keeps the message channel open for async responses
});

// Function to start playing videos
function startVideoPlayback() {
  // Check if we're on the liked posts page
  if (!window.location.href.includes('instagram.com/')) {
    console.error('Not on Instagram!');
    return;
  }
  
  // First, navigate to the liked posts page if we're not already there
  if (!window.location.href.includes('/liked_posts/')) {
    navigateToLikedPosts();
    return;
  }
  
  console.log('Starting liked videos playback...');
  
  // Find all videos on the page
  findVideos();
  
  // If no videos found, set up a mutation observer to wait for videos to load
  if (videos.length === 0) {
    setupMutationObserver();
  } else {
    // Start playing the first video
    playNextVideo();
  }
}

// Function to navigate to the liked posts page
function navigateToLikedPosts() {
  console.log('Navigating to liked posts page...');
  
  // Click on the profile icon to open the menu (if it exists)
  const profileButton = document.querySelector('svg[aria-label="Profile"]') || 
                       document.querySelector('a[href*="/accounts/activity/"]');
  
  if (profileButton) {
    profileButton.closest('a, button').click();
    
    // Wait for the menu to appear and then click on "Saved" or "Liked Posts"
    setTimeout(() => {
      const likedPostsLink = Array.from(document.querySelectorAll('a')).find(a => 
        a.textContent.includes('Liked Posts') || a.textContent.includes('You liked')
      );
      
      if (likedPostsLink) {
        likedPostsLink.click();
      } else {
        console.error('Could not find liked posts link');
      }
    }, 1000);
  } else {
    // If we can't find the profile button, try direct navigation
    window.location.href = 'https://www.instagram.com/explore/liked_posts/';
  }
}

// Function to find all videos on the page
function findVideos() {
  // Reset videos array
  videos = [];
  
  // Instagram videos are usually in video elements inside article elements
  const videoElements = document.querySelectorAll('article video');
  
  if (videoElements.length > 0) {
    videos = Array.from(videoElements);
    console.log(`Found ${videos.length} videos`);
  } else {
    // Try alternative selectors if the above doesn't work
    const allVideos = document.querySelectorAll('video');
    if (allVideos.length > 0) {
      videos = Array.from(allVideos);
      console.log(`Found ${videos.length} videos (alternative method)`);
    } else {
      console.log('No videos found on the page');
    }
  }
}

// Function to play the next video in the sequence
function playNextVideo() {
  if (!isPlaying || videos.length === 0) {
    return;
  }
  
  if (currentVideoIndex >= videos.length) {
    console.log('Reached the end of the current videos');
    // We've reached the end, try to load more videos by scrolling
    scrollForMoreContent();
    return;
  }
  
  const video = videos[currentVideoIndex];
  
  // Check if the video is still in the DOM
  if (!document.body.contains(video)) {
    console.log('Video element is no longer in the DOM, finding new videos...');
    findVideos();
    if (videos.length === 0) {
      setupMutationObserver();
      return;
    }
    currentVideoIndex = 0;
    playNextVideo();
    return;
  }
  
  // Scroll to make the video visible
  video.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
  // Wait a moment to ensure the video is loaded after scrolling
  setTimeout(() => {
    // Ensure video controls are enabled
    video.controls = true;
    
    // Unmute the video
    video.muted = false;
    
    // Set volume to mid-level
    video.volume = 0.5;
    
    // Try to play the video
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log(`Playing video ${currentVideoIndex + 1} of ${videos.length}`);
      }).catch(error => {
        console.error('Error playing video:', error);
        // Some videos may not be playable, try the next one
        currentVideoIndex++;
        playNextVideo();
      });
    }
    
    // Listen for the video to end, then play the next one
    video.onended = function() {
      console.log('Video ended, playing next...');
      currentVideoIndex++;
      playNextVideo();
    };
  }, 1000);
}

// Function to scroll for more content
function scrollForMoreContent() {
  console.log('Scrolling for more content...');
  
  // Save the current number of videos
  const previousCount = videos.length;
  
  // Scroll to the bottom of the page to trigger loading more content
  window.scrollTo(0, document.body.scrollHeight);
  
  // Wait for new content to load, then check for new videos
  setTimeout(() => {
    findVideos();
    
    // Check if we found any new videos
    if (videos.length > previousCount) {
      console.log(`Found ${videos.length - previousCount} new videos`);
      // Reset currentVideoIndex if we've reset the videos array
      if (currentVideoIndex >= previousCount) {
        currentVideoIndex = previousCount;
      }
      playNextVideo();
    } else {
      console.log('No new videos found, stopping playback');
      isPlaying = false;
    }
  }, 3000);
}

// Function to set up mutation observer to detect when videos load
function setupMutationObserver() {
  if (observer) {
    observer.disconnect();
  }
  
  console.log('Setting up mutation observer to wait for videos...');
  
  observer = new MutationObserver((mutations) => {
    // Check if any videos have been added to the page
    const newVideos = document.querySelectorAll('article video, video');
    
    if (newVideos.length > 0) {
      console.log(`Mutation observer found ${newVideos.length} videos`);
      observer.disconnect();
      findVideos();
      
      if (videos.length > 0) {
        playNextVideo();
      }
    }
  });
  
  // Observe changes to the entire document
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Also try scrolling to trigger content load
  scrollForMoreContent();
}

// Function to stop video playback
function stopVideoPlayback() {
  console.log('Stopping video playback');
  
  // Disconnect the observer if it exists
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  
  // Pause the current video if there is one
  if (videos.length > 0 && currentVideoIndex < videos.length) {
    const currentVideo = videos[currentVideoIndex];
    if (currentVideo && !currentVideo.paused) {
      currentVideo.pause();
    }
  }
  
  // Reset state
  currentVideoIndex = 0;
} 