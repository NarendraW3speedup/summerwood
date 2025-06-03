import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

const ViewFullScreen = ({ route }) => {
  const { videoUrl } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: videoUrl }}
        style={{ flex: 1 }}
        javaScriptEnabled
        allowsFullscreenVideo
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
};

export default ViewFullScreen;
