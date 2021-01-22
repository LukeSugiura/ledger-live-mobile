// @flow

import Transport from "@ledgerhq/hw-transport";
import { from } from "rxjs";
import { take, first, filter } from "rxjs/operators";
import type { ApduMock } from "../logic/createAPDUMock";
import { hookRejections } from "../components/DebugRejectSwitch";
import { e2eBridgeSubject } from "../../e2e/engine/bridge/client";

export type DeviceMock = {
  id: string,
  name: string,
  apduMock: ApduMock,
};

type Opts = {
  createTransportDeviceMock: (id: string, name: string) => DeviceMock,
};

const defaultOpts = {
  observeState: from([{ type: "PoweredOn", available: true }]),
};

export default (opts: Opts) => {
  const { observeState, createTransportDeviceMock } = {
    ...defaultOpts,
    ...opts,
  };

  return class BluetoothTransportMock extends Transport<DeviceMock | string> {
    static isSupported = (): Promise<boolean> => Promise.resolve(true);

    static observeState = (o: *) => observeState.subscribe(o);

    static list = () => Promise.resolve([]);

    static disconnect = (_id: string) => Promise.resolve();

    static setLogLevel = (_param: string) => {};

    static listen(observer: *) {
      return e2eBridgeSubject
        .pipe(
          filter(msg => msg.type === "add"),
          take(3),
        )
        .subscribe(msg => {
          observer.next({
            type: msg.type,
            descriptor: createTransportDeviceMock(
              msg.payload.id,
              msg.payload.name,
            ),
          });
        });
    }

    static async open(device: *) {
      await e2eBridgeSubject
        .pipe(
          filter(msg => msg.type === "open"),
          first(),
        )
        .toPromise();
      return new BluetoothTransportMock(
        typeof device === "string"
          ? createTransportDeviceMock(device, "")
          : device,
      );
    }

    device: DeviceMock;

    constructor(device: DeviceMock) {
      super();
      this.device = device;
    }

    exchange(apdu: Buffer): Promise<Buffer> {
      return hookRejections(this.device.apduMock.exchange(apdu));
    }

    setScrambleKey() {}

    close(): Promise<void> {
      return this.device.apduMock.close();
    }
  };
};
