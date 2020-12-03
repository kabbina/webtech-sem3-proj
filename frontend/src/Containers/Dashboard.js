import { Button, Flex } from "@chakra-ui/core";
import React, { Fragment } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { logout } from "../actions/userActions";

const Dashboard = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const handleGame = () => {
    history.push("/game");
  };
  const handleQuiz = () => {
    history.push("/quiz");
  };
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <Fragment>
      <Flex height="10vh">
        <Button
          variant="outline"
          variantColor="white"
          _hover={{ color: `red.500` }}
          position="absolute"
          top="2"
          right="2"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Flex>
      <Flex align="center" justify="center" height="20vh" direction="column">
        <h1 style={{ fontSize: 2 + "em", margin: 0.67 + "em" + 0 }}>
          Welcome !
        </h1>
      </Flex>
      <Flex align="center" justify="center" height="23vh" direction="column">
        <h3 style={{ marginBottom: 2 + "px", fontSize: 1.3 + "em" }}>
          Would like to play a game
        </h3>
        <Button bg="blue.300" size="lg" type="button" onClick={handleGame}>
          Tic Toc Toe
        </Button>
        <br />
        <Button bg="blue.300" size="lg" type="button" onClick={handleQuiz}>
          Quiz
        </Button>
      </Flex>
    </Fragment>
  );
};

export default Dashboard;
