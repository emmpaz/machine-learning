import pandas as pd
import time
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error

class HousePricePredictor:
    def __init__(self, file: str):
        self.df = pd.read_csv(file)
        self.model = None

    def preprocess(self) -> pd.DataFrame:
        self.df = self.df.drop(columns=['id'])
        self.df = self.df.dropna(axis=0, how='any')
        self.df['price'] = pd.to_numeric(self.df['price'])
        self.df['date'] = self.df['date'].str[:4]

        self.df['price_per_sqft'] = self.df['price'] / self.df['sqft_living']
        return self.df

    def split_data(self):
        X = self.df.drop(columns=['price'])
        y = self.df['price']
        X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=42)
        return X_train, X_test, y_train, y_test

    def train_model(self, X_train, y_train):
        forest = RandomForestRegressor(random_state=42)
        print('Training Random Forest model...')
        start = time.time()
        forest.fit(X_train, y_train)
        end = time.time()
        print(f"Training time: {end - start}s")
        self.model = forest

    def evaluate_model(self, X_test, y_test):
        if self.model is None:
            raise ValueError("Model has not been trained yet.")
        y_pred = self.model.predict(X_test)
        mse = mean_squared_error(y_test, y_pred)
        mae = mean_absolute_error(y_test, y_pred)
        print(f"Mean Squared Error: {mse:.2f}")
        print(f"Mean Absolute Error: {mae:.2f}")

    def save_model(self, filename='trained_model.pkl'):
        if self.model is None:
            raise ValueError("Model has not been trained yet.")
        joblib.dump(self.model, filename)
        print(f"Model saved as {filename}")

    def load_model(self, filename='trained_model.pkl'):
        self.model = joblib.load(filename)
        print(f"Model loaded from {filename}")

    def preprocess_input(self, features):
        feature_names = ['date', 'bedrooms', 'bathrooms', 'sqft_living', 'sqft_lot', 'floors', 'waterfront', 'view',
                         'condition', 'grade', 'sqft_above', 'sqft_basement', 'yr_built', 'yr_renovated', 'zipcode',
                         'lat', 'long', 'sqft_living15', 'sqft_lot15']
        preprocessed_features = pd.DataFrame([features], columns=feature_names)
        return preprocessed_features

    def predict_price(self, features):
        if self.model is None:
            raise ValueError("Model has not been trained or loaded.")
        preprocessed_features = self.preprocess_input(features)
        predicted_price = self.model.predict(preprocessed_features)
        return predicted_price[0]

    def get_user_input(self):
        # Get user input for house features
        date = int(input("Enter current year: "))
        bedrooms = int(input("Enter the number of bedrooms: "))
        bathrooms = float(input("Enter the number of bathrooms: "))
        sqft_living = float(input("Enter the square footage of living space: "))
        sqft_lot = float(input("Enter the square footage of the lot: "))
        floors = int(input("Enter the number of floors: "))
        waterfront = int(input("Is the house on a waterfront? (0: No, 1: Yes): "))
        view = int(input("Enter the view rating (0-4): "))
        condition = int(input("Enter the condition rating (1-5): "))
        grade = int(input("Enter the grade rating (1-13): "))
        sqft_above = float(input("Enter the square footage above ground: "))
        sqft_basement = float(input("Enter the square footage of the basement: "))
        yr_built = int(input("Enter the year the house was built: "))
        yr_renovated = int(input("Enter the year the house was last renovated (0 if never renovated): "))
        zipcode = input("Enter the zipcode: ")
        lat = float(input("Enter the latitude: "))
        long = float(input("Enter the longitude: "))
        sqft_living15 = float(input("Enter the average square footage of living space for nearby houses: "))
        sqft_lot15 = float(input("Enter the average square footage of lots for nearby houses: "))

        features = [date, bedrooms, bathrooms, sqft_living, sqft_lot, floors, waterfront, view, condition,
                    grade, sqft_above, sqft_basement, yr_built, yr_renovated, zipcode, lat, long,
                    sqft_living15, sqft_lot15]

        return features

    def main(self):
        self.df = self.preprocess()
        X_train, X_test, y_train, y_test = self.split_data()
        self.train_model(X_train, y_train)
        self.evaluate_model(X_test, y_test)
        self.save_model()

        while True:
            user_input = input("Enter 'p' to predict price, 'q' to quit: ")
            if user_input.lower() == 'p':
                features = self.get_user_input()
                price = self.predict_price(features)
                print(f"Predicted price: ${price:.2f}")
            elif user_input.lower() == 'q':
                break
            else:
                print("Invalid input. Please try again.")

if __name__ == "__main__":
    predictor = HousePricePredictor('./kc_house_data.csv')
    predictor.main()