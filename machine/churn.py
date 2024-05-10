import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import classification_report

class Churn:
    def __init__(self, filename='churn.csv') -> None:
        self.df = pd.read_csv(filename)
        self.df = self.df.dropna()
        self.df.drop(list(self.df.filter(regex='ID')), axis=1, inplace=True)
    

    def preprocess(self):
        X = self.df.drop(axis=1, columns=['Churn'])
        y = self.df['Churn']

        categorical_columns = X.select_dtypes(include=['object']).columns.to_list()
        X = pd.get_dummies(X, columns=categorical_columns)
        
        y = pd.get_dummies(y, columns=['Churn'])
    
        return X, y
    
    def split(self, X, y):
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=.2, random_state=42)

        return X_train, X_test, y_train, y_test
    
    def train(self, X_train, y_train):
        self.tree = DecisionTreeClassifier()
        self.tree.fit(X_train, y_train)

    def predict(self, X_test, y_test):
        pred = self.tree.predict(X_test)
        ac = classification_report(y_test, pred)
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
