from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import joblib
import os

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB connection
mongo_uri = os.environ.get("MONGO_URI")
client = MongoClient(mongo_uri)
db = client.realml
properties_collection = db.properties

# Load ML model
model = joblib.load("ml/model.pkl")  # Make sure model.pkl is in ml/

@app.route("/")
def home():
    return "🏠 RealEstateML Flask Backend Running!"

# Add property (Seller)
@app.route("/add", methods=["POST"])
def add_property():
    data = request.get_json()

    try:
        # Extract features for ML prediction
        features = [
            data['CRIM'], data['ZN'], data['INDUS'], data['CHAS'], data['NOX'],
            data['RM'], data['AGE'], data['DIS'], data['RAD'], data['TAX'],
            data['PTRATIO'], data['B'], data['LSTAT']
        ]
        predicted_price = model.predict([features])[0]
        expected_price = data.get("expectedPrice", 0)
        profitable = predicted_price > expected_price

        # Save to MongoDB
        property_doc = {
            "sellerName": data.get("sellerName"),
            "email": data.get("email"),
            "phone": data.get("phone"),
            "location": data.get("location"),
            "features": {
                "CRIM": data['CRIM'], "ZN": data['ZN'], "INDUS": data['INDUS'], "CHAS": data['CHAS'],
                "NOX": data['NOX'], "RM": data['RM'], "AGE": data['AGE'], "DIS": data['DIS'],
                "RAD": data['RAD'], "TAX": data['TAX'], "PTRATIO": data['PTRATIO'], "B": data['B'], "LSTAT": data['LSTAT']
            },
            "expectedPrice": expected_price,
            "predictedPrice": predicted_price,
            "profitable": profitable
        }

        properties_collection.insert_one(property_doc)
        return jsonify({"message": "Property added successfully", "property": property_doc})

    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Get all properties (Buyer)
@app.route("/all", methods=["GET"])
def get_properties():
    properties = list(properties_collection.find({}, {"_id": 0}))
    return jsonify(properties)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
