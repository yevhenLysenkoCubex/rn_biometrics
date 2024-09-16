import { Image, StyleSheet, Button } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function PublicScreen() {
  const router = useRouter();

  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [_, setBiometricAuthResult] = useState<boolean | null>(null);

  useEffect(() => {
    const checkBiometricSupport = async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricsEnabled(hasHardware && isEnrolled);
    };

    checkBiometricSupport();
  }, []);

  const handleBiometric = async () => {
    if (biometricsEnabled) {
      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Authenticate with Biometrics",
          fallbackLabel: "Use PIN",
        });

        if (result.success) {
          setBiometricAuthResult(true);
          router.replace("/(tabs)");
        } else {
          setBiometricAuthResult(false);
          return;
        }
      } catch (error) {
        console.error("Error during biometric authentication:", error);
      }
    } else {
      console.log("Biometric authentication is not enabled or available");
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.container}>
        <Button
          title="Sign in via biometric"
          disabled={!biometricsEnabled}
          onPress={handleBiometric}
        />
        <ThemedText>Use real device</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
