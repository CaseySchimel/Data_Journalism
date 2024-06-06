import json
import matplotlib.pyplot as plt
import pandas as pd


with open('most-popular-car-by-state-2024.json') as f:
    data = json.load(f)


df = pd.DataFrame(data)


most_popular_cars = df['MostPopularCarMostPopular2022']


car_counts = most_popular_cars.value_counts()


plt.figure(figsize=(12, 8))
car_counts.plot(kind='bar', color='skyblue')
plt.title('Most Popular Car Models by State in 2022')
plt.xlabel('Car Model')
plt.ylabel('Number of States')
plt.xticks(rotation=45)
plt.show()
