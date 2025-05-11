// js/script.js
// Render pagination
function renderPagination(container, currentPage, totalPages, onPageChange) {
    if (!container) return;
    
    container.innerHTML = '';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = `pagination-btn prev ${currentPage === 1 ? 'disabled' : ''}`;
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i> Prev';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    });
    container.appendChild(prevBtn);
    
    // Page buttons
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start if end is maxed out
    if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // First page button if not in range
    if (startPage > 1) {
        const firstPageBtn = document.createElement('button');
        firstPageBtn.className = 'pagination-btn';
        firstPageBtn.textContent = '1';
        firstPageBtn.addEventListener('click', () => onPageChange(1));
        container.appendChild(firstPageBtn);
        
        // Ellipsis if needed
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'pagination-ellipsis';
            ellipsis.textContent = '...';
            container.appendChild(ellipsis);
        }
    }
    
    // Page buttons
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => onPageChange(i));
        container.appendChild(pageBtn);
    }
    
    // Last page button if not in range
    if (endPage < totalPages) {
        // Ellipsis if needed
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'pagination-ellipsis';
            ellipsis.textContent = '...';
            container.appendChild(ellipsis);
        }
        
        const lastPageBtn = document.createElement('button');
        lastPageBtn.className = 'pagination-btn';
        lastPageBtn.textContent = totalPages;
        lastPageBtn.addEventListener('click', () => onPageChange(totalPages));
        container.appendChild(lastPageBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = `pagination-btn next ${currentPage === totalPages ? 'disabled' : ''}`;
    nextBtn.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    });
    container.appendChild(nextBtn);
}// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Tab functionality for resources page
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabBtns.length && tabContents.length) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.target;
                
                // Remove active class from all buttons and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to current button and content
                btn.classList.add('active');
                document.getElementById(target).classList.add('active');
            });
        });
    }

    // Execute page-specific functions based on current page
    const currentPath = window.location.pathname;
    
    if (currentPath.endsWith('index.html') || currentPath.endsWith('/')) {
        loadRecentItems();
        updateStats();
    }
});

// Load the most recent items for the homepage
async function loadRecentItems() {
    try {
        // Load recent papers
        const papers = await fetchJSON('../pages/item-papers');
        if (papers && papers.length) {
            const recentPapers = papers
                .sort((a, b) => b.year - a.year)
                .slice(0, 5);
            
            displayRecentPapers(recentPapers);
        }
        
        // Load recent datasets
        const datasets = await fetchJSON('../pages/item-datasets');
        if (datasets && datasets.length) {
            const recentDatasets = datasets
                .sort((a, b) => b.year - a.year)
                .slice(0, 5);
            
            displayRecentDatasets(recentDatasets);
        }
    } catch (error) {
        console.error('Error loading recent items:', error);
    }
}

// Display recent papers on homepage
function displayRecentPapers(papers) {
    const container = document.getElementById('recent-papers');
    if (!container) return;
    
    container.innerHTML = '';
    
    papers.forEach(paper => {
        const paperItem = document.createElement('div');
        paperItem.className = 'resource-item';
        
        const html = `
            <h3>${paper.title}</h3>
            <div class="meta">
                <span>${paper.authors.join(', ')}</span> · 
                <span>${paper.year}</span> · 
                <span>${paper.publication}</span>
            </div>
            <div class="links">
                ${paper.doi ? `<a href="https://doi.org/${paper.doi}" target="_blank"><i class="fas fa-external-link-alt"></i> DOI</a>` : ''}
                ${paper.pdf ? `<a href="${paper.pdf}" target="_blank"><i class="fas fa-file-pdf"></i> PDF</a>` : ''}
                ${paper.code ? `<a href="${paper.code}" target="_blank"><i class="fas fa-code"></i> Code</a>` : ''}
            </div>
        `;
        
        paperItem.innerHTML = html;
        container.appendChild(paperItem);
    });
}

// Display recent datasets on homepage
function displayRecentDatasets(datasets) {
    const container = document.getElementById('recent-datasets');
    if (!container) return;
    
    container.innerHTML = '';
    
    datasets.forEach(dataset => {
        const datasetItem = document.createElement('div');
        datasetItem.className = 'resource-item';
        
        const html = `
            <h3>${dataset.title}</h3>
            <div class="meta">
                <span>${dataset.authors.join(', ')}</span> · 
                <span>${dataset.year}</span>
            </div>
            <p>${dataset.description.substring(0, 150)}${dataset.description.length > 150 ? '...' : ''}</p>
            <div class="links">
                ${dataset.url ? `<a href="${dataset.url}" target="_blank"><i class="fas fa-external-link-alt"></i> Website</a>` : ''}
                ${dataset.download ? `<a href="${dataset.download}" target="_blank"><i class="fas fa-download"></i> Download</a>` : ''}
                ${dataset.paper ? `<a href="${dataset.paper}" target="_blank"><i class="fas fa-file-alt"></i> Paper</a>` : ''}
            </div>
        `;
        
        datasetItem.innerHTML = html;
        container.appendChild(datasetItem);
    });
}

// Update stats on homepage
async function updateStats() {
    try {
        const papersCount = document.getElementById('papers-count');
        const datasetsCount = document.getElementById('datasets-count');
        const resourcesCount = document.getElementById('resources-count');
        
        if (papersCount) {
            const papers = await fetchJSON('../pages/item-papers');
            papersCount.textContent = papers.length;
        }
        
        if (datasetsCount) {
            const datasets = await fetchJSON('../pages/item-datasets');
            datasetsCount.textContent = datasets.length;
        }
        
        if (resourcesCount) {
            const tools = await fetchJSON('../pages/item-resources', 'tools');
            const media = await fetchJSON('../pages/item-resources', 'media');
            resourcesCount.textContent = tools.length + media.length;
        }
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// Load papers for papers.html
async function loadPapers() {
    try {
        const papers = await fetchJSON('./item-papers');
        const container = document.getElementById('papers-list');
        const loading = document.getElementById('loading');
        const noResults = document.getElementById('no-results');
        const paginationContainer = document.getElementById('papers-pagination');
        
        if (!container || !loading || !noResults) return;
        
        if (!papers || !papers.length) {
            loading.classList.add('hidden');
            noResults.classList.remove('hidden');
            return;
        }
        
        // Set up pagination
        const itemsPerPage = 10;
        let currentPage = 1;
        const totalPages = Math.ceil(papers.length / itemsPerPage);
        
        // Initial render
        renderPapersPage(papers, container, currentPage, itemsPerPage);
        renderPagination(paginationContainer, currentPage, totalPages, (page) => {
            currentPage = page;
            renderPapersPage(papers, container, currentPage, itemsPerPage);
        });
        
        loading.classList.add('hidden');
        
        // Set up search and sorting
        const searchInput = document.getElementById('search-papers');
        const sortSelect = document.getElementById('sort-papers');
        
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                const filtered = filterAndSortPapers(papers, searchInput.value, sortSelect.value);
                const newTotalPages = Math.ceil(filtered.length / itemsPerPage);
                currentPage = 1; // Reset to first page when searching
                renderPapersPage(filtered, container, currentPage, itemsPerPage);
                renderPagination(paginationContainer, currentPage, newTotalPages, (page) => {
                    currentPage = page;
                    renderPapersPage(filtered, container, currentPage, itemsPerPage);
                });
                
                if (filtered.length === 0) {
                    noResults.classList.remove('hidden');
                } else {
                    noResults.classList.add('hidden');
                }
            });
        }
        
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                const filtered = filterAndSortPapers(papers, searchInput.value, sortSelect.value);
                const newTotalPages = Math.ceil(filtered.length / itemsPerPage);
                currentPage = 1; // Reset to first page when sorting
                renderPapersPage(filtered, container, currentPage, itemsPerPage);
                renderPagination(paginationContainer, currentPage, newTotalPages, (page) => {
                    currentPage = page;
                    renderPapersPage(filtered, container, currentPage, itemsPerPage);
                });
            });
        }
    } catch (error) {
        console.error('Error loading papers:', error);
        const loading = document.getElementById('loading');
        if (loading) loading.classList.add('hidden');
    }
}

// Render papers for a specific page
function renderPapersPage(papers, container, currentPage, itemsPerPage) {
    container.innerHTML = '';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, papers.length);
    const paginatedPapers = papers.slice(startIndex, endIndex);
    
    renderPapersTable(paginatedPapers, container);
}

// Render papers table
function renderPapersTable(papers, container) {
    container.innerHTML = '';
    
    papers.forEach(paper => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>
                <strong>${paper.title}</strong>
            </td>
            <td>${paper.authors.join(', ')}</td>
            <td>${paper.year}</td>
            <td>${paper.publication}</td>
            <td class="links">
                ${paper.doi ? `<a href="https://doi.org/${paper.doi}" target="_blank" class="link-btn" title="DOI"><i class="fas fa-external-link-alt"></i></a>` : ''}
                ${paper.pdf ? `<a href="${paper.pdf}" target="_blank" class="link-btn" title="PDF"><i class="fas fa-file-pdf"></i></a>` : ''}
                ${paper.code ? `<a href="${paper.code}" target="_blank" class="link-btn" title="Code"><i class="fas fa-code"></i></a>` : ''}
            </td>
        `;
        
        container.appendChild(row);
    });
}

// Filter and sort papers
function filterAndSortPapers(papers, searchTerm, sortOption) {
    // Filter papers based on search term
    const filteredPapers = papers.filter(paper => {
        const term = searchTerm.toLowerCase();
        return paper.title.toLowerCase().includes(term) || 
               paper.authors.some(author => author.toLowerCase().includes(term)) ||
               paper.publication.toLowerCase().includes(term) ||
               paper.year.toString().includes(term);
    });
    
    // Sort papers based on sort option
    return [...filteredPapers].sort((a, b) => {
        switch (sortOption) {
            case 'year-desc':
                return b.year - a.year;
            case 'year-asc':
                return a.year - b.year;
            case 'title-asc':
                return a.title.localeCompare(b.title);
            case 'title-desc':
                return b.title.localeCompare(a.title);
            default:
                return b.year - a.year;
        }
    });
}

// Load datasets for datasets.html
async function loadDatasets() {
    try {
        const datasets = await fetchJSON('./item-datasets');
        const container = document.getElementById('datasets-list');
        const loading = document.getElementById('loading-datasets');
        const noResults = document.getElementById('no-datasets-results');
        const paginationContainer = document.getElementById('datasets-pagination');
        
        if (!container || !loading || !noResults) return;
        
        if (!datasets || !datasets.length) {
            loading.classList.add('hidden');
            noResults.classList.remove('hidden');
            return;
        }
        
        // Set up pagination
        const itemsPerPage = 10;
        let currentPage = 1;
        const totalPages = Math.ceil(datasets.length / itemsPerPage);
        
        // Initial render
        renderDatasetsPage(datasets, container, currentPage, itemsPerPage);
        renderPagination(paginationContainer, currentPage, totalPages, (page) => {
            currentPage = page;
            renderDatasetsPage(datasets, container, currentPage, itemsPerPage);
        });
        
        loading.classList.add('hidden');
        
        // Set up search and sorting
        const searchInput = document.getElementById('search-datasets');
        const sortSelect = document.getElementById('sort-datasets');
        
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                const filtered = filterAndSortDatasets(datasets, searchInput.value, sortSelect.value);
                const newTotalPages = Math.ceil(filtered.length / itemsPerPage);
                currentPage = 1; // Reset to first page when searching
                renderDatasetsPage(filtered, container, currentPage, itemsPerPage);
                renderPagination(paginationContainer, currentPage, newTotalPages, (page) => {
                    currentPage = page;
                    renderDatasetsPage(filtered, container, currentPage, itemsPerPage);
                });
                
                if (filtered.length === 0) {
                    noResults.classList.remove('hidden');
                } else {
                    noResults.classList.add('hidden');
                }
            });
        }
        
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                const filtered = filterAndSortDatasets(datasets, searchInput.value, sortSelect.value);
                const newTotalPages = Math.ceil(filtered.length / itemsPerPage);
                currentPage = 1; // Reset to first page when sorting
                renderDatasetsPage(filtered, container, currentPage, itemsPerPage);
                renderPagination(paginationContainer, currentPage, newTotalPages, (page) => {
                    currentPage = page;
                    renderDatasetsPage(filtered, container, currentPage, itemsPerPage);
                });
            });
        }
    } catch (error) {
        console.error('Error loading datasets:', error);
        const loading = document.getElementById('loading-datasets');
        if (loading) loading.classList.add('hidden');
    }
}

// Render datasets for a specific page
function renderDatasetsPage(datasets, container, currentPage, itemsPerPage) {
    container.innerHTML = '';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, datasets.length);
    const paginatedDatasets = datasets.slice(startIndex, endIndex);
    
    renderDatasetsTable(paginatedDatasets, container);
}

// Render datasets table
function renderDatasetsTable(datasets, container) {
    container.innerHTML = '';
    
    datasets.forEach(dataset => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>
                <strong>${dataset.title}</strong>
            </td>
            <td>${dataset.authors.join(', ')}</td>
            <td>${dataset.year}</td>
            <td>${dataset.description.substring(0, 100)}${dataset.description.length > 100 ? '...' : ''}</td>
            <td class="links">
                ${dataset.url ? `<a href="${dataset.url}" target="_blank" class="link-btn" title="Website"><i class="fas fa-external-link-alt"></i></a>` : ''}
                ${dataset.download ? `<a href="${dataset.download}" target="_blank" class="link-btn" title="Download"><i class="fas fa-download"></i></a>` : ''}
                ${dataset.paper ? `<a href="${dataset.paper}" target="_blank" class="link-btn" title="Paper"><i class="fas fa-file-alt"></i></a>` : ''}
            </td>
        `;
        
        container.appendChild(row);
    });
}

// Filter and sort datasets
function filterAndSortDatasets(datasets, searchTerm, sortOption) {
    // Filter datasets based on search term
    const filteredDatasets = datasets.filter(dataset => {
        const term = searchTerm.toLowerCase();
        return dataset.title.toLowerCase().includes(term) || 
               dataset.authors.some(author => author.toLowerCase().includes(term)) ||
               dataset.description.toLowerCase().includes(term) ||
               dataset.year.toString().includes(term);
    });
    
    // Sort datasets based on sort option
    return [...filteredDatasets].sort((a, b) => {
        switch (sortOption) {
            case 'year-desc':
                return b.year - a.year;
            case 'year-asc':
                return a.year - b.year;
            case 'title-asc':
                return a.title.localeCompare(b.title);
            case 'title-desc':
                return b.title.localeCompare(a.title);
            default:
                return b.year - a.year;
        }
    });
}

// Load resources for resources.html
async function loadResources() {
    try {
        // Load tools
        const tools = await fetchJSON('./item-resources', 'tools');
        displayResources(tools, 'tools-list', 'loading-tools', 'no-tools-results');
        
        // Load media (videos & articles)
        const media = await fetchJSON('./item-resources', 'media');
        displayResources(media, 'media-list', 'loading-media', 'no-media-results');
        
        // Set up search functionality
        const searchInput = document.getElementById('search-resources');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                filterResources(tools, 'tools-list', 'no-tools-results', searchInput.value);
                filterResources(media, 'media-list', 'no-media-results', searchInput.value);
            });
        }
    } catch (error) {
        console.error('Error loading resources:', error);
        
        const loadingTools = document.getElementById('loading-tools');
        const loadingMedia = document.getElementById('loading-media');
        
        if (loadingTools) loadingTools.classList.add('hidden');
        if (loadingMedia) loadingMedia.classList.add('hidden');
    }
}

// Display resources (tools or media)
function displayResources(resources, containerId, loadingId, noResultsId) {
    const container = document.getElementById(containerId);
    const loading = document.getElementById(loadingId);
    const noResults = document.getElementById(noResultsId);
    
    if (!container || !loading || !noResults) return;
    
    if (!resources || !resources.length) {
        loading.classList.add('hidden');
        noResults.classList.remove('hidden');
        return;
    }
    
    container.innerHTML = '';
    
    resources.forEach(resource => {
        const li = document.createElement('li');
        li.className = 'resource-item';
        
        li.innerHTML = `
            <h3>${resource.title}</h3>
            <div class="meta">
                ${resource.author ? `<span>By ${resource.author}</span> · ` : ''}
                ${resource.year ? `<span>${resource.year}</span>` : ''}
            </div>
            <p>${resource.description}</p>
            <div class="links">
                <a href="${resource.url}" target="_blank"><i class="fas fa-external-link-alt"></i> View Resource</a>
            </div>
        `;
        
        container.appendChild(li);
    });
    
    loading.classList.add('hidden');
}

// Filter resources
function filterResources(resources, containerId, noResultsId, searchTerm) {
    const container = document.getElementById(containerId);
    const noResults = document.getElementById(noResultsId);
    
    if (!container || !noResults) return;
    
    const filteredResources = resources.filter(resource => {
        const term = searchTerm.toLowerCase();
        return resource.title.toLowerCase().includes(term) || 
               (resource.author && resource.author.toLowerCase().includes(term)) ||
               resource.description.toLowerCase().includes(term);
    });
    
    if (filteredResources.length === 0) {
        container.innerHTML = '';
        noResults.classList.remove('hidden');
    } else {
        displayResources(filteredResources, containerId, null, noResultsId);
        noResults.classList.add('hidden');
    }
}

// Fetch JSON data from a directory manifest
async function fetchJSON(path, category = null) {
  try {
    // 1) grab the manifest of filenames
    const manifestRes = await fetch(`${path}/index.json`);
    if (!manifestRes.ok) {
      console.warn(`No manifest found at ${path}/index.json`);
      return [];
    }
    const names = await manifestRes.json();  // ["foo.json","bar.json",…]
    
    // 2) fetch & parse each entry in parallel
    const results = await Promise.all(
      names.map(async name => {
        try {
          const res = await fetch(`${path}/${name}`);
          const data = await res.json();
          // 3) if category filtering is requested, apply it
          if (category && data.type !== category) return null;
          return data;
        } catch (err) {
          console.error(`Error loading ${name}:`, err);
          return null;
        }
      })
    );
    
    // 4) drop any nulls & return
    return results.filter(item => item);
  } catch (err) {
    console.error('Error in fetchJSON:', err);
    return [];
  }
}

// Infinite scroll implementation for papers and datasets
window.addEventListener('scroll', function() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const bodyHeight = document.body.offsetHeight;
    
    // Implement infinite scroll only when we're near the bottom
    if (scrollPosition >= bodyHeight - 500) {
        // Check which page we're on
        const currentPath = window.location.pathname;
        
        if (currentPath.includes('papers.html')) {
            // Load more papers
            // This is where you would implement the actual logic to load more papers
            console.log('Loading more papers...');
        } else if (currentPath.includes('datasets.html')) {
            // Load more datasets
            // This is where you would implement the actual logic to load more datasets
            console.log('Loading more datasets...');
        } else if (currentPath.includes('resources.html')) {
            // Load more resources based on active tab
            const activeTab = document.querySelector('.tab-btn.active');
            if (activeTab) {
                const target = activeTab.dataset.target;
                console.log('Loading more resources for', target);
            }
        }
    }
});