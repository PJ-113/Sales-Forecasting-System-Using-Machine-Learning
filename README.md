# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Backend API (FastAPI)

This project includes a simple FastAPI server under `backend/main.py` that trains a Prophet time‑series model and returns both chart data and evaluation metrics (RMSE/MAPE) derived from the uploaded CSV. To use the frontend you need to start the backend as well:

```powershell
# from workspace root
cd backend
uvicorn main:app --reload --port 8000
```

Make sure the server is running before uploading a file in the UI; otherwise the client will show
"Failed to run prediction. Is the backend server running?" (the alert now also shows any error message returned by the API).
If the frontend cannot reach the backend, a red banner appears just below the dashboard header explaining the issue, e.g. "Cannot connect to backend at http://127.0.0.1:8000/api/forecast". This typically means you need to start the API or adjust `API_URL` if it listens on a different host/port.
The API endpoint is `http://localhost:8000/api/forecast` and accepts a `file` field plus query parameters `model_type` and `timeframe`. It returns a JSON object with:

- `chartData` – array for Recharts
- `insight` – generated insight text
- `rmse` – root‑mean‑square error computed on the historical data
- `mape` – mean absolute percentage error (in percent)

The backend will perform basic preprocessing automatically:

* drop rows missing the required `date` or `sales` columns
* coerce `sales` to numeric, forward/back‑fill any remaining NaNs, and clamp negatives to zero
* create simple time‑based features (`day_of_week` and `month`) and send them to Prophet as additional regressors, which helps the model learn weekday/month effects
* **aggregate/resample** the input series according to the `timeframe` parameter (`Daily`/`Weekly`/`Monthly`) before training; the future dataframe is generated at the same frequency. This is why changing the timeframe now results in different RMSE/MAPE values – the model is actually seeing weekly or monthly totals instead of daily data.

So you can upload raw CSVs without cleaning first; the service will prepare the data before training. Additional features may be added similarly by extending `main.py`.

The React `Controls` panel will now display the real RMSE/MAPE values instead of hard‑coded placeholders.
