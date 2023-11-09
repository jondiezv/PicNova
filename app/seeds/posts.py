from app.models import db, Post, User, environment, SCHEMA
from sqlalchemy.sql import text

def seed_posts():
    demo = User.query.filter_by(username="Demo").first()
    user1 = User.query.filter_by(username="catlover64").first()
    user2 = User.query.filter_by(username="doggo123").first()
    user3 = User.query.filter_by(username="artEnthusiast").first()
    user4 = User.query.filter_by(username="foodie99").first()
    user5 = User.query.filter_by(username="natureExplorer").first()

    post1 = Post(
        user_id=demo.id,
        title="My First Post",
        description="Hello I'm new here",
        hidden=False,
        views=543
    )

    post2 = Post(
        user_id=user1.id,
        title="Cute Cat Picture",
        description="Sharing adorable cat photos!",
        hidden=False,
        views=1234
    )

    post3 = Post(
        user_id=user2.id,
        title="Doggo Adventures",
        description="Exploring the world with my doggo!",
        hidden=False,
        views=876
    )

    post4 = Post(
        user_id=user3.id,
        title="Art Showcase",
        description="Featuring my latest artworks.",
        hidden=False,
        views=654
    )

    post5 = Post(
        user_id=user4.id,
        title="Foodie Delights",
        description="Discovering delicious food recipes.",
        hidden=False,
        views=432
    )

    post6 = Post(
        user_id=user5.id,
        title="Nature's Beauty",
        description="Capturing the beauty of the natural world.",
        hidden=False,
        views=987
    )

    db.session.add(post1)
    db.session.add(post2)
    db.session.add(post3)
    db.session.add(post4)
    db.session.add(post5)
    db.session.add(post6)
    db.session.commit()


def undo_posts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.posts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM posts"))

    db.session.commit()
