import React, { useState } from 'react';
import { View, Button, Text, SafeAreaView, ScrollView } from 'react-native';
import { Passkey } from 'react-native-passkey';
import { btoa, atob } from 'react-native-quick-base64'

const ASSOCIATED_DOMAIN = '8d36-62-217-235-172.ngrok-free.app'

export default function App() {
  const [log, setLog] = useState<string[]>([]);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  const addLog = (message: string) => {
    setLog(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  // Test bytes we want to store and retrieve
  const TEST_BYTES = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  const checkSupport = async () => {
    const supported = Passkey.isSupported();
    setIsSupported(supported);
    addLog(`Passkey support: ${supported}`);
  };

  const createPasskey = async () => {
    try {
      // Convert our test bytes to base64url string
      const userIdBase64 = btoa(String.fromCharCode(...TEST_BYTES));
      
      // Create challenge bytes
      const challenge = new Uint8Array([0, 1, 2]);
      const challengeBase64 = btoa(String.fromCharCode(...challenge));

      addLog('Creating passkey...');
      addLog(`Original bytes: ${TEST_BYTES.join(',')}`);
      addLog(`Encoded userId: ${userIdBase64}`);

      const result = await Passkey.createPlatformKey({
        challenge: challengeBase64,
        rp: {
          name: 'Passkey Test App',
          id: ASSOCIATED_DOMAIN,
        },
        user: {
          id: userIdBase64,
          name: 'test_user',
          displayName: 'Test User',
        },
        pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          requireResidentKey: true,
          residentKey: 'required',
        },
        timeout: 60000,
        attestation: 'none',
      });

      addLog('Passkey created successfully');
      addLog(JSON.stringify(result, null, 2));
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
      addLog(`Error creating passkey: ${JSON.stringify(error, null, 2)}`);
    }
  };

  const getPasskey = async () => {
    try {
      // Create challenge bytes (same as creation)
      const challenge = new Uint8Array([0, 1, 2]);
      const challengeBase64 = btoa(String.fromCharCode(...challenge));

      addLog('Getting passkey...');

      const result = await Passkey.getPlatformKey({
        challenge: challengeBase64,
        rpId: ASSOCIATED_DOMAIN,
        allowCredentials: [], // Empty for discoverable credentials
        timeout: 60000,
      });

      addLog('Passkey retrieved successfully');
      addLog(JSON.stringify(result, null, 2));

      // Try to decode the userHandle to verify our bytes
      if (result.response.userHandle) {
        const decoded = atob(result.response.userHandle);
        const decodedBytes = new Uint8Array([...decoded].map(c => c.charCodeAt(0)));
        addLog(`Retrieved bytes: ${decodedBytes.join(',')}`);
        
        // Verify if bytes match
        const match = TEST_BYTES.every((byte, i) => byte === decodedBytes[i]);
        addLog(`Bytes match: ${match}`);
      } else {
        addLog('No userHandle in response');
      }
    } catch (error) {
      addLog(`Error getting passkey: ${error}`);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 20, marginBottom: 20 }}>Passkey POC</Text>
        <Button title="Check Support" onPress={checkSupport} />
        <Text style={{ marginVertical: 10 }}>
          Supported: {isSupported === null ? 'Unknown' : String(isSupported)}
        </Text>
        <Button title="Create Passkey" onPress={createPasskey} />
        <View style={{ height: 10 }} />
        <Button title="Get Passkey" onPress={getPasskey} />
        <ScrollView 
          style={{ 
            marginTop: 20, 
            padding: 10, 
            backgroundColor: '#f0f0f0', 
            maxHeight: 400 
          }}
        >
          {log.map((entry, i) => (
            <Text key={i} style={{ marginBottom: 5 }}>{entry}</Text>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}