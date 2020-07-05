import { Router } from "https://deno.land/x/oak/mod.ts";
import {
  getTopics,
  getTopic,
  getComments,
  getComment,
  addTopic,
  addComment,
  getCommentsByParent,
} from "./controllers/methods.ts";

const router = new Router();

router.get("/api/v1/topics/", getTopics)
  .get("/api/v1/topics/:id", getTopic)
  .get("/api/v1/comments/", getComments)
  .get("/api/v1/comments/:id", getComment)
  .get("/api/v1/comments/parent/:pid", getCommentsByParent)
  .post("/api/v1/comments/", addComment)
  .post("/api/v1/topics/", addTopic);
export default router;
