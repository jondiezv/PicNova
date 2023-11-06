from flask import Blueprint, jsonify, session, request
from app.models import Post, User, Comment, Like, Tag, Favorite, Image, db
from flask_login import current_user, login_user, logout_user, login_required



comments = Blueprint('comments', __name__)

@comments.route('/post/<int:post_id>/comments', methods=['GET'])
def get_comments_by_post_id(post_id):
    try:
        comments = Comment.query.filter_by(post_id=post_id).all()

        comments_data = [comment.to_dict() for comment in comments]

        return jsonify(comments_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
