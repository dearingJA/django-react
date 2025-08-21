from django.urls import path
from . import views

urlpatterns = [
    path("comments/", views.CommentListCreate.as_view(), name="note-list"),
    path("comments/delete/<int:pk>/", views.CommentDelete.as_view(), name="delete-note"),
    path("comments/like/<int:pk>/", views.LikeComment.as_view(), name="like-comment"),
    path("comments/dislike/<int:pk>/", views.DislikeComment.as_view(), name="dislike-comment"),
    path("current_user/", views.CurrentUserView.as_view(), name="current-user"),
    path("daily_question/", views.DailyQuestion.as_view(), name="daily-question"),
]
