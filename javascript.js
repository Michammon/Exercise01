document.addEventListener('DOMContentLoaded', function () {
    const postsContainer = document.getElementById('posts-container');
    const paginationContainer = document.getElementById('pagination-container');

    const postsPerPage = 10;
    let currentPage = 1;
    let totalPosts = 100; // Initial total number of posts

    // Pobierz dane z API przy ładowaniu strony
    fetchData();

    async function fetchData() {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${currentPage}&_limit=${postsPerPage}`);
            const userData = await fetch('https://jsonplaceholder.typicode.com/users'); // Fetch user data

            if (!response.ok || !userData.ok) {
                throw new Error("Could not fetch resource");
            }

            const postData = await response.json();
            const usersData = await userData.json(); // Extract user data

            displayPosts(postData, usersData);
            setupPagination();
        } catch (error) {
            console.error(error);
        }
    }

    function displayPosts(posts, users) {
        postsContainer.innerHTML = '';

        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.id = `post-${post.id}`;

            const titleElement = document.createElement('h2');
            titleElement.textContent = post.title;

            const authorElement = document.createElement('p');
            const user = users.find(user => user.id === post.userId); // Find the user corresponding to the post
            authorElement.textContent = `Author: ${user ? user.name : 'Unknown'}`; // Display user's name, or 'Unknown' if not found

            const bodyElement = document.createElement('p');
            bodyElement.textContent = `Body: ${post.body}`;

            // hidden text show text
            const halfText = post.body.substring(0, post.body.length / 2);
            bodyElement.innerHTML = `<span class="visible-text">${halfText}</span><span class="hidden-text">${post.body}</span>`;

            const readMoreBtn = document.createElement('span');
            readMoreBtn.classList.add('read-more');
            readMoreBtn.textContent = 'Show More';
            readMoreBtn.addEventListener('click', function () {
                bodyElement.classList.toggle('show-full');
                readMoreBtn.textContent = bodyElement.classList.contains('show-full') ? 'Show Less' : 'Show More';
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Usuń newsa';
            deleteButton.onclick = () => deletePost(post.id);

            postElement.appendChild(titleElement);
            postElement.appendChild(authorElement);
            postElement.appendChild(bodyElement);
            postElement.appendChild(deleteButton);
            postElement.appendChild(readMoreBtn);

            postsContainer.appendChild(postElement);
        });
    }

    function setupPagination() {
        paginationContainer.innerHTML = '';

        const totalPages = Math.ceil(totalPosts / postsPerPage); // Zakładamy 100 postów w API

        const prevButton = createPaginationButton('Previous', () => changePage(currentPage - 1));
        paginationContainer.appendChild(prevButton);

        for (let i = 1; i <= totalPages; i++) {
            const button = createPaginationButton(i, () => changePage(i));
            paginationContainer.appendChild(button);
        }

        const nextButton = createPaginationButton('Next', () => changePage(currentPage + 1));
        paginationContainer.appendChild(nextButton);
    }

    function createPaginationButton(content, onClick) {
        const button = document.createElement('button');
        button.textContent = content;
        button.onclick = onClick;
        return button;
    }

    function changePage(newPage) {
        if (newPage >= 1 && newPage <= Math.ceil(totalPosts / postsPerPage)) {
            currentPage = newPage;
            fetchData();
        }
    }

    function deletePost(postId) {
        const postElement = document.getElementById(`post-${postId}`);
        if (postElement) {
            postElement.style.display = 'none';
            totalPosts--; // Decrement the total number of posts
            console.log(`Usunięto post o ID: ${postId}`);
            setupPagination(); // Update pagination after deletion
        } else {
            console.log(`Nie można odnaleźć posta o ID: ${postId}`);
        }
    }
});




