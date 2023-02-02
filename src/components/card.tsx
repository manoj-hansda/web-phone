import { ComponentChildren } from "preact";

interface CardProps {

  children: ComponentChildren;
}

const Card = (props: CardProps) => {

  return (
    <div className="card">
      {props.children}
    </div>
  )
}

export default Card;