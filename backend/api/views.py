from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, CommentSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from .models import Comment
from rest_framework.views import APIView
from rest_framework.response import Response


class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class CommentListCreate(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Comment.objects.all()

    def perform_create(self, serializer):
        try:
            serializer.save(author=self.request.user)
        except Exception as e:
            print("Error in perform_create:", e)
            raise e  # re-raise so you get full traceback in logs


class LikeComment(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            comment = Comment.objects.get(pk=pk)
            comment.likes += 1
            comment.save()
            return Response({'likes': comment.likes})
        except Exception as e:
            print("Error in perform_create:", e)
            raise e


class DislikeComment(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            comment = Comment.objects.get(pk=pk)
            comment.dislikes += 1
            comment.save()
            return Response({'dislikes': comment.dislikes})
        except Exception as e:
            print("Error in perform_create:", e)
            raise e


class CommentDelete(generics.DestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Comment.objects.filter(author=user)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
