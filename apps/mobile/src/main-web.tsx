import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import Navigation from './app/navigation';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<StrictMode>
		<Navigation />
	</StrictMode>,
);
