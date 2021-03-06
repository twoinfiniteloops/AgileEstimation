import React, { useEffect } from "react";
import CardsPanel from './CardSelection/CardsPanel';
import UserTable from './UserTable';
import ResultTable from './ResultTable';
import { useParams } from "react-router-dom";
import { addUser, changeUserName } from "../services/user"
import { changeRoomState } from '../services/room'
import { flushVotes } from '../services/room'
import {
    Button,
    Form,
    Container,
    Row,
    Col
  } from 'react-bootstrap';

const Room = (props) => {
    const isAdmin = props.isAdmin
    const roundState = props.roundState
    const voteList = props.voteList
    const userID = props.userID
    const username = props.username
    const setRoundState = props.setRoundState
    const setUserName = props.setUserName

    // console.log("here", roundState)

    const { id } = useParams()

    /*const auth = async () => {
        if(!localStorage.getItem("authToken")){
            // console.log("auth token yok")
            // console.log("ridddd", id)
            try {
                const result = await addUser(id)
                if(result.status === 200){
                    localStorage.setItem("authToken", result.data.token)
                    setUserName(result.data.username)
                } else{
                    console.log("not 200")
                }
            } catch(e) {
                console.log("hata", e.message)
            }
        }
    }
    auth() */

   useEffect( () => {
        // Anything in here is fired on component mount.
        if(!localStorage.getItem("authToken")){
            // console.log("auth token yok")
            // console.log("ridddd", id)
            addUser(id).then(result => {
            // console.log("her", result)
            if(result.status === 200){
                localStorage.setItem("authToken", result.data.token)
                setUserName(result.data.username)
            } else{
                console.log("not 200")
            }
            }).catch(e => console.log("hata", e.message))
        }
     }, []);
    
    const handleUserNameChange = (event) => {
        event.preventDefault()
        changeUserName(event.target.username.value, localStorage.getItem("authToken"))
        .then(res => {
            console.log("here", res)
            setUserName(event.target.username.value)
        })
        .catch(e => console.log("ereh", e.message))
    }

    return (
        <div>
            <p>
                Username: {username}
            </p>
            <div>
                <form onSubmit={handleUserNameChange}>
                Username:
                <input name="username" placeholder={username}></input>
                <button type="submit">Change username</button>
                </form>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                {roundState && <UserTable userList={props.userList} roundState={roundState} voteList={voteList}/>}
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                {roundState === "finish" ? <ResultTable resultList={props.resultList}/> : null }
            </div>
            <div>
                <Container>
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            {roundState==="voting" 
                            ? <CardsPanel
                                userID={userID}
                                roomID={id}
                            /> 
                            : null}
                        </Col>
                    </Row>
                </Container>
            </div>
            <div>
                {(roundState === "start" || roundState === "finish") && isAdmin 
                ? <Button variant="primary" onClick={() => {
                    changeRoomState("voting", id, localStorage.getItem("authToken") ).then(res => setRoundState("voting")).catch(e => console.log(e.message))
                    //setResultList([])
                    flushVotes(id, localStorage.getItem("authToken"))
                    .then(res => console.log("room votes cleaned!"))
                    .catch(e => console.log("error in flushVotes", e.message))
                }
                }>Start Round</Button> 
                : null}
                {roundState === "voting" && isAdmin 
                ? <Button variant="primary" onClick={() => {
                    changeRoomState("finish", id, localStorage.getItem("authToken") ).then(res => setRoundState("finish")).catch(e => console.log(e.message))
                }}>Finish Round</Button> 
                : null}
            </div>
        </div>
    )
}

export default Room