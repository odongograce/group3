**EcoFinds**

EcoFinds is a web application that allows users to list second-hand items for auction. Buyers compete by placing bids, and the system automatically tracks the highest offers. Each new bid must exceed the current highest bid, while administrators oversee auctions to finalize sales to the highest bidder.

EcoFinds provides a transparent and dynamic marketplace for second-hand items.

**Features**

User Accounts: Buyers and sellers can register and log in.

Auction Listings: Sellers can create listings with a starting price and minimum increment.

Bidding System: Buyers place bids higher than the current highest bid.

Admin Controls: Administrators finalize auctions and ensure fairness.

Real-time Tracking: The highest bid for each item is automatically updated.


**Technology Stack**

**Frontend**: React.js

**Backend**: Flask API

**Database**: SQLAlchemy SQLite

**Other**: HTML, CSS, JavaScript

**Setup & Running the Project**
**Backend**

1. Navigate to the server folder:

cd server


2. Create a virtual environment and install dependencies:

python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate


3. Install the required packages manually:

pip install flask
pip install flask_sqlalchemy
pip install flask_cors


4. Seed the database with initial data (optional):

python seed.py


5. Start the Flask API:

python app.py


The backend runs on http://localhost:5000 by default.

**Frontend**

1. Navigate to the client folder:

cd client


2. Install dependencies:

npm install


3. Start the React app:

npm start


The frontend runs on http://localhost:3000 by default.

**Usage**

**Create an account**: Sign up as a buyer or seller.

**List items**: Sellers can post items for auction with starting prices and minimum increments.

**Place bids**: Buyers submit bids above the current highest bid.

**Finalize auctions**: Admins can end auctions and confirm the highest bidder as the winner.

**Folder Structure**
ecoFinds/
│
├── server/       # Flask backend
│   ├── app.py
│   ├── models.py
│   └── seed.py
│
├── client/       # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md

**Contributing**

Contributions are welcome! Fork the repository, create a branch for your feature or bug fix, and submit a pull request.
