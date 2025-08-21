from django.contrib.auth.models import User
from rest_framework import generics

from backend.settings import GITHUB_TOKEN

from .serializers import UserSerializer, CommentSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from .models import Comment
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import date
import requests
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential


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


_cached_question = None
_cached_date = None


class DailyQuestion(APIView):
    def get(self, request):
        global _cached_question, _cached_date
        today = date.today().isoformat()

        if _cached_date == today and _cached_question:
            return Response({"question": _cached_question})

        try:
            token = GITHUB_TOKEN
            endpoint = "https://models.github.ai/inference"
            model = "openai/gpt-4.1-mini"

            client = ChatCompletionsClient(
                endpoint=endpoint,
                credential=AzureKeyCredential(token),
            )

            prompt = f"Generate one unique, short, engaging sports debate question for {today}."

            response = client.complete(
                messages=[
                    SystemMessage("You are a sports journalist that generates fun daily debate questions."),
                    UserMessage(prompt)
                ],
                temperature=1.0,
                top_p=1.0,
                model=model
            )

            question = response.choices[0].message.content.strip()
            _cached_question = question
            _cached_date = today

            return Response({"question": question})

        except Exception as e:
            print("GitHub AI API error:", e)
            return Response({"question": "ERROR GETTING THE QUESTION"})
