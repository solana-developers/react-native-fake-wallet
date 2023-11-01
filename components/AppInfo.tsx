import {Text, View} from 'react-native';

interface AppInfoProps {
  title?: string;
  cluster?: string;
  appName?: string;
  scope?: string;
}

function AppInfo(props: AppInfoProps) {
  const {title, cluster, appName, scope} =
    props;
  return (
    <>
      <Text>{title}</Text>
      <View>
        <Text>Request Metadata</Text>
        <Text>Cluster: {cluster ? cluster : 'NA'}</Text>
        <Text>App name: {appName ? appName : 'NA'}</Text>
        <Text>Scope: {scope ? scope : 'NA'}</Text>
      </View>
    </>
  );
}

export default AppInfo;