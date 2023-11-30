from app.models import db, Comment, Post, User, environment, SCHEMA
from sqlalchemy.sql import text

def seed_comments():
    marnie_user = User.query.filter_by(username="marnie").first()
    bobbie_user = User.query.filter_by(username="bobbie").first()
    gamer_user = User.query.filter_by(username="gamer123").first()
    music_user = User.query.filter_by(username="musicLover").first()

    post_demo = Post.query.filter_by(title="VR-ready cat").first()
    post_demo2 = Post.query.filter_by(title="Foodie Delights").first()
    post_demo3 = Post.query.filter_by(title="Why is he looking at me like that").first()
    post_demo4 = Post.query.filter_by(title="Nature's Beauty").first()

    comment = Comment(
        user_id=marnie_user.id,
        post_id=post_demo.id,
        comment="He looks so cute"
    )

    comment2 = Comment(
        user_id=bobbie_user.id,
        post_id=post_demo2.id,
        comment="now youre making me hungry"
    )

    comment3 = Comment(
        user_id=gamer_user.id,
        post_id=post_demo3.id,
        comment="He's like 'wheres my food at'"
    )

    comment4 = Comment(
        user_id=music_user.id,
        post_id=post_demo4.id,
        comment="which place is this????"
    )

    db.session.add(comment)
    db.session.add(comment2)
    db.session.add(comment3)
    db.session.add(comment4)
    db.session.commit()

def undo_comments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM comments"))

    db.session.commit()
