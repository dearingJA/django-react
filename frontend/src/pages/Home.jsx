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
    setComments(prev => 
      prev.map(comment =>
        comment.id === id ? { ...comment, ...updatedFields } : comment
      )
    );
  }

  return (
    <div>
      <div>
        <h2>Today's Question</h2>
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
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <br />
          <input type="submit" value="Submit"></input>
        </form>
      </div>
      <div>
        <h2>Comments</h2>
        {comments.map((comment) => (
        <Comment
            comment={comment} 
            onDelete={deleteComment} 
            currentUser={currentUser} 
            key={comment.id}
            onUpdate={updateComment}
          />
        ))}
      </div>
    </div>
  )
}

export default Home
