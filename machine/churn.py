import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import classification_report
from sklearn.preprocessing import LabelEncoder

class Churn:
    def __init__(self, filename='churn.csv') -> None:
        self.df = pd.read_csv(filename)
        self.df = self.df.dropna()
        self.df.drop(list(self.df.filter(regex='ID')), axis=1, inplace=True)
    

    def preprocess(self):
        X = self.df.drop(axis=1, columns=['Churn'])
        y = self.df['Churn']

        tenure_bins = [0, 12, 24, 48, float('inf')]
        tenure_labels = ['Short', 'Medium', 'Long', 'Very Long']

        X['TenureLevel'] = pd.cut(X['tenure'], bins=tenure_bins, labels=tenure_labels, right=False)
        X = X.drop('tenure', axis=1)

        categorical_columns = X.select_dtypes(include=['object', 'category']).columns.to_list()
        X = pd.get_dummies(X, columns=categorical_columns)
        y = pd.get_dummies(y, columns=['Churn'])
        return X, y
    
    def split(self, X, y):
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=.2, random_state=42)

        return X_train, X_test, y_train, y_test
    
    def train(self, X_train, y_train):
        self.tree = DecisionTreeClassifier(random_state=42)
        self.tree.fit(X_train, y_train)

    def predict(self, X_test, y_test):
        pred = self.tree.predict(X_test)
        ac = classification_report(y_test, pred, zero_division=1)
        print(ac)
    
    def main(self):
        X, y = self.preprocess()
        X_train, X_test, y_train, y_test = self.split(X, y)
        self.train(X_train, y_train)
        self.predict(X_test, y_test)
        return

if __name__ == "__main__":
    churn = Churn()
    churn.main()
