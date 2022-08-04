import { html } from '../../node_modules/lit-html/lit-html.js';
import { deleteBook, getBookById, getLikesByBookId, getMyLikesByBookId, likeBook } from '../api/data.js';
import { getUserData } from '../util.js';

let detailsTemplate = (book, isOwner, onDelete, likes, showLikeButton, onLike) => html`
<section id="details-page" class="details">
    <div class="book-information">
        <h3>${book.title}</h3>
        <p class="type">Type: ${book.type}</p>
        <p class="img"><img src=${book.imageUrl}></p>
        <div class="actions">
            ${bookControlsTemplate(book, isOwner, onDelete)}
            ${likesControlsTemplate(showLikeButton, onLike)}
            <div class="likes">
                <img class="hearts" src="/images/heart.png">
                <span id="total-likes">Likes: ${likes}</span>
            </div>
        </div>
    </div>
    <div class="book-description">
        <h3>Description:</h3>
        <p>${book.description}</p>
    </div>
</section>
`;

let bookControlsTemplate = (book, isOwner, onDelete) => {
    if (isOwner) {
        return html`<a class="button" href="/edit/${book._id}">Edit</a>
<a @click="${onDelete}" class="button" href="javascript:void(0)">Delete</a>`;
    } else {
        return null;
    }
}

let likesControlsTemplate = (showLikeButton, onLike) => {
    if (showLikeButton) {
        return html`<a @click="${onLike}" class="button" href="javascript:void(0)">Like</a>`;
    } else {
        return null;
    }
}


export async function detailsPage(context) {
    let userData = getUserData();
    let [book, likes, hasLikes] = await Promise.all([
        getBookById(context.params.id),
        getLikesByBookId(context.params.id),
        userData ? getMyLikesByBookId(context.params.id, userData.id): 0,

    ]);

    let isOwner = userData && userData.id == book._ownerId;
    let showLikeButton = isOwner == false && hasLikes == false && userData != null;

    context.render(detailsTemplate(book, isOwner, onDelete, likes, showLikeButton, onLike));

    async function onDelete() {
        await deleteBook(context.params.id);
        context.page.redirect('/');
    }

    async function onLike() {
        await likeBook(context.params.id);
        context.page.redirect('/details/' + context.params.id);
    }

}