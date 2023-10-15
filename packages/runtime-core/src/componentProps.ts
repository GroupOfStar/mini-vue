import { ComponentInternalInstance, Data } from "./component";

export const initProps = (instance: ComponentInternalInstance, props: Data) => {
  console.log("instance :>> ", instance);
  instance.props = props;
};
