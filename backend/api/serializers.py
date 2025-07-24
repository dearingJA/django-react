from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Comment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class CommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()
    author = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "content", "created_at", "author", "parent", "replies"]
        extra_kwargs = {"author": {"read_only": True}}

    def get_replies(self, obj):
        # rec serialize replies
        if obj.replies.exists():
            return CommentSerializer(obj.replies.all(), many=True, context=self.context).data
        return []
