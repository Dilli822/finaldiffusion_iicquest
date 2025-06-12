import uuid
import random
import string
from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify

class Post(models.Model):
    author = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    title = models.CharField(max_length=255, unique=False)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    slug = models.SlugField(unique=True, max_length=255)
    
    category = models.CharField(max_length=255, unique=False,blank=True)
    
    likes = models.ManyToManyField(get_user_model(), related_name='liked_posts', blank=True)


    image = models.ImageField(upload_to='post_images/', blank=True, null=True)
    video = models.FileField(upload_to='post_videos/', blank=True, null=True)
    typePost = models.CharField(max_length=250, blank=True, null=True)
    
    def generate_random_slug(self):
        random_slug = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
        return random_slug

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            random_suffix = self.generate_random_slug()
            self.slug = f"{base_slug}-{random_suffix}"
            while Post.objects.filter(slug=self.slug).exists():
                random_suffix = self.generate_random_slug()
                self.slug = f"{base_slug}-{random_suffix}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.post.title}"
