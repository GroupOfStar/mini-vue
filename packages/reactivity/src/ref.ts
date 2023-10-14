import { hasChanged, isObject } from "@mini-vue/shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
  private _value: any;
  private _dep: Set<any>;
  private _rawValue: any;
  public __v_isRef = true;
  constructor(value: any) {
    this._rawValue = value;
    this._value = convert(value);
    this._dep = new Set<any>();
  }

  get value() {
    if (isTracking()) {
      trackEffects(this._dep);
    }
    return this._value;
  }

  set value(newValue) {
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue;
      this._value = convert(newValue);
      triggerEffects(this._dep);
    }
  }
}

function convert(value: any) {
  return isObject(value) ? reactive(value) : value;
}

export const ref = (raw: any) => {
  return new RefImpl(raw);
};

export const isRef = (ref: any) => {
  return !!ref.__v_isRef;
};

export const unRef = (ref: any) => {
  return isRef(ref) ? ref.value : ref;
};

export const proxyRefs = (objectWithRefs: any) => {
  return new Proxy(objectWithRefs, {
    get(target, key) {
      return unRef(Reflect.get(target, key));
    },
    set(target, key, value) {
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key].value = value);
      } else {
        return Reflect.set(target, key, value);
      }
    }
  });
};
