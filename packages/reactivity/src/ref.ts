import { hasChanged, isObject } from "@mini-vue/shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
  private _value: any;
  private _dep: Set<any>;
  private _rawValue: any;
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
