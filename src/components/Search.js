import React from 'react';
import styled from 'styled-components';
import xpath from 'xpath';
import axios from 'axios';
window.DOMParser = require('xmldom').DOMParser;

const Input = styled.input.attrs({
  // we can define static props
  type: "url",

  // or we can define dynamic ones
  margin: props => props.size || "1em",
  padding: props => props.size || "1em"
})`
  color: black;
  font-size: 1em;
  border: 2px solid green;
  border-radius: 3px;
  size:"2em";
  height:25px;
  width:600px;
  /* here we use the dynamically computed props */
  margin: ${props => props.margin};
  padding: ${props => props.padding};
`;

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      finalTopic: []
    };
    this.changeUrl = this.changeUrl.bind(this);
  }

  componentDidUpdate() {
    axios.get(this.state.url)
      .then(res => {
        const searchResult = res.data;
        const parser = new DOMParser();
        const doc = parser.parseFromString(searchResult);
        const topic = xpath.select("//title", doc)[0].firstChild.data;
        this.setState({ finalTopic: topic });
      })
  }

  changeUrl(event) {
    this.setState({ url: event.target.value });
  }

  render() {
    return (
      <ul>
        <div>
          <form>
            <Input placeholder="Enter an url" id="url" onChange={this.changeUrl} />
          </form>
          {this.state.finalTopic}
        </div>
      </ul>
    )
  }
}