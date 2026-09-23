from rest_framework import generics, filters
from rest_framework.pagination import PageNumberPagination
from django.db import connection
from blog.models import Category, Post
from blog.serializers import (
    CategoryTreeSerializer,
    PostListSerializer,
    PostDetailSerializer
)

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class CategoryListView(generics.ListAPIView):
    serializer_class = CategoryTreeSerializer

    def get_queryset(self):
        return Category.objects.filter(parent__isnull=True).prefetch_related('children')

class PostListView(generics.ListAPIView):
    serializer_class = PostListSerializer
    pagination_class = StandardResultsSetPagination

    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'content']

    def get_queryset(self):
        queryset = Post.objects.filter(status='published').select_related('category')
        category_slug = self.request.query_params.get('category', None)

        if category_slug:
            category_ids = self.get_category_and_children_ids(category_slug)
            queryset = queryset.filter(category_id__in=category_ids)

        return queryset

    def get_category_and_children_ids(self, slug):
        sql = """
            WITH RECURSIVE category_tree AS (
                SELECT id FROM blog_category WHERE slug = %s
                UNION ALL
                SELECT c.id FROM blog_category c
                INNER JOIN category_tree ct ON c.parent_id = ct.id
            )

            SELECT id from category_tree;
        """

        with connection.cursor() as cursor:
            cursor.execute(sql, [slug])
            return [row[0] for row in cursor.fetchall()]

class PostDetailView(generics.RetrieveAPIView):
    queryset = Post.objects.filter(status='published').select_related('category')
    serializer_class = PostDetailSerializer
    lookup_field = 'slug'

'''
class PostListCreateView(generics.ListCreateAPIView):
    """
    GET /api/posts -> returns published posts only, newest first.
    """
    serializer_class = PostListSerializer

    def get_queryset(self):
        return Post.objects.filter(status='published').order_by('-published_at', '-created_at')

class PostDetailView(generics.RetrieveAPIView):
    """
    GET /api/posts/<slug> -> Details of a single published post
    """
    serializer_class = PostListSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return Post.objects.filter(status='published')
'''
