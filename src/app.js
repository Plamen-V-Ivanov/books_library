import { render } from '../node_modules/lit-html/lit-html.js';
import page from '../node_modules/page/page.mjs';
import { logout } from './api/api.js';
import { getUserData } from './util.js';
import { createPage } from './views/create.js';
import { homePage } from './views/home.js';
import { loginPage } from './views/login.js';
import { myBooksPage } from './views/myBooks.js';
import { registerPage } from './views/register.js';
import { searchPage } from './views/search.js';

let root = document.getElementById('site-content');

document.getElementById('logoutBtn').addEventListener('clock', (e) => {
    logout();
    updateUserNav();
    page.redirect('/');
})

function decorateContext(context, next) {
    context.render = (content) => render(content, root);
    context.updateUserNav = updateUserNav;
    next();
}

export function updateUserNav() {
    let userData = getUserData();
    if (userData) {
        document.getElementById('user').style.display = 'inline-block';
        document.getElementById('guest').style.display = 'none';
        document.querySelector('#user span').textContent = `Welcome, ${userData.email}`;
    } else {
        document.getElementById('user').style.display = 'none';
        document.getElementById('guest').style.display = 'inline-block';
    }
}

page(decorateContext);
page('/', homePage);
page('/login', loginPage);
page('/register', registerPage);
page('/create', createPage);
page('/mybooks', myBooksPage);
page('/search', searchPage);



updateUserNav();

page.start();