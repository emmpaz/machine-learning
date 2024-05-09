import pandas
import time
import joblib
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error

class RandomForest:

    df = ""

    def __init__(self, file : str):
        self.df = pandas.read_csv(file)
        self.df = self.preprocess()
        X_train, X_test, y_train, y_test = self.split()
        self.train_forest(X_train, y_train)

    def preprocess(self) -> pandas.DataFrame:
        self.df = self.df.drop(columns=['id'])
        self.df = self.df.dropna(axis=0, how='any')
        self.df['price'] = pandas.to_numeric(self.df['price'])
        self.df['date'] = self.df['date'].str[:4]
        return self.df


    def split(self):
        X = self.df.drop(columns=['price'])
        y = self.df['price']
        X_train, X_test, y_train, y_test = train_test_split(X, y)
        return X_train, X_test, y_train, y_test

    def train_forest(self, X_train, y_train):
        forest = RandomForestRegressor(random_state=42)
        print('forest time:')
        start = time.time()
        forest.fit(X_train, y_train)
        end = time.time()
        print(f"{end - start}s")
        joblib.dump(forest, 'trained_model.pkl')
        print('File is now in relative path as trained_model.pkl')
        return



def preprocess_input(features):
    # Perform necessary preprocessing steps based on your model's requirements
    # For example, convert categorical variables to numerical, scale features, etc.
    # Append the preprocessed features to the 'preprocessed_features' list
    
    # Convert the preprocessed features to a 2D array
    feature_names = ['date', 'bedrooms', 'bathrooms', 'sqft_living', 'sqft_lot', 'floors', 'waterfront', 'view', 'condition',
                     'grade', 'sqft_above', 'sqft_basement', 'yr_built', 'yr_renovated', 'zipcode', 'lat', 'long',
                     'sqft_living15', 'sqft_lot15']
    preprocessed_features = pandas.DataFrame([features], columns=feature_names)
    
    return preprocessed_features

def predict_price(model, features):
    # Preprocess the features
    preprocessed_features = preprocess_input(features)
    
    # Make the prediction
    predicted_price = model.predict(preprocessed_features)
    
    return predicted_price[0]

def get_user_input():
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


# model = joblib.load('./trained_model.pkl')
# feat = get_user_input()
# price = predict_price(model, feat)
# print(f"Using Random Forest Regressor model, this is the predicted price for the home: ${price}")

def main():
    dec = RandomForest('./kc_house_data.csv')
    return

if __name__ == "__main__":
    main()





