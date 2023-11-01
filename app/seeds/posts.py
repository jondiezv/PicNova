from app.models import db, Post, User, environment, SCHEMA
from sqlalchemy.sql import text

def seed_posts():

    demo = User.query.filter_by(username="Demo").first()

    post = Post(
        user_id=demo.id,
        title="My First Post",
        description="This is a description of my first post. I'm excited to share it with you all!",
        hidden=False,
        views=0
    )

    db.session.add(post)
    db.session.commit()


def undo_posts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.posts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM posts"))

    db.session.commit()
