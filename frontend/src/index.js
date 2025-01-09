import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import { Provider } from 'react-redux';
import store from './redux/store';
// import { ThemeProvider } from "@material-tailwind/react";

import './index.css';

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => {
      resolve(true);
    };
    document.body.appendChild(script);
  });
};

const AppWrapper = () => {
  useEffect(() => {
    loadScript("https://apis.google.com/js/platform.js");
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AppWrapper />);

// reportWebVitals();
