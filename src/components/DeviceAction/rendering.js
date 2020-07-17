// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
// import LottieView from "lottie-react-native";
import LText from "../LText";
import getWindowDimensions from "../../logic/getWindowDimensions";
import Spinning from "../Spinning";
import LiveLogo from "../../icons/LiveLogoIcon";
import colors from "../../colors";
import Button from "../Button";
import { NavigatorName } from "../../const";
import Warning from "../../icons/Warning";

// const anims = {
//   pairing: {
//     anim: require("../../animations/pairing.json"),
//     imageAssetsFolder: undefined,
//   },
// };

type RawProps = {
  t: (key: string, options?: { [key: string]: string }) => string,
};

export function renderAllowOpeningApp({ wording }: { wording: string }) {
  return (
    <View>
      <LText>Open {wording} App</LText>
    </View>
  );
}

export function renderConnectYourDevice() {
  return (
    <View>
      <LText>Connect your device</LText>
    </View>
  );
}

export function renderLoading({ t }: RawProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.spinnerContainer}>
        <Spinning>
          <LiveLogo size={32} color={colors.grey} />
        </Spinning>
      </View>
      <LText style={styles.text}>{t("DeviceAction.loading")}</LText>
    </View>
  );
}

type WarningOutdatedProps = {
  ...RawProps,
  navigation: any,
  appName: string,
  passWarning: () => void,
};

export function renderWarningOutdated({
  t,
  navigation,
  appName,
  passWarning,
}: WarningOutdatedProps) {
  function onOpenManager() {
    navigation.navigate(NavigatorName.Manager);
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.warningIconContainer}>
        <Warning size={28} color={colors.yellow} />
      </View>
      <LText style={[styles.text, styles.title]} bold>
        {t("DeviceAction.outdated")}
      </LText>
      <LText style={[styles.text, styles.description]} semiBold>
        {t("DeviceAction.outdatedDesc", { appName })}
      </LText>
      <View style={styles.actionContainer}>
        <Button
          event="DeviceActionWarningOutdatedContinue"
          type="secondary"
          title={t("common.continue")}
          onPress={passWarning}
          outline={false}
          containerStyle={styles.button}
        />
        <Button
          event="DeviceActionWarningOutdatedOpenManager"
          type="primary"
          title={t("DeviceAction.button.openManager")}
          onPress={onOpenManager}
          containerStyle={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 160,
  },
  anim: {
    width: getWindowDimensions().width - 2 * 16,
  },
  text: {
    color: colors.darkBlue,
  },
  warningIconContainer: {
    padding: 8,
  },
  title: {
    padding: 8,
  },
  description: {
    color: colors.grey,
    padding: 8,
  },
  spinnerContainer: {
    padding: 24,
  },
  button: {
    margin: 8,
  },
  actionContainer: {
    flexDirection: "row",
  },
});
