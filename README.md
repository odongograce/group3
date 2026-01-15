```md

# ecoFinds

In this project, you'll be working with an online second-hand auction marketplace.

## In this repo:

- There is a Flask application with core auction features built out.
- There is a fully built React frontend application.
- Users can register as buyers or sellers.
- Sellers can create auction listings with starting prices and minimum bid increments.
- Buyers can place bids that must be higher than the current highest bid.
- Admins can oversee and finalize auctions.
- The system automatically tracks and updates the highest bid in real time.

Depending on your preference, you can check your application by:

- Running the Flask API and testing endpoints manually
- Running the React application in the browser and interacting with the API via the UI

## Features 

1. **User Accounts**: Buyers and sellers can register and log in.  
2. **Auction Listings**: Sellers can create listings with starting prices and minimum increments.  
3. **Bidding System**: Buyers place bids higher than the current highest bid.  
4. **Admin Controls**: Administrators finalize auctions and ensure fairness.  
5. **Real-time Tracking**: The highest bid for each item is automatically updated.  

## Usage

1. **Create an account**: Sign up as a buyer or seller.  
2. **List items**: Sellers post items for auction with starting prices and minimum increments.  
3. **Place bids**: Buyers submit bids above the current highest bid.  
4. **Finalize auctions**: Admins end auctions and confirm the highest bidder as the winner.  

## Technology Stack

- **Frontend:** React.js  
- **Backend:** Flask API  
- **Database:** SQLAlchemy (SQLite)  
- **Other:** HTML, CSS, JavaScript  

## Setup

The instructions assume you changed into the project folder **prior** to opening the code editor.

### Backend Setup

To create and activate the virtual environment named `env` and install dependencies, run:

```console
cd server
python3 -m venv env
source env/bin/activate   # On Windows: env\Scripts\activate
pip install flask flask_sqlalchemy flask_cors
```

To seed database with initial data, run:

```console
python seed.py
```

You can run your Flask API on http://localhost:5555 by running:

```console
python app.py
```

### Frontend Setup

To install frontend dependencies, run:

```console
cd client
npm install
```

You can run your react app on http://localhost:3000 by running:

```sh
npm start
``

## Folder Structure

```txt
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