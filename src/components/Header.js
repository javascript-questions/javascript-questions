import { h } from 'preact';

const Header = ({ question }) => (
	<header className="header">
    <i>1 of 43</i>
    <h2>{question}</h2>
	</header>
);

export default Header;
