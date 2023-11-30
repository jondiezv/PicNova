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
        title="VR-ready cat",
        description="This is not my actual cat and I don't actually have a vr headset I just thought this image was funny",
        hidden=False,
        views=543
    )

    post2 = Post(
        user_id=user1.id,
        title="Why is he looking at me like that",
        description="Is he expecting something?",
        hidden=False,
        views=1234
    )

    post3 = Post(
        user_id=user2.id,
        title="just picked up this game",
        description="I never played this game before, heard it was controversial. What am I in for?",
        hidden=False,
        views=876
    )

    post4 = Post(
        user_id=user3.id,
        title="Art Showcase",
        description="Just finished painting, what do you think?",
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

    post7 = Post(
        user_id=user3.id,
        title="who is this character and why is she everywhere",
        description="can someone explain this meme to me i keep seeing this cat everywhere and I don't get it",
        hidden=False,
        views=987
    )

    post8 = Post(
        user_id=demo.id,
        title="rate my haul",
        description="Just wanted to share my excitement on the biggest haul of my magic career by far!",
        hidden=False,
        views=987
    )

    db.session.add(post1)
    db.session.add(post2)
    db.session.add(post3)
    db.session.add(post4)
    db.session.add(post5)
    db.session.add(post6)
    db.session.add(post7)
    db.session.add(post8)
    db.session.commit()


def undo_posts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.posts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM posts"))

    db.session.commit()
