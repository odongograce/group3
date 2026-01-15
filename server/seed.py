from app import app
from config import db
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
        # Admin
        admin = User(
            username="Admin Freddy",
            email="admin@ecofind.com",
            role="admin"
        )
        admin.set_password("admin123")


        # Sellers
        sellers = [
            User(username="Sarah Johnson", email="sarah@gmail.com", role="seller"),
            User(username="Mike Chen", email="mike@hotmail.com",role="seller"),
            User(username="Emily Brown", email="emily@yahoo.com", role="seller"),
        ]
        for s in sellers:
            s.set_password("password123")
        
        # Buyers
        buyers = [
            User(username="John Doe", email="john@gmail.com", role="buyer"),
            User(username="Jane Smith", email="jane@icloud.com", role="buyer"),
            User(username="Bob Wilson", email="bob@yahoo.com",role="buyer"),
        ]
        for b in buyers:
            b.set_password("password123")


        db.session.add(admin)
        db.session.add_all(sellers)
        db.session.add_all(buyers)
        db.session.commit()
        
        print("Creating auctions...")
        categories = ["Electronics", "Furniture", "Clothing", "Books", "Sports", "Home & Garden"]
        conditions = ["new", "like new", "good", "fair"]
        
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
            {
                "title": "Wooden Desk",
                "description": "Solid oak desk perfect for home office",
                "condition": "good",
                "starting_price": 100.0,
                "category": "Furniture",
                "image_url": "https://wwmake.com/cdn/shop/files/MacieDeskWalnutClear_800x.jpg?v=1689075504"
            },
            {
                "title": "Designer Jacket",
                "description": "Genuine leather jacket, size medium",
                "condition": "like new",
                "starting_price": 80.0,
                "category": "Clothing",
                "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5G1nIB7ATFA4A75g76gIXzDe6nXwlHkch2Q&s"
            },
            {
                "title": "Mountain Bike",
                "description": "26-inch mountain bike, well maintained",
                "condition": "good",
                "starting_price": 150.0,
                "category": "Sports",
                "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLXbbQtak0TeijaorHedEs7yQvL5xuXVdnVw&s"
            },
        ]
        auctions = []
        for i, auction_data in enumerate(auctions_data):
            auction = Auction(
                title=auction_data["title"],
                description=auction_data["description"],
                condition=auction_data["condition"],
                starting_price=auction_data["starting_price"],
                current_price=auction_data["starting_price"],
                end_date=datetime.utcnow() + timedelta(days=randint(3, 14)),
                status=choice(["pending", "approved", "approved"]),
                category=auction_data["category"],
                image_url=auction_data["image_url"],
                user_id=sellers[i % len(sellers)].id
            )
            auctions.append(auction)
       
        db.session.add_all(auctions)
        db.session.commit()
       
        print("Creating bids...")
        approved_auctions = [a for a in auctions if a.status == "approved"]
       
        for auction in approved_auctions[:3]:
            num_bids = randint(2, 5)
            current_price = auction.starting_price
           
            for _ in range(num_bids):
                bid_amount = current_price + auction.minimum_increment + uniform(0, 20)
                bid = Bid(
                    bid_amount=round(bid_amount, 2),
                    user_id=choice(buyers).id,
                    auction_id=auction.id
                )
                auction.current_price = round(bid_amount, 2)
                current_price = bid_amount
                db.session.add(bid)
       
        db.session.commit()
       
        print("Database seeded successfully!")
        print(f"Created {len(sellers) + len(buyers) + 1} users")
        print(f"Created {len(auctions)} auctions")
        print(f"Created bids for approved auctions")


if __name__ == '__main__':
    seed_database()