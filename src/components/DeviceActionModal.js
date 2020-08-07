// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import DeviceAction from "./DeviceAction";
import BottomModal from "./BottomModal";
import ModalBottomAction from "./ModalBottomAction";

type Props = {
  // TODO: fix action type
  action: any,
  device: ?Device,
  // TODO: fix request type
  request?: any,
  onClose?: () => void,
  onResult: $PropertyType<React$ElementProps<typeof DeviceAction>, "onResult">,
};

export default function DeviceActionModal({
  action,
  device,
  request,
  onClose,
  onResult,
}: Props) {
  return (
    <BottomModal
      id="DeviceActionModal"
      isOpened={!!device}
      onClose={onClose}
      onResult={onResult}
    >
      {device && (
        <ModalBottomAction
          footer={
            <View style={styles.footerContainer}>
              <DeviceAction
                action={action}
                device={device}
                request={request}
                onClose={onClose}
                onResult={onResult}
              />
            </View>
          }
        />
      )}
    </BottomModal>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: "row",
  },
});
