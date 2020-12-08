import {
  Button,
  Flex
} from "@chakra-ui/core";
import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/quizActions';
import * as storeActions from '../actions/winnerActions';
import "../Containers/Quizstyle.css";

class Quiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentQuestion: 0,
      myAnswer: null,
      options: [],
      score: 0,
      disabled: true,
      isEnd: false,
      quizzesList: []
    };
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.quizList && nextProps.quizList.length > 0) {
      const quizData = nextProps.quizList;
      this.setState({
          questions: quizData[this.state.currentQuestion].question,
          answer: quizData[this.state.currentQuestion].answer,
          options: quizData[this.state.currentQuestion].options,
          quizzesList: quizData,
      });
    }
  }
  loadQuizData = () => {
    this.props.actions.getQuizDetails();
  };

  componentDidMount() {
    this.loadQuizData();
  }
  nextQuestionHandler = () => {
    const { myAnswer, answer, score } = this.state;

    if (myAnswer === answer) {
      this.setState({
        score: score + 1
      });
    }

    this.setState({
      currentQuestion: this.state.currentQuestion + 1
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentQuestion !== prevState.currentQuestion) {
      this.setState(() => {
        return {
          disabled: true,
          questions: this.state.quizzesList[this.state.currentQuestion].question,
          options: this.state.quizzesList[this.state.currentQuestion].options,
          answer: this.state.quizzesList[this.state.currentQuestion].answer
        };
      });
    }
    if (this.state.isEnd !== prevState.isEnd) {
      this.props.storeActions.storeTicToeWinner(this.props.userDetails.name, 'quiz', this.state.score);
    }
  }
  //check answer
  checkAnswer = (answer) => {
    this.setState({ myAnswer: answer, disabled: false });
  };
  finishHandler = () => {
    if (this.state.currentQuestion === this.state.quizzesList.length - 1) {
      this.setState({
        isEnd: true
      });
    }
    if (this.state.myAnswer === this.state.answer) {
      this.setState({
        score: this.state.score + 1
      });
    }
  };
  render() {
    const { options, myAnswer, currentQuestion, isEnd } = this.state;

    if (isEnd) {
      return (
        <Flex className = 'page'align="center" justify="center" height="100vh" direction="column">
        <div className="result">
          <h2 className = "score">Game Over! Your Final score is: {this.state.score} points </h2>
          <div>
            The correct answers for the questions were
            <ul>
              {this.state.quizzesList.map((item, index) => (
                <li className="ui floating message options" key={index}>
                  {item.answer}
                </li>
              ))}
            </ul>
          </div>
        </div>
        </Flex>
      );
    } else {
      return (
        <Flex className = 'page2' align="center" justify="center" height="100vh" direction="column">
        <div className="App">
          <span className = 'Qno'>{`Question ${currentQuestion + 1 }  out of ${
            this.state.quizzesList.length
          } `}</span>
          <h1 className = 'Question'>{this.state.questions} </h1>
          {options.map((option) => (
            <p
              key={option._id}
              className={`ui floating message options
         ${myAnswer === option ? "selected" : null}
         `}
              onClick={() => this.checkAnswer(option)}
            >
              {option}
            </p>
          ))}
          {currentQuestion < this.state.quizzesList.length - 1 && (
            <Button
              disabled={this.state.disabled}
              onClick={this.nextQuestionHandler}
              size="lg"
              colorScheme="blue"
            >
              Next
            </Button>
          )}
          {/* //adding a finish button */}
          {currentQuestion === this.state.quizzesList.length - 1 && (
            <Button size="lg" colorScheme="blue" onClick={this.finishHandler}>
              Finish
            </Button>
          )}
        </div>
        </Flex>
      );
    }
  }
}
function mapStateToProps(state) {
  return {
    quizList: state.quizDetails.quiz,
    userDetails: state.userLogin.userInfo,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    storeActions: bindActionCreators(storeActions, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Quiz);

