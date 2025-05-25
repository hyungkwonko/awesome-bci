// js/script.js
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
        // Initialize particles.js if it exists
        if (typeof particlesJS !== 'undefined' && document.getElementById('hero-particles')) {
            particlesJS("hero-particles", {
                "particles": {
                    "number": {
                        "value": 80,
                        "density": {
                            "enable": true,
                            "value_area": 800
                        }
                    },
                    "color": {
                        "value": "#6200ea"
                    },
                    "shape": {
                        "type": "circle",
                        "stroke": {
                            "width": 0,
                            "color": "#000000"
                        },
                        "polygon": {
                            "nb_sides": 5
                        }
                    },
                    "opacity": {
                        "value": 0.5,
                        "random": false,
                        "anim": {
                            "enable": false,
                            "speed": 1,
                            "opacity_min": 0.1,
                            "sync": false
                        }
                    },
                    "size": {
                        "value": 3,
                        "random": true,
                        "anim": {
                            "enable": false,
                            "speed": 40,
                            "size_min": 0.1,
                            "sync": false
                        }
                    },
                    "line_linked": {
                        "enable": true,
                        "distance": 150,
                        "color": "#9d46ff",
                        "opacity": 0.4,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 2,
                        "direction": "none",
                        "random": false,
                        "straight": false,
                        "out_mode": "out",
                        "bounce": false,
                        "attract": {
                            "enable": false,
                            "rotateX": 600,
                            "rotateY": 1200
                        }
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": true,
                            "mode": "grab"
                        },
                        "onclick": {
                            "enable": true,
                            "mode": "push"
                        },
                        "resize": true
                    },
                    "modes": {
                        "grab": {
                            "distance": 140,
                            "line_linked": {
                                "opacity": 1
                            }
                        },
                        "bubble": {
                            "distance": 400,
                            "size": 40,
                            "duration": 2,
                            "opacity": 8,
                            "speed": 3
                        },
                        "repulse": {
                            "distance": 200,
                            "duration": 0.4
                        },
                        "push": {
                            "particles_nb": 4
                        },
                        "remove": {
                            "particles_nb": 2
                        }
                    }
                },
                "retina_detect": true
            });
        }
        
        loadRecentItems();
        updateStats();
    } else if (currentPath.includes('papers.html')) {
        loadPapers();
    } else if (currentPath.includes('datasets.html')) {
        loadDatasets();
    } else if (currentPath.includes('resources.html')) {
        loadResources();
    }
    
    // Counter animation for stats
    const counters = document.querySelectorAll('.counter');
    
    function animateCounter() {
        counters.forEach(counter => {
            const target = parseInt(counter.textContent, 10);
            const count = parseInt(counter.getAttribute('data-count') || 0, 10);
            const speed = 50; // animation speed
            const inc = target / speed;
            
            if (count < target) {
                counter.setAttribute('data-count', Math.ceil(count + inc));
                counter.textContent = Math.ceil(count + inc);
                setTimeout(animateCounter, 20);
            } else {
                counter.textContent = target;
            }
        });
    }

    // Start counter animation when elements are in view
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.5
        };
        
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        const statsSection = document.querySelector('.stats');
        if (statsSection) {
            observer.observe(statsSection);
        }
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        const statsSection = document.querySelector('.stats');
        if (statsSection) {
            animateCounter();
        }
    }
});

// Render pagination
function renderPagination(container, currentPage, totalPages, onPageChange) {
    if (!container) {
        console.error('Pagination container not found');
        return;
    }
    
    console.log(`Rendering pagination: page ${currentPage} of ${totalPages}`); // Debug log
    
    container.innerHTML = '';
    
    if (totalPages <= 1) {
        return; // No pagination needed
    }
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = `pagination-btn prev ${currentPage === 1 ? 'disabled' : ''}`;
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i> Prev';
    prevBtn.disabled = currentPage === 1;
    
    if (currentPage > 1) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(`Previous button clicked, going to page ${currentPage - 1}`);
            onPageChange(currentPage - 1);
        });
    }
    container.appendChild(prevBtn);
    
    // Page buttons logic
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
        firstPageBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('First page button clicked');
            onPageChange(1);
        });
        container.appendChild(firstPageBtn);
        
        // Ellipsis if needed
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'pagination-ellipsis';
            ellipsis.textContent = '...';
            container.appendChild(ellipsis);
        }
    }
    
    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(`Page ${i} button clicked`);
            onPageChange(i);
        });
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
        lastPageBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Last page button clicked');
            onPageChange(totalPages);
        });
        container.appendChild(lastPageBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = `pagination-btn next ${currentPage === totalPages ? 'disabled' : ''}`;
    nextBtn.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
    nextBtn.disabled = currentPage === totalPages;
    
    if (currentPage < totalPages) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(`Next button clicked, going to page ${currentPage + 1}`);
            onPageChange(currentPage + 1);
        });
    }
    container.appendChild(nextBtn);
}

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
                ${paper.url ? `<a href="${paper.url}" target="_blank"><i class="fas fa-external-link-alt"></i> URL</a>` : ''}
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
        
        if (!container || !loading || !noResults) {
            console.error('Required elements not found');
            return;
        }
        
        if (!papers || !papers.length) {
            loading.classList.add('hidden');
            noResults.classList.remove('hidden');
            return;
        }
        
        // Set up pagination variables
        const itemsPerPage = 10;
        let currentPage = 1;
        let filteredPapers = [...papers].sort((a, b) => b.year - a.year); // Sort by newest first initially

        
        // Function to update pagination and display
        function updatePapersDisplay() {
            const totalPages = Math.ceil(filteredPapers.length / itemsPerPage);
            
            // Ensure current page is valid
            if (currentPage > totalPages && totalPages > 0) {
                currentPage = totalPages;
            } else if (currentPage < 1) {
                currentPage = 1;
            }
            
            renderPapersPage(filteredPapers, container, currentPage, itemsPerPage);
            
            if (paginationContainer && totalPages > 1) {
                renderPagination(paginationContainer, currentPage, totalPages, (page) => {
                    console.log(`Navigating to page ${page}`); // Debug log
                    currentPage = page;
                    updatePapersDisplay();
                });
            } else if (paginationContainer) {
                paginationContainer.innerHTML = ''; // Clear pagination if only one page
            }
            
            // Show/hide no results message
            if (filteredPapers.length === 0) {
                noResults.classList.remove('hidden');
                container.style.display = 'none';
            } else {
                noResults.classList.add('hidden');
                container.style.display = '';
            }
        }
        
        // Initial render
        updatePapersDisplay();
        loading.classList.add('hidden');
        
        // Set up search functionality
        const searchInput = document.getElementById('search-papers');
        const sortSelect = document.getElementById('sort-papers');
        
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                const searchTerm = searchInput.value;
                const sortOption = sortSelect ? sortSelect.value : 'year-desc';
                filteredPapers = filterAndSortPapers(papers, searchTerm, sortOption);
                currentPage = 1; // Reset to first page when searching
                updatePapersDisplay();
            });
        }
        
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                const searchTerm = searchInput ? searchInput.value : '';
                const sortOption = sortSelect.value;
                filteredPapers = filterAndSortPapers(papers, searchTerm, sortOption);
                currentPage = 1; // Reset to first page when sorting
                updatePapersDisplay();
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
    if (!container) {
        console.error('Container not found for rendering papers');
        return;
    }
    
    console.log(`Rendering page ${currentPage} with ${papers.length} total papers`); // Debug log
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, papers.length);
    const paginatedPapers = papers.slice(startIndex, endIndex);
    
    console.log(`Showing papers ${startIndex + 1} to ${endIndex} of ${papers.length}`); // Debug log
    
    renderPapersTable(paginatedPapers, container);
}

// Render papers table - IMPROVED VERSION
function renderPapersTable(papers, container) {
    if (!container) {
        console.error('Container not found for rendering papers table');
        return;
    }
    
    container.innerHTML = '';
    
    // Check if container is a tbody or if we need to create table structure
    const isTableBody = container.tagName === 'TBODY';
    
    papers.forEach(paper => {
        const row = document.createElement('tr');
        row.className = 'paper-row'; // Add class for styling
        
        row.innerHTML = `
            <td>
                <span class="paper-title">${escapeHtml(paper.title)}</span>
            </td>
            <td class="authors-cell">${escapeHtml(paper.authors.join(', '))}</td>
            <td class="year-cell">${paper.year}</td>
            <td class="publication-cell">${escapeHtml(paper.publication)}</td>
            <td class="links-cell">
                ${paper.url ? `<a href="${escapeHtml(paper.url)}" target="_blank" class="link-btn" title="URL" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i></a>` : ''}
                ${paper.pdf ? `<a href="${escapeHtml(paper.pdf)}" target="_blank" class="link-btn" title="PDF" rel="noopener noreferrer"><i class="fas fa-file-pdf"></i></a>` : ''}
                ${paper.code ? `<a href="${escapeHtml(paper.code)}" target="_blank" class="link-btn" title="Code" rel="noopener noreferrer"><i class="fas fa-code"></i></a>` : ''}
            </td>
        `;
        
        container.appendChild(row);
    });
    
    console.log(`Rendered ${papers.length} papers in table`); // Debug log
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
                <span class="dataset-title">${dataset.title}</span>
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

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}