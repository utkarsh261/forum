import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { Topic, Comment } from "../types.ts";
import { Client } from "https://deno.land/x/postgres/mod.ts";
import { _config } from "../config/config.ts";

let config;
config = _config.database.postgres;

const client = new Client(config);

var topicList = new Array<Topic>();
var commentList = new Array<Comment>();
var topics = new Array<any>();
var comments = new Array<any>();
async function initConnection() {
  await client.connect();
  const topicsQuery = await client.query(
    "SELECT * FROM topics;",
  );
  const commentsQuery = await client.query(
    "SELECT * FROM comments;",
  );
  await client.end();
  topics = topicsQuery.rows;
  comments = commentsQuery.rows;
  for (var i = 0; i < topics.length; i++) {
    const t = {} as Topic;
    t.id = topics[i][0];
    t.uid = topics[i][1];
    t.name = topics[i][2];
    t.content = topics[i][3];
    topicList.push(t);
  }
  for (var i = 0; i < comments.length; i++) {
    const c = {} as Comment;
    c.id = comments[i][0];
    c.uid = comments[i][1];
    c.content = comments[i][2];
    c.parent = comments[i][3];
    commentList.push(c);
  }
}
async function updateTopicTable(topic: Topic) {
  await client.connect();
  await client.query(
    "INSERT INTO topics(uid, name, content) VALUES($1, $2, $3)",
    topic.uid,
    topic.name,
    topic.content,
  );
  await client.end();
  await initConnection();
}
async function updateCommentTable(comment: Comment) {
  await client.connect();
  await client.query(
    "INSERT INTO comments(uid, content, parent) VALUES($1, $2, $3)",
    comment.uid,
    comment.content,
    comment.parent,
  );
  await client.end();
  await initConnection()
}
const getTopics = async ({ response }: { response: any }) => {
  if(topicList.length===0){
    await initConnection();
  }
  response.body = {
    success: true,
    data: topicList,
  };
};
const getTopic =
  (async ({ params, response }: { params: { id: string }; response: any }) => {
    if(topicList.length===0){
      await initConnection();
    }
    const topic: Topic | undefined = topicList.find((t) => t.uid == params.id);
    if (topic) {
      response.status = 200;
      response.body = {
        success: true,
        data: topic,
      };
    } else {
      response.status = 404;
      response.body = {
        success: false,
        data: "No Such Topic Found!",
      };
    }
  });
const getComments = async ({ response }: { response: any }) => {
  if(commentList.length===0){
    await initConnection();
  }
  response.body = {
    success: true,
    data: commentList,
  };
};
const getComment =
  (async ({ params, response }: { params: { id: string }; response: any }) => {
    if(commentList.length===0){
      await initConnection();
    }
    const comment: Comment | undefined = commentList.find((c) =>
      c.uid == params.id
    );
    if (comment) {
      response.status = 200;
      response.body = {
        success: true,
        data: comment,
      };
    } else {
      response.status = 404;
      response.body = {
        success: false,
        data: "No Such Topic Found!",
      };
    }
  });
const addTopic = async (
  { request, response }: { request: any; response: any },
) => {
  const body = await request.body();
  if (!request.hasBody) {
    response.status = 400;
    response.body = {
      success: false,
      data: "No data provided",
    };
  } else {
    const topic: Topic = body.value;
    if (topic.content.length === 0 || topic.name.length === 0) {
      response.status = 400;
      response.body = {
        success: false,
        data: "Field Empty",
      };
    } else {
      topic.uid = v4.generate();
      await updateTopicTable(topic);
      response.status = 201;
      response.body = {
        success: true,
        data: topic,
      };
    }
  }
};
const addComment = async (
  { request, response }: { request: any; response: any },
) => {
  const body = await request.body();

  if (!request.hasBody) {
    response.status = 400;
    response.body = {
      success: false,
      data: "No data provided",
    };
  } else {
    const comment: Comment = body.value;
    if (comment.content.length === 0 || comment.parent.length === 0) {
      response.status = 400;
      response.body = {
        success: false,
        data: "Field Empty",
      };
    } else {
      comment.uid = v4.generate();
      await updateCommentTable(comment);
      response.status = 201;
      response.body = {
        success: true,
        data: comment,
      };
    }
  }
};

const getCommentsByParent =
  (async ({ params, response }: { params: { pid: string }; response: any }) => {
    if(commentList.length===0){
      await initConnection();
    }
    var filteredComments = new Array<Comment>();
    for (var i = 0; i < commentList.length; i++) {
      if (commentList[i].parent == params.pid) {
        filteredComments.push(commentList[i]);
      }
    }
    if (filteredComments.length === 0) {
      response.status = 204;
      response.body = {
        success: true,
        data: "No Comments for this thread.",
      };
    } else {
      response.status = 200;
      response.body = {
        success: true,
        data: filteredComments,
      };
    }
  });
export {
  getTopics,
  getComment,
  getTopic,
  getComments,
  addTopic,
  addComment,
  getCommentsByParent,
};
