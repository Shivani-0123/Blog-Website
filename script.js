
/* ==========================================
   1. BLOG ARTICLES DATA
========================================== */

const articles = [
    {
        id: 1,
        title: "The Future of Artificial Intelligence",
        category: "Technology",
        date: "2026-10-18",
        author: "Alex Morgan",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=85",
        excerpt: "Discover how artificial intelligence is changing the way we work, learn and interact with technology.",
        content: `
            <p>Artificial Intelligence is transforming the modern world.
            From smart assistants to recommendation systems, AI is becoming
            a part of our everyday lives.</p>
            <h2>How AI is changing our lives</h2>
            <p>AI helps businesses analyze data, automate repetitive tasks
            and provide better customer experiences. Machine learning allows
            computers to identify patterns and make predictions from data.</p>
            <h2>What does the future hold?</h2>
            <p>As AI continues to develop, understanding its benefits,
            limitations and responsible use will become increasingly important.</p>
        `,
        readTime: "5 min read",
        tag: "#ArtificialIntelligence"
    },
    {
        id: 2,
        title: "Building a Healthy Daily Routine",
        category: "Lifestyle",
        date: "2026-10-15",
        author: "Sophia Lee",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=85",
        excerpt: "Small daily habits can improve your focus, energy and overall well-being. Start with simple changes.",
        content: `
            <p>A healthy routine does not need to be complicated.
            Consistent small habits can make a meaningful difference over time.</p>
            <h2>Start with the basics</h2>
            <p>Try maintaining a regular sleep schedule, drinking enough water,
            eating balanced meals and including movement in your day.</p>
            <h2>Stay consistent</h2>
            <p>Choose habits that fit your lifestyle. Track your progress and
            remember that consistency is more important than perfection.</p>
        `,
        readTime: "4 min read",
        tag: "#HealthyHabits"
    },
    {
        id: 3,
        title: "A Beginner's Guide to Web Development",
        category: "Technology",
        date: "2026-10-12",
        author: "Daniel Carter",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=85",
        excerpt: "Learn how HTML, CSS and JavaScript work together to create interactive and beautiful websites.",
        content: `
            <p>Web development is the process of building websites and web
            applications. You can start learning it with three fundamental
            technologies.</p>
            <h2>HTML, CSS and JavaScript</h2>
            <p>HTML creates the structure of a page. CSS controls its
            appearance, while JavaScript adds interaction and dynamic
            functionality.</p>
            <h2>Build real projects</h2>
            <p>Start with a portfolio, a blog website or a task manager.
            Building projects helps you understand how different concepts
            work together.</p>
        `,
        readTime: "6 min read",
        tag: "#WebDevelopment"
    },
    {
        id: 4,
        title: "Beautiful Places Every Traveller Should Explore",
        category: "Travel",
        date: "2026-10-09",
        author: "Emma Wilson",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85",
        excerpt: "Explore the beauty of mountains, peaceful landscapes and memorable journeys around the world.",
        content: `
            <p>Travelling gives us an opportunity to explore new places,
            meet people and experience different cultures.</p>
            <h2>Plan your next adventure</h2>
            <p>Choose a destination that matches your interests and budget.
            Research local transport, weather and places worth visiting.</p>
            <h2>Travel thoughtfully</h2>
            <p>Respect local communities, protect natural environments
            and take time to appreciate the journey.</p>
        `,
        readTime: "5 min read",
        tag: "#TravelDiaries"
    },
    {
        id: 5,
        title: "The Principles of Minimalist Design",
        category: "Design",
        date: "2026-10-06",
        author: "Olivia Brown",
        image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=85",
        excerpt: "Discover how clean layouts, thoughtful spacing and visual hierarchy make digital experiences better.",
        content: `
            <p>Minimalist design focuses on clarity and purpose.
            Instead of adding unnecessary elements, it highlights
            what matters most.</p>
            <h2>Less clutter, more clarity</h2>
            <p>Use consistent spacing, readable typography and a limited
            colour palette. Give important elements room to stand out.</p>
            <h2>Design for people</h2>
            <p>A good design is not only attractive. It should also be
            accessible, responsive and easy to navigate.</p>
        `,
        readTime: "4 min read",
        tag: "#UIUXDesign"
    },
    {
        id: 6,
        title: "Why Learning Never Goes Out of Style",
        category: "Lifestyle",
        date: "2026-10-02",
        author: "James Taylor",
        image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=85",
        excerpt: "Develop a learning mindset and discover practical ways to build knowledge throughout your life.",
        content: `
            <p>Learning is a lifelong process that helps us adapt,
            solve problems and discover new opportunities.</p>
            <h2>Make learning a habit</h2>
            <p>Read regularly, practise new skills and ask questions.
            Breaking a difficult topic into smaller pieces makes it
            easier to understand.</p>
            <h2>Put knowledge into practice</h2>
            <p>Projects, discussions and real-world challenges help turn
            information into useful skills.</p>
        `,
        readTime: "3 min read",
        tag: "#LifelongLearning"
    }
];


/* Load saved articles and dashboard changes */

try {
    const custom = JSON.parse(
        localStorage.getItem("blogCustomArticles") || "[]"
    );

    const edited = JSON.parse(
        localStorage.getItem("blogEditedArticles") || "{}"
    );

    const deleted = JSON.parse(
        localStorage.getItem("blogDeletedArticles") || "[]"
    );

    for (let i = articles.length - 1; i >= 0; i--) {
        const id = articles[i].id;

        if (deleted.includes(id)) {
            articles.splice(i, 1);
        } else if (edited[id]) {
            Object.assign(articles[i], edited[id]);
        }
    }

    custom.forEach(article => {
        if (!deleted.includes(article.id)) {
            articles.push(article);
        }
    });
} catch (error) {
    console.error("Could not load saved blog articles:", error);
}


/* ==========================================
   2. SELECT HTML ELEMENTS
========================================== */

const blogGrid = document.getElementById("blogGrid");
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const categoryList = document.getElementById("categoryList");
const articleCount = document.getElementById("articleCount");
const noResults = document.getElementById("noResults");
const loadMoreButton = document.getElementById("loadMore");

let selectedCategory = "All";
let visibleArticles = 6;
const articlesPerLoad = 3;


/* ==========================================
   3. FORMAT DATE
========================================== */

function formatDate(dateString) {
    const date = new Date(dateString + "T12:00:00");

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}


/* ==========================================
   4. DISPLAY BLOG CARDS
========================================== */

function displayArticles() {
    if (!blogGrid) return;
    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredArticles = articles.filter(article => {
        const matchesCategory =
            selectedCategory === "All" ||
            article.category === selectedCategory;

        const searchableText = [
            article.title,
            article.category,
            article.author,
            article.excerpt,
            article.tag
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    const articlesToShow = filteredArticles.slice(0, visibleArticles);

    blogGrid.innerHTML = articlesToShow.map(article => `
        <article class="blog-card">
            <div class="blog-card-image-wrap">
                <img
                    class="blog-card-image"
                    src="${article.image}"
                    alt="${article.title}"
                    loading="lazy"
                >
            </div>

            <div class="blog-card-content">
                <div class="blog-card-meta">
                    <span class="blog-category">
                        ${article.category}
                    </span>
                    <span>${formatDate(article.date)}</span>
                </div>

                <h3>
                    <a href="article.html?id=${article.id}">
                        ${article.title}
                    </a>
                </h3>

                <p>${article.excerpt}</p>

                <div class="card-bottom">
                    <span class="card-tag">${article.tag}</span>
                    <a class="read-more"
                       href="article.html?id=${article.id}">
                        Read More →
                    </a>
                </div>
            </div>
        </article>
    `).join("");

    articleCount.textContent =
        `${filteredArticles.length} ${
            filteredArticles.length === 1 ? "article" : "articles"
        }`;

    noResults.hidden = filteredArticles.length !== 0;

    loadMoreButton.hidden =
        visibleArticles >= filteredArticles.length;
}


/* ==========================================
   5. SEARCH ARTICLES
========================================== */
if (searchInput) {
    searchInput.addEventListener("input", () => {
        visibleArticles = articlesPerLoad;
        displayArticles();
    });
}

if (clearSearch) {
    clearSearch.addEventListener("click", () => {
        if (searchInput) {
            searchInput.value = "";
        }

        visibleArticles = articlesPerLoad;
        displayArticles();

        if (searchInput) {
            searchInput.focus();
        }
    });
}

/* ==========================================
   6. FILTER BY CATEGORY
========================================== */

if (categoryList) {
    categoryList.addEventListener("click", event => {
        const button = event.target.closest(".category-btn");

        if (!button) return;

        selectedCategory = button.dataset.category;
        visibleArticles = articlesPerLoad;

        document.querySelectorAll(".category-btn").forEach(btn => {
            btn.classList.toggle("active", btn === button);
        });

        displayArticles();
    });
}


/* ==========================================
   7. LOAD MORE ARTICLES
========================================== */

if (loadMoreButton) {
    loadMoreButton.addEventListener("click", () => {
        visibleArticles += articlesPerLoad;
        displayArticles();
    });
}

/* ==========================================
   8. DARK MODE
========================================== */

const themeToggle = document.getElementById("themeToggle");

function updateThemeButton() {
    if (!themeToggle) return;

    const isDark = document.body.classList.contains("dark-mode");

    themeToggle.textContent = isDark ? "☀️" : "🌙";

    themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
    );
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        const isDark = document.body.classList.contains("dark-mode");

        try {
            localStorage.setItem("blogTheme", isDark ? "dark" : "light");
        } catch (error) {
            // Theme still works if browser storage is unavailable.
        }

        updateThemeButton();
    });
}

try {
    if (localStorage.getItem("blogTheme") === "dark") {
        document.body.classList.add("dark-mode");
    }
} catch (error) {
    // Use the default light theme.
}

updateThemeButton();


/* ==========================================
   9. MOBILE NAVIGATION
========================================== */


const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "☰";
        });
    });
}



/* ==========================================
   10. NEWSLETTER DEMO
========================================== */


const newsletterForm = document.getElementById("newsletterForm");
const newsletterEmail = document.getElementById("newsletterEmail");
const newsletterMessage = document.getElementById("newsletterMessage");

if (newsletterForm && newsletterEmail && newsletterMessage) {
    newsletterForm.addEventListener("submit", event => {
        event.preventDefault();

        if (!newsletterEmail.checkValidity()) {
            newsletterEmail.reportValidity();
            return;
        }

        newsletterMessage.textContent =
            "Thanks for your interest! This is a demo form; no subscription was saved.";

        newsletterForm.reset();
    });
}



/* ==========================================
   11. INITIALIZE WEBSITE
========================================== */

displayArticles();


/* ==========================================
   12. BOOKMARK / SAVE ARTICLES
========================================== */

const BOOKMARK_KEY = "blogSpaceBookmarks";

function getBookmarks() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(BOOKMARK_KEY) || "[]"
        );

        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        return [];
    }
}

function saveBookmarks(bookmarks) {
    try {
        localStorage.setItem(
            BOOKMARK_KEY,
            JSON.stringify(bookmarks)
        );
        return true;
    } catch (error) {
        alert("Unable to save bookmarks in this browser.");
        return false;
    }
}

function isBookmarked(articleId) {
    return getBookmarks().includes(Number(articleId));
}

function toggleBookmark(articleId) {
    const id = Number(articleId);
    const bookmarks = getBookmarks();

    const updated = bookmarks.includes(id)
        ? bookmarks.filter(savedId => savedId !== id)
        : [...bookmarks, id];

    if (!saveBookmarks(updated)) return;

    displayArticles();

    // Update the article-page button if one exists.
    const articleBookmark = document.getElementById("articleBookmark");

    if (articleBookmark) {
        updateArticleBookmarkButton(articleBookmark, id);
    }
}

function updateArticleBookmarkButton(button, id) {
    const saved = isBookmarked(id);

    button.textContent = saved
        ? "♥ Saved"
        : "♡ Save Article";

    button.setAttribute("aria-pressed", String(saved));
}

function addBookmarkButtonStyles() {
    if (document.getElementById("bookmarkStyles")) return;

    const styles = document.createElement("style");
    styles.id = "bookmarkStyles";

    styles.textContent = `
        .bookmark-btn {
            border: 1px solid var(--border);
            border-radius: 9px;
            padding: 8px 12px;
            background: var(--card);
            color: var(--text);
            font-weight: 600;
            cursor: pointer;
            transition: background .2s, color .2s;
        }

        .bookmark-btn:hover {
            border-color: var(--primary);
            color: var(--primary);
        }

        .bookmark-btn[aria-pressed="true"] {
            color: #d94668;
            border-color: #d94668;
        }

        .saved-page-link {
            display: inline-block;
            color: var(--primary);
            font-weight: 700;
            margin-bottom: 20px;
        }
    `;

    document.head.appendChild(styles);
}

function addBookmarkButtonsToCards() {
    const cards = document.querySelectorAll(".blog-card");

    cards.forEach(card => {
        const link = card.querySelector(
            'a[href*="article.html?id="]'
        );

        if (!link) return;

        const url = new URL(link.href);
        const id = Number(url.searchParams.get("id"));

        if (!id) return;

        let button = card.querySelector(".bookmark-btn");

        if (!button) {
            const bottom = card.querySelector(".card-bottom");

            if (!bottom) return;

            button = document.createElement("button");
            button.type = "button";
            button.className = "bookmark-btn";

            bottom.appendChild(button);

            button.addEventListener("click", () => {
                toggleBookmark(id);
            });
        }

        updateArticleBookmarkButton(button, id);
    });
}

// Wrap the existing renderer without removing its search or filters.
if (typeof displayArticles === "function") {
    const originalDisplayArticles = displayArticles;

    displayArticles = function () {
        originalDisplayArticles();
        addBookmarkButtonsToCards();
    };
}

addBookmarkButtonStyles();

// Show a link to the saved articles page on the homepage.
if (
    document.getElementById("blogGrid") &&
    !document.getElementById("savedArticlesLink")
) {
    const savedLink = document.createElement("a");

    savedLink.id = "savedArticlesLink";
    savedLink.className = "saved-page-link";
    savedLink.href = "saved.html";
    savedLink.textContent = "♥ View Saved Articles";

    const grid = document.getElementById("blogGrid");

    grid.parentNode.insertBefore(savedLink, grid);
}

// Run after adding bookmark support.
if (document.getElementById("blogGrid")) {
    displayArticles();
}
