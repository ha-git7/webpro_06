"use strict";

let number = 0;
const bbs = document.querySelector('#bbs');

// 投稿送信
document.querySelector('#post').addEventListener('click', () => {
    const name = document.querySelector('#name').value;
    const message = document.querySelector('#message').value;
    const image = document.querySelector('#image').files[0];

    const formData = new FormData();
    formData.append('name', name);
    formData.append('message', message);
    if (image) formData.append('image', image);

    const params = {
        method: "POST",
        body: formData
    };

    const url = "/post";
    fetch(url, params)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error');
            }
            return response.json();
        })
        .then((response) => {
            console.log(response);
            document.querySelector('#message').value = "";
            document.querySelector('#name').value = "";
            document.querySelector('#image').value = "";
        });
});

// 投稿チェック
document.querySelector('#check').addEventListener('click', () => {
    const params = {
        method: "POST",
        body: '',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    const url = "/check";
    fetch(url, params)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error');
            }
            return response.json();
        })
        .then((response) => {
            let value = response.number;
            console.log(value);
            if (number != value) {
                const params = {
                    method: "POST",
                    body: 'start=' + number,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };
                const url = "/read";
                fetch(url, params)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('Error');
                        }
                        return response.json();
                    })
                    .then((response) => {
                        number += response.messages.length;
                        for (let mes of response.messages) {
                            let cover = document.createElement('div');
                            cover.className = 'cover';
                            let name_area = document.createElement('span');
                            name_area.className = 'name';
                            name_area.innerText = mes.name;
                            let mes_area = document.createElement('span');
                            mes_area.className = 'mes';
                            mes_area.innerText = mes.message;

                            // 画像があれば表示
                            if (mes.image) {
                                let img = document.createElement('img');
                                img.src = mes.image;
                                img.alt = '投稿画像';
                                img.className = 'post-image';
                                cover.appendChild(img);
                            }

                            // コメントセクション
                            let commentArea = document.createElement('div');
                            commentArea.className = 'comment-area';

                            let commentButton = document.createElement('button');
                            commentButton.className = 'comment-button';
                            commentButton.dataset.id = mes.id;
                            commentButton.innerText = 'コメント';

                            let commentInput = document.createElement('input');
                            commentInput.type = 'text';
                            commentInput.id = `comment-input-${mes.id}`;

                            commentArea.appendChild(commentButton);
                            commentArea.appendChild(commentInput);

                            cover.appendChild(name_area);
                            cover.appendChild(mes_area);
                            cover.appendChild(commentArea);

                            // 削除ボタンを追加
                            let deleteButton = document.createElement('button');
                            deleteButton.className = 'delete-button';
                            deleteButton.innerText = '削除';
                            deleteButton.dataset.id = mes.id;
                            cover.appendChild(deleteButton);

                            // コメント表示
                            if (mes.comments) {
                                for (let comment of mes.comments) {
                                    let commentElem = document.createElement('div');
                                    commentElem.className = 'comment';
                                    commentElem.innerText = comment;
                                    cover.appendChild(commentElem);
                                }
                            }

                            bbs.appendChild(cover);
                        }
                    });
            }
        });
});

// コメント送信
document.querySelector('#bbs').addEventListener('click', (e) => {
    if (e.target.classList.contains('comment-button')) {
        const postId = e.target.dataset.id;
        const commentInput = document.querySelector(`#comment-input-${postId}`);
        const comment = commentInput.value;
        if (comment) {
            const params = {
                method: 'POST',
                body: `id=${postId}&comment=${comment}`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            fetch('/comment', params)
                .then(response => response.json())
                .then((response) => {
                    // コメントを投稿した後、表示
                    addCommentToPost(postId, comment);
                });
        }
    }
});

// 投稿削除
document.querySelector('#bbs').addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-button')) {
        const postId = e.target.dataset.id;
        const params = {
            method: 'POST',
            body: `id=${postId}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        fetch('/delete', params)
            .then(response => response.json())
            .then(() => {
                // 削除後に掲示板を更新
                e.target.closest('.cover').remove();
            });
    }
});
