from django.urls import path
from . import views

urlpatterns = [
    path("comments/", views.CommentListCreate.as_view(), name="note-list"),
    path("comments/delete/<int:pk>/", views.CommentDelete.as_view(), name="delete-note"),
    path("current_user/", views.CurrentUserView.as_view(), name="current-user"),
]
