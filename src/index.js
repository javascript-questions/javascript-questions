import './style';
import { Component } from 'preact';
import Intro from './components/Intro';
import Header from './components/Header';

export default class App extends Component {
  state = {
    pending: true,
    questions: []
  }

  loadQuestions() {
    fetch('./assets/data/questions.json')
      .then(res => res.json())
      .then(questions => this.setState({
        pending: false,
        questions
      }));
	}

  componentDidMount() {
    this.loadQuestions();
  }

	render({}, { pending, questions }) {
    if (pending) return 'Loading activity...';

    const question = questions[0];

		return (
      <div>
        <Intro />
        <Header question={question.title} />
        <pre>{question.code}</pre>
        <ul>
          {question.choices.map(choice => (
            <li>{choice}</li>
          ))}
        </ul>
      </div>
		);
	}
}
