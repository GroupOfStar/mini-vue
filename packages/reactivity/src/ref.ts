import { hasChanged, isObject } from "@mini-vue/shared";
import { trackEffects, type Dep, isTracking, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
  private _raw: any;
  private _value: any;
  private _dep: Dep;
  constructor(raw: any) {
    this._raw = raw;
    this._value = convert(raw);
    this._dep = new Set();
  }
  get value() {
    if (isTracking()) {
      trackEffects(this._dep);
    }
    return this._value;
  }
  set value(newVal) {
    if (hasChanged(newVal, this._raw)) {
      this._value = convert(newVal);
      this._raw = newVal;
      triggerEffects(this._dep);
    }
  }
}

function convert(raw: any) {
  return isObject(raw) ? reactive(raw) : raw;
}

export const ref = (raw: any) => {
  return new RefImpl(raw);
};
