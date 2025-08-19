import {useState, useEffect} from "react";
import api from "../api";
import Comment from "../components/Comment"
import "../styles/Home.css"

function Home() {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    getCurrentUser();
    getComments();
  }, [])

  const getCurrentUser = () => {
    api
      .get("/api/current_user/")
      .then((res) => setCurrentUser(res.data))
      .catch((err) => console.error("Failed to fetch current user:", err)); 
  };

  const getComments = () => {
    api
      .get("/api/comments/")
      .then((res) => res.data)
      .then((data) => { setComments(data); console.log(data) })
      .catch((err) => alert(err));
  };

  const deleteComment = (id) => {
    api
      .delete(`/api/comments/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) alert("Comment deleted!");
        else alert("Failed to delete comment.");
        getComments();
      })
      .catch((err) => alert(err));
  };

  const createComment = (e) => {
    e.preventDefault();
    api
      .post("/api/comments/", { content })
      .then((res) => {
        if (res.status === 201) {
          alert("Comment created!");
          setContent("");
        }
        else alert("Failed to make comment.");
        getComments();
      })
      .catch((err) => alert(err));
  };

  const updateComment = (id, updatedFields) => {
    const updateRecursively = (comments) =>
      comments.map((comment) => {
        if (comment.id === id) {
          return { ...comment, ...updatedFields };
        }
        if (comment.replies && comment.replies.length > 0) {
          return { ...comment, replies: updateRecursively(comment.replies) };
        }
        return comment;
      });

    setComments((prev) => updateRecursively(prev));
  };

  const replyToComment = async (parentId, text) => {
    try {
      const res = await api.post("/api/comments/", {
        content: text,
        parent: parentId,
      });

      const newReply = res.data;

      const addReply = (comments) =>
        comments.map((c) =>
          c.id === parentId
            ? { ...c, replies: [...(c.replies || []), newReply] }
            : { ...c, replies: addReply(c.replies || []) }
        );

      setComments((prev) => addReply(prev));
    } catch (err) {
      console.error("Failed to reply:", err);
    }
  }; 

  return (
    <div>
      <div>
        <h2>Today's Question</h2>
        <p>Sample Question: Which team is going to win the Super Bowl?</p>
      </div>

      <div>
        <h2>Create a Comment</h2>
        <form onSubmit={createComment}>
          <label htmlFor="content">Content:</label>
          <br />
          <textarea
            id="content"
            name="content"
            required
            placeholder="Respond to the daily question..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <br />
          <input type="submit" value="Submit"></input>
        </form>
      </div>
      <div>
        <h2>Comments</h2>
        {comments
          .filter((c) => !c.parent)
          .map((comment) => (
        <Comment
            comment={comment} 
            onDelete={deleteComment} 
            currentUser={currentUser} 
            key={comment.id}
            onUpdate={updateComment}
            onReply={replyToComment}
          />
        ))}
      </div>
    </div>
  )
}

export default Home
