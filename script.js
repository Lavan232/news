// Times of India RSS Feed Configuration
const TOI_RSS_FEEDS = {
    latest: 'https://timesofindia.indiatimes.com/rssfeedmostrecent.cms',
    india: 'https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms',
    world: 'https://timesofindia.indiatimes.com/rssfeeds/296589292.cms',
    business: 'https://timesofindia.indiatimes.com/rssfeeds/1898055.cms',
    sports: 'https://timesofindia.indiatimes.com/rssfeeds/4719148.cms',
    entertainment: 'https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms'
};

// DOM Elements
const breakingNewsContent = document.getElementById('breaking-news-content');
const featuredNewsContainer = document.getElementById('featured-news');
const newsGridContainer = document.getElementById('news-grid');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    fetchNews('latest');
});

// Fetch news based on category
async function fetchNews(category) {
    try {
        // Show loading state
        featuredNewsContainer.innerHTML = '<div class="loading">Loading featured news...</div>';
        newsGridContainer.innerHTML = '<div class="loading">Loading news...</div>';
        
        // Fetch news from TOI RSS feed
        const feedUrl = TOI_RSS_FEEDS[category];
        const rssToJsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
        
        const response = await fetch(rssToJsonUrl);
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            displayNews(data.items);
            updateBreakingNews(data.items);
        } else {
            throw new Error('No news items found');
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        featuredNewsContainer.innerHTML = '<div class="error">Failed to load news. Please try again later.</div>';
        newsGridContainer.innerHTML = '';
    }
}

// Display news on the page
function displayNews(newsItems) {
    // Clear previous content
    featuredNewsContainer.innerHTML = '';
    newsGridContainer.innerHTML = '';
    
    // Display featured news (first item)
    if (newsItems.length > 0) {
        const featuredItem = newsItems[0];
        featuredNewsContainer.innerHTML = `
            <div class="featured-news-item">
                <img src="${featuredItem.enclosure.link || 'https://via.placeholder.com/800x400?text=News+Image'}" alt="${featuredItem.title}">
                <div class="featured-content">
                    <h2>${featuredItem.title}</h2>
                    <p>${featuredItem.description.replace(/<[^>]+>/g, '').substring(0, 150)}...</p>
                    <div class="news-meta">
                        <span><i class="far fa-clock"></i> ${formatDate(featuredItem.pubDate)}</span>
                        <span><i class="far fa-newspaper"></i> Times of India</span>
                    </div>
                    <a href="${featuredItem.link}" target="_blank" class="read-more">Read Full Story</a>
                </div>
            </div>
        `;
    }
    
    // Display remaining news in grid
    if (newsItems.length > 1) {
        for (let i = 1; i < newsItems.length; i++) {
            const item = newsItems[i];
            const newsItemElement = document.createElement('div');
            newsItemElement.className = 'news-item';
            newsItemElement.innerHTML = `
                <img src="${item.enclosure.link || 'https://via.placeholder.com/300x180?text=News+Image'}" alt="${item.title}">
                <div class="news-content">
                    <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                    <p>${item.description.replace(/<[^>]+>/g, '').substring(0, 100)}...</p>
                    <div class="news-meta">
                        <span><i class="far fa-clock"></i> ${formatDate(item.pubDate)}</span>
                    </div>
                </div>
            `;
            newsGridContainer.appendChild(newsItemElement);
        }
    }
}

// Update breaking news ticker
function updateBreakingNews(newsItems) {
    // Take first 5 headlines for the ticker
    const breakingHeadlines = newsItems.slice(0, 5).map(item => item.title);
    
    // Clear existing content
    breakingNewsContent.innerHTML = '';
    
    // Add each headline with separator
    breakingHeadlines.forEach((headline, index) => {
        const headlineElement = document.createTextNode(headline);
        breakingNewsContent.appendChild(headlineElement);
        
        // Add separator if not the last item
        if (index < breakingHeadlines.length - 1) {
            const separator = document.createElement('span');
            separator.innerHTML = ' • ';
            breakingNewsContent.appendChild(separator);
        }
    });
}

// Format date to readable format
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Add active class to clicked nav item
document.querySelectorAll('nav li').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('nav li').forEach(li => li.classList.remove('active'));
        this.classList.add('active');
    });
});