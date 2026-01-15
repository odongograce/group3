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
        # Admin
        admin = User(
            name="Admin User",
            email="admin@ecofind.com",
            password="admin123",
            role="admin"
        )
        
        # Sellers
        sellers = [
            User(name="Sarah Johnson", email="sarah@example.com", password="password123", role="seller"),
            User(name="Mike Chen", email="mike@example.com", password="password123", role="seller"),
            User(name="Emily Brown", email="emily@example.com", password="password123", role="seller"),
        ]
        
        # Buyers
        buyers = [
            User(name="John Doe", email="john@example.com", password="password123", role="buyer"),
            User(name="Jane Smith", email="jane@example.com", password="password123", role="buyer"),
            User(name="Bob Wilson", email="bob@example.com", password="password123", role="buyer"),
            User(name="Esther Wambui", email="bobo@example.com", password="password123", role="buyer"),
            User(name="George Erickson", email="erickson@example.com", password="passowrd123", role="buyer")
        ]
        
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
                "image_url": "/vintage-camera.png"
            },
            {
                "title": "Luxury Watch",
                "description": "Swiss-made automatic watch with leather band",
                "condition": "like new",
                "starting_price": 200.0,
                "category": "Electronics",
                "image_url": "/luxury-watch.jpg"
            },
            {
                "title": "Wooden Desk",
                "description": "Solid oak desk perfect for home office",
                "condition": "good",
                "starting_price": 100.0,
                "category": "Furniture",
                "image_url": "/placeholder.svg?height=200&width=200"
            },
            {
                "title": "Designer Jacket",
                "description": "Genuine leather jacket, size medium",
                "condition": "like new",
                "starting_price": 80.0,
                "category": "Clothing",
                "image_url": "/placeholder.svg?height=200&width=200"
            },
            {
                "title": "Mountain Bike",
                "description": "26-inch mountain bike, well maintained",
                "condition": "good",
                "starting_price": 150.0,
                "category": "Sports",
                "image_url": "/placeholder.svg?height=200&width=200"
            },
        ]
        
        auctions = []
        for i, auction_data in enumerate(auctions_data):
            auction = Auction(
                title=auction_data["title"],
                description=auction_data["description"],
                condition=auction_data["condition"],
                starting_price=auction_data["starting_price"],
                minimum_increment=5.0,
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
        # Create some bids for approved auctions
        approved_auctions = [a for a in auctions if a.status == "approved"]
        
        for auction in approved_auctions[:3]:  # Add bids to first 3 approved auctions
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
