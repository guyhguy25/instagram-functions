let db = {
    users: [
        {
            userId: 'dh23ggj5h32g543h5gf43',
            email: 'user@gmail.com',
            handle: 'user',
            verified: false,
            sex: "null",
            posts_number: 0,
            createdAt: '2020-10-13T13:10:00.000Z',
            imageUrl: 'image/dsafasfasfad/fasdasd',
            bio: 'hello, my name is user, nice to meet you',
            website: 'https://user.com',
            location: 'Tel Aviv, Israel'
        }
    ],
    posts: [
        {
            userHandle: 'user',
            body: 'this is the scream body',
            createdAt: '2020-10-13T13:10:00.000Z',
            likes: 5,
            commentCount: 2
        }
    ],
    comments: [
        {
            userHandle: 'user',
            postId: 'asfasdasfasf',
            body: 'nice one mate!',
            createdAt: '2020-10-13T13:10:00.000Z',
        }
    ],
    notifications: [
        {
            recipient: 'user',
            sender: 'john',
            read: 'true | false',
            postId: 'asfasdasfasf',
            type: 'like | comment',
            createdAt: '2020-10-13T13:10:00.000Z',
        }
    ]
};

const userDetails = {
    credentials: {
        userId: 'ASJFSKLAJFKLASJFLKKKLFSAM',
        email: 'user@gmail.com',
        handle: 'user',
        createdAt: '2020-10-13T13:10:00.000Z',
        imageUrl: 'image/dsafasfasfad/fasdasd',
        bio: 'hello, my name is user, nice to meet you',
        website: 'https://user.com',
        location: 'Tel Aviv, Israel'
    },
    likes: [
        {
            userHandle: 'user',
            postId: 'gdasgf43AtADSFSfa'
        },
        {
            userHandle: 'user',
            postId: 'g1231312sdfafa'
        }
    ]
}