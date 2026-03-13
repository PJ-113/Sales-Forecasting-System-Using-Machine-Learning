import csv
import random
from datetime import datetime, timedelta

def generate_mock_sales_data(filename, days_back=365):
    """Generates synthetic daily sales data for testing."""
    start_date = datetime.now() - timedelta(days=days_back)
    
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        # Header matching typical forecasting datasets (like M5)
        writer.writerow(['date', 'item_id', 'store_id', 'sales', 'sell_price'])
        
        base_sales = 200
        for i in range(days_back):
            current_date = start_date + timedelta(days=i)
            
            # Simulate weekend spikes
            is_weekend = current_date.weekday() >= 5
            seasonality = 150 if is_weekend else 0
            
            # Add some linear growth trend
            trend = i * 0.5
            
            # Random noise
            noise = random.randint(-30, 50)
            
            sales = max(0, int(base_sales + trend + seasonality + noise))
            price = round(random.uniform(10.5, 12.99), 2)
            
            writer.writerow([
                current_date.strftime('%Y-%m-%d'),
                'ITEM_1032',
                'STORE_01',
                sales,
                price
            ])
            
if __name__ == '__main__':
    generate_mock_sales_data('sample_sales_data.csv', 365)
    print("Created sample_sales_data.csv successfully!")
