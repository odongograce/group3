from app import app
from models import db, User, Auction, Bid
from datetime import datetime, timedelta
from random import choice, uniform, randint

def seed_database():
    with app.app_context():
        print("Clearing database...")
        Bid.query.delete()
        Auction.query.delete()
        User.query.delete()

        print("Creating users...")

        admin = User(
            username="Admin Freddy",
            email="admin@ecofind.com",
            role="admin",
            password="admin123"
)


        sellers = [
            User(username="Sarah Johnson", email="sarah@gmail.com", role="seller", password="password123"),
            User(username="Mike Chen", email="mike@hotmail.com", role="seller", password="password123"),
            User(username="Emily Brown", email="emily@yahoo.com", role="seller", password="password123"),
]



        buyers = [
            User(username="Nigel Johnson", email="nigel@gmail.com", role="seller", password="password123"),
            User(username="Lucy Chen", email="lucy@hotmail.com", role="seller", password="password123"),
            User(username="Molly Brown", email="molly@yahoo.com", role="seller", password="password123"),
]


        db.session.add(admin)
        db.session.add_all(sellers + buyers)
        db.session.commit()

        print("Creating auctions...")

        auctions_data = [
            {
                "title": "Vintage Camera",
                "description": "Beautiful vintage film camera in excellent working condition",
                "condition": "good",
                "starting_price": 50.0,
                "category": "Electronics",
                "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPbrJOqoY1C3piZuAR7u-P46NLkD3aRzNDlQ&s"
            },
            {
                "title": "Luxury Watch",
                "description": "Swiss-made automatic watch with leather band",
                "condition": "like new",
                "starting_price": 200.0,
                "category": "Electronics",
                "image_url": "https://media.fashionnetwork.com/cdn-cgi/image/format=auto/m/06e4/0f65/5c91/8359/0a6e/d7df/f5a4/15e3/73a5/7505/7505.jpeg"
            },
        ]

        auctions = []
        for i, data in enumerate(auctions_data):
            auction = Auction(
                title=data["title"],
                description=data["description"],
                condition=data["condition"],
                starting_price=data["starting_price"],
                current_price=data["starting_price"],
                category=data["category"],
                image_url=data["image_url"],
                status="active",
                end_date=datetime.utcnow() + timedelta(days=randint(3, 14)),
                user_id=sellers[i % len(sellers)].id
            )
            auctions.append(auction)

        db.session.add_all(auctions)
        db.session.commit()

        print("Creating bids...")

        active_auctions = [a for a in auctions if a.status == "active"]

        for auction in active_auctions:
            current_price = auction.starting_price
            for _ in range(randint(2, 5)):
                bid_amount = current_price + 5 + uniform(1, 20)
                bid = Bid(
                    bid_amount=bid_amount,
                    user_id=choice(buyers).id,
                    auction_id=auction.id
                )
                auction.current_price = bid_amount
                current_price = bid_amount
                db.session.add(bid)

        db.session.commit()

        print("Database seeded successfully!")

if __name__ == "__main__":
    seed_database()
