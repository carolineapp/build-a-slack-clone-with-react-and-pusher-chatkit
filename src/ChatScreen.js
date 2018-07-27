import React, { Component } from "react";
import MessageList from "./components/MessageList";
import Chatkit from "@pusher/chatkit";
import SendMessageForm from "./components/SendMessageForm";
import { instanceLocator, chatkitKey, tokenProvider } from "./config.js";

class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {},
      currentRoom: {},
      messages: []
    };
    this.subMessage = this.subMessage.bind(this);
  }

  subMessage(text) {
    console.log("USER", this.state.currentUser);
    this.state.currentUser.sendMessage({
      text,
      roomId: this.state.currentRoom.id
    });
  }
  componentDidMount() {
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: instanceLocator,
      userId: this.props.currentUsername,
      key: chatkitKey,
      tokenProvider: new Chatkit.TokenProvider({
        url: tokenProvider
      })
    });

    chatManager
      .connect()
      .then(currentUser => {
        this.setState({ currentUser });
        console.log("THIS IS USER", currentUser);
        return currentUser.subscribeToRoom({
          roomId: 12490153,
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
    console.log("catching");
  }
  render() {
    console.log(this.state.currentUser);
    const styles = {
      container: {
        height: "100vh",
        display: "flex",
        flexDirection: "column"
      },
      chatContainer: {
        display: "flex",
        flex: 1
      },
      whosOnlineListContainer: {
        width: "300px",
        flex: "none",
        padding: 20,
        backgroundColor: "#2c303b",
        color: "white"
      },
      chatListContainer: {
        padding: 20,
        width: "85%",
        display: "flex",
        flexDirection: "column"
      }
    };

    return (
      <div style={styles.container}>
        <div style={styles.chatContainer}>
          <aside style={styles.whosOnlineListContainer}>
            <h2>Woooooo look at this amazing chat app</h2>
          </aside>
          <section style={styles.chatListContainer}>
            <MessageList
              messages={this.state.messages}
              style={styles.chatList}
            />
            <SendMessageForm onSubmit={this.subMessage} />
          </section>
        </div>
      </div>
    );
  }
}

export default ChatScreen;
