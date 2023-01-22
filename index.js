const axios = require('axios').default;

async function fetchData() {
  const [posts, comments] = await Promise.all([
    axios.get('https://jsonplaceholder.typicode.com/posts'),
    axios.get('https://jsonplaceholder.typicode.com/comments'),
  ]);

  return {
    posts: posts.data,
    comments: comments.data,
  };
}

// The iterations are nested, so time complexity is O(n^2)
function withFind(posts, comments, logMessage) {
  console.time(logMessage);

  const result = posts.map((post) => {
    const foundComment = comments.find((comment) => comment.postId === post.id); // O(n)

    if (foundComment) {
      return {
        ...post,
        comment: foundComment.body,
      };
    }

    return post;
  }); // O(n)
  console.timeEnd(logMessage);

  return result;
}

// The iterations are not nested, so time complexity is O(n)
function withMap(posts, comments, logMessage) {
  console.time(logMessage);

  const commentsMap = new Map([]);

  comments.map((comment) =>
    commentsMap.has(comment.postId)
      ? commentsMap.set(comment.postId, [
          ...commentsMap.get(comment.postId),
          comment,
        ])
      : commentsMap.set(comment.postId, [comment])
  );

  const result = posts.map((post) => {
    const foundComment = commentsMap.get(post.id);

    if (foundComment) {
      return {
        ...post,
        comment: foundComment[0].body,
      };
    }

    return post;
  }); // O(n)
  console.timeEnd(logMessage);

  return result;
}

function withObj(posts, comments, logMessage) {
  console.time(logMessage);

  const commentsObj = comments.reduce((prev, comment) => {
    return {
      ...prev,
      [comment.postId]: comment,
    };
  }, {}); // O(n)

  const result = posts.map((post) => {
    const foundComment = commentsObj[post.id];

    if (foundComment) {
      return {
        ...post,
        comment: foundComment.body,
      };
    }
    return post;
  }); // O(n)

  console.timeEnd(logMessage);

  return result;
}

async function main() {
  const { posts, comments } = await fetchData();

  withFind(posts, comments, `Using Array.find function before shuffle`);

  withMap(posts, comments, `Using Map before shuffle`);

  withObj(posts, comments, `Using JS Obj before shuffle`);
}

main();
