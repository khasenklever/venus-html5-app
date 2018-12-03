import React, { Component } from "react"
import { MqttClientContext } from "../index.js"

class MqttTopicWildcard extends Component {
  state = {
    initialized: false
  }

  componentDidUpdate(prevProps) {
    if (!this.state.initialized && this.props.subscribe) {
      this.props.subscribe(this.props.wildcard)
      this.setState({ initialized: true })
    }

    if (prevProps.wildcard !== this.props.wildcard) {
      console.log("New wildcard", prevProps, this.props)
      if (prevProps.wildcard !== null) {
        this.props.unsubscribe(this.props.wildcard)
      }

      this.props.subscribe(this.props.wildcard)
    }
  }

  componentWillUnmount() {
    this.props.unsubscribe(this.props.wildcard)
  }

  render() {
    return <>{this.props.children(this.props.messages)}</>
  }
}

export default props => (
  <MqttClientContext.Consumer>
    {({ subscribe, unsubscribe, getMessagesByWildcard }) => {
      const filteredMessages = getMessagesByWildcard(props.wildcard)
      return (
        <MqttTopicWildcard {...props} subscribe={subscribe} unsubscribe={unsubscribe} messages={filteredMessages} />
      )
    }}
  </MqttClientContext.Consumer>
)