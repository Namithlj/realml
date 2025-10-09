from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import joblib
import os
from random import uniform, randint, choice
from urllib.parse import quote_plus

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB connection
db_user = os.environ.get("MONGO_USER")  # e.g., 'namith'
db_pass = os.environ.get("MONGO_PASS")  # e.g., 'Namith@0'
db_name = os.environ.get("MONGO_DB")    # e.g., 'realml'

mongo_uri = f"mongodb+srv://{db_user}:{quote_plus(db_pass)}@realml.notixq1.mongodb.net/{db_name}?retryWrites=true&w=majority&appName=Realml"
client = MongoClient(mongo_uri)
db = client[db_name]
properties_collection = db.properties

# Seed demo data if empty
def seed_demo_data():
    if properties_collection.count_documents({}) == 0:
        demo_locations = ["Bangalore", "Chennai", "Hyderabad", "Pune", "Mumbai"]
        for _ in range(5):
            features = {f: round(uniform(0, 10), 2) for f in 
                ["CRIM","ZN","INDUS","CHAS","NOX","RM","AGE","DIS","RAD","TAX","PTRATIO","B","LSTAT"]}
            features["CHAS"] = choice([0, 1])
            expected = round(uniform(100000, 500000), 2)
            predicted = round(expected * uniform(0.8, 1.2), 2)
            doc = {
                "sellerName": f"Demo Seller {_+1}",
                "email": f"demo{_+1}@example.com",
                "phone": f"99999{randint(10000,99999)}",
                "location": choice(demo_locations),
                "features": features,
                "expectedPrice": expected,
                "predictedPrice": predicted,
                "profitable": predicted > expected
            }
            properties_collection.insert_one(doc)
        print("✅ Demo properties inserted")
    else:
        print("ℹ️ Database already contains properties; skipping seeding.")

# Call during startup
seed_demo_data()

# Load ML model
model = joblib.load("ml/model.pkl")  # Ensure this file exists

@app.route("/")
def home():
    return "🏠 RealEstateML Flask Backend Running!"

@app.route("/add", methods=["POST"])
def add_property():
    data = request.get_json()
    required_fields = [
        "sellerName", "email", "phone", "location",
        "CRIM","ZN","INDUS","CHAS","NOX","RM","AGE","DIS",
        "RAD","TAX","PTRATIO","B","LSTAT","expectedPrice"
    ]

    # Check for missing fields
    for f in required_fields:
        if f not in data:
            return jsonify({"error": f"Missing field: {f}"}), 400

    try:
        # Convert to floats for ML
        features = [float(data[f]) for f in required_fields[4:]]
        predicted_price = float(model.predict([features])[0])
        expected_price = float(data.get("expectedPrice", 0))
        profitable = predicted_price > expected_price

        property_doc = {
            "sellerName": data["sellerName"],
            "email": data["email"],
            "phone": data["phone"],
            "location": data["location"],
            "features": {k: float(data[k]) for k in required_fields[4:-1]},
            "expectedPrice": expected_price,
            "predictedPrice": predicted_price,
            "profitable": profitable
        }

        properties_collection.insert_one(property_doc)
        return jsonify({"message": "Property added successfully", "property": property_doc}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/all", methods=["GET"])
def get_properties():
    properties = list(properties_collection.find({}, {"_id": 0}))
    return jsonify(properties)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
