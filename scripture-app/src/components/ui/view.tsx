import { View as RNView } from 'react-native';
import { ViewProps } from 'react-native/Libraries/Components/View/ViewPropTypes';

import { cn } from '@/lib/utils';

import { TextClassContext } from './text';

type CustomViewProps = ViewProps & {
  textClassName?: string;
};

export default function View(props: CustomViewProps) {
  const { textClassName, ...viewProps } = props;
  return (
    <TextClassContext.Provider value={cn(textClassName)}>
      <RNView {...viewProps} />
    </TextClassContext.Provider>
  );
}
