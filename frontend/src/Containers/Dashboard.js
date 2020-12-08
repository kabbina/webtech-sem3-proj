import {
    Button,
    Flex
} from "@chakra-ui/core";
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Header from "./Header";
import "../Containers/Dashboardstyle.css";
const Dashboard = () => {
    const history = useHistory();
    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin;
    const [ userName, setUserName ] = useState('');
    const handleGame = () => {
        history.push({pathname: '/game', state: userName});
    }
    const handleQuiz = () => {
        history.push({pathname: '/quiz', state: userName});
    }
    const emptyCheck = (value) => {
        return value && Object.keys(value).length === 0 && value.constructor === Object;
      }
    useEffect(() => {
        if (userInfo && !emptyCheck(userInfo)) {
            setUserName(userInfo.name);
        }
    }, [userInfo]);
    return (
    <div className = 'dbstyle'>
        <Fragment>
            <Header />
            {userName && <Flex className = 'dbstyle' align="center" justify="center" height="70vh" direction="column">
            <h1 className = 'greet'>Welcome {userName} !</h1>
    
            <h3 className = 'prompt'>Would like to play a game?</h3>
            <Button size="lg" type="button" onClick={handleGame}>Tic Toc Toe</Button> <br/>
            <Button  size="lg" type="button" onClick={handleQuiz}>Quiz</Button>
            </Flex>}
        </Fragment>
        </div>
    )
}

export default Dashboard
