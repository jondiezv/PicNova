from flask import Blueprint, jsonify, session, request
from app.models import Post, User, Comment, Like, Tag, Favorite, Image, db
from flask_login import current_user, login_user, logout_user, login_required

posts = Blueprint('posts', __name__)

@posts.route('/', methods=['GET'])
def get_all_posts():

    posts = Post.query.all()

    posts_list = []
    for post in posts:

        image_urls = [image.url for image in post.images]

        post_dict = {
            'id': post.id,
            'user_id': post.user_id,
            'title': post.title,
            'description': post.description,
            'hidden': post.hidden,
            'views': post.views,
            'image_urls': image_urls,
        }
        posts_list.append(post_dict)

    return jsonify(posts_list)



@posts.route('/<int:post_id>', methods=['GET'])
def get_post_by_id(post_id):

        post = Post.query.get(post_id)
        if post is None:
            return jsonify({'error': 'Post not found'}), 404

        image_urls = [image.url for image in post.images]

        post_dict = {
            'id': post.id,
            'user_id': post.user_id,
            'title': post.title,
            'description': post.description,
            'hidden': post.hidden,
            'views': post.views,
            'image_urls': image_urls,
        }

        return jsonify(post_dict)
