// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class NewIdentity extends ethereum.Event {
  get params(): NewIdentity__Params {
    return new NewIdentity__Params(this);
  }
}

export class NewIdentity__Params {
  _event: NewIdentity;

  constructor(event: NewIdentity) {
    this._event = event;
  }

  get identity(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get owners(): Array<Address> {
    return this._event.parameters[1].value.toAddressArray();
  }
}

export class IdentityFactory extends ethereum.SmartContract {
  static bind(address: Address): IdentityFactory {
    return new IdentityFactory("IdentityFactory", address);
  }
}

export class CreateIdentityCall extends ethereum.Call {
  get inputs(): CreateIdentityCall__Inputs {
    return new CreateIdentityCall__Inputs(this);
  }

  get outputs(): CreateIdentityCall__Outputs {
    return new CreateIdentityCall__Outputs(this);
  }
}

export class CreateIdentityCall__Inputs {
  _call: CreateIdentityCall;

  constructor(call: CreateIdentityCall) {
    this._call = call;
  }

  get _owners(): Array<Address> {
    return this._call.inputValues[0].value.toAddressArray();
  }

  get _equities(): Array<BigInt> {
    return this._call.inputValues[1].value.toBigIntArray();
  }
}

export class CreateIdentityCall__Outputs {
  _call: CreateIdentityCall;

  constructor(call: CreateIdentityCall) {
    this._call = call;
  }
}
