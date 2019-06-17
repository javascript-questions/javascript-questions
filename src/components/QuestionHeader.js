import { h } from 'preact';

const QuestionHeader = ({ question }) => (
	<header className="header">
    <h2>{question.title}</h2>
	</header>
);

export default QuestionHeader;
