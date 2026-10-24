
/* ==========================================
   1. GET ARTICLE FROM URL
========================================== */

const articleContent = document.getElementById("articleContent");
const relatedGrid = document.getElementById("relatedGrid");

const articleId = Number(
    new URLSearchParams(window.location.search).get("id")
);

const currentArticle = articles.find(article => article.id === articleId);


/* ==========================================
   2. DISPLAY ARTICLE
========================================== */

function showArticle() {
    if (!currentArticle) {
        document.title = "Article Not Found | BlogSpace";

        articleContent.innerHTML = `
            <h1 class="article-title">Article Not Found</h1>
            <p>Sorry, this article does not exist.</p>
            <p><a class="text-link" href="index.html#articles">
                ← Return to all articles
            </a></p>
        `;

        document.querySelector(".share-section").hidden = true;
        document.querySelector(".comments-section").hidden = true;
        document.querySelector(".related-section").hidden = true;
        return;
    }

    document.title = `${currentArticle.title} | BlogSpace`;

    articleContent.innerHTML = `
        <span class="eyebrow">${currentArticle.category.toUpperCase()}</span>

        <h1 class="article-title">${currentArticle.title}</h1>

        <div class="article-meta">
            <span>By ${currentArticle.author}</span>
            <span>${formatDate(currentArticle.date)}</span>
            <span>${currentArticle.readTime}</span>
        </div>

        <p class="article-excerpt">${currentArticle.excerpt}</p>

        <img
            class="article-cover"
            src="${currentArticle.image}"
            alt="${currentArticle.title}"
        >

        <div class="article-body">
            ${currentArticle.content}
        </div>

        <p class="card-tag">${currentArticle.tag}</p>
    `;

    showRelatedArticles();
}


/* ==========================================
   3. RELATED ARTICLES
========================================== */

function showRelatedArticles() {
    const relatedArticles = articles
        .filter(article =>
            article.id !== currentArticle.id &&
            article.category === currentArticle.category
        )
        .slice(0, 2);

    // If the same category has fewer than two articles,
    // fill the remaining spaces with other articles.
    if (relatedArticles.length < 2) {
        const extraArticles = articles
            .filter(article =>
                article.id !== currentArticle.id &&
                !relatedArticles.some(
                    related => related.id === article.id
                )
            )
            .slice(0, 2 - relatedArticles.length);

        relatedArticles.push(...extraArticles);
    }

    relatedGrid.innerHTML = relatedArticles.map(article => `
        <article class="related-card">
            <a href="article.html?id=${article.id}">
                <img src="${article.image}"
                     alt="${article.title}" loading="lazy">
            </a>

            <div class="related-card-content">
                <span class="blog-category">${article.category}</span>

                <h3>
                    <a href="article.html?id=${article.id}">
                        ${article.title}
                    </a>
                </h3>

                <p>${article.excerpt}</p>
            </div>
        </article>
    `).join("");
}


/* ==========================================
   4. SHARE ARTICLE
========================================== */

const shareMessage = document.getElementById("shareMessage");

function getShareUrl() {
    return window.location.href;
}

function getShareText() {
    return currentArticle
        ? `${currentArticle.title} - BlogSpace`
        : "Read more on BlogSpace";
}

document.getElementById("shareNative").addEventListener("click", async () => {
    if (!currentArticle) return;

    if (navigator.share) {
        try {
            await navigator.share({
                title: currentArticle.title,
                text: currentArticle.excerpt,
                url: getShareUrl()
            });
        } catch (error) {
            if (error.name !== "AbortError") {
                shareMessage.textContent = "Sharing is unavailable.";
            }
        }
    } else {
        shareMessage.textContent =
            "Use Copy Link to share this article.";
    }
});


/* ==========================================
   5. WHATSAPP SHARING
========================================== */

document.getElementById("shareWhatsApp").addEventListener("click", () => {
    if (!currentArticle) return;

    const message = `${getShareText()}\n${getShareUrl()}`;

    const whatsappUrl =
        `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});


/* ==========================================
   6. COPY ARTICLE LINK
========================================== */

document.getElementById("copyLink").addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(getShareUrl());
        shareMessage.textContent = "Article link copied!";
    } catch (error) {
        shareMessage.textContent =
            "Copy is unavailable here. Copy the URL from your browser.";
    }
});


/* ==========================================
   7. COMMENTS
========================================== */

const commentForm = document.getElementById("commentForm");
const commentName = document.getElementById("commentName");
const commentText = document.getElementById("commentText");
const commentsList = document.getElementById("commentsList");
const commentMessage = document.getElementById("commentMessage");

function getCommentsKey() {
    return `blogComments_${articleId}`;
}

function readComments() {
    try {
        const saved = localStorage.getItem(getCommentsKey());
        const parsed = saved ? JSON.parse(saved) : [];

        return Array.isArray(parsed) ? parsed.filter(comment =>
            comment &&
            typeof comment.name === "string" &&
            typeof comment.text === "string" &&
            typeof comment.date === "string"
        ) : [];
    } catch (error) {
        return [];
    }
}

function displayComments() {
    const comments = readComments();

    if (comments.length === 0) {
        commentsList.innerHTML = "<p>No comments yet. Be the first!</p>";
        return;
    }

    commentsList.innerHTML = comments.map(comment => `
        <div class="comment-item">
            <h4>${escapeHTML(comment.name)}</h4>
            <p>${escapeHTML(comment.text)}</p>
            <small>${escapeHTML(comment.date)}</small>
        </div>
    `).join("");
}

function escapeHTML(value) {
    return value.replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

commentForm.addEventListener("submit", event => {
    event.preventDefault();

    if (!currentArticle) return;

    const name = commentName.value.trim();
    const text = commentText.value.trim();

    if (!name || !text) {
        commentMessage.textContent =
            "Please enter your name and comment.";
        return;
    }

    const comments = readComments();

    comments.unshift({
        name: name.slice(0, 60),
        text: text.slice(0, 1000),
        date: new Date().toLocaleDateString()
    });

    try {
        localStorage.setItem(getCommentsKey(), JSON.stringify(comments));
        commentForm.reset();
        commentMessage.textContent = "Your comment has been posted!";
        displayComments();
    } catch (error) {
        commentMessage.textContent =
            "Unable to save your comment in this browser.";
    }
});


/* ==========================================
   8. INITIALIZE ARTICLE PAGE
========================================== */

if (currentArticle) {
    showArticle();
    displayComments();
} else {
    showArticle();
}


/* ==========================================
   9. DARK MODE ON ARTICLE PAGE
========================================== */

const articleThemeToggle = document.getElementById("themeToggle");

function updateArticleThemeButton() {
    const isDark = document.body.classList.contains("dark-mode");

    articleThemeToggle.textContent = isDark ? "☀️" : "🌙";
    articleThemeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
    );
}

try {
    if (localStorage.getItem("blogTheme") === "dark") {
        document.body.classList.add("dark-mode");
    }
} catch (error) {
    // Continue with the default theme.
}

updateArticleThemeButton();

articleThemeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    try {
        localStorage.setItem(
            "blogTheme",
            document.body.classList.contains("dark-mode") ? "dark" : "light"
        );
    } catch (error) {
        // Theme toggle still works without storage.
    }

    updateArticleThemeButton();
});
