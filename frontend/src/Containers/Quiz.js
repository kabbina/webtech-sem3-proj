// import _ from "lodash";
import { Button, Flex } from "@chakra-ui/core";
import React, { Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../actions/quizActions";

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
      quizzesList: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.quizList && nextProps.quizList.length > 0) {
      console.log(nextProps.quizList);
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
        score: score + 1,
      });
    }

    this.setState({
      currentQuestion: this.state.currentQuestion + 1,
    });
    console.log(this.state.currentQuestion);
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentQuestion !== prevState.currentQuestion) {
      this.setState(() => {
        return {
          disabled: true,
          questions: this.state.quizzesList[this.state.currentQuestion]
            .question,
          options: this.state.quizzesList[this.state.currentQuestion].options,
          answer: this.state.quizzesList[this.state.currentQuestion].answer,
        };
      });
    }
  }
  //check answer
  checkAnswer = (answer) => {
    this.setState({ myAnswer: answer, disabled: false });
  };
  finishHandler = () => {
    if (this.state.currentQuestion === this.state.quizzesList.length - 1) {
      this.setState({
        isEnd: true,
      });
    }
    if (this.state.myAnswer === this.state.answer) {
      this.setState({
        score: this.state.score + 1,
      });
    }
  };
  handlequit = () => {
    const { history } = this.props;
    history.goBack();
  };
  render() {
    const { options, myAnswer, currentQuestion, isEnd } = this.state;

    if (isEnd) {
      return (
        <Flex align="center" height="100vh" direction="column">
          <div className="result">
            <h3>Game Over your Final score is {this.state.score} points </h3>
            <div>
              The correct answer's for the questions was
              <ul>
                {this.state.quizzesList.map((item, index) => (
                  <li className="ui floating message options" key={index}>
                    {index + 1 + "." + item.question}
                    <br />
                    {`Answer: ` + item.answer}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Flex>
      );
    } else {
      return (
        <Fragment>
          <Flex
            align="center"
            justify="center"
            height="100vh"
            direction="column"
          >
            <div className="App">
              <span>
                {`Questions ${currentQuestion}  out of ${
                  this.state.quizzesList.length - 1
                } remaining `}
              </span>
              <h1>{this.state.questions}</h1>
              {options.map((option) => (
                <p
                  key={option.id}
                  className={`ui floating message options ${
                    myAnswer === option ? "selected" : null
                  } `}
                  onClick={() => this.checkAnswer(option)}
                >
                  {option}
                </p>
              ))}
              {currentQuestion < this.state.quizzesList.length - 1 && (
                <Flex align="center" justify="center" direction="row">
                  <div
                    style={{
                      // this flex contains a div that has  next and exit buttons
                      display: `inline-flex`,
                      flexWrap: `wrap`,
                      gap: 5 + `vh`,
                    }}
                  >
                    <Button
                      disabled={this.state.disabled}
                      size="lg"
                      variant="solid"
                      onClick={this.nextQuestionHandler}//onclick  
                    >
                      Next
                    </Button>
                    <Button
                      size="md"
                      variant="solid"
                      _hover={{ bg: `red.500` }}
                      onClick={this.handlequit}
                    >
                      exit
                    </Button>
                  </div>
                </Flex>
              )}
              {/* //adding a finish button */}
              {currentQuestion === this.state.quizzesList.length - 1 && (
                <Button
                  size="lg"
                  colorScheme="blue"
                  onClick={this.finishHandler}
                >
                  Finish
                </Button>
              )}
            </div>
          </Flex>
        </Fragment>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    quizList: state.quizDetails.quiz,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Quiz);
