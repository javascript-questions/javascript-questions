import { h } from 'preact';

const Header = ({ question, totalQuestions }) => (
	<header className="header">
    <i>{question.id} of {totalQuestions}</i>
    <h2>{question.title}</h2>
	</header>
);

export default Header;
