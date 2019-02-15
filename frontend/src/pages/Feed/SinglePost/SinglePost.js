import React, { Component } from 'react'

import Image from '../../../components/Image/Image'
import './SinglePost.css'

import axios from 'axios'
const API_URL = 'http://localhost:3000/api/'

class SinglePost extends Component {
  state = {
    title: '',
    author: '',
    date: '',
    image: '',
    content: ''
  }

  componentDidMount = async () => {
    const postId = this.props.match.params.postId
    try {
      let resData = await axios.get(API_URL + 'feed/post/' + postId)
      console.log("post ", resData)
      this.setState({
        title: resData.post.title,
        author: resData.post.creator.name,
        image: API_URL + resData.post.imageUrl,
        date: new Date(resData.post.createdAt).toLocaleDateString('en-US'),
        content: resData.post.content
      })
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className="single-post__image">
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.content}</p>
      </section>
    )
  }
}

export default SinglePost
