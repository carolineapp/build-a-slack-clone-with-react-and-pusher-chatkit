import React, { Component } from "react";
import MessageList from "./MessageList";
import Chatkit from "@pusher/chatkit";
import SendMessageForm from "./SendMessageForm";

class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {},
      currentRoom: {},
      messages: []
    };
    this.submitMessage = this.submitMessage.bind(this);
  }

  submitMessage(text) {
    this.state.currentUser.sendMessage({
      text,
      roomId: this.state.currentRoom.id
    });
  }
  componentDidMount() {
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: process.env.REACT_APP_PUSHER_INSTANCE,
      userId: this.props.currentUsername,
      key: process.env.REACT_APP_PUSHER_KEY,
      tokenProvider: new Chatkit.TokenProvider({
        url: process.env.REACT_APP_PUSHER_URL
      })
    });

    chatManager
      .connect()
      .then(currentUser => {
        this.setState({ currentUser });
        return currentUser.subscribeToRoom({
          roomId: 12921462,
          messageLimit: 100,
          hooks: {
            onNewMessage: message => {
              this.setState({
                messages: [...this.state.messages, message]
              });
            }
          }
        });
      })
      .then(currentRoom => {
        this.setState({ currentRoom });
      })
      .catch(error => console.error("error", error));
  }
  render() {
    const styles = {
      container: {
        height: "100vh",
        display: "flex"
      },
      chatContainer: {
        display: "flex"
      },
      whosOnlineListContainer: {
        width: "100%",
        height: "100px",
        flex: "none",
        padding: 20,
        backgroundColor: "#002980",
        color: "white"
        textAlign: "center"
      },
      chatListContainer: {
        padding: 20,
        width: "100%",
        display: "flex",
        flexDirection: "column"
      }
    };

    return (
      <div style={styles.container}>
        <div style={styles.whosOnlineListContainer}>
          <h2>Networky</h2>
        </div>
        <div style={styles.chatContainer}>
          <section style={styles.chatListContainer}>
            <MessageList
              messages={this.state.messages}
              style={styles.chatList}
            />
            <SendMessageForm onSubmit={this.submitMessage} />
          </section>
        </div>
      </div>
    );
  }
}

export default ChatScreen;
