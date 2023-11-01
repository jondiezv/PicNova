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
