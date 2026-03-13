from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
from prophet import Prophet
import json
import io

app = FastAPI()

# Allow frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/forecast")
async def forecast_sales(file: UploadFile = File(...), model_type: str = "Prophet", timeframe: str = "Daily"):
    try:
        # Read uploaded CSV
        contents = await file.read()
        df_raw = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        # Expecting at least 'date' and 'sales' columns
        if 'date' not in df_raw.columns or 'sales' not in df_raw.columns:
            return JSONResponse(status_code=400, content={"error": "CSV must contain 'date' and 'sales' columns."})

        # Drop rows where the essential fields are missing
        df_raw = df_raw.dropna(subset=['date', 'sales'])

        # coerce sales to numeric and fill/clip negative
        df_raw['sales'] = pd.to_numeric(df_raw['sales'], errors='coerce')
        # if there are still NaNs after coercion, forward-fill then backfill
        df_raw['sales'] = df_raw['sales'].ffill()
        df_raw['sales'] = df_raw['sales'].bfill()

        # Convert 'date' column immediately so resampling works correctly
        df_raw['date'] = pd.to_datetime(df_raw['date'])

        # Resample according to requested timeframe (aggregate sales)
        # This change is what makes RMSE/MAPE differ when timeframe changes
        if timeframe == 'Weekly':
            # sum sales by week (using Monday as the week start)
            df_resampled = df_raw.set_index('date').resample('W-MON')['sales'].sum().reset_index()
        elif timeframe == 'Monthly':
            df_resampled = df_raw.set_index('date').resample('ME')['sales'].sum().reset_index()
        else:
            df_resampled = df_raw.copy()

        # Basic feature engineering: day of week and month (on resampled dates)
        df_resampled['day_of_week'] = df_resampled['date'].dt.weekday
        df_resampled['month'] = df_resampled['date'].dt.month

        # Prepare for Prophet: rename to 'ds' and 'y'
        df = df_resampled[['date', 'sales', 'day_of_week', 'month']].copy()
        df.columns = ['ds', 'y', 'day_of_week', 'month']
        
        # Ensure ds is datetime
        df['ds'] = pd.to_datetime(df['ds'])

        # Initialize and Train Prophet Model
        m = Prophet(daily_seasonality=True if timeframe == 'Daily' else False,
                    weekly_seasonality=True,
                    yearly_seasonality=True)
        # if feature columns exist, add as regressors
        if 'day_of_week' in df.columns:
            m.add_regressor('day_of_week')
        if 'month' in df.columns:
            m.add_regressor('month')
        
        m.fit(df)

        # Determine frequency for future dataframe based on timeframe
        freq = 'D' if timeframe == 'Daily' else ('W-MON' if timeframe == 'Weekly' else 'M')
        # Create future dataframe (30 periods for demo)
        future = m.make_future_dataframe(periods=30, freq=freq)
        # add engineered features for the future dates if model uses them
        future['day_of_week'] = future['ds'].dt.weekday
        future['month'] = future['ds'].dt.month
        
        # Predict
        forecast = m.predict(future)

        # Merge actuals with forecasts for the chart
        # We need historical actuals + historical forecast (fitted) + future forecast
        
        chart_data = []

        # Before converting to strings, compute evaluation metrics on historical portion
        merged = pd.merge(df, forecast[['ds', 'yhat']], on='ds')
        # RMSE and MAPE calculations (avoid divide-by-zero for mape)
        merged['error'] = merged['y'] - merged['yhat']
        rmse_val = float((merged['error'] ** 2).mean() ** 0.5)
        # filter zeros to prevent infinite MAPE
        nonzero = pd.Series(merged['y'] != 0)
        if nonzero.any():
            mape_val = float((merged.loc[nonzero, 'error'].abs() / merged.loc[nonzero, 'y']).mean() * 100)
        else:
            mape_val = None

        # Convert datetimes back to strings for JSON
        df['ds_str'] = df['ds'].dt.strftime('%b %d, %Y')
        forecast['ds_str'] = forecast['ds'].dt.strftime('%b %d, %Y')

        # Build Historical Array
        actuals_dict = dict(zip(df['ds_str'], df['y']))
        
        for index, row in forecast.iterrows():
            date_str = row['ds_str']
            val_actual = actuals_dict.get(date_str, None)
            val_forecast = row['yhat']
            
            # For data points where we have actuals, we don't necessarily show the forecast line
            # or we show it alongside. For the demo chart to look like earlier:
            if val_actual is not None:
                chart_data.append({
                    "date": date_str,
                    "actual": float(max(0, val_actual)),  # Ensure non-negative
                    "forecast": None
                })
            else:
                # This is a future point
                chart_data.append({
                    "date": date_str,
                    "actual": None,
                    "forecast": float(max(0, val_forecast))
                })
        
        # Connect the lines (give the last historical point a forecast value equal to its actual)
        last_historical_idx = len(df) - 1
        if last_historical_idx >= 0 and last_historical_idx + 1 < len(chart_data):
            # The point right at the boundary
            chart_data[last_historical_idx]["forecast"] = chart_data[last_historical_idx]["actual"]

        # Generate a dynamic insight string
        trend = "แนวโน้มขาขึ้น (Upward Trend)" if forecast['trend'].iloc[-1] > forecast['trend'].iloc[0] else "แนวโน้มขาลง (Downward Trend)"
        growth_pct = abs((forecast['trend'].iloc[-1] - forecast['trend'].iloc[0]) / forecast['trend'].iloc[0] * 100)
        
        insight_text = (
            f" จากการวิเคราะห์ข้อมูลประวัติยอดขาย โมเดล {model_type} ตรวจพบ{trend} "
            f"โดยมีอัตราการเปลี่ยนแปลงโดยประมาณ {growth_pct:.1f}% ตลอดช่วงเวลาของชุดข้อมูล "
            f"นอกจากนี้ยังพบรูปแบบผลกระทบตามฤดูกาลรายสัปดาห์ (Weekly Seasonality) อย่างชัดเจน เราขอแนะนำให้คุณปรับเปลี่ยนแผนการรับสินค้าและจัดโปรโมชัน "
            f"ให้สอดคล้องกับช่วงวันที่มีความต้องการซื้อสูงสุดตามฤดูกาลที่คาดการณ์ไว้"
        )

        # include evaluation metrics in response
        resp = {
            "chartData": chart_data,
            "insight": insight_text,
            "rmse": rmse_val,
            "mape": mape_val
        }
        return resp

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
