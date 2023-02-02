import { ComponentChildren } from 'preact'

interface ContainerProps {
  children: ComponentChildren;
}

const Container = (props: ContainerProps) => {
  return (
    <div className="container">
      {props.children}
    </div>
  )
}

export default Container;