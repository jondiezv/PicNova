from app.models import db, Comment, Post, User, environment, SCHEMA
from sqlalchemy.sql import text

def seed_comments():
    marnie_user = User.query.filter_by(username="marnie").first()
    post_demo = Post.query.filter_by(title="My First Post").first()

    comment = Comment(
        user_id=marnie_user.id,
        post_id=post_demo.id,
        comment="Nice post!"
    )

    db.session.add(comment)
    db.session.commit()

def undo_comments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM comments"))

    db.session.commit()
