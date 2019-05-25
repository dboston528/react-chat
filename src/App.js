import React from 'react';
import './App.css';
import MessageList from './MessageList';
import SendMessageForm from './SendMessageForm'
import Chatkit from '@pusher/chatkit-client'
import { testToken, instanceLocator, username, roomId } from './config'

// const instanceLocator = "v1:us1:98cbd997-c757-47ca-b5ee-d0c9a83592e6"
// const testToken = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/98cbd997-c757-47ca-b5ee-d0c9a83592e6/token"
// const username = "dboston528"
// const roomId = '19432521';

class App extends React.Component {

  constructor() {
    super()
    this.state = {
      messages: []
    }
    this.sendSimpleMessage = this.sendSimpleMessage.bind(this)
  }

  componentDidMount() {
    const chatManager = new Chatkit.ChatManager({
      instanceLocator,
      userId: username,
      tokenProvider: new Chatkit.TokenProvider({
        url: testToken
      })
    })

    chatManager.connect()
      .then(currentUser => {
        this.currentUser = currentUser
        this.currentUser.subscribeToRoom({
          roomId: roomId,
          hooks: {
            onMessage: message => {
              this.setState({
                messages: [...this.state.messages, message]
              })
            }
          }
        })
      })
  }

  sendSimpleMessage(text) {
    this.currentUser.sendMessage({
      text,
      roomId: roomId
    })
  }


  render() {
    return (
      <div>
        <p className='title'>Chat App</p>
        <MessageList
          messages={this.state.messages}
          roomId={this.state.roomId}
        />
        <SendMessageForm sendMessage={this.sendSimpleMessage} />
      </div>
    )
  }
}

export default App;
