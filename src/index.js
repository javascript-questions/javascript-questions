import './style';
import { Component } from 'preact';
import Intro from './components/Intro';
import Header from './components/Header';

export default class App extends Component {
  state = {
    questions: [],
    questionId: location.hash ? parseInt(location.hash.split('#')[1]) : null,
    revealAnswer: false
  }

  loadQuestions() {
    fetch('./assets/data/questions.json')
      .then(res => res.json())
      .then(questions => this.setState({ questions }));
	}

  componentDidMount() {
    this.loadQuestions();

    window.addEventListener('hashchange', () => this.locationHashChanged(), false);
  }

  locationHashChanged() {
    this.setState({
      questionId: parseInt(location.hash.split('#')[1])
    })
  }

  getQuestion(id) {
    const { questions } = this.state;
    const question = questions.find(question => question.id === id);
    return question;
  }

  getNextQuestion = () => {
    const { questionId } = this.state;
    const nextId = questionId + 1;
    const question = this.getQuestion(nextId);
    if (question) {
      this.setState({ questionId: nextId, revealAnswer: false });
      location.hash = nextId;
    }
    return question;
  }

  getPrevQuestion = () => {
    const { questionId } = this.state;
    const prevId = questionId - 1;
    const question = this.getQuestion(prevId);
    if (question) {
      this.setState({ questionId: prevId, revealAnswer: false });
      window.location.hash = prevId;
    }
    return question;
  }

  revealAnswer = () => {
    this.setState({ revealAnswer: true });
  }

	render({}, { questions, questionId, revealAnswer }) {
    const question = this.getQuestion(questionId);

    if (!questionId) return <Intro />;
    if (!question) return 'Loading activity...';

		return (
      <div>
        <Header question={question} totalQuestions={questions.length} />
        <main className="Box">
          <pre className="Box-header">{question.code}</pre>
          <ul>
            {question.choices.map(choice => (
              <li className="Box-row" onClick={this.revealAnswer} role="button">{choice}</li>
            ))}
          </ul>
          {revealAnswer && <div className="Box-row">{question.answer}</div>}
        </main>

        <button onClick={this.getPrevQuestion}>Prev</button>
        <button onClick={this.getNextQuestion}>Next</button>
      </div>
		);
	}
}
