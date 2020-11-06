const { db } = require('../util/admin');
// const { fieldValue } = require('../util/admin');
// const firebase = require('firebase');
// const admin = require('../util/admin');

// Get All Posts
exports.getAllPosts = (req, res) => {
    db.collection('posts').orderBy('createdAt', 'desc').get()
        .then((data) => {
            let posts = [];
            data.forEach((doc) => {
                posts.push({
                    postId: doc.id,
                    ...doc.data()
                });
            });
            return res.json(posts);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        }
        );
}
// Post one post
exports.postOnePost = (req, res) => {
    if (req.body.body.trim() === '') {
        return res.status(400).json({ body: 'Body must not be empty' });
    }
    const newPost = {
        body: req.body.body,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl,
        createdAt: new Date().toISOString(),
        likes: 0,
        userslike: [],
        commentCount: 0
    };
    db.collection('posts').add(newPost)
        .then((doc) => {
            const resPost = newPost;
            resPost.postId = doc.id;
            res.json(newPost);
        })
        .catch((err) => {
            res.status(500).json({ error: 'something went wrong' });
            console.error(err);
        });
}
// Fetch one post
exports.getPost = (req, res) => {
    let postData = {};
    db.doc(`/posts/${req.params.postId}`).get()
        .then((doc) => {
            if(!doc.exists) {
                return res.status(404).json({ error: 'Post not found'});
            }
            postData = doc.data();
            postData.postId = doc.id;
            // return db.collection('posts').doc(doc.id).collection('comments').orderBy('timestamp', 'desc').get()
            return db.collection('comments').orderBy('createdAt', 'desc').where('postId', '==', req.params.postId).get()
        })
        .then((data) => {
            postData.comments = [];
            data.forEach((doc) => {
                postData.comments.push(doc.data());
            });
            return res.json(postData);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
}
//Comment on a post
exports.commentOnPost = (req, res) => {
    if(req.body.body.trim() === '') return res.status(400).json({ comment: 'Must not be empty'});

    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        postId: req.params.postId,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl
    };

    db.doc(`/posts/${req.params.postId}`).get()
        .then((doc) => {
            if(!doc.exists) {
                return res.status(404).json({ error: 'Post not found'});
            }
            return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
        })
        .then(() => {
            return db.collection('comments').add(newComment);
            // return db.collection('posts').doc(req.params.postId).collection('comments').add(newComment);  Adding inside post collection for comments
        })
        .then(() => {
            res.json(newComment);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        });
}

exports.likePost = (req, res) => {
    const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle).where('postId', '==', req.params.postId).limit(1);
    const postDocument = db.doc(`/posts/${req.params.postId}`);
    let postData;
    postDocument.get()
    .then((doc) => {
        if(doc.exists) {
            postData = doc.data();
            postData.postId = doc.id;
            return likeDocument.get();
        } else {
        return res.status(404).json({ error: 'Post not found' });
        }
    })
    .then((data) => {
        if(data.empty) {
            return db.collection('likes').add({
                postId: req.params.postId,
                userHandle: req.user.handle
            })
            .then(() => {
                postData.likes++;
                return postDocument.update({ likes: postData.likes });
            })
            .then(() => {
                return res.json(postData);
            });
        } else return res.status(400).json({ error: 'Post already liked' });
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({ error: err.code });
    });
}

exports.unlikePost = (req, res) => {
    const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle).where('postId', '==', req.params.postId).limit(1);
    const postDocument = db.doc(`/posts/${req.params.postId}`);
    let postData;
    postDocument.get()
    .then((doc) => {
        if(doc.exists) {
            postData = doc.data();
            postData.postId = doc.id;
            return likeDocument.get();
        } else {
        return res.status(404).json({ error: 'Post not found' });
        }
    })
    .then((data) => {
        if(data.empty) {
            return res.status(400).json({ error: 'Post not liked' });
        } else {
                return db.doc(`/likes/${data.docs[0].id}`).delete()
                .then(() => {
                    postData.likes--;
                    return postDocument.update({ likes: postData.likes });
                })
                .then(() => {
                    return res.json(postData);
                });
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({ error: err.code });
    });
}
// Delete a Post
exports.deletePost = (req, res) => {
    const document = db.doc(`/posts/${req.params.postId}`);
    document.get()
        .then((doc) => {
            if(!doc.exists) return res.status(404).json({error: 'Post not found'});
            if(doc.data().userHandle !== req.user.handle) res.status(404).json({ error: 'Unauthorized'} );
            else document.delete();
        })
        .then(() => {
            res.json({ message: 'Post has been deleted'});
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
}

//Like/Unlink a post in Post Field (not in use right now)
// exports.likePost = (req, res) => {
//     const postDocument = db.doc(`/posts/${req.params.postId}`);
//     let postData;
//     postDocument.get()
//         .then((doc) => {
//             if(doc.exists) {
//                 postData = doc.data();
//                 postData.postId = doc.id;
//                 return postData;
//             }
//             else return res.status(404).json({error: 'Post not found'});
//         })
//         .then(() => {
//             let Users = postData.userslike;
//             let usern = req.user.handle;
//             if(Users.includes(usern)) {
//                 // res.json({ message: 'user is exists'});
//                 // postData.likes--;
//                 Users = Users.filter(user => user !== usern);
//                 postDocument.update({likes: fieldValue.increment(-1), userslike: Users});
//                 return res.json(postData);
//             }
//             else {
//                 // res.json({ message: 'user is not exists'});
//                 // postData.likes++;
//                 Users = [...Users, usern];
//                 postDocument.update({ likes: fieldValue.increment(1), userslike: Users });
//                 return res.json(postData);
//             }
//         })
//         .catch((err) => {
//             console.error(err);
//             res.status(500).json({ error: err.code });
//         });
// }