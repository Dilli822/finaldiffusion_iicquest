from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Post
from .serializers import PostSerializer
from rest_framework.response import Response

class PostListAPIView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    # permission_classes = [IsAuthenticated]
    

class PostListCreateAPIView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
        

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Post
from .serializers import PostSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied

class PostRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]  # Ensure only authenticated owners or admins can update or delete
    
    def get_object(self):
        # Retrieve the Post instance based on the provided pk
        return super().get_object()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Check if the post belongs to the authenticated user
        if instance.author != self.request.user:
            raise PermissionDenied("You do not have permission to update this post.")
        
        request.data['author'] = self.request.user.id
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Check if the post belongs to the authenticated user
        if instance.author != self.request.user:
            raise PermissionDenied("You do not have permission to delete this post.")
        
        return super().destroy(request, *args, **kwargs)

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Comment  # Import the Comment model
from .serializers import CommentSerializer

class CommentListCreateAPIView(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can comment

    def get_queryset(self):
        # Filter comments based on the post_id from URL parameters
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(post_id=post_id)

    def perform_create(self, serializer):
        # Automatically set the user and post for the new comment
        serializer.save(user=self.request.user, post_id=self.kwargs['post_id'])


# View for updating and deleting comments
class CommentDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Retrieve the comment object based on post_id and comment_id from URL parameters
        post_id = self.kwargs['post_id']
        comment_id = self.kwargs['comment_id']
        return generics.get_object_or_404(Comment, id=comment_id, post_id=post_id)
    
from rest_framework.views import APIView


class AllPosts(APIView):
    def get(self, request):
        try:
            posts = Post.objects.all()
            posts_data = []
            for post in posts:
                post_serializer = PostSerializer(post)
                comments = post.comments.all()
                comment_serializer = CommentSerializer(comments, many=True)
                post_data = {
                    'post': post_serializer.data,
                    'comments': comment_serializer.data
                }
                posts_data.append(post_data)
            return Response(posts_data, status=status.HTTP_200_OK)
        except Post.DoesNotExist:
            return Response({'error': 'No posts found'}, status=status.HTTP_404_NOT_FOUND)