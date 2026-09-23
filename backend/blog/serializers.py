from rest_framework import serializers
from blog.models import Category, Post

class CategoryTreeSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'children']

    def get_children(self, obj):
        serializer = CategoryTreeSerializer(obj.children.all(), many=True)
        return serializer.data

class CategorySimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class PostListSerializer(serializers.ModelSerializer):
    category = CategorySimpleSerializer(read_only=True)

    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'slug',
            'category',
            'status',
            'published_at',
            'created_at'
        ]

class PostDetailSerializer(serializers.ModelSerializer):
    category = CategorySimpleSerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True,
        required=False,
        allow_null=True
    )

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'slug', 'content', 'category',
            'category_id', 'status', 'published_at', 'created_at', 'updated_at'
        ]

class PostSerializer(serializers.ModelSerializer):
    excerpt = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'slug',
            'content',
            'excerpt',
            'author',
            'status',
            'published_at',
            'created_at',
            'updated_at'
        ]

    def get_excerpt(self, obj):
        return obj.content[:150] + ('...' if len(obj.content) > 150 else '')
