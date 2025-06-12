from rest_framework import serializers
from .models import *
from django.utils.text import slugify

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ['author', 'created_at', 'slug'] 

    def create(self, validated_data):
        validated_data['slug'] = slugify(validated_data['title'])
        return super().create(validated_data)
    

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'user', 'text', 'created_at']