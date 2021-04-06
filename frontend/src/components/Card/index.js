import React from 'react'
import './Card.css'

const Card = ({cardInfo}) => {
    const { image, title, text } = cardInfo

    return (
      <div className="card-container">
        <img className="card-image" src={image} alt="card" />
        <p>{title}</p>
        <p>{text}</p>
      </div>
    );
}

export default Card