import React from "react"
import "../styles/Comment.css"

function Comment({ comment, onDelete, currentUser }) {
  const formattedDate = new Date(comment.created_at).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }); 


  return (
    <div className="comment-container">
      <div className="comment-info">
        <p className="comment-author">{comment.author.username}</p>
        <p className="comment-content">{comment.content}</p>
        <p className="comment-date">{formattedDate}</p>
      </div>
      <div className="button-container">
        <button className="comment-button like-button">
          Like
        </button>
        <button className="comment-button dislike-button">
          Dislike
        </button>
        <button className="comment-button reply-button">
          Reply
        </button>
        {currentUser.id === comment.author.id && (
          <button className="comment-button delete-button" onClick= {() => onDelete(comment.id)}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default Comment
