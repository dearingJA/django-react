import React from "react"
import "../styles/Comment.css"

function Comment({ comment, onDelete, currentUser }) {
  const formattedDate = new Date(comment.created_at).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }); 


  return <div className="comment-container">
    <p className="comment-author">{comment.author.username}</p>
    <p className="comment-content">{comment.content}</p>
    <p className="comment-date">{formattedDate}</p>
    {currentUser.id === comment.author.id && (
      <button className="delete-button" onClick= {() => onDelete(comment.id)}>
        Delete
      </button>
    )}
  </div>
}

export default Comment
