import { ComponentInternalInstance, Data } from './component'

export const initProps = (instance: ComponentInternalInstance, props: Data) => {
  instance.props = props
}
