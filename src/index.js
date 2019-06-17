import './style';
import { Component } from 'preact';
import snarkdown from 'snarkdown';
import Intro from './components/Intro';
import Header from './components/Header';
import LoadingActiviy from './components/LoadingActiviy';

export default class App extends Component {
  state = {
    questions: [],
    questionId: location.hash ? parseInt(location.hash.split('#')[1]) : null,
    revealAnswer: false,
    userAnswers: []
  }

  loadQuestions() {
    fetch('./assets/questions.json')
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

  updateUserChoice = ({ questionId, choiceId }) => {
    const { userAnswers } = this.state;
    const newAnswer = { questionId, choiceId };
    const index = userAnswers.findIndex(({ questionId }) => questionId === questionId);

    if (index === -1) {
      userAnswers.push(newAnswer);
    } else {
      userAnswers[index] = newAnswer;
    }

    this.setState({ userAnswers });
  }

  revealAnswer = choiceId => {
    if (this.state.revealAnswer) return;
    this.setState({ revealAnswer: true });
  }

	render({}, { questions, questionId, userAnswers, revealAnswer }) {
    const totalQuestions = questions.length;
    const question = this.getQuestion(questionId);
    const userAnswer = userAnswers.find(answer => answer.questionId === questionId);

    if (!questionId) return <Intro />;
    if (!question) return <LoadingActiviy />;

		return (
      <>
        <Header question={question} totalQuestions={totalQuestions} />
        <main className="Box">
          <pre className="Box-header">{question.code}</pre>
          <ul>
            {question.choices.map((choice, choiceId) => (
              <li
                className="Box-row Box-row--hover-gray"
                dangerouslySetInnerHTML={{__html: snarkdown(choice)}}
                data-selected={userAnswer && userAnswer.choiceId === choiceId}
                onClick={() => {
                  this.updateUserChoice({questionId, choiceId});
                  this.revealAnswer();
                }}
              />
            ))}
          </ul>
          {revealAnswer && <div className="Box-row" dangerouslySetInnerHTML={{__html: snarkdown(question.answer)}} />}
        </main>

        <div class="Pagination">
          <a href={`/#${questionId - 1}`} className="Button Button--purple" rel="prev" disabled={questionId === 1}>Prev</a>
          <i>{questionId} of {totalQuestions}</i>
          <a href={`/#${questionId + 1}`} className="Button Button--purple" rel="next" disabled={questionId === totalQuestions}>Next</a>
        </div>
      </>
		);
	}
}
