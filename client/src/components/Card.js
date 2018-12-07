import React, { Component } from 'react';
import './Card.css';


class Card extends Component {
	render(){
		return(
				<li className="Card-Container">		
					<span>{this.props.body}</span><br/>
					<span className="Card-Author">- {this.props.author}</span>
				</li>
			)
	}
}

export default Card;