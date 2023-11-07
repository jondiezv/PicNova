from flask import Blueprint, jsonify, session, request
from app.models import Post, User, Comment, Like, Tag, Favorite, Image, db
from flask_login import current_user, login_user, logout_user, login_required



comments = Blueprint('comments', __name__)


@comments.route('/create', methods=['POST'])
@login_required
def create_comment():
    try:
        current_user_id = current_user.id
        current_post_id = request.json.get('post_id')

        post = Post.query.get(current_post_id)
        if not post:
            return jsonify({"error": "Post not found"}), 404

        comment_text = request.json.get('comment')
        comment = Comment(
            user_id=current_user_id,
            post_id=current_post_id,
            comment=comment_text
        )

        db.session.add(comment)
        db.session.commit()

        return jsonify({"message": "Comment created successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@comments.route('/edit/<int:comment_id>', methods=['PUT'])
@login_required
def edit_comment(comment_id):
    try:

        comment = Comment.query.get(comment_id)

        if not comment:
            return jsonify({"error": "Comment not found"}), 404

        if comment.user_id != current_user.id:
            return jsonify({"error": "You are not allowed to edit this comment"}), 403

        new_comment_text = request.json.get('comment')
        comment.comment = new_comment_text

        db.session.commit()

        return jsonify({"message": "Comment edited successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@comments.route('/delete/<int:comment_id>', methods=['DELETE'])
@login_required
def delete_comment(comment_id):
    try:
        comment = Comment.query.get(comment_id)

        if not comment:
            return jsonify({"error": "Comment not found"}), 404

        if comment.user_id != current_user.id:
            return jsonify({"error": "You are not allowed to delete this comment"}), 403

        db.session.delete(comment)
        db.session.commit()

        return jsonify({"message": "Comment deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
