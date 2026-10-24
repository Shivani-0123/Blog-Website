
/* ==========================================
   1. STORAGE HELPERS
========================================== */

const CUSTOM_KEY = "blogCustomArticles";
const EDITED_KEY = "blogEditedArticles";
const DELETED_KEY = "blogDeletedArticles";

function readStorage(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        return fallback;
    }
}

function saveStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        alert("Unable to save. Browser storage may be full.");
        return false;
    }
}

function getAllArticles() {
    const custom = readStorage(CUSTOM_KEY, []);
    const edited = readStorage(EDITED_KEY, {});
    const deleted = readStorage(DELETED_KEY, []);

    const defaults = articles
        .filter(article => !deleted.includes(article.id))
        .map(article => ({
            ...article,
            ...(edited[article.id] || {})
        }));

    return [...defaults, ...custom.filter(article =>
        !deleted.includes(article.id)
    )];
}


/* ==========================================
   2. SELECT ELEMENTS
========================================== */

const articleForm = document.getElementById("articleForm");
const editIdInput = document.getElementById("editId");
const postTitle = document.getElementById("postTitle");
const postCategory = document.getElementById("postCategory");
const postAuthor = document.getElementById("postAuthor");
const postImage = document.getElementById("postImage");
const postExcerpt = document.getElementById("postExcerpt");
const postContent = document.getElementById("postContent");

const formHeading = document.getElementById("formHeading");
const saveButton = document.getElementById("saveArticle");
const cancelEdit = document.getElementById("cancelEdit");
const adminMessage = document.getElementById("adminMessage");
const adminArticleList = document.getElementById("adminArticleList");
const adminSearch = document.getElementById("adminSearch");
const totalArticles = document.getElementById("totalArticles");
const customArticles = document.getElementById("customArticles");


/* ==========================================
   3. HELPERS
========================================== */

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function getCustomArticles() {
    return readStorage(CUSTOM_KEY, []);
}

function getNextArticleId() {
    const all = getAllArticles();

    return all.reduce(
        (maximum, article) => Math.max(maximum, Number(article.id) || 0),
        0
    ) + 1;
}

function makeSafeArticleContent(text) {
    return text
        .trim()
        .split(/\n\s*\n/)
        .filter(paragraph => paragraph.trim())
        .map(paragraph => `<p>${escapeHTML(paragraph).replace(/\n/g, "<br>")}</p>`)
        .join("");
}

function getPlainArticleContent(html) {
    const temp = document.createElement("div");
    temp.innerHTML = html;

    return temp.innerText || temp.textContent || "";
}

function isValidImageURL(value) {
    try {
        const url = new URL(value);

        return url.protocol === "https:" || url.protocol === "http:";
    } catch (error) {
        return false;
    }
}


/* ==========================================
   4. RESET FORM
========================================== */

function resetArticleForm() {
    articleForm.reset();
    editIdInput.value = "";
    formHeading.textContent = "Create a New Article";
    saveButton.textContent = "Publish Article";
    cancelEdit.hidden = true;
}


/* ==========================================
   5. CREATE OR UPDATE ARTICLE
========================================== */

articleForm.addEventListener("submit", event => {
    event.preventDefault();

    const title = postTitle.value.trim();
    const category = postCategory.value;
    const author = postAuthor.value.trim();
    const image = postImage.value.trim();
    const excerpt = postExcerpt.value.trim();
    const contentText = postContent.value.trim();

    if (!title || !author || !excerpt || !contentText) {
        adminMessage.textContent = "Please complete all fields.";
        return;
    }

    if (!isValidImageURL(image)) {
        adminMessage.textContent =
            "Please enter a valid HTTP or HTTPS image URL.";
        return;
    }

    const editingId = editIdInput.value
        ? Number(editIdInput.value)
        : null;

    const allArticles = getAllArticles();

    const existingArticle = editingId
        ? allArticles.find(article => article.id === editingId)
        : null;

    if (editingId && !existingArticle) {
        adminMessage.textContent = "Article not found.";
        return;
    }

    const updatedArticle = {
        id: editingId || getNextArticleId(),
        title,
        category,
        author,
        image,
        excerpt,
        content: makeSafeArticleContent(contentText),
        date: existingArticle?.date ||
            new Date().toISOString().slice(0, 10),
        readTime: `${Math.max(1, Math.ceil(contentText.split(/\s+/).length / 200))} min read`,
        tag: "#" + category.replace(/\s+/g, "")
    };

    if (editingId) {
        const custom = getCustomArticles();
        const customIndex = custom.findIndex(
            article => article.id === editingId
        );

        if (customIndex !== -1) {
            custom[customIndex] = updatedArticle;

            if (!saveStorage(CUSTOM_KEY, custom)) return;
        } else {
            const edited = readStorage(EDITED_KEY, {});
            edited[editingId] = updatedArticle;

            if (!saveStorage(EDITED_KEY, edited)) return;
        }

        adminMessage.textContent = "Article updated successfully!";
    } else {
        const custom = getCustomArticles();
        custom.unshift(updatedArticle);

        if (!saveStorage(CUSTOM_KEY, custom)) return;

        adminMessage.textContent = "Article published successfully!";
    }

    resetArticleForm();
    renderAdminArticles();
});


/* ==========================================
   6. DISPLAY ARTICLES IN DASHBOARD
========================================== */

function renderAdminArticles() {
    const all = getAllArticles();
    const custom = getCustomArticles();
    const query = adminSearch.value.trim().toLowerCase();

    const filtered = all.filter(article =>
        `${article.title} ${article.category} ${article.author}`
            .toLowerCase()
            .includes(query)
    );

    totalArticles.textContent = all.length;
    customArticles.textContent = custom.filter(article =>
        !readStorage(DELETED_KEY, []).includes(article.id)
    ).length;

    if (filtered.length === 0) {
        adminArticleList.innerHTML =
            "<p>No articles found. Try another search.</p>";
        return;
    }

    adminArticleList.innerHTML = filtered.map(article => `
        <div class="admin-article">
            <img src="${escapeHTML(article.image)}"
                 alt="${escapeHTML(article.title)}">

            <div class="admin-article-info">
                <h3>${escapeHTML(article.title)}</h3>
                <p>${escapeHTML(article.category)} ·
                   ${escapeHTML(article.author)}</p>
                <p>${custom.some(item => item.id === article.id)
                    ? "Custom article"
                    : "Built-in article"}</p>
            </div>

            <div class="admin-article-actions">
                <button type="button"
                        data-action="edit"
                        data-id="${article.id}">
                    Edit
                </button>

                <button type="button"
                        class="delete-btn"
                        data-action="delete"
                        data-id="${article.id}">
                    Delete
                </button>
            </div>
        </div>
    `).join("");
}


/* ==========================================
   7. EDIT ARTICLE
========================================== */

adminArticleList.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;
    const article = getAllArticles().find(item => item.id === id);

    if (!article) return;

    if (action === "edit") {
        editIdInput.value = article.id;
        postTitle.value = article.title;
        postCategory.value = article.category;
        postAuthor.value = article.author;
        postImage.value = article.image;
        postExcerpt.value = article.excerpt;
        postContent.value = getPlainArticleContent(article.content);

        formHeading.textContent = "Edit Article";
        saveButton.textContent = "Save Changes";
        cancelEdit.hidden = false;
        adminMessage.textContent = "";

        articleForm.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    if (action === "delete") {
        const confirmed = confirm(
            `Are you sure you want to delete "${article.title}"?`
        );

        if (!confirmed) return;

        const deleted = readStorage(DELETED_KEY, []);

        if (!deleted.includes(id)) {
            deleted.push(id);
        }

        if (!saveStorage(DELETED_KEY, deleted)) return;

        adminMessage.textContent = "Article deleted.";
        resetArticleForm();
        renderAdminArticles();
    }
});


/* ==========================================
   8. CANCEL EDIT
========================================== */

cancelEdit.addEventListener("click", () => {
    resetArticleForm();
    adminMessage.textContent = "";
});


/* ==========================================
   9. SEARCH DASHBOARD
========================================== */

adminSearch.addEventListener("input", renderAdminArticles);


/* ==========================================
   10. INITIALIZE DASHBOARD
========================================== */

renderAdminArticles();


// Automatically create a sample test article
document.getElementById("createTestArticle").addEventListener("click", () => {
    const testTitle = "My First Blog Post: Learning Web Development";

    // Prevent creating the same test article repeatedly
    const alreadyExists = getAllArticles().some(
        article => article.title === testTitle
    );

    if (alreadyExists) {
        adminMessage.textContent =
            "Test article already exists! Check Manage Articles.";
        return;
    }

    postTitle.value = testTitle;
    postCategory.value = "Technology";
    postAuthor.value = "BlogSpace Admin";
    postImage.value =
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=85";
    postExcerpt.value =
        "Learn HTML, CSS and JavaScript by building real-world projects. This is my first test article on BlogSpace.";

    postContent.value = `Today I started building my own blog website using HTML, CSS and JavaScript.

HTML provides the structure of a website. CSS makes the website attractive and responsive. JavaScript adds interactive features such as search, category filters and dynamic content.

Building projects is a great way to practise programming and understand how different technologies work together.

My next goal is to connect BlogSpace to a database and make it a complete full-stack application.`;

    // Submit using the existing create-article functionality
    articleForm.requestSubmit();
});
