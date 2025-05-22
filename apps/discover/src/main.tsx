import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/app';
import './styles.scss';
const mezon = {
	ssl: process.env.NX_CHAT_APP_API_SECURE !== 'false'
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>
);
