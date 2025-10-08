from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)
model = joblib.load('model.pkl')

@app.route('/')
def home():
    return "🏠 Boston Housing Price Prediction API Running!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        # Ensure all features are in correct order
        features = [
            data['CRIM'], data['ZN'], data['INDUS'], data['CHAS'], data['NOX'],
            data['RM'], data['AGE'], data['DIS'], data['RAD'], data['TAX'],
            data['PTRATIO'], data['B'], data['LSTAT']
        ]

        prediction = model.predict([features])[0]
        return jsonify({'predicted_MEDV': round(prediction, 2)})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(port=5001, debug=True)
