import { Link } from 'react-router-dom';

export default function Guess() {
	return (
		<div>
			<div>Guess</div>
			<Link to="/chat/main">Go to main</Link>
		</div>
	);
}
