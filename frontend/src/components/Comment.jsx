import React, { useState } from "react"
import api from "../api"
import "../styles/Comment.css"

function Comment({ comment, onDelete, currentUser, onUpdate, onReply }) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const formattedDate = new Date(comment.created_at).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }); 

  const handleLike = async () => {
    try {
      const res = await api.post(`/api/comments/like/${comment.id}/`);
      onUpdate(comment.id, {likes: res.data.likes});
    } catch (err) {
      console.error("Failed to like comment:", err);
    }
  };

  const handleDislike = async () => {
    try {
      const res = await api.post(`/api/comments/dislike/${comment.id}/`);
      onUpdate(comment.id, {dislikes: res.data.dislikes});
    } catch (err) {
      console.error("Failed to dislike comment:", err);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;

    try {
      await onReply(comment.id, replyText);

      setReplyText("");
      setIsReplying(false);
    } catch (err) {
      console.error("Failed to reply: ", err);
    }
  };

  return (
    <div className="comment-container">
      <div className="comment-info">
        <div className="comment-author-date">
          <span className="comment-author">{comment.author.username}</span>
          <span className="comment-date">{formattedDate}</span>
        </div>
          <p className="comment-content">{comment.content}</p>
      </div>
      <div className="button-container">
        <button className="comment-button like-button" onClick={handleLike}>
          Like ({comment.likes})
        </button>
        <button className="comment-button dislike-button" onClick={handleDislike}>
          Dislike ({comment.dislikes})
        </button>
        <button className="comment-button reply-button" onClick={() => setIsReplying(!isReplying)}>
          Reply
        </button>
        {currentUser.id === comment.author.id && (
          <button className="comment-button delete-button" onClick={() => onDelete(comment.id)}>
            Delete
          </button>
        )}
      </div>
      {isReplying && (
        <div className="reply-box">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            rows="2"
          />
          <button className="comment-button send-reply" onClick={handleReply}>
            Submit
          </button>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="replies-container">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onDelete={onDelete}
              currentUser={currentUser}
              onUpdate={onUpdate}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Comment
