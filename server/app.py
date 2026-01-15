from flask import request, session, make_response
from flask_restful import Resource
from datetime import datetime

from config import app, db, migrate, api
from models import User, Auction, Bid

db.init_app(app)
migrate.init_app(app, db)
api.init_app(app)

@app.before_request
def handle_options():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response




@app.route('/')
def home():
    return {"message": "ecoFinds API Server is running"}, 200


class Users(Resource):
    def get(self):
        users = User.query.all()
        return [user.to_dict() for user in users], 200

    def post(self):
        data = request.get_json()

        new_user = User(
            username=data.get('username'),
            email=data.get('email'),
            password=data.get('password'),
            role=data.get('role', 'buyer')
        )

        db.session.add(new_user)
        db.session.commit()

        return new_user.to_dict(), 201


class UserById(Resource):
    def get(self, id):
        user = User.query.get(id)
        if not user:
            return {"error": "User not found"}, 404
        return user.to_dict(), 200

    def delete(self, id):
        user = User.query.get(id)
        if not user:
            return {"error": "User not found"}, 404

        db.session.delete(user)
        db.session.commit()
        return {"message": "User deleted"}, 200


class Auctions(Resource):
    def get(self):
        auctions = Auction.query.all()
        return [auction.to_dict() for auction in auctions], 200

    def post(self):
        data = request.get_json()

        new_auction = Auction(
            title=data.get('title'),
            description=data.get('description'),
            category=data.get('category'),
            condition=data.get('condition'),
            starting_price=float(data.get('starting_price')),
            current_price=float(data.get('starting_price')),
            end_date=datetime.fromisoformat(data.get('end_date')),
            status="pending",
            user_id=data.get('user_id')
        )

        db.session.add(new_auction)
        db.session.commit()

        return new_auction.to_dict(), 201


class AuctionById(Resource):
    def get(self, id):
        auction = Auction.query.get(id)
        if not auction:
            return {"error": "Auction not found"}, 404
        return auction.to_dict(), 200

    def delete(self, id):
        auction = Auction.query.get(id)
        if not auction:
            return {"error": "Auction not found"}, 404

        db.session.delete(auction)
        db.session.commit()
        return {"message": "Auction deleted"}, 200



class Bids(Resource):
    def get(self):
        bids = Bid.query.all()
        return [bid.to_dict() for bid in bids], 200

    def post(self):
        data = request.get_json()

        auction = Auction.query.get(data.get('auction_id'))
        if not auction:
            return {"error": "Auction not found"}, 404

        bid_amount = float(data.get('bid_amount'))

        if bid_amount <= auction.current_price:
            return {"error": "Bid must be higher than current price"}, 400

        new_bid = Bid(
            bid_amount=bid_amount,
            user_id=data.get('user_id'),
            auction_id=data.get('auction_id')
        )

        auction.current_price = bid_amount

        db.session.add(new_bid)
        db.session.commit()

        return new_bid.to_dict(), 201



class Login(Resource):
    def post(self):
        data = request.get_json()

        user = User.query.filter_by(email=data.get('email')).first()
        if not user or user.password != data.get('password'):
            return {"error": "Invalid credentials"}, 401

        session['user_id'] = user.id
        return user.to_dict(), 200


class Logout(Resource):
    def delete(self):
        session.pop('user_id', None)
        return {"message": "Logged out"}, 200


class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Not logged in"}, 401

        user = User.query.get(user_id)
        return user.to_dict(), 200


api.add_resource(Users, '/api/users')
api.add_resource(UserById, '/api/users/<int:id>')
api.add_resource(Auctions, '/api/auctions')
api.add_resource(AuctionById, '/api/auctions/<int:id>')
api.add_resource(Bids, '/api/bids')
api.add_resource(Login, '/api/login')
api.add_resource(Logout, '/api/logout')
api.add_resource(CheckSession, '/api/check_session')


if __name__ == "__main__":
    app.run(port=5555, debug=True)




























# from flask import request, session, jsonify
# from flask_restful import Resource
# from config import app, db, api
# from models import User, Auction, Bid
# from datetime import datetime

# # Home route
# @app.route('/')
# def home():
#     return '<h1>ecoFinds API Server</h1>'


# # User Resources
# class Users(Resource):
#     def get(self):
#         users = User.query.all()
#         return [user.to_dict(rules=('-auctions', '-bids')) for user in users], 200
    
#     def post(self):
#         data = request.get_json()
#         try:
#             new_user = User(
#                 name=data['name'],
#                 email=data['email'],
#                 password=data['password'],  # In production, hash this!
#                 role=data.get('role', 'buyer')
#             )
#             db.session.add(new_user)
#             db.session.commit()
#             return new_user.to_dict(), 201
#         except ValueError as e:
#             return {'error': str(e)}, 400
#         except Exception as e:
#             return {'error': 'Failed to create user'}, 400


# class UserById(Resource):
#     def get(self, id):
#         user = User.query.filter_by(id=id).first()
#         if not user:
#             return {'error': 'User not found'}, 404
#         return user.to_dict(), 200
    
#     def patch(self, id):
#         user = User.query.filter_by(id=id).first()
#         if not user:
#             return {'error': 'User not found'}, 404
        
#         data = request.get_json()
#         try:
#             for key, value in data.items():
#                 if key != 'id':
#                     setattr(user, key, value)
#             db.session.commit()
#             return user.to_dict(), 200
#         except ValueError as e:
#             return {'error': str(e)}, 400
    
#     def delete(self, id):
#         user = User.query.filter_by(id=id).first()
#         if not user:
#             return {'error': 'User not found'}, 404
        
#         db.session.delete(user)
#         db.session.commit()
#         return {'message': 'User deleted successfully'}, 200


# # Auction Resources
# class Auctions(Resource):
#     def get(self):
#         # Filter by status if provided
#         status = request.args.get('status')
#         if status:
#             auctions = Auction.query.filter_by(status=status).all()
#         else:
#             auctions = Auction.query.all()
#         return [auction.to_dict(rules=('-bids',)) for auction in auctions], 200
    
#     def post(self):
#         data = request.get_json()
#         try:
#             new_auction = Auction(
#                 title=data['title'],
#                 description=data['description'],
#                 condition=data['condition'],
#                 starting_price=float(data['starting_price']),
#                 minimum_increment=float(data.get('minimum_increment', 1.0)),
#                 current_price=float(data['starting_price']),
#                 end_date=datetime.fromisoformat(data['end_date']),
#                 category=data['category'],
#                 image_url=data.get('image_url'),
#                 user_id=data['user_id'],
#                 status='pending'  # All new auctions start as pending
#             )
#             db.session.add(new_auction)
#             db.session.commit()
#             return new_auction.to_dict(), 201
#         except ValueError as e:
#             return {'error': str(e)}, 400
#         except Exception as e:
#             return {'error': f'Failed to create auction: {str(e)}'}, 400


# class AuctionById(Resource):
#     def get(self, id):
#         auction = Auction.query.filter_by(id=id).first()
#         if not auction:
#             return {'error': 'Auction not found'}, 404
#         return auction.to_dict(), 200
    
#     def patch(self, id):
#         auction = Auction.query.filter_by(id=id).first()
#         if not auction:
#             return {'error': 'Auction not found'}, 404
        
#         data = request.get_json()
#         try:
#             for key, value in data.items():
#                 if key == 'end_date' and value:
#                     value = datetime.fromisoformat(value)
#                 if key not in ['id', 'user_id', 'created_at']:
#                     setattr(auction, key, value)
#             db.session.commit()
#             return auction.to_dict(), 200
#         except ValueError as e:
#             return {'error': str(e)}, 400
    
#     def delete(self, id):
#         auction = Auction.query.filter_by(id=id).first()
#         if not auction:
#             return {'error': 'Auction not found'}, 404
        
#         db.session.delete(auction)
#         db.session.commit()
#         return {'message': 'Auction deleted successfully'}, 200


# # Bid Resources
# class Bids(Resource):
#     def get(self):
#         # Filter by auction_id if provided
#         auction_id = request.args.get('auction_id')
#         if auction_id:
#             bids = Bid.query.filter_by(auction_id=auction_id).order_by(Bid.bid_amount.desc()).all()
#         else:
#             bids = Bid.query.all()
#         return [bid.to_dict() for bid in bids], 200
    
#     def post(self):
#         data = request.get_json()
#         try:
#             # Get the auction
#             auction = Auction.query.filter_by(id=data['auction_id']).first()
#             if not auction:
#                 return {'error': 'Auction not found'}, 404
            
#             # Validate bid amount
#             bid_amount = float(data['bid_amount'])
#             if bid_amount <= auction.current_price:
#                 return {'error': f'Bid must be higher than current price ${auction.current_price}'}, 400
            
#             if bid_amount < auction.current_price + auction.minimum_increment:
#                 return {'error': f'Bid must be at least ${auction.current_price + auction.minimum_increment}'}, 400
            
#             # Create bid
#             new_bid = Bid(
#                 bid_amount=bid_amount,
#                 user_id=data['user_id'],
#                 auction_id=data['auction_id']
#             )
            
#             # Update auction current price
#             auction.current_price = bid_amount
            
#             db.session.add(new_bid)
#             db.session.commit()
#             return new_bid.to_dict(), 201
#         except ValueError as e:
#             return {'error': str(e)}, 400
#         except Exception as e:
#             return {'error': f'Failed to place bid: {str(e)}'}, 400


# class BidById(Resource):
#     def get(self, id):
#         bid = Bid.query.filter_by(id=id).first()
#         if not bid:
#             return {'error': 'Bid not found'}, 404
#         return bid.to_dict(), 200
    
#     def delete(self, id):
#         bid = Bid.query.filter_by(id=id).first()
#         if not bid:
#             return {'error': 'Bid not found'}, 404
        
#         db.session.delete(bid)
#         db.session.commit()
#         return {'message': 'Bid deleted successfully'}, 200


# # Authentication Routes
# class Login(Resource):
#     def post(self):
#         data = request.get_json()
#         user = User.query.filter_by(email=data['email']).first()
        
#         if not user or user.password != data['password']:
#             return {'error': 'Invalid credentials'}, 401
        
#         session['user_id'] = user.id
#         return user.to_dict(), 200


# class Logout(Resource):
#     def delete(self):
#         session.pop('user_id', None)
#         return {'message': 'Logged out successfully'}, 200


# class CheckSession(Resource):
#     def get(self):
#         user_id = session.get('user_id')
#         if user_id:
#             user = User.query.filter_by(id=user_id).first()
#             if user:
#                 return user.to_dict(), 200
#         return {'error': 'Not authenticated'}, 401


# # Register API resources
# api.add_resource(Users, '/api/users')
# api.add_resource(UserById, '/api/users/<int:id>')
# api.add_resource(Auctions, '/api/auctions')
# api.add_resource(AuctionById, '/api/auctions/<int:id>')
# api.add_resource(Bids, '/api/bids')
# api.add_resource(BidById, '/api/bids/<int:id>')
# api.add_resource(Login, '/api/login')
# api.add_resource(Logout, '/api/logout')
# api.add_resource(CheckSession, '/api/check_session')


# if __name__ == '__main__':
#     app.run(port=5555, debug=True)
