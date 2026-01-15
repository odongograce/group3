from app import app
from models import db, User, Auction, Bid
from datetime import datetime, timedelta
from random import choice, uniform, randint