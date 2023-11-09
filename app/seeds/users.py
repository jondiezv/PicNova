from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


def seed_users():
    demo = User(
        username='Demo', email='demo@aa.io', password='password')
    marnie = User(
        username='marnie', email='marnie@aa.io', password='password')
    bobbie = User(
        username='bobbie', email='bobbie@aa.io', password='password')
    user1 = User(
        username='catlover64', email='catlover64@aa.io', password='password')
    user2 = User(
        username='doggo123', email='doggo123@aa.io', password='password')
    user3 = User(
        username='artEnthusiast', email='artEnthusiast@aa.io', password='password')
    user4 = User(
        username='foodie99', email='foodie99@aa.io', password='password')
    user5 = User(
        username='natureExplorer', email='natureExplorer@aa.io', password='password')
    user6 = User(
        username='musicLover', email='musicLover@aa.io', password='password')
    user7 = User(
        username='traveler', email='traveler@aa.io', password='password')
    user8 = User(
        username='gamer123', email='gamer123@aa.io', password='password')
    user9 = User(
        username='bookworm', email='bookworm@aa.io', password='password')
    user10 = User(
        username='movieBuff', email='movieBuff@aa.io', password='password')

    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)
    db.session.add(user1)
    db.session.add(user2)
    db.session.add(user3)
    db.session.add(user4)
    db.session.add(user5)
    db.session.add(user6)
    db.session.add(user7)
    db.session.add(user8)
    db.session.add(user9)
    db.session.add(user10)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
