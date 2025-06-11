from django.urls import path
from .views import *

urlpatterns = [
    path('api/posts/public/list/', AllPosts.as_view(), name='post-list-create'),
    path('api/posts/', PostListCreateAPIView.as_view(), name='post-list-create'),
    path('api/posts/<int:pk>/', PostRetrieveUpdateDestroyAPIView.as_view(), name='post-detail'),
    path('api/posts/<int:post_id>/comments/', CommentListCreateAPIView.as_view(), name='comment-list-create'),
     path('api/posts/<int:post_id>/comments/<int:comment_id>/', CommentDetailAPIView.as_view(), name='comment-detail'),
]
