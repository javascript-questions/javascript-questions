import './style';
import { Component, Fragment } from 'preact';
import snarkdown from 'snarkdown';
import Intro from './components/Intro';
import Header from './components/Header';

export default class App extends Component {
  state = {
    questions: [],
    questionId: location.hash ? parseInt(location.hash.split('#')[1]) : null,
    revealAnswer: false
  }

  loadQuestions() {
    fetch('./questions.json')
      .then(res => res.json())
      .then(questions => this.setState({ questions }));
	}

  componentDidMount() {
    this.loadQuestions();
    window.addEventListener('hashchange', () => this.locationHashChanged(), false);
  }

  locationHashChanged() {
    const { questionId } = this.state;
    const newQuestionId = parseInt(location.hash.split('#')[1]);
    if (newQuestionId === questionId) return;
    this.showQuestion(newQuestionId);
    window.scrollTo({ top: 0 });
  }

  getQuestion(id) {
    const { questions } = this.state;
    return questions.find(question => question.id === id);
  }

  showQuestion(id) {
    const question = this.getQuestion(id);
    if (question) {
      this.setState({ questionId: id, revealAnswer: false });
      location.hash = id;
    }
  }

  revealAnswer = () => {
    if (this.state.revealAnswer) return;
    this.setState({ revealAnswer: true });
  }

	render({}, { questions, questionId, revealAnswer }) {
    const totalQuestions = questions.length;
    const question = this.getQuestion(questionId);

    if (!question) return <Intro />;

		return (
      <Fragment>
        <Header question={question} totalQuestions={totalQuestions} />
        <main className="Box">
          <pre className="Box-header">{question.code}</pre>
          <ul>
            {question.choices.map(choice => (
              <li className="Box-row Box-row--hover-gray" onClick={this.revealAnswer} role="button">{choice}</li>
            ))}
          </ul>
          {revealAnswer && <div className="Box-row" dangerouslySetInnerHTML={{__html: snarkdown(question.answer)}} />}
        </main>

        <div class="Pagination">
          <a href={`/#${questionId - 1}`} className="Button Button--purple" rel="prev" disabled={questionId === 1}>Prev</a>
          <i>{questionId} of {totalQuestions}</i>
          <a href={`/#${questionId + 1}`} className="Button Button--purple" rel="next" disabled={questionId === totalQuestions}>Next</a>
        </div>
      </Fragment>
		);
	}
}
