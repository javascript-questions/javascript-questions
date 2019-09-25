import { h } from 'preact';

const QuestionHeader = ({ question }) => (
	<header class="QuestionHeader">
    <h2>{question.title}</h2>
	</header>
);

export default QuestionHeader;
