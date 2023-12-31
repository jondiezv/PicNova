from flask import Blueprint, jsonify, session, request
from app.models import Post, User, Comment, Like, Tag, Favorite, Image, db
from flask_login import current_user, login_user, logout_user, login_required
from app.api.aws_helper import (
    upload_file_to_s3, get_unique_filename, remove_file_from_s3
)
from app.forms.createpost_form import CreatePost
from app.forms.editpost_form import EditPost
from flask import current_app
from botocore.exceptions import ClientError
from sqlalchemy.orm import subqueryload


posts = Blueprint('posts', __name__)

@posts.route('/', methods=['GET'])
def get_all_posts():
    posts = Post.query.filter_by(hidden=False).all()

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
    username = post.user.username if post.user else None
    likes_count = Like.query.filter_by(post_id=post.id).count()
    favorites_count = Favorite.query.filter_by(post_id=post.id).count()

    post_dict = {
        'id': post.id,
        'user_id': post.user_id,
        'username': username,
        'title': post.title,
        'description': post.description,
        'hidden': post.hidden,
        'views': post.views,
        'created_at': post.created_at.isoformat(),
        'updated_at': post.updated_at.isoformat(),
        'image_urls': image_urls,
        'likes_count': likes_count,
        'favorites_count': favorites_count,
    }

    return jsonify(post_dict)



@posts.route('/create', methods=['POST'])
@login_required
def create_post():
    form = CreatePost()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        try:
            title = form.data['title']
            description = form.data['description']
            hidden = form.data.get('hidden', False)

            new_post = Post(
                user_id=current_user.id,
                title=title,
                description=description,
                hidden=hidden
            )

            db.session.add(new_post)
            db.session.flush()

            file = form.image.data
            unique_filename = get_unique_filename(file.filename)
            upload_result = upload_file_to_s3(file)

            if 'errors' in upload_result:
                raise Exception(upload_result['errors'])

            new_image = Image(
                post_id=new_post.id,
                url=upload_result['url']
            )

            db.session.add(new_image)
            db.session.commit()

            return jsonify({'id': new_post.id, 'message': 'Post created successfully'}), 201

        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f'Unexpected error: {e}')
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Invalid form data', 'form_errors': form.errors}), 400


@posts.route('/<int:post_id>', methods=['DELETE'])
@login_required
def delete_post(post_id):

    post = Post.query.get(post_id)
    if post is None:
        return jsonify({'error': 'Post not found'}), 404
    if post.user_id != current_user.id:
        return jsonify({'error': 'You are not authorized to delete this post'}), 403

    try:

        db.session.delete(post)
        db.session.commit()

        return jsonify({'message': 'Post deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Unexpected error: {e}')
        return jsonify({'error': str(e)}), 500


@posts.route('/<int:post_id>/edit', methods=['PUT'])
@login_required
def edit_post(post_id):
    form = EditPost()
    form["csrf_token"].data = request.cookies["csrf_token"]

    post = Post.query.get(post_id)

    if post is None:
        return jsonify({'error': 'Post not found'}), 404

    if post.user_id != current_user.id:
        return jsonify({'error': 'You are not authorized to edit this post'}), 403

    if form.validate_on_submit():
        try:
            post.title = form.data['title']
            post.description = form.data['description']
            post.hidden = form.data.get('hidden', False)
            db.session.commit()
            return jsonify({'message': 'Post edited successfully'}), 200

        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Invalid form data', 'form_errors': form.errors}), 400


@posts.route('/user/<int:user_id>', methods=['GET'])
@login_required
def get_posts_by_user(user_id):
    if user_id != current_user.id:
        return jsonify({'error': 'You are not authorized to view this user\'s posts'}), 403

    user_posts = Post.query.filter_by(user_id=current_user.id).all()

    posts_list = []
    for post in user_posts:
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


@posts.route('/<int:post_id>/comments', methods=['GET'])
def get_comments_by_post_id(post_id):
    try:
        comments = Comment.query.filter_by(post_id=post_id).options(
            subqueryload(Comment.user)
        ).all()

        comments_data = []
        for comment in comments:
            comments_data.append({
                'id': comment.id,
                'user_id': comment.user_id,
                'post_id': comment.post_id,
                'comment': comment.comment,
                'url': comment.url,
                'username': comment.user.username,
                'created_at': comment.created_at.isoformat(),
                'updated_at': comment.updated_at.isoformat(),
            })

        return jsonify(comments_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@posts.route('/<int:post_id>/add_to_favorites', methods=['POST'])
@login_required
def add_post_to_favorites(post_id):
    post = Post.query.get(post_id)
    if post is None:
        return jsonify({'error': 'Post not found'}), 404

    user = current_user

    existing_favorite = Favorite.query.filter_by(user_id=user.id, post_id=post.id).first()
    if existing_favorite:
        return jsonify({'message': 'Post already in favorites'}), 200

    try:
        new_favorite = Favorite(user=user, post=post)
        db.session.add(new_favorite)
        db.session.commit()
        return jsonify({'message': 'Post added to favorites successfully'}), 201

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Unexpected error: {e}')
        return jsonify({'error': str(e)}), 500


@posts.route('/<int:post_id>/remove_from_favorites', methods=['POST'])
@login_required
def remove_post_from_favorites(post_id):
    post = Post.query.get(post_id)
    if post is None:
        return jsonify({'error': 'Post not found'}), 404

    user = current_user

    favorite = Favorite.query.filter_by(user_id=user.id, post_id=post.id).first()
    if favorite:
        try:
            db.session.delete(favorite)
            db.session.commit()
            return jsonify({'message': 'Post removed from favorites successfully'}), 200
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f'Unexpected error: {e}')
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'message': 'Post is not in favorites'}), 200


@posts.route('/user/<int:user_id>/favorites', methods=['GET'])
@login_required
def get_user_favorites(user_id):
    if user_id != current_user.id:
        return jsonify({'error': 'Unauthorized access'}), 403

    favorites = Favorite.query.filter_by(user_id=user_id).all()
    favorite_posts = [Post.query.get(favorite.post_id) for favorite in favorites]

    favorites_list = [{
        'post_id': post.id,
        'image_urls': [image.url for image in post.images],
        'title': post.title,
        'description': post.description,
        'hidden': post.hidden
    } for post in favorite_posts]

    return jsonify(favorites_list), 200
