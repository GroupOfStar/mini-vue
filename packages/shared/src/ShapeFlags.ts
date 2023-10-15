export const enum ShapeFlags {
  /** element 节点类型 */
  ELEMENT = 1, // 0001
  /** 有状态的组件类型 */
  STATEFUL_COMPONENT = 1 << 1, // 0010
  /** 文本节点 */
  TEXT_CHILDREN = 1 << 2, // 0100
  /** 数组节点 */
  ARRAY_CHILDREN = 1 << 3 // 1000
}
