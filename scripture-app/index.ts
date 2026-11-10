import { Platform } from 'react-native';

if (Platform.OS === 'android') {
  const { registerWidgetTaskHandler } = require('react-native-android-widget');
  const { widgetTaskHandler } = require('./src/widgets/android/widget-task-handler');
  registerWidgetTaskHandler(widgetTaskHandler);
}

import 'expo-router/entry';
