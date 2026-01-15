from config import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50))
    email = db.Column(db.String(255))
    password_hash = db.Column(db.String(255))
    role = db.Column(db.String(20))

    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role
        }


class Auction(db.Model):
    __tablename__ = 'auctions'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    description = db.Column(db.String(100))
    category = db.Column(db.String(100))
    condition = db.Column(db.String(100))
    starting_price = db.Column(db.Integer)
    current_price = db.Column(db.Integer)
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime)
    image_url = db.Column(db.String(255))
    status = db.Column(db.String(100))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "category": self.category,
            "condition": self.condition,
            "starting_price": self.starting_price,
            "current_price": self.current_price,
            "status": self.status,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "user_id": self.user_id,
            "image_url": self.image_url,
        }


class Bid(db.Model):
    __tablename__ = 'bids'

    id = db.Column(db.Integer, primary_key=True)
    bid_amount = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    auction_id = db.Column(db.Integer, db.ForeignKey('auctions.id'))

    def to_dict(self):
        return {
            "id": self.id,
            "bid_amount": self.bid_amount,
            "user_id": self.user_id,
            "auction_id": self.auction_id
        }


















