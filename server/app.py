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
        image_url=data.get('image_url'),
        end_date=datetime.fromisoformat(data.get('end_date')),
        status="pending",
        user_id=data.get('user_id')
)


        # new_auction = Auction(
        #     title=data.get('title'),
        #     description=data.get('description'),
        #     category=data.get('category'),
        #     condition=data.get('condition'),
        #     starting_price=float(data.get('starting_price')),
        #     current_price=float(data.get('starting_price')),
        #     end_date=datetime.fromisoformat(data.get('end_date')),
        #     status="pending",
        #     user_id=data.get('user_id')
        # )

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
            return {
                "success": False,
                "error": "Invalid credentials"
            }, 401

        session['user_id'] = user.id

        return {
            "success": True,
            "user": user.to_dict()
        }, 200


# class Login(Resource):
#     def post(self):
#         data = request.get_json()

#         user = User.query.filter_by(email=data.get('email')).first()
#         if not user or user.password != data.get('password'):
#             return {"error": "Invalid credentials"}, 401

#         session['user_id'] = user.id
#         return user.to_dict(), 200


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





















